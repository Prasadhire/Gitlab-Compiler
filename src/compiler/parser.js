// ============================================================
//  PHASE 2 — PARSER
//  Token stream → Abstract Syntax Tree (AST)
//
//  Grammar:
//    program     := statement*
//    statement   := varDecl | assignStmt | ifStmt | whileStmt | printStmt
//    varDecl     := RAKHO IDENT EQ expr NEWLINE
//    assignStmt  := IDENT EQ expr NEWLINE
//    ifStmt      := AGAR expr TOH NEWLINE stmt* (WARNA NEWLINE stmt*)? KHATAM
//    whileStmt   := JBTK expr KARO NEWLINE stmt* KHATAM
//    printStmt   := DIKHAO expr NEWLINE
//    expr        := comparison
//    comparison  := addSub ((==|!=|<|>|<=|>=) addSub)*
//    addSub      := mulDiv ((+|-) mulDiv)*
//    mulDiv      := unary ((*|/|%) unary)*
//    unary       := - unary | primary
//    primary     := NUMBER | STRING | BOOL | IDENT | ( expr )
// ============================================================

import { TT } from './lexer';

// ── AST Node factories ───────────────────────────────────────
export const N = {
  Program : (body)          => ({ type:'Program',  body }),
  VarDecl : (name, value)   => ({ type:'VarDecl',  name, value }),
  Assign  : (name, value)   => ({ type:'Assign',   name, value }),
  If      : (cond, then_, else_) => ({ type:'If',  cond, then:then_, else:else_ }),
  While   : (cond, body)    => ({ type:'While',    cond, body }),
  Print   : (value)         => ({ type:'Print',    value }),
  BinOp   : (op, left, right) => ({ type:'BinOp', op, left, right }),
  Unary   : (op, expr)      => ({ type:'Unary',    op, expr }),
  Num     : (value)         => ({ type:'Num',      value }),
  Str     : (value)         => ({ type:'Str',      value }),
  Bool    : (value)         => ({ type:'Bool',     value }),
  Ident   : (name)          => ({ type:'Ident',    name }),
};

export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos    = 0;
  }

  peek()     { return this.tokens[this.pos]; }
  prev()     { return this.tokens[this.pos - 1]; }
  isEnd()    { return this.peek().type === TT.EOF; }
  check(t)   { return !this.isEnd() && this.peek().type === t; }
  match(...ts) {
    if (ts.some(t => this.check(t))) { this.pos++; return true; }
    return false;
  }
  skipNL()   { while (this.check(TT.NEWLINE)) this.pos++; }
  expect(t, msg) {
    if (this.check(t)) { this.pos++; return this.prev(); }
    throw new Error(
      `Parse Error (line ${this.peek().line}): ${msg ?? `Expected ${t}, got ${this.peek().type}`}`
    );
  }

  // ── Entry ─────────────────────────────────────────────────
  parse() {
    const body = [];
    this.skipNL();
    while (!this.isEnd()) {
      body.push(this.statement());
      this.skipNL();
    }
    return N.Program(body);
  }

  statement() {
    const t = this.peek();
    if (t.type === TT.RAKHO)  return this.varDecl();
    if (t.type === TT.AGAR)   return this.ifStmt();
    if (t.type === TT.JBTK)   return this.whileStmt();
    if (t.type === TT.DIKHAO) return this.printStmt();
    if (t.type === TT.IDENT)  return this.assignStmt();
    throw new Error(`Parse Error (line ${t.line}): Unexpected '${t.value}'`);
  }

  varDecl() {
    this.expect(TT.RAKHO);
    const name = this.expect(TT.IDENT, "Expected variable name after 'rakho'").value;
    this.expect(TT.EQ, "Expected '=' after variable name");
    const value = this.expr();
    this.skipNL();
    return N.VarDecl(name, value);
  }

  assignStmt() {
    const name = this.expect(TT.IDENT).value;
    this.expect(TT.EQ, "Expected '='");
    const value = this.expr();
    this.skipNL();
    return N.Assign(name, value);
  }

  ifStmt() {
    this.expect(TT.AGAR);
    const cond = this.expr();
    this.expect(TT.TOH, "Expected 'toh' after condition");
    this.skipNL();

    const then_ = [];
    while (!this.isEnd() && !this.check(TT.WARNA) && !this.check(TT.KHATAM)) {
      then_.push(this.statement());
      this.skipNL();
    }

    let else_ = null;
    if (this.match(TT.WARNA)) {
      this.skipNL();
      else_ = [];
      while (!this.isEnd() && !this.check(TT.KHATAM)) {
        else_.push(this.statement());
        this.skipNL();
      }
    }

    this.expect(TT.KHATAM, "Expected 'khatam' to close 'agar' block");
    this.skipNL();
    return N.If(cond, then_, else_);
  }

  whileStmt() {
    this.expect(TT.JBTK);
    const cond = this.expr();
    this.expect(TT.KARO, "Expected 'karo' after condition");
    this.skipNL();

    const body = [];
    while (!this.isEnd() && !this.check(TT.KHATAM)) {
      body.push(this.statement());
      this.skipNL();
    }

    this.expect(TT.KHATAM, "Expected 'khatam' to close 'jab tak' block");
    this.skipNL();
    return N.While(cond, body);
  }

  printStmt() {
    this.expect(TT.DIKHAO);
    const value = this.expr();
    this.skipNL();
    return N.Print(value);
  }

  // ── Expressions ───────────────────────────────────────────
  expr()       { return this.comparison(); }

  comparison() {
    let left = this.addSub();
    while (this.match(TT.EQEQ, TT.NEQ, TT.LT, TT.GT, TT.LTE, TT.GTE))
      left = N.BinOp(this.prev().value, left, this.addSub());
    return left;
  }

  addSub() {
    let left = this.mulDiv();
    while (this.match(TT.PLUS, TT.MINUS))
      left = N.BinOp(this.prev().value, left, this.mulDiv());
    return left;
  }

  mulDiv() {
    let left = this.unary();
    while (this.match(TT.MUL, TT.DIV, TT.MOD))
      left = N.BinOp(this.prev().value, left, this.unary());
    return left;
  }

  unary() {
    if (this.match(TT.MINUS)) return N.Unary('-', this.unary());
    return this.primary();
  }

  primary() {
    const t = this.peek(); this.pos++;
    if (t.type === TT.NUMBER) return N.Num(t.value);
    if (t.type === TT.STRING) return N.Str(t.value);
    if (t.type === TT.SAHI)   return N.Bool(true);
    if (t.type === TT.GALAT)  return N.Bool(false);
    if (t.type === TT.IDENT)  return N.Ident(t.name ?? t.value);
    if (t.type === TT.LPAREN) {
      const e = this.expr();
      this.expect(TT.RPAREN, "Expected ')'");
      return e;
    }
    throw new Error(`Parse Error (line ${t.line}): Unexpected '${t.value}'`);
  }
}

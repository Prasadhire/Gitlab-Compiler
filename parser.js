// ============================================================
//  PHASE 2 — PARSER
//  Token stream → Abstract Syntax Tree (AST)
//
//  Grammar:
//    program     := statement*
//    statement   := varDecl | ifStmt | whileStmt | printStmt | assignStmt
//    varDecl     := RAKHO IDENT EQ expr NEWLINE
//    ifStmt      := AGAR expr TOH NEWLINE statement* (WARNA NEWLINE statement*)? KHATAM NEWLINE
//    whileStmt   := JBTK expr KARO NEWLINE statement* KHATAM NEWLINE
//    printStmt   := DIKHAO expr NEWLINE
//    assignStmt  := IDENT EQ expr NEWLINE
//    expr        := comparison
//    comparison  := addSub ((==|!=|<|>|<=|>=) addSub)*
//    addSub      := mulDiv ((+|-) mulDiv)*
//    mulDiv      := unary ((*|/|%) unary)*
//    unary       := - unary | primary
//    primary     := NUMBER | STRING | IDENT | ( expr ) | SAHI | GALAT
// ============================================================

class ParseError extends Error {
  constructor(msg, line) { super(`Parse Error (line ${line}): ${msg}`); }
}

// ─── AST Node Factories ────────────────────────────────────
const N = {
  Program:    (body)          => ({ type: 'Program', body }),
  VarDecl:    (name, value)   => ({ type: 'VarDecl', name, value }),
  Assign:     (name, value)   => ({ type: 'Assign', name, value }),
  If:         (cond, then_, else_) => ({ type: 'If', cond, then: then_, else: else_ }),
  While:      (cond, body)    => ({ type: 'While', cond, body }),
  Print:      (value)         => ({ type: 'Print', value }),
  BinOp:      (op, left, right) => ({ type: 'BinOp', op, left, right }),
  Unary:      (op, expr)      => ({ type: 'Unary', op, expr }),
  Num:        (value)         => ({ type: 'Num', value }),
  Str:        (value)         => ({ type: 'Str', value }),
  Bool:       (value)         => ({ type: 'Bool', value }),
  Ident:      (name)          => ({ type: 'Ident', name }),
};

class Parser {
  constructor(tokens) {
    this.tokens = tokens.filter(t => t.type !== TokenType.NEWLINE || true); // keep newlines
    this.pos    = 0;
  }

  peek()    { return this.tokens[this.pos]; }
  previous(){ return this.tokens[this.pos - 1]; }
  isEnd()   { return this.peek().type === TokenType.EOF; }

  check(type)     { return !this.isEnd() && this.peek().type === type; }
  match(...types) { if (types.some(t => this.check(t))) { this.pos++; return true; } return false; }

  skipNewlines()  { while (this.check(TokenType.NEWLINE)) this.pos++; }

  expect(type, msg) {
    if (this.check(type)) { this.pos++; return this.previous(); }
    throw new ParseError(msg ?? `Expected ${type}, got ${this.peek().type}`, this.peek().line);
  }

  // ── Grammar rules ──────────────────────────────────────

  parse() {
    const body = [];
    this.skipNewlines();
    while (!this.isEnd()) {
      body.push(this.statement());
      this.skipNewlines();
    }
    return N.Program(body);
  }

  statement() {
    const t = this.peek();
    if (t.type === TokenType.RAKHO)  return this.varDecl();
    if (t.type === TokenType.AGAR)   return this.ifStmt();
    if (t.type === TokenType.JBTK)   return this.whileStmt();
    if (t.type === TokenType.DIKHAO) return this.printStmt();
    if (t.type === TokenType.IDENT)  return this.assignStmt();
    throw new ParseError(`Unexpected token '${t.value}'`, t.line);
  }

  varDecl() {
    this.expect(TokenType.RAKHO);
    const name = this.expect(TokenType.IDENT, 'Expected variable name after rakho').value;
    this.expect(TokenType.EQ, "Expected '=' after variable name");
    const value = this.expr();
    this.skipNewlines();
    return N.VarDecl(name, value);
  }

  assignStmt() {
    const name = this.expect(TokenType.IDENT).value;
    this.expect(TokenType.EQ, "Expected '='");
    const value = this.expr();
    this.skipNewlines();
    return N.Assign(name, value);
  }

  ifStmt() {
    this.expect(TokenType.AGAR);
    const cond = this.expr();
    this.expect(TokenType.TOH, "Expected 'toh' after condition");
    this.skipNewlines();

    const then_ = [];
    while (!this.isEnd() && !this.check(TokenType.WARNA) && !this.check(TokenType.KHATAM)) {
      then_.push(this.statement());
      this.skipNewlines();
    }

    let else_ = null;
    if (this.match(TokenType.WARNA)) {
      this.skipNewlines();
      else_ = [];
      while (!this.isEnd() && !this.check(TokenType.KHATAM)) {
        else_.push(this.statement());
        this.skipNewlines();
      }
    }

    this.expect(TokenType.KHATAM, "Expected 'khatam' to close agar block");
    this.skipNewlines();
    return N.If(cond, then_, else_);
  }

  whileStmt() {
    this.expect(TokenType.JBTK);
    const cond = this.expr();
    this.expect(TokenType.KARO, "Expected 'karo' after condition");
    this.skipNewlines();

    const body = [];
    while (!this.isEnd() && !this.check(TokenType.KHATAM)) {
      body.push(this.statement());
      this.skipNewlines();
    }

    this.expect(TokenType.KHATAM, "Expected 'khatam' to close jab tak block");
    this.skipNewlines();
    return N.While(cond, body);
  }

  printStmt() {
    this.expect(TokenType.DIKHAO);
    const value = this.expr();
    this.skipNewlines();
    return N.Print(value);
  }

  expr()       { return this.comparison(); }

  comparison() {
    let left = this.addSub();
    while (this.match(TokenType.EQEQ, TokenType.NEQ, TokenType.LT, TokenType.GT, TokenType.LTE, TokenType.GTE)) {
      left = N.BinOp(this.previous().value, left, this.addSub());
    }
    return left;
  }

  addSub() {
    let left = this.mulDiv();
    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      left = N.BinOp(this.previous().value, left, this.mulDiv());
    }
    return left;
  }

  mulDiv() {
    let left = this.unary();
    while (this.match(TokenType.MUL, TokenType.DIV, TokenType.MOD)) {
      left = N.BinOp(this.previous().value, left, this.unary());
    }
    return left;
  }

  unary() {
    if (this.match(TokenType.MINUS)) return N.Unary('-', this.unary());
    return this.primary();
  }

  primary() {
    const t = this.peek(); this.pos++;
    if (t.type === TokenType.NUMBER) return N.Num(t.value);
    if (t.type === TokenType.STRING) return N.Str(t.value);
    if (t.type === TokenType.SAHI)   return N.Bool(true);
    if (t.type === TokenType.GALAT)  return N.Bool(false);
    if (t.type === TokenType.IDENT)  return N.Ident(t.value);
    if (t.type === TokenType.LPAREN) {
      const e = this.expr();
      this.expect(TokenType.RPAREN, "Expected ')'");
      return e;
    }
    throw new ParseError(`Unexpected token '${t.value}'`, t.line);
  }
}

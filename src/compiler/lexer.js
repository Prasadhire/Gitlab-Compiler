// ============================================================
//  PHASE 1 — LEXER
//  Converts raw HinglishScript source → Token array
// ============================================================

export const TT = {
  // Keywords
  RAKHO:'RAKHO', AGAR:'AGAR', WARNA:'WARNA', TOH:'TOH',
  JBTK:'JBTK', KARO:'KARO', DIKHAO:'DIKHAO', KHATAM:'KHATAM',
  SAHI:'SAHI', GALAT:'GALAT',
  // Literals
  NUMBER:'NUMBER', STRING:'STRING', IDENT:'IDENT',
  // Operators
  PLUS:'PLUS', MINUS:'MINUS', MUL:'MUL', DIV:'DIV', MOD:'MOD',
  EQ:'EQ', EQEQ:'EQEQ', NEQ:'NEQ',
  LT:'LT', GT:'GT', LTE:'LTE', GTE:'GTE',
  // Misc
  LPAREN:'LPAREN', RPAREN:'RPAREN', NEWLINE:'NEWLINE', EOF:'EOF',
};

const KEYWORDS = {
  rakho:TT.RAKHO, agar:TT.AGAR, warna:TT.WARNA, toh:TT.TOH,
  karo:TT.KARO, dikhao:TT.DIKHAO, khatam:TT.KHATAM,
  sahi:TT.SAHI, galat:TT.GALAT,
};

export class Token {
  constructor(type, value, line) {
    this.type  = type;
    this.value = value;
    this.line  = line;
  }
}

export class Lexer {
  constructor(src) {
    this.src  = src;
    this.pos  = 0;
    this.line = 1;
  }

  peek(o = 0) { return this.src[this.pos + o] ?? null; }

  advance() {
    const c = this.src[this.pos++];
    if (c === '\n') this.line++;
    return c;
  }

  skipWS() {
    while (this.pos < this.src.length && /[ \t\r]/.test(this.peek()))
      this.advance();
  }

  readNum() {
    let n = '';
    while (this.pos < this.src.length && /[\d.]/.test(this.peek()))
      n += this.advance();
    return new Token(TT.NUMBER, parseFloat(n), this.line);
  }

  readStr() {
    this.advance();
    let s = '';
    while (this.pos < this.src.length && this.peek() !== '"')
      s += this.advance();
    this.advance();
    return new Token(TT.STRING, s, this.line);
  }

  readIdent() {
    let w = '';
    while (this.pos < this.src.length && /[a-zA-Z_0-9]/.test(this.peek()))
      w += this.advance();

    // two-word keyword: "jab tak"
    if (
      w === 'jab' &&
      this.peek() === ' ' &&
      this.src.slice(this.pos + 1, this.pos + 4) === 'tak'
    ) {
      this.advance();
      this.advance(); this.advance(); this.advance();
      return new Token(TT.JBTK, 'jab tak', this.line);
    }

    const kw = KEYWORDS[w.toLowerCase()];
    return new Token(kw ?? TT.IDENT, w, this.line);
  }

  tokenize() {
    const tokens = [];

    while (this.pos < this.src.length) {
      this.skipWS();
      if (this.pos >= this.src.length) break;

      const ch = this.peek();
      const ln = this.line;

      if (ch === '\n') {
        this.advance();
        tokens.push(new Token(TT.NEWLINE, '\\n', ln));
        continue;
      }

      // Comment
      if (ch === '/' && this.peek(1) === '/') {
        while (this.peek() !== '\n' && this.pos < this.src.length)
          this.advance();
        continue;
      }

      if (/\d/.test(ch))        { tokens.push(this.readNum());   continue; }
      if (ch === '"')            { tokens.push(this.readStr());   continue; }
      if (/[a-zA-Z_]/.test(ch)) { tokens.push(this.readIdent()); continue; }

      this.advance();

      if      (ch === '=' && this.peek() === '=') { this.advance(); tokens.push(new Token(TT.EQEQ,'==',ln)); }
      else if (ch === '!' && this.peek() === '=') { this.advance(); tokens.push(new Token(TT.NEQ, '!=',ln)); }
      else if (ch === '<' && this.peek() === '=') { this.advance(); tokens.push(new Token(TT.LTE, '<=',ln)); }
      else if (ch === '>' && this.peek() === '=') { this.advance(); tokens.push(new Token(TT.GTE, '>=',ln)); }
      else {
        const map = {
          '+':TT.PLUS,'-':TT.MINUS,'*':TT.MUL,'/':TT.DIV,'%':TT.MOD,
          '=':TT.EQ,'<':TT.LT,'>':TT.GT,'(':TT.LPAREN,')':TT.RPAREN,
        };
        if (map[ch]) tokens.push(new Token(map[ch], ch, ln));
        else throw new Error(`Lexer Error (line ${ln}): Unknown character '${ch}'`);
      }
    }

    tokens.push(new Token(TT.EOF, null, this.line));
    return tokens;
  }
}

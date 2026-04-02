// ============================================================
//  PHASE 1 — LEXER (Tokenizer)
//  Raw Hinglish source code → Array of Tokens
// ============================================================

const TokenType = {
  // Keywords
  RAKHO:   'RAKHO',    // variable declaration  (rakho x = 5)
  AGAR:    'AGAR',     // if
  WARNA:   'WARNA',    // else
  TOH:     'TOH',      // then
  JBTK:    'JBTK',     // while (jab tak)
  KARO:    'KARO',     // do
  DIKHAO:  'DIKHAO',   // print
  KHATAM:  'KHATAM',   // end block
  SAHI:    'SAHI',     // true
  GALAT:   'GALAT',    // false

  // Literals
  NUMBER:  'NUMBER',
  STRING:  'STRING',
  IDENT:   'IDENT',

  // Operators
  PLUS:    'PLUS',
  MINUS:   'MINUS',
  MUL:     'MUL',
  DIV:     'DIV',
  MOD:     'MOD',
  EQ:      'EQ',       // =
  EQEQ:    'EQEQ',     // ==
  NEQ:     'NEQ',      // !=
  LT:      'LT',       // <
  GT:      'GT',       // >
  LTE:     'LTE',      // <=
  GTE:     'GTE',      // >=

  // Misc
  LPAREN:  'LPAREN',
  RPAREN:  'RPAREN',
  NEWLINE: 'NEWLINE',
  EOF:     'EOF',
};

const KEYWORDS = {
  rakho:    TokenType.RAKHO,
  agar:     TokenType.AGAR,
  warna:    TokenType.WARNA,
  toh:      TokenType.TOH,
  'jab tak':TokenType.JBTK,
  karo:     TokenType.KARO,
  dikhao:   TokenType.DIKHAO,
  khatam:   TokenType.KHATAM,
  sahi:     TokenType.SAHI,
  galat:    TokenType.GALAT,
};

class Token {
  constructor(type, value, line) {
    this.type  = type;
    this.value = value;
    this.line  = line;
  }
  toString() { return `[${this.type}:${this.value}]`; }
}

class LexerError extends Error {
  constructor(msg, line) { super(`Lexer Error (line ${line}): ${msg}`); }
}

class Lexer {
  constructor(source) {
    this.src  = source;
    this.pos  = 0;
    this.line = 1;
  }

  peek(offset = 0) { return this.src[this.pos + offset] ?? null; }
  advance()        { const c = this.src[this.pos++]; if (c === '\n') this.line++; return c; }

  skipWhitespace() {
    while (this.pos < this.src.length && /[ \t\r]/.test(this.peek())) this.advance();
  }

  readNumber() {
    let n = '';
    while (this.pos < this.src.length && /[\d.]/.test(this.peek())) n += this.advance();
    return new Token(TokenType.NUMBER, parseFloat(n), this.line);
  }

  readString() {
    this.advance(); // skip opening "
    let s = '';
    while (this.pos < this.src.length && this.peek() !== '"') s += this.advance();
    this.advance(); // skip closing "
    return new Token(TokenType.STRING, s, this.line);
  }

  readIdentOrKeyword() {
    let word = '';
    while (this.pos < this.src.length && /[a-zA-Z_0-9]/.test(this.peek())) word += this.advance();

    // two-word keyword: "jab tak"
    if (word === 'jab' && this.peek() === ' ' && this.src.slice(this.pos + 1, this.pos + 4) === 'tak') {
      this.advance(); // space
      this.advance(); this.advance(); this.advance(); // "tak"
      return new Token(TokenType.JBTK, 'jab tak', this.line);
    }

    const kw = KEYWORDS[word.toLowerCase()];
    return new Token(kw ?? TokenType.IDENT, word, this.line);
  }

  tokenize() {
    const tokens = [];

    while (this.pos < this.src.length) {
      this.skipWhitespace();
      if (this.pos >= this.src.length) break;

      const ch = this.peek();
      const ln = this.line;

      if (ch === '\n')         { this.advance(); tokens.push(new Token(TokenType.NEWLINE, '\\n', ln)); continue; }
      if (ch === '/' && this.peek(1) === '/') { while (this.peek() !== '\n' && this.pos < this.src.length) this.advance(); continue; }
      if (/\d/.test(ch))       { tokens.push(this.readNumber()); continue; }
      if (ch === '"')          { tokens.push(this.readString()); continue; }
      if (/[a-zA-Z_]/.test(ch)){ tokens.push(this.readIdentOrKeyword()); continue; }

      // Operators
      this.advance();
      if (ch === '=' && this.peek() === '=') { this.advance(); tokens.push(new Token(TokenType.EQEQ, '==', ln)); }
      else if (ch === '!' && this.peek() === '=') { this.advance(); tokens.push(new Token(TokenType.NEQ, '!=', ln)); }
      else if (ch === '<' && this.peek() === '=') { this.advance(); tokens.push(new Token(TokenType.LTE, '<=', ln)); }
      else if (ch === '>' && this.peek() === '=') { this.advance(); tokens.push(new Token(TokenType.GTE, '>=', ln)); }
      else {
        const single = { '+': TokenType.PLUS, '-': TokenType.MINUS, '*': TokenType.MUL,
                         '/': TokenType.DIV,  '%': TokenType.MOD,   '=': TokenType.EQ,
                         '<': TokenType.LT,   '>': TokenType.GT,
                         '(': TokenType.LPAREN,')'  : TokenType.RPAREN };
        if (single[ch]) tokens.push(new Token(single[ch], ch, ln));
        else throw new LexerError(`Unknown character '${ch}'`, ln);
      }
    }

    tokens.push(new Token(TokenType.EOF, null, this.line));
    return tokens;
  }
}

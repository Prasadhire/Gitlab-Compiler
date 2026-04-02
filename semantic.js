// ============================================================
//  PHASE 3 — SEMANTIC ANALYZER
//  Walks the AST, checks:
//    1. Undeclared variable usage
//    2. Re-declaration of same variable in same scope
//    3. Type mismatch in arithmetic (string + number)
// ============================================================

class SemanticError extends Error {
  constructor(msg) { super(`Semantic Error: ${msg}`); }
}

class SymbolTable {
  constructor(parent = null) {
    this.table  = {};     // name → { type, declared }
    this.parent = parent;
  }

  define(name, type) {
    if (this.table[name]) throw new SemanticError(`Variable '${name}' already declared in this scope`);
    this.table[name] = { type };
  }

  lookup(name) {
    if (this.table[name]) return this.table[name];
    if (this.parent)      return this.parent.lookup(name);
    throw new SemanticError(`Variable '${name}' ka use kiya but declare nahi kiya (undefined)`);
  }

  update(name, type) {
    if (this.table[name]) { this.table[name].type = type; return; }
    if (this.parent)      { this.parent.update(name, type); return; }
    throw new SemanticError(`Variable '${name}' assigned but not declared — pehle 'rakho' se declare karo`);
  }
}

class SemanticAnalyzer {
  constructor() {
    this.scope    = new SymbolTable();
    this.warnings = [];
    this.info     = [];
  }

  analyze(node) {
    switch (node.type) {
      case 'Program': {
        node.body.forEach(s => this.analyze(s));
        return 'void';
      }
      case 'VarDecl': {
        const t = this.analyze(node.value);
        this.scope.define(node.name, t);
        this.info.push(`✔ Variable '${node.name}' declared as ${t}`);
        return 'void';
      }
      case 'Assign': {
        const t = this.analyze(node.value);
        this.scope.update(node.name, t);
        return 'void';
      }
      case 'Print': {
        this.analyze(node.value);
        return 'void';
      }
      case 'If': {
        const condType = this.analyze(node.cond);
        if (condType === 'string') this.warnings.push(`⚠ String expression used as condition in 'agar' — this might not behave as expected`);
        const childScope = new SymbolTable(this.scope);
        const saved = this.scope; this.scope = childScope;
        node.then.forEach(s => this.analyze(s));
        if (node.else) node.else.forEach(s => this.analyze(s));
        this.scope = saved;
        return 'void';
      }
      case 'While': {
        const condType = this.analyze(node.cond);
        if (condType === 'string') this.warnings.push(`⚠ String used as 'jab tak' condition`);
        const childScope = new SymbolTable(this.scope);
        const saved = this.scope; this.scope = childScope;
        node.body.forEach(s => this.analyze(s));
        this.scope = saved;
        return 'void';
      }
      case 'BinOp': {
        const l = this.analyze(node.left);
        const r = this.analyze(node.right);
        if (['+','-','*','/','%'].includes(node.op)) {
          if (l === 'string' && r === 'string' && node.op === '+') return 'string'; // string concat allowed
          if (l === 'string' || r === 'string') {
            this.warnings.push(`⚠ Type mismatch: '${node.op}' between ${l} and ${r}`);
            return 'any';
          }
          return 'number';
        }
        return 'boolean';
      }
      case 'Unary':   { this.analyze(node.expr); return 'number'; }
      case 'Num':     { return 'number'; }
      case 'Str':     { return 'string'; }
      case 'Bool':    { return 'boolean'; }
      case 'Ident':   {
        const sym = this.scope.lookup(node.name);
        return sym.type ?? 'any';
      }
      default: throw new SemanticError(`Unknown AST node: ${node.type}`);
    }
  }
}

// ============================================================
//  PHASE 3 — SEMANTIC ANALYZER
//  Walks AST and checks:
//    • Undeclared variable usage
//    • Double declaration in same scope
//    • Type mismatches in arithmetic
// ============================================================

class SymbolTable {
  constructor(parent = null) {
    this.table  = {};
    this.parent = parent;
  }

  define(name, type) {
    if (this.table[name])
      throw new Error(`Semantic Error: Variable '${name}' already declared in this scope`);
    this.table[name] = { type };
  }

  lookup(name) {
    if (this.table[name]) return this.table[name];
    if (this.parent)      return this.parent.lookup(name);
    throw new Error(`Semantic Error: '${name}' use kiya but declare nahi kiya — pehle 'rakho' use karo`);
  }

  update(name, type) {
    if (this.table[name]) { this.table[name].type = type; return; }
    if (this.parent)      { this.parent.update(name, type); return; }
    throw new Error(`Semantic Error: '${name}' assign kiya but declared nahi hai`);
  }
}

export class SemanticAnalyzer {
  constructor() {
    this.scope    = new SymbolTable();
    this.warnings = [];
    this.infos    = [];
  }

  analyze(node) {
    switch (node.type) {

      case 'Program':
        node.body.forEach(s => this.analyze(s));
        return 'void';

      case 'VarDecl': {
        const t = this.analyze(node.value);
        this.scope.define(node.name, t);
        this.infos.push({ msg: `Variable '${node.name}' declared`, detail: `type: ${t}` });
        return 'void';
      }

      case 'Assign': {
        const t = this.analyze(node.value);
        this.scope.update(node.name, t);
        this.infos.push({ msg: `Variable '${node.name}' updated`, detail: `type: ${t}` });
        return 'void';
      }

      case 'Print':
        this.analyze(node.value);
        return 'void';

      case 'If': {
        const ct = this.analyze(node.cond);
        if (ct === 'string')
          this.warnings.push(`String used as condition in 'agar' — unexpected result ho sakta hai`);
        const child = new SymbolTable(this.scope);
        const saved = this.scope; this.scope = child;
        node.then.forEach(s => this.analyze(s));
        if (node.else) node.else.forEach(s => this.analyze(s));
        this.scope = saved;
        return 'void';
      }

      case 'While': {
        const ct = this.analyze(node.cond);
        if (ct === 'string')
          this.warnings.push(`String used as 'jab tak' condition`);
        const child = new SymbolTable(this.scope);
        const saved = this.scope; this.scope = child;
        node.body.forEach(s => this.analyze(s));
        this.scope = saved;
        return 'void';
      }

      case 'BinOp': {
        const l = this.analyze(node.left);
        const r = this.analyze(node.right);
        if (['+', '-', '*', '/', '%'].includes(node.op)) {
          if (l === 'string' && r === 'string' && node.op === '+') return 'string';
          if (l === 'string' || r === 'string') {
            this.warnings.push(`Type mismatch: '${node.op}' operator between ${l} and ${r}`);
            return 'any';
          }
          return 'number';
        }
        return 'boolean';
      }

      case 'Unary':  this.analyze(node.expr); return 'number';
      case 'Num':    return 'number';
      case 'Str':    return 'string';
      case 'Bool':   return 'boolean';

      case 'Ident': {
        const sym = this.scope.lookup(node.name);
        return sym.type ?? 'any';
      }

      default:
        throw new Error(`Semantic: Unknown AST node '${node.type}'`);
    }
  }
}

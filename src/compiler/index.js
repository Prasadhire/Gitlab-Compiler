// ============================================================
//  COMPILER ORCHESTRATOR
//  Runs all 4 phases and returns structured results
// ============================================================

import { Lexer }            from './lexer';
import { Parser }           from './parser';
import { SemanticAnalyzer } from './semantic';
import { CodeGenerator }    from './codegen';

export function compile(source) {
  const result = {
    tokens:   { data: null, error: null },
    ast:      { data: null, error: null },
    semantic: { data: null, warnings: [], infos: [], error: null },
    codegen:  { data: null, error: null },
    output:   { lines: [], error: null },
  };

  // Phase 1 — Lexer
  try {
    result.tokens.data = new Lexer(source).tokenize();
  } catch (e) {
    result.tokens.error = e.message;
    return result;
  }

  // Phase 2 — Parser
  try {
    result.ast.data = new Parser(result.tokens.data).parse();
  } catch (e) {
    result.ast.error = e.message;
    return result;
  }

  // Phase 3 — Semantic
  try {
    const sa = new SemanticAnalyzer();
    sa.analyze(result.ast.data);
    result.semantic.warnings = sa.warnings;
    result.semantic.infos    = sa.infos;
  } catch (e) {
    result.semantic.error = e.message;
    return result;
  }

  // Phase 4 — Code Generation
  try {
    result.codegen.data = new CodeGenerator().generate(result.ast.data);
  } catch (e) {
    result.codegen.error = e.message;
    return result;
  }

  // Run generated code
  try {
    const lines = [];
    const __print = v => lines.push(String(v));
    // eslint-disable-next-line no-new-func
    new Function('__print', result.codegen.data)(__print);
    result.output.lines = lines;
  } catch (e) {
    result.output.error = `Runtime Error: ${e.message}`;
  }

  return result;
}

// ── Example programs ────────────────────────────────────────
export const EXAMPLES = [
  {
    label: 'Variables & Arithmetic',
    code: `// Variables aur arithmetic
rakho x = 10
rakho y = 25
rakho sum = x + y
dikhao sum

rakho avg = (x + y) / 2
dikhao avg`,
  },
  {
    label: 'if-warna (Conditions)',
    code: `// Agar-warna condition
rakho marks = 85

agar marks >= 90 toh
  dikhao "A Grade - Bahut accha!"
warna
  agar marks >= 75 toh
    dikhao "B Grade - Accha hai!"
  warna
    dikhao "Aur mehnat karo!"
  khatam
khatam`,
  },
  {
    label: 'jab tak (While Loop)',
    code: `// While loop with accumulator
rakho i = 1
rakho total = 0

jab tak i <= 5 karo
  total = total + i
  i = i + 1
khatam

dikhao "1 se 5 ka sum:"
dikhao total`,
  },
];

<<<<<<< HEAD
# Gitlab-Compiler
=======
# HinglishScript Compiler
### Compiler Design — Phase 1 Submission

---

## Project Overview

HinglishScript is a **mini programming language** that uses Hinglish (Hindi + English) keywords.
This project demonstrates all **4 phases of a compiler** with a clean, interactive web UI.

---

## All 4 Compiler Phases

| # | Phase | File | What it does |
|---|-------|------|-------------|
| 1 | **Lexer** | `lexer.js` | Converts raw source code → Tokens |
| 2 | **Parser** | `parser.js` | Tokens → Abstract Syntax Tree (AST) |
| 3 | **Semantic Analyzer** | `semantic.js` | Type checking + Scope analysis |
| 4 | **Code Generator** | `codegen.js` | AST → JavaScript output |

---

## File Structure

```
hinglish-compiler/
├── index.html        ← Main UI (open this in browser)
├── lexer.js          ← Phase 1: Tokenizer
├── parser.js         ← Phase 2: AST Builder
├── semantic.js       ← Phase 3: Type & Scope Checker
├── codegen.js        ← Phase 4: JS Code Generator
└── README.md         ← This file
```

---

## HinglishScript Language Keywords

| HinglishScript | Meaning | Example |
|----------------|---------|---------|
| `rakho`        | declare variable | `rakho x = 10` |
| `dikhao`       | print output | `dikhao x` |
| `agar ... toh` | if condition | `agar x > 5 toh` |
| `warna`        | else | `warna` |
| `jab tak ... karo` | while loop | `jab tak i < 10 karo` |
| `khatam`       | end block | `khatam` |
| `sahi`         | true | `rakho flag = sahi` |
| `galat`        | false | `rakho flag = galat` |

---

## How to Run

1. Open `index.html` in any modern browser (Chrome, Firefox, Edge)
2. Write HinglishScript code in the editor
3. Click **Compile & Run**
4. See all 4 phases in the output tabs

---

## Evaluation Parameters Coverage

- ✅ **Relevance to Compiler Design** — Full 4-phase pipeline implemented
- ✅ **Functionality & Implementation** — Working compiler with live execution
- ✅ **Innovation & Creativity** — Original Hinglish language design
- ✅ **Presentation & Explanation** — Visual step-by-step phase viewer

---

## Sample Programs

```
// Variables & Arithmetic
rakho x = 10
rakho y = 20
dikhao x + y

// If-Else
agar x < y toh
  dikhao "Y bada hai"
warna
  dikhao "X bada hai"
khatam

// While Loop
rakho i = 1
jab tak i <= 5 karo
  dikhao i
  i = i + 1
khatam
```

---

*Made with JavaScript | No external libraries required*
>>>>>>> 632fb35 (code push karna hai github pe bas)

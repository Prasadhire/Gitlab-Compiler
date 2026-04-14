# HinglishScript Compiler 🚀

### Compiler Design Project — Full Implementation

---

## 📌 Project Overview

HinglishScript is a **mini programming language** that uses Hinglish (Hindi + English) keywords.

This project demonstrates all **4 phases of a compiler** with a clean and interactive web interface.

---

## ⚙️ Compiler Phases Implemented

| # | Phase             | File          | Description                                 |
| - | ----------------- | ------------- | ------------------------------------------- |
| 1 | Lexer             | `lexer.js`    | Converts source code into tokens            |
| 2 | Parser            | `parser.js`   | Generates Abstract Syntax Tree (AST)        |
| 3 | Semantic Analyzer | `semantic.js` | Performs type checking and scope validation |
| 4 | Code Generator    | `codegen.js`  | Converts AST into JavaScript code           |

---

## 📁 Project Structure

```
hinglish-compiler/
├── index.html
├── lexer.js
├── parser.js
├── semantic.js
├── codegen.js
├── Dockerfile
├── docker-compose.yml
├── .gitlab-ci.yml
└── README.md
```

---

## 💻 HinglishScript Keywords

| Keyword          | Meaning              | Example               |
| ---------------- | -------------------- | --------------------- |
| rakho            | variable declaration | `rakho x = 10`        |
| dikhao           | print output         | `dikhao x`            |
| agar ... toh     | if condition         | `agar x > 5 toh`      |
| warna            | else                 | `warna`               |
| jab tak ... karo | while loop           | `jab tak i < 10 karo` |
| khatam           | end block            | `khatam`              |
| sahi             | true                 | `rakho flag = sahi`   |
| galat            | false                | `rakho flag = galat`  |

---

## ▶️ How to Run

### Option 1: Direct (Simple)

1. Open `index.html` in browser
2. Write HinglishScript code
3. Click **Compile & Run**

---

### Option 2: Docker (Recommended)

```bash
docker build -t compiler-app .
docker run -p 3000:80 compiler-app
```

👉 Open: http://localhost:3000

---

## 🔄 CI/CD Implementation

* GitLab CI/CD pipeline implemented

* Stages:

  * Build
  * Test
  * Push to Docker Hub
  * Deploy (Docker Compose)

* Self-hosted GitLab Runner used

* Secure credentials handled via CI/CD variables

---

## 🧪 Sample Code

```
// Variables
rakho x = 10
rakho y = 20
dikhao x + y

// If-Else
agar x < y toh
  dikhao "Y bada hai"
warna
  dikhao "X bada hai"
khatam

// Loop
rakho i = 1
jab tak i <= 5 karo
  dikhao i
  i = i + 1
khatam
```

---

## 🚀 Tech Stack

* JavaScript
* Docker
* Docker Compose
* GitLab CI/CD
* Linux

---

## 📈 Key Features

* Full 4-phase compiler pipeline
* Custom Hinglish programming language
* Interactive UI
* Dockerized application
* Automated CI/CD pipeline

---

## 🧠 Learning Outcomes

* Understanding compiler design concepts
* Hands-on DevOps (CI/CD, Docker)
* Automation using GitLab pipelines
* Real-world deployment workflow

---

## 🔗 Project Links

* GitLab CI/CD: https://gitlab.com/na-group1445414/Gitlab-Compiler.git

---

## 👨‍💻 Author

Developed as part of DevOps & Compiler Design learning journey.

---

⭐ If you like this project, give it a star!

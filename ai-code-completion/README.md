# AI Code Completion Tool

A self-hosted AI code completion tool that runs entirely in your Codesphere workspace. No external API required — your code never leaves your server.

## Features

- **Local Processing**: All code stays on your machine. No cloud API calls.
- **Multi-Language Support**: JavaScript, Python, HTML, CSS, JSON
- **Smart Completions**: Context-aware code suggestions
- **CodeMirror Editor**: Professional code editing experience with syntax highlighting, line numbers, and code folding

## Supported Languages

| Language | Completions |
|----------|-------------|
| JavaScript | functions, classes, async/await, imports, loops, conditionals |
| Python | functions, classes, decorators, list comprehensions, context managers |
| HTML | semantic elements, forms, tables, media |
| CSS | flexbox, grid, colors, typography, layouts |
| JSON | key-value pairs, nested objects, arrays |

## Deployment on Codesphere

1. Fork this template
2. Create a new Codesphere workspace from your fork
3. Set up the CI pipeline (auto-installed on Codesphere)
4. Run the `prepare` stage to install dependencies
5. Run the `run` stage to start the dev server
6. Click "Open deployment" to access the tool

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000 to use the tool.

## Usage

1. Select your programming language from the dropdown
2. Start typing code in the editor
3. When you type a keyword (like "func", "const", "def"), completion suggestions appear
4. Click a suggestion or use it as inspiration to complete your code

## How It Works

This tool uses local snippet matching rather than a real AI model to provide code completions. In a production environment, you could replace the completion logic with:

- A self-hosted LLM (like CodeLlama or StarCoder)
- The Continue.dev or other open-source completion engines
- A local instance of the AI Code Completion model

The architecture is designed so that the completion backend can be swapped out without changing the frontend.

## Tech Stack

- Next.js 14 (App Router)
- CodeMirror 6 (editor)
- React 18

## Blog Post

[Write a blog article about this project on Dev.To, Medium, or personal blog and link it here]

---

Built for Codesphere Templates — deploy complex apps in minutes.
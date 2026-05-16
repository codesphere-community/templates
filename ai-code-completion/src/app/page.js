'use client'

import { useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { json } from '@codemirror/lang-json'

const LANGUAGES = {
  javascript: javascript({ jsx: true }),
  python: python(),
  html: html(),
  css: css(),
  json: json(),
}

const SAMPLE_COMPLETIONS = {
  javascript: [
    { label: 'console.log', detail: 'Log to console', insertText: 'console.log(${1:value})' },
    { label: 'function', detail: 'Function declaration', insertText: 'function ${1:name}(${2:params}) {\n  ${3:// body}\n}' },
    { label: 'async function', detail: 'Async function', insertText: 'async function ${1:name}(${2:params}) {\n  ${3:// body}\n}' },
    { label: 'const', detail: 'Constant declaration', insertText: 'const ${1:name} = ${2:value}' },
    { label: 'let', detail: 'Variable declaration', insertText: 'let ${1:name} = ${2:value}' },
    { label: 'if', detail: 'If statement', insertText: 'if (${1:condition}) {\n  ${2:// body}\n}' },
    { label: 'for', detail: 'For loop', insertText: 'for (let ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n  ${3:// body}\n}' },
    { label: 'return', detail: 'Return statement', insertText: 'return ${1:value}' },
    { label: 'class', detail: 'Class declaration', insertText: 'class ${1:name} {\n  constructor(${2:params}) {\n    ${3:// init}\n  }\n}' },
    { label: 'import', detail: 'Import statement', insertText: "import { ${1:module} } from '${2:path}'" },
  ],
  python: [
    { label: 'def', detail: 'Function definition', insertText: 'def ${1:name}(${2:params}):\n    ${3:pass}' },
    { label: 'class', detail: 'Class definition', insertText: 'class ${1:name}:\n    def __init__(self${2:params}):\n        ${3:pass}' },
    { label: 'print', detail: 'Print to stdout', insertText: 'print(${1:value})' },
    { label: 'if', detail: 'If statement', insertText: 'if ${1:condition}:\n    ${2:pass}' },
    { label: 'for', detail: 'For loop', insertText: 'for ${1:item} in ${2:iterable}:\n    ${3:pass}' },
    { label: 'while', detail: 'While loop', insertText: 'while ${1:condition}:\n    ${2:pass}' },
    { label: 'try', detail: 'Try-except block', insertText: 'try:\n    ${1:pass}\nexcept ${2:Exception} as ${3:e}:\n    ${4:pass}' },
    { label: 'with', detail: 'Context manager', insertText: 'with ${1:context} as ${2:target}:\n    ${3:pass}' },
    { label: 'async def', detail: 'Async function', insertText: 'async def ${1:name}(${2:params}):\n    ${3:pass}' },
    { label: 'return', detail: 'Return statement', insertText: 'return ${1:value}' },
  ],
  html: [
    { label: '<div>', detail: 'Div element', insertText: '<div${1:attr}>\n  ${2:content}\n</div>' },
    { label: '<span>', detail: 'Span element', insertText: '<span${1:attr}>${2:content}</span>' },
    { label: '<p>', detail: 'Paragraph', insertText: '<p>${1:content}</p>' },
    { label: '<a>', detail: 'Link', insertText: '<a href="${1:url}"${2:attr}>${3:text}</a>' },
    { label: '<img>', detail: 'Image', insertText: '<img src="${1:src}" alt="${2:alt}"${3:attr}/>' },
    { label: '<ul>', detail: 'Unordered list', insertText: '<ul>\n  <li>${1:item}</li>\n</ul>' },
    { label: '<button>', detail: 'Button', insertText: '<button${1:attr}>${2:text}</button>' },
    { label: '<input>', detail: 'Input field', insertText: '<input type="${1:text}"${2:attr}/>' },
  ],
  css: [
    { label: 'display', detail: 'Display property', insertText: 'display: ${1:block}' },
    { label: 'margin', detail: 'Margin shorthand', insertText: 'margin: ${1:0}' },
    { label: 'padding', detail: 'Padding shorthand', insertText: 'padding: ${1:0}' },
    { label: 'color', detail: 'Text color', insertText: 'color: ${1:#000}' },
    { label: 'font-size', detail: 'Font size', insertText: 'font-size: ${1:16px}' },
    { label: 'background', detail: 'Background', insertText: 'background: ${1:#fff}' },
    { label: 'flex', detail: 'Flexbox', insertText: 'display: flex;\n  justify-content: ${1:center};\n  align-items: ${2:center};' },
    { label: 'grid', detail: 'CSS Grid', insertText: 'display: grid;\n  grid-template-columns: ${1:1fr};\n  gap: ${2:1rem};' },
  ],
  json: [
    { label: '"key": "value"', detail: 'Key-value pair', insertText: '"${1:key}": "${2:value}"' },
    { label: '"name": "', detail: 'Name property', insertText: '"name": "${1:value}"' },
    { label: '"version": "', detail: 'Version property', insertText: '"version": "${1:1.0.0}"' },
    { label: '"dependencies": {}', detail: 'Dependencies object', insertText: '"dependencies": {\n  "${1:name}": "${2:version}"\n}' },
  ],
}

function getCompletions(lang, query) {
  const langCompletions = SAMPLE_COMPLETIONS[lang] || SAMPLE_COMPLETIONS.javascript
  if (!query) return langCompletions.slice(0, 8)
  const q = query.toLowerCase()
  return langCompletions.filter(c => c.label.toLowerCase().includes(q)).slice(0, 6)
}

export default function Home() {
  const [code, setCode] = useState('// Start typing code here\nfunction hello() {\n  \n}\n')
  const [language, setLanguage] = useState('javascript')
  const [completions, setCompletions] = useState([])
  const [activeCompletion, setActiveCompletion] = useState(null)
  const [showCompletions, setShowCompletions] = useState(false)

  const handleChange = (value) => {
    setCode(value)
    const lines = value.split('\n')
    const lastLine = lines[lines.length - 1]
    const words = lastLine.split(/\s/)
    const lastWord = words[words.length - 1]

    if (lastWord.length >= 2) {
      const found = getCompletions(language, lastWord)
      setCompletions(found)
      setShowCompletions(found.length > 0)
      setActiveCompletion(found[0] || null)
    } else {
      setShowCompletions(false)
      setCompletions([])
      setActiveCompletion(null)
    }
  }

  const insertCompletion = (completion) => {
    const lines = code.split('\n')
    const lastLineIdx = lines.length - 1
    const lastLine = lines[lastLineIdx]
    const words = lastLine.split(/\s/)
    const wordStart = code.lastIndexOf(' ' + lastWord(lastLine)) + 1
    const lastWord = lastWord(lastLine)
    
    let newCode = code.substring(0, wordStart) + completion.label + code.substring(wordStart + lastWord.length)
    setCode(newCode)
    setShowCompletions(false)
  }

  const lastWord = (line) => {
    const words = line.split(/\s/)
    return words[words.length - 1] || ''
  }

  const langExtensions = {
    javascript: javascript({ jsx: true }),
    python: python(),
    html: html(),
    css: css(),
    json: json(),
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#c9d1d9', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>AI Code Completion</h1>
          <p style={{ fontSize: '12px', color: '#8b949e', margin: '4px 0 0' }}>Self-hosted • No API required • Your code stays local</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ fontSize: '14px', color: '#8b949e' }}>Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ background: '#161b22', border: '1px solid #30363d', color: '#c9d1d9', padding: '6px 12px', borderRadius: '6px', fontSize: '14px' }}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="json">JSON</option>
          </select>
        </div>
      </header>

      <div style={{ padding: '24px', height: 'calc(100vh - 80px)' }}>
        <div style={{ position: 'relative', height: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #30363d' }}>
          <CodeMirror
            value={code}
            height="100%"
            theme="dark"
            extensions={[langExtensions[language]]}
            onChange={handleChange}
            style={{ fontSize: '14px', height: '100%' }}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightActiveLine: true,
              foldGutter: true,
              autocompletion: false,
            }}
          />

          {showCompletions && completions.length > 0 && (
            <div style={{
              position: 'absolute',
              bottom: '80px',
              left: '24px',
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '8px',
              padding: '8px',
              minWidth: '300px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              zIndex: 100,
            }}>
              <div style={{ fontSize: '11px', color: '#8b949e', padding: '4px 8px', marginBottom: '4px' }}>
                AI Completions (local model)
              </div>
              {completions.map((comp, i) => (
                <div
                  key={i}
                  onClick={() => insertCompletion(comp)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    background: activeCompletion === comp ? '#21262d' : 'transparent',
                  }}
                  onMouseEnter={() => setActiveCompletion(comp)}
                >
                  <span style={{ fontSize: '14px', color: '#58a6ff' }}>{comp.label}</span>
                  <span style={{ fontSize: '12px', color: '#8b949e', marginLeft: '8px' }}>{comp.detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: '16px', padding: '12px 16px', background: '#161b22', borderRadius: '8px', border: '1px solid #30363d' }}>
          <div style={{ fontSize: '13px', color: '#8b949e' }}>
            <strong style={{ color: '#c9d1d9' }}>How it works:</strong> Type any keyword (e.g., "func", "const", "def") and AI Code Completion will suggest relevant snippets from your local model.
            All processing happens locally — no data leaves your workspace.
          </div>
        </div>
      </div>
    </div>
  )
}
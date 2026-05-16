import { useState, useRef } from 'react'
import Head from 'next/head'

export default function Home() {
  const [text, setText] = useState('https://codesphere.com')
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#FFFFFF')
  const canvasRef = useRef(null)

  function generateQR() {
    const QRCode = require('qrcode')
    const canvas = canvasRef.current
    QRCode.toCanvas(canvas, text || ' ', {
      width: size,
      margin: 2,
      color: { dark: fgColor, light: bgColor }
    }, (err) => {
      if (err) console.error(err)
    })
  }

  function downloadPNG() {
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="container">
      <Head>
        <title>QR Code Generator</title>
      </Head>
      <h1>QR Code Generator</h1>
      <p className="subtitle">Generate customizable QR codes instantly</p>
      <div className="form">
        <label>Text or URL</label>
        <input
          placeholder="Enter text or URL..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className="options">
        <div className="form">
          <label>Size: {size}px</label>
          <input
            type="range"
            min={128}
            max={512}
            step={32}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
        </div>
        <div className="form">
          <label>Foreground</label>
          <input
            type="color"
            value={fgColor}
            onChange={(e) => setFgColor(e.target.value)}
          />
        </div>
        <div className="form">
          <label>Background</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />
        </div>
      </div>
      <button className="generate-btn" onClick={generateQR}>Generate QR Code</button>
      <div className="preview">
        <canvas ref={canvasRef}></canvas>
      </div>
      <button className="download-btn" onClick={downloadPNG}>Download PNG</button>
      <style jsx>{`
        .container { max-width: 640px; margin: 0 auto; padding: 2rem; text-align: center; font-family: -apple-system, sans-serif; }
        h1 { font-size: 2.2rem; color: #1e293b; margin-bottom: 0.25rem; }
        .subtitle { color: #64748b; margin-bottom: 2rem; }
        .form { display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem; margin-bottom: 1rem; }
        .form label { font-weight: 600; color: #475569; font-size: 0.9rem; }
        .form input[type="text"] { width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; }
        .form input[type="color"] { width: 60px; height: 40px; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer; }
        .options { display: flex; gap: 1.5rem; flex-wrap: wrap; justify-content: center; margin-bottom: 1rem; }
        .generate-btn { padding: 0.75rem 2rem; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; margin-bottom: 1.5rem; }
        .generate-btn:hover { background: #2563eb; }
        .preview { display: flex; justify-content: center; margin-bottom: 1rem; min-height: 128px; align-items: center; background: #f8fafc; border-radius: 12px; padding: 1rem; }
        .preview canvas { border-radius: 8px; }
        .download-btn { padding: 0.6rem 1.5rem; background: #22c55e; color: white; border: none; border-radius: 8px; font-size: 0.95rem; cursor: pointer; }
        .download-btn:hover { background: #16a34a; }
      `}</style>
    </div>
  )
}

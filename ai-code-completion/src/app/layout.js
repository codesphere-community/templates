import './globals.css'

export const metadata = {
  title: 'AI Code Completion',
  description: 'Self-hosted AI code completion tool',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
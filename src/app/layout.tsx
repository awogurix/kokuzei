import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '税務調査立会ドットコム - 専門家による税務調査サポート',
  description: '元国税調査官による税務調査の立会サポート。追徴税額を最小限に抑え、重加算税を回避する専門的なアドバイスを提供します。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}

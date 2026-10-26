import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '商品一覧',
  description: '商品の一覧と詳細を表示する Next.js アプリ'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}

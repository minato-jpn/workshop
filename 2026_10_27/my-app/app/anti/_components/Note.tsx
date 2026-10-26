import Link from 'next/link'
import type { ReactNode } from 'react'

type Props = {
  title: string
  goodHref: string
  children: ReactNode
}

// 各アンチパターンページの冒頭に出す「何が悪いか / どこを見るか」の説明
export const Note = ({ title, goodHref, children }: Props) => {
  return (
    <aside style={{ padding: 16, marginBottom: 24, background: '#fff4e5', borderRadius: 8 }}>
      <p>
        <Link href="/anti">← アンチパターン一覧</Link> / 推奨版: <Link href={goodHref}>{goodHref}</Link>
      </p>
      <h1>❌ {title}</h1>
      {children}
    </aside>
  )
}

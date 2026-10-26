import Link from 'next/link'

// 推奨版とアンチパターンを並べた検証ページの一覧
const patterns = [
  {
    chapter: 'データフェッチ on Server Components',
    anti: '/anti/client-fetch',
    good: '/products',
    check: 'Network タブとページのソース'
  },
  {
    chapter: 'データフェッチ コロケーション / 細粒度の REST API 設計',
    anti: '/anti/props-drilling',
    good: '/products',
    check: 'コード(誰がデータを知っているか)'
  },
  {
    chapter: 'Request Memoization',
    anti: '/anti/no-memoization/1',
    good: '/products/1',
    check: 'ターミナルのクエリ回数'
  },
  {
    chapter: '並行データフェッチ',
    anti: '/anti/waterfall/1',
    good: '/products/1',
    check: 'DB_DELAY_MS=500 で起動して start / end の順番'
  },
  {
    chapter: 'N+1 と DataLoader',
    anti: '/anti/n-plus-one',
    good: '/products',
    check: 'ターミナルのクエリ回数'
  },
  {
    chapter: 'N+1 と DataLoader(DataLoader の作り方)',
    anti: '/anti/shared-loader/1',
    good: '/products/1',
    check: 'DB を更新してからリロード'
  }
]

export default function AntiPatternsPage() {
  return (
    <main>
      <h1>アンチパターン検証</h1>
      <p>
        ターミナルの [db] start / end ログで、推奨版と比べてください。ウォーターフォールを見るときは
        <code>DB_DELAY_MS=500 npm run dev</code> で起動します。
      </p>
      <table>
        <thead>
          <tr>
            <th>章</th>
            <th>❌ アンチパターン</th>
            <th>✅ 推奨版</th>
            <th>見るところ</th>
          </tr>
        </thead>
        <tbody>
          {patterns.map((pattern) => (
            <tr key={pattern.anti}>
              <td>{pattern.chapter}</td>
              <td>
                <Link href={pattern.anti}>{pattern.anti}</Link>
              </td>
              <td>
                <Link href={pattern.good}>{pattern.good}</Link>
              </td>
              <td>{pattern.check}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>server-only(ビルド時に検出されるのでページはありません)</h2>
      <p>
        Client Component(&apos;use client&apos;)から <code>@/app/lib/products</code> の関数を import
        するとビルドエラーになります。試すときは一時的にファイルを作って確認し、終わったら消してください。
      </p>
    </main>
  )
}

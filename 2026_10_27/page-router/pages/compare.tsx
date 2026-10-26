import Link from "next/link";

// Pages Router(このアプリ, :3001)と App Router(my-app, :3000)の比較一覧
const rows = [
  {
    topic: "データ取得の単位 / バケツリレー",
    pages: "/products",
    app: "/products",
    check: "コード: getServerSideProps → Products → Card と props で渡す / App Router は Card が自分で取得",
  },
  {
    topic: "フェッチ完了まで描画されない",
    pages: "/products",
    app: "/products",
    // App Router の /products/[id] は 404 判定のためページで await するので、比較には使わない
    check: "DB_DELAY_MS=500 で TTFB を比較(curl の time_starttransfer)。App Router は Loading を先にストリーミングする",
  },
  {
    topic: "並行データフェッチ(Promise.all)",
    pages: "/products/1",
    app: "/products/1",
    check: "ログで start が 2 つ並ぶ",
  },
  {
    topic: "❌ getServerSideProps 内のウォーターフォール",
    pages: "/anti/sequential/1",
    app: "/anti/waterfall/1",
    check: "ログで start / end が交互",
  },
  {
    topic: "クライアントでコロケーション(React Query)",
    pages: "/client-colocation",
    app: "/products",
    check: "Network タブ: HTTP の N+1 / ページのソースに商品名がない",
  },
];

export default function ComparePage() {
  return (
    <main style={{ padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Pages Router と App Router の比較</h1>
      <p>
        両方を起動して比べてください: my-app で <code>DB_DELAY_MS=500 npm run dev</code>(:3000)、page-router で{" "}
        <code>DB_DELAY_MS=500 npm run dev</code>(:3001)
      </p>
      <table>
        <thead>
          <tr>
            <th>テーマ</th>
            <th>Pages Router</th>
            <th>App Router</th>
            <th>見るところ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.topic}>
              <td>{row.topic}</td>
              <td>
                <Link href={row.pages}>{row.pages}</Link>
              </td>
              <td>
                <a href={`http://localhost:3000${row.app}`}>{row.app}</a>
              </td>
              <td>{row.check}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

# データフェッチ検証ガイド

「Next.jsの考え方」第1部(データフェッチ)の内容を、推奨パターンとアンチパターンを並べて手元で確かめるためのガイドです。

- [データフェッチ on Server Components](https://zenn.dev/akfm/books/nextjs-basic-principle/viewer/part_1_server_components)
- [データフェッチ コロケーション](https://zenn.dev/akfm/books/nextjs-basic-principle/viewer/part_1_colocation)
- [Request Memoization](https://zenn.dev/akfm/books/nextjs-basic-principle/viewer/part_1_request_memoization)
- [並行データフェッチ](https://zenn.dev/akfm/books/nextjs-basic-principle/viewer/part_1_concurrent_fetch)
- [N+1とDataLoader](https://zenn.dev/akfm/books/nextjs-basic-principle/viewer/part_1_data_loader)
- [細粒度のREST API設計](https://zenn.dev/akfm/books/nextjs-basic-principle/viewer/part_1_fine_grained_api_design)

| ディレクトリ | 内容 | ポート |
|---|---|---|
| `my-app/` | App Router(推奨パターン + `/anti` 以下にアンチパターン) | 3000 |
| `page-router/` | Pages Router(比較用) | 3001 |

## 起動

```bash
# DB(初回のみ。起動済みなら不要)
docker compose up -d

# ターミナル1: App Router
cd my-app && DB_DELAY_MS=500 npm run dev

# ターミナル2: Pages Router
cd page-router && DB_DELAY_MS=500 npm run dev
```

`DB_DELAY_MS` は各クエリを指定ミリ秒だけ遅らせる検証用の設定です。ローカル DB は数 ms で返るので、遅延を入れないと直列か並行かがログで見分けられません。付けなくても動きます。

## ログの見方

クエリの回数と順番は、ブラウザではなく `npm run dev` を実行したターミナルに出ます。

```
[db] start getProductIds          ← start が先に並び
[db] start getProductsByIds [1]
[db] end   getProductIds (505ms)  ← あとから end が並べば「並行」
[db] end   getProductsByIds [1] (506ms)
```

`start → end → start → end` と交互に出れば「直列(ウォーターフォール)」です。

## 入口

- http://localhost:3000/anti … App Router の推奨版とアンチパターンの比較一覧
- http://localhost:3001/compare … Pages Router と App Router の比較一覧

## App Router(my-app)

### 推奨パターン

| URL | 記事の内容 | 確認すること |
|---|---|---|
| http://localhost:3000/products | Server Components / コロケーション / DataLoader | id 一覧 1 回 + `getProductsByIds [1, 2, 3]` の 1 回だけ |
| http://localhost:3000/products/1 | Request Memoization / 並行データフェッチ | `getProduct(1)` を 3 か所で呼んでもクエリは 1 回。`getProductIds` と `getProductsByIds [1]` の start が並ぶ |

### アンチパターン

| URL | 何が悪いか | 確認方法 | 結果(DB_DELAY_MS=300〜500) |
|---|---|---|---|
| http://localhost:3000/anti/client-fetch | Client Component で `useEffect` + fetch | DevTools の Network タブ / ページのソース | HTML に商品名が 0 件。JS 実行後に API が直列で飛ぶ |
| http://localhost:3000/anti/props-drilling | ページで一括取得して props でバケツリレー。一覧に不要な `detail` まで取得 | コード | カードの項目を変えるたびにページまで直す必要がある |
| http://localhost:3000/anti/no-memoization/1 | `React.cache` なし | ターミナルのログ | 同じクエリが **3 回**(推奨版は 1 回) |
| http://localhost:3000/anti/waterfall/1 | preload なし(推奨版から 1 行消しただけ) | ターミナルのログ | 3 クエリが直列で **1072ms**(推奨版は **717ms**) |
| http://localhost:3000/anti/n-plus-one | DataLoader なしでカードごとに 1 件取得 | ターミナルのログ | **4 クエリ**(推奨版は 2 クエリ) |
| http://localhost:3000/anti/shared-loader/1 | DataLoader をモジュールスコープで作る | 手順はページ内に記載 | DB を更新しても古い価格のまま。別リクエスト(別ユーザー)にキャッシュが漏れる |

### server-only(ページなし)

Client Component(`'use client'`)から `@/app/lib/products` を import すると、ビルド時に次のエラーになります。

```
You're importing a module that depends on "server-only" into a React Client Component module.
```

試すときは一時ファイルを作って `npx next build` し、終わったら削除してください。

## Pages Router(page-router)

| URL | 内容 | 確認すること |
|---|---|---|
| http://localhost:3001/products | `getServerSideProps` → `Products` → `Card` へ props でバケツリレー | コード / TTFB |
| http://localhost:3001/products/1 | `getServerSideProps` 内で `Promise.all`(Pages Router での並行データフェッチ) | 2 つの start が並ぶ。**523ms** |
| http://localhost:3001/anti/sequential/1 | ❌ `getServerSideProps` 内で `await` を直列に書く | start / end が交互。**1031ms** |
| http://localhost:3001/client-colocation | React Query で各コンポーネントがクライアントから取得 | Network タブで `/api/products/1`・`/2`・`/3` が別々に飛ぶ(HTTP の N+1)。HTML に商品名なし |

### 「フェッチ完了まで描画されない」の確認

```bash
curl -s -o /dev/null -w 'TTFB=%{time_starttransfer} total=%{time_total}\n' localhost:3001/products
curl -s -o /dev/null -w 'TTFB=%{time_starttransfer} total=%{time_total}\n' localhost:3000/products
```

| | TTFB | 全体 |
|---|---|---|
| Pages Router `/products` | 0.54 秒 | 0.54 秒 |
| App Router `/products` | **0.06 秒** | 1.1 秒 |

Pages Router は全データがそろうまで HTML を返しません。App Router は `Suspense` の Loading を先に返し、データは後からストリーミングします。

App Router の `/products/1` は 404 判定のためにページで `await` しているので、TTFB の比較には使えません(実測で Pages Router より遅くなりました)。

## Pages Router と App Router の違い

| | Pages Router | App Router |
|---|---|---|
| サーバーで取得できる場所 | ページの `getServerSideProps` だけ | どの Server Component でも |
| 下位コンポーネントへの渡し方 | props でバケツリレー | 各コンポーネントが自分で取得(コロケーション) |
| 下位でコロケーションしたい場合 | React Query などでクライアントフェッチ。ブラウザに公開する API が必要で、HTTP の N+1 とウォーターフォールが起きる | Server Component のまま取得し、DataLoader で 1 クエリにまとめる |
| 重複呼び出しの対策 | ページに集約されるので起きにくい | `React.cache`(Request Memoization) |
| 並行化 | `Promise.all` | コンポーネント分割 + `Suspense` + preload |
| 描画開始 | 全データ取得後 | Loading を先にストリーミング |

## 実装のポイント(my-app)

### データ層: `my-app/app/lib/products.ts`

```ts
import 'server-only'                       // クライアントからの import をビルドエラーにする
import { cache } from 'react'
import DataLoader from 'dataloader'

// 細粒度 API: 一覧は id だけ
export const getProductIds = cache(async () => { /* SELECT id ... */ })

// バッチ API: keys と同じ順序・長さで返す
export const getProductsByIds = async (ids: readonly number[]) => { /* WHERE id = ANY($1) */ }

// DataLoader はリクエストごとに 1 つ(モジュールスコープで new しない)
const getProductLoader = cache(() => new DataLoader(getProductsByIds))

export const getProduct = async (id: number) => getProductLoader().load(id)
```

### コロケーション: `my-app/app/components/Card/Card.tsx`

```tsx
// id だけ受け取り、表示するデータは自分で取得する
export const Card = async ({ id }: { id: number }) => {
  const product = await getProduct(id)   // N 枚あっても DataLoader が 1 クエリにまとめる
  ...
}
```

### 並行データフェッチ: `my-app/app/products/[id]/page.tsx`

```tsx
preloadProducts()                          // 「ほかの商品」の取得を先に始める(await しない)
const product = await getProduct(productId) // 404 判定のためここだけ待つ
```

## ファイル構成

```
my-app/app/
├── lib/
│   ├── db.ts                 # Pool + 検証用ログ/遅延付き query()
│   └── products.ts           # ✅ 推奨版データ層
├── components/
│   ├── Products/Products.tsx # id 一覧を取得して Card を並べる + preloadProducts
│   ├── Card/Card.tsx         # 自分で getProduct
│   └── ProductDetail/        # 自分で getProduct
├── products/                 # ✅ 推奨版ページ
├── api/products/route.ts     # 細粒度 API(?id=1&id=2 でバッチ取得)
└── anti/                     # ❌ アンチパターン
    ├── _lib/products.ts      # cache なし / 共有 DataLoader / 粗い API
    ├── _components/
    └── client-fetch/ props-drilling/ no-memoization/ waterfall/ n-plus-one/ shared-loader/

page-router/
├── lib/db.ts lib/products.ts # my-app と同じログ/遅延
├── pages/
│   ├── api/[[...route]].ts   # Hono: GET /api/products, /api/products/:id
│   ├── products/             # getServerSideProps 版
│   ├── anti/sequential/      # ❌ 直列 await
│   ├── client-colocation/    # React Query 版
│   └── compare.tsx           # 比較一覧
└── components/Note/
```

## 注意

- **アンチパターンのページ**:`/anti` 以下は学習用です。実装の参考にしないでください。
- **DB を更新したら戻す**:`shared-loader` の検証で価格を変えたら、元に戻してください。

  ```bash
  docker exec workshop-db psql -U postgres -d workshop -c "UPDATE products SET price = 1800 WHERE id = 2"
  ```

- **使われていないファイル**:`my-app/app/_lib/products/fetcher/` はもうどこからも使われていません。

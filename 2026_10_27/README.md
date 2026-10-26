# Nextjsの考えかた (データフェッチ)

## 今回の内容

「Next.jsの考え方」第1部(データフェッチ)を読んで、実際に手を動かして確かめた内容のまとめです。
推奨パターンとアンチパターンを並べて、クエリの回数や順番をログで比べられるようにしました。起動方法と URL の一覧は [GUIDE.md](./GUIDE.md) にあります。

- App Router 版: http://localhost:3000/anti
- Pages Router 版: http://localhost:3001/compare

### この資料で見せたいこと

**app router は「コンポーネントごとにデータを取る(コロケーション)」と「速い・少ないクエリ」を両立できる。ただし、そのためには server-only・React.cache・preload・DataLoader という道具を正しく使う必要がある。**

各節の冒頭の「見せたいこと」に、その節で伝えたいことと、デモで開く URL・見る場所を書いています。

| 見る場所 | 意味 |
|---|---|
| ログ | `npm run dev` を実行したターミナルに出る `[db] start / end` |
| Network | ブラウザの DevTools の Network タブ |
| ソース | 右クリック →「ページのソースを表示」 |

### デモの流れ

1. Pages Router の限界を見せる(バケツリレー / 描画が遅い / React Query だと HTTP の N+1)
2. app router ならコンポーネントで直接取れることを見せる(コロケーション)
3. そのとき出てくる問題を 1 つずつ解決する(重複呼び出し → Request Memoization、待ち時間 → 並行データフェッチ、クエリが多い → DataLoader)
4. それを支える API の形(細粒度 API)と、安全装置(server-only)を見せる

デモの前に、ターミナルを 2 つ開いて起動しておきます。

```bash
cd my-app && DB_DELAY_MS=500 npm run dev        # App Router   → :3000
cd page-router && DB_DELAY_MS=500 npm run dev   # Pages Router → :3001
```

## page router と app router のフェッチの違い

> **見せたいこと**: page router では「サーバーで取る(速いがバケツリレー)」か「下位コンポーネントでクライアントから取る(コロケーションできるが遅い)」の二択になる。app router はこの二択をなくした。
>
> | デモ | URL | 見る場所 |
> |---|---|---|
> | バケツリレー | http://localhost:3001/products | コード(`pages/products/index.tsx` → `Products` → `Card`) |
> | 全部取り終わるまで何も表示されない | http://localhost:3001/products と http://localhost:3000/products を交互に開く | 画面(App Router は Loading が先に出る) |
> | React Query でコロケーションすると HTTP の N+1 | http://localhost:3001/client-colocation | Network(`/api/products/1`・`/2`・`/3`)とソース(商品名がない) |

page routerでは、サーバー側のデータのフェッチはページの表示の段階(`getServerSideProps`)で呼び出されます。そのため、下位コンポーネントにデータを渡すためにpropsをバケツリレーするほかないです。ただ、クライアントサイドでデータのフェッチをする場合には、react queryとかがあるので、それを使えば下位のコンポネントでのデータの呼び出しは可能です。

ただし、react queryで下位コンポーネントから呼び出す場合は、

- ブラウザから叩くための API を公開する必要がある
- JS が動いてからフェッチするので、HTML にはデータが入らない
- カードごとに `/api/products/1`・`/2`・`/3` と HTTP リクエストが飛ぶ(HTTP の N+1)

という問題があります(http://localhost:3001/client-colocation の Network タブで確認できます)。

またページルーターのサーバー側のデータフェッチの場合は、データの取得をレンダリングの前に行うため、フェッチが完了するまでレンダリングがされません。
app routerでは `Suspense` で囲んだ部分のローディングを先に返して、データは後からストリーミングできます。

| 商品一覧(DB_DELAY_MS=500) | TTFB | 全体 |
|---|---|---|
| Pages Router | 0.54 秒 | 0.54 秒 |
| App Router | 0.06 秒 | 1.1 秒 |

## server-only を使った場合と使わない場合の違いについて

> **見せたいこと**: server-only がなくても「たまたま」ビルドエラーで止まることはあるが、止まらずに内部 API のコードがブラウザに配られてしまうケースがある。server-only は「サーバー専用」をビルドで保証する。
>
> | デモ | URL | 見る場所 |
> |---|---|---|
> | (ブラウザでは確認できない) | なし | 下の「使った場合と使わない場合」のビルド結果とエラーメッセージ |

間違ってクライアントサイドでデータフェッチをしないため。

### なぜ必要なのか

app routerでは、Server Component 用のファイルと Client Component 用のファイルが同じ `app/` の中に並びます。見た目では区別がつかないので、サーバーでだけ動かしたい関数を、うっかり Client Component(`'use client'`)から import してしまうことがあります。

`'use client'` のファイルから import されたモジュールは、すべてブラウザ向けの JS(クライアントバンドル)に含まれます。つまり、

- 内部 API の URL、SQL、認可のロジックなどのコードがブラウザから丸見えになる
- サーバーでしか使えないはずの処理が、ブラウザで実行されようとする

ということが起きます。

### 実装例

データ取得用のファイルの先頭に 1 行書くだけです(`npm install server-only` が必要)。

```ts
// app/lib/products.ts
// クライアントから誤って import されたらビルドエラーにする(DB 接続情報を漏らさない)
import 'server-only'
import { cache } from 'react'
import DataLoader from 'dataloader'
import { query } from './db'

export const getProductIds = cache(async (): Promise<number[]> => { ... })
```

Server Component から使う分には何も変わりません。

```tsx
// app/components/Products/Products.tsx(Server Component)→ OK
import { getProductIds } from '@/app/lib/products'
```

Client Component から import すると、ビルドが止まります。

```tsx
// app/xxx/page.tsx
'use client'
import { getProductIds } from '@/app/lib/products' // → ビルドエラー
```

### 使った場合と使わない場合(実際にビルドして確認)

Client Component から次の 2 種類の関数を import して、`next build` してみました。

```ts
// ① DB(pg)に直接つなぐ関数
export const getIds = async () => (await pool.query('SELECT id FROM products')).rows

// ② 秘密のトークン付きで内部 API を叩く関数
export const getSecretData = async () => {
  const res = await fetch('https://internal-api.example.com/v1/admin/products', {
    headers: { Authorization: `Bearer ${process.env.INTERNAL_API_TOKEN}` }
  })
  return res.json()
}
```

| | server-only なし | server-only あり |
|---|---|---|
| ① DB に直接つなぐ | ビルドエラー。ただし `Can't resolve 'dns'` という pg 内部の分かりにくいエラー(pg が Node.js 専用のモジュールを使っていたので、たまたま止まっただけ) | 原因が分かるエラーで止まる |
| ② 内部 API を叩く | **ビルドが通ってしまう**。内部 API の URL と処理内容がブラウザ向けの JS にそのまま入る | 原因が分かるエラーで止まる |

server-only ありのときのエラー:

```
You're importing a module that depends on "server-only" into a React Client Component module.
This API is only available in Server Components but one of its parents is marked with "use client",
so this module is also a Client Component.
```

②でブラウザ向けの JS に入っていたコード(ビルド結果の `.next/static` から抜粋):

```js
let n=async()=>(await fetch("https://internal-api.example.com/v1/admin/products",
  {headers:{Authorization:`Bearer ${i.default.env.INTERNAL_API_TOKEN}`}})).json();
```

トークンの値そのものは入っていませんでした。Next.js は `NEXT_PUBLIC_` で始まる環境変数しかブラウザ向けに埋め込まないためです。その代わりブラウザでは `undefined` になり、「なぜか認証エラーになる」という分かりにくいバグになります。コードに直接書かれた秘密情報なら、そのまま漏れます。

### まとめ

- server-only がなくても、たまたまビルドエラーで止まることはある。でも、止まらずに通ってしまうケースがある
- 「サーバーでしか動かさない」という意図を、コメントではなくビルドで強制できるのが server-only
- データ取得の関数(DB・内部 API・認証情報を使うもの)を置くファイルには、必ず書いておく

## コロケーション

> **見せたいこと**: どちらも見た目は同じページだが、「カードが使うデータを誰が知っているか」が違う。コロケーションすると、カードを直すときにカードのファイルだけ見ればよくなる。
>
> | デモ | URL | 見る場所 |
> |---|---|---|
> | ✅ Card が自分で取得する | http://localhost:3000/products | コード(`app/components/Card/Card.tsx`) |
> | ❌ ページで取得して props で渡す | http://localhost:3000/anti/props-drilling | コード(`app/anti/props-drilling/page.tsx`) |

app routerでは、データを使うコンポーネント自身がデータを取得します(コロケーション)。
ページで全部取得して props で渡すと、カードに項目を足すたびにページまで直すことになります。カードは id だけ受け取って、中身は自分で取得します。

```tsx
export const Card = async ({ id }: { id: number }) => {
  const product = await getProduct(id)
  ...
}
```

## Request Memoization

> **見せたいこと**: コロケーションすると同じデータをあちこちで呼ぶことになるが、`React.cache` があれば何回呼んでも DB アクセスは 1 回。だから安心して各コンポーネントで呼べる。
>
> | デモ | URL | 見る場所 |
> |---|---|---|
> | ✅ 3 か所で呼んでも 1 回 | http://localhost:3000/products/1 | ログ(`getProductsByIds [1]` が 1 回) |
> | ❌ `React.cache` なしだと 3 回 | http://localhost:3000/anti/no-memoization/1 | ログ(`getProductNoCache [1]` が 3 回) |

コロケーションすると、同じデータを複数のコンポーネントで呼び出すことになります(例: `generateMetadata`・ページ・詳細コンポーネントの 3 か所で同じ商品を取得)。
`fetch` は Next.js が同一リクエスト内の重複を自動でまとめてくれますが、DB に直接つなぐ場合は `React.cache` で包む必要があります。

```ts
export const getProductIds = cache(async () => { ... })
```

`React.cache` のキャッシュは**リクエストごと**で、リクエストが終われば捨てられます。ユーザー間で共有されることはありません。

| 詳細ページ | 同じ商品のクエリ回数 |
|---|---|
| `React.cache` なし(/anti/no-memoization/1) | 3 回 |
| `React.cache` あり(/products/1) | 1 回 |

## ウォーターフォールにしないために、並行で呼び出すようにしたらいいって話

> **見せたいこと**: コードの違いはたった 1 行(`Promise.all` か、`preloadProducts()` の有無)なのに、待ち時間が約 2 倍変わる。ログの `start` / `end` の並び方で、直列か並行かが一目で分かる。
>
> | デモ | URL | 見る場所 |
> |---|---|---|
> | ✅ App Router: preload で並行 | http://localhost:3000/products/1 | ログ(最初に `start` が 2 つ並ぶ) |
> | ❌ App Router: preload なし | http://localhost:3000/anti/waterfall/1 | ログ(`start → end → start → end`) |
> | ✅ Pages Router: `Promise.all` | http://localhost:3001/products/1 | ログ(最初に `start` が 2 つ並ぶ) |
> | ❌ Pages Router: `await` を順番に | http://localhost:3001/anti/sequential/1 | ログ(`start → end → start → end`) |

await を順番に書くと、前のデータ取得が終わるまで次の取得が始まりません(ウォーターフォール)。
2 つのデータに依存関係がない(片方の結果がなくても、もう片方を取得できる)なら、並行に取得すれば待ち時間は「合計」ではなく「一番遅いもの」になります。

```
直列:  [商品 500ms]──>[ほかの商品 500ms]          → 1000ms
並行:  [商品 500ms]
       [ほかの商品 500ms]                          →  500ms
```

ウォーターフォールが起きる場所は 2 つあります。

1. **1 つの関数の中**で await を順番に書いたとき
2. **親子のコンポーネント**で、親が await してから子をレンダリングするとき(子のデータ取得は、親の await が終わるまで始まらない)

### ① 1 つの関数の中のウォーターフォール

❌ await を順番に書く(page-router の `pages/anti/sequential/[id].tsx`)

```ts
export const getServerSideProps = async ({ params }) => {
  const productId = Number(params?.id)

  const product = await getProduct(productId) // 500ms 待ってから…
  if (!product) return { notFound: true }
  const products = await getProducts()        // …ここで初めて取得が始まる

  return { props: { product, otherProducts: products.filter((p) => p.id !== productId) } }
}
```

✅ `Promise.all` で同時に始める(page-router の `pages/products/[id].tsx`)

```ts
export const getServerSideProps = async ({ params }) => {
  const productId = Number(params?.id)

  // 2 つの取得を同時に始めて、両方終わるのを待つ
  const [product, products] = await Promise.all([getProduct(productId), getProducts()])
  if (!product) return { notFound: true }

  return { props: { product, otherProducts: products.filter((p) => p.id !== productId) } }
}
```

page router ではデータ取得が `getServerSideProps` に集まるので、並行化の手段は基本的にこれだけです。

### ② コンポーネントを分割して並行にする(app router)

app router では、**兄弟の Server Component は並行にレンダリングされる**ので、データ取得をコンポーネントに分けるだけで並行になります。`Promise.all` を書く必要はありません。

```tsx
// 兄弟なので、ProductDetail と Products のデータ取得は同時に始まる
export default function Page() {
  return (
    <main>
      <Suspense fallback={<Loading />}>
        <ProductDetail id={1} />    {/* 中で await getProduct(1) */}
      </Suspense>
      <Suspense fallback={<Loading />}>
        <Products excludeId={1} />  {/* 中で await getProductIds() */}
      </Suspense>
    </main>
  )
}
```

`Suspense` で囲むと、終わったものから順に表示されます(遅い方を待たずにストリーミングされる)。

### ③ 親子のウォーターフォール

ページで await してから子をレンダリングすると、子のデータ取得はその後になります。404 判定のために、ページで商品を待たないといけない場合などです。

❌ `app/anti/waterfall/[id]/page.tsx`

```tsx
export default async function WaterfallPage({ params }: Props) {
  const productId = Number((await params).id)

  const product = await getProduct(productId) // ページで 500ms 待つ
  if (!product) notFound()

  return (
    <main>
      <ProductDetail id={productId} />
      <Suspense fallback={<Loading />}>
        <Products excludeId={productId} /> {/* ここで初めて getProductIds() が始まる */}
      </Suspense>
    </main>
  )
}
```

### ④ preload パターンで親子のウォーターフォールを解消する

親が await する**前に**、子が使うデータの取得を await せずに始めておきます。子では普通に同じ関数を呼ぶだけで、先に始めた取得の結果を受け取れます。

✅ `app/components/Products/Products.tsx`(preload 関数は使う側のコンポーネントの隣に置く)

```tsx
// 一覧の preload 用。詳細ページなどで、ほかの await より先に取得を始めておく
export const preloadProducts = () => {
  void getProductIds() // await しない。void は「結果を使わない」ことの明示
}

export const Products = async ({ excludeId }: Props) => {
  const ids = await getProductIds() // preload 済みなら、その結果を受け取るだけ
  ...
}
```

✅ `app/products/[id]/page.tsx`

```tsx
export default async function ProductPage({ params }: Props) {
  const productId = parseId((await params).id)
  if (productId === null) notFound()

  // 並行データフェッチ: 「ほかの商品」の取得を、商品の存在チェックを待たずに始めておく
  preloadProducts()

  // 存在しない商品は 404 にするため、ここだけはページで待つ
  const product = await getProduct(productId)
  if (!product) notFound()

  return (
    <main>
      <ProductDetail id={productId} />
      <Suspense fallback={<Loading />}>
        <Products excludeId={productId} />
      </Suspense>
    </main>
  )
}
```

**preload は `React.cache` があって初めて成り立ちます。** `getProductIds` が `cache` で包まれているので、preload で始めた Promise と、`Products` の中で呼んだ結果が同じものになります。`cache` がないと、preload と `Products` で 2 回クエリが飛ぶだけです。

```ts
// app/lib/products.ts
export const getProductIds = cache(async (): Promise<number[]> => { ... })
```

実際のログ(DB_DELAY_MS=300):

```
# ❌ /anti/waterfall/1(preload なし)
[db] start getProductsByIds [1]
[db] end   getProductsByIds [1] (305ms)
[db] start getProductIds              ← 商品の取得が終わってから始まる
[db] end   getProductIds (308ms)

# ✅ /products/1(preload あり)
[db] start getProductIds              ← 2 つが同時に始まる
[db] start getProductsByIds [1]
[db] end   getProductIds (305ms)
[db] end   getProductsByIds [1] (310ms)
```

### まとめ

| 状況 | 解決方法 |
|---|---|
| 1 つの関数の中で複数のデータを取得する | `Promise.all` |
| app router で別々のコンポーネントが使うデータ | コンポーネントを分割する(兄弟は並行)+ `Suspense` |
| 親で await してから子をレンダリングする | preload(+ `React.cache`) |
| 本当に依存関係がある(A の結果を使って B を取得する) | 直列で OK。並行にはできない |

| 詳細ページ(DB_DELAY_MS=300〜500) | 並行 | 直列 |
|---|---|---|
| app router | 717ms | 1072ms(preload を消しただけ) |
| page router | 523ms(`Promise.all`) | 1031ms(await を順番に書いただけ) |

### 並行ですべて呼び出すのに問題点はないのか

あります。

- 一覧のようにコンポーネントが大量に並ぶと、その数だけクエリ/API リクエストが同時に飛ぶ(N+1)。→ 次の節の DataLoader で解決します
- DB のコネクションプールや外部 API のレート制限を使い切る恐れがある
- `Promise.all` は 1 つでも失敗すると全体が失敗する(一部だけ失敗してよいなら `Promise.allSettled`)

## N+1のデータフェッチの実装

> **見せたいこと**: コロケーションしてカードごとに取得すると N+1 になるが、DataLoader で 1 クエリにまとまる。ただし DataLoader をモジュールスコープで作ると、別のユーザーにデータが漏れる。
>
> | デモ | URL | 見る場所 |
> |---|---|---|
> | ✅ DataLoader で 1 クエリ | http://localhost:3000/products | ログ(`getProductsByIds [1, 2, 3]` が 1 回) |
> | ❌ DataLoader なし | http://localhost:3000/anti/n-plus-one | ログ(`getProductNoCache` がカードの数だけ) |
> | ❌ DataLoader を共有 | http://localhost:3000/anti/shared-loader/1 | 画面(ページ内の手順で DB を更新してリロード → 古い価格のまま) |

コロケーションを意識して、コンポネントごとのAPI呼び出しとウォーターフォール式のレンダリングにしないために親コンポーネントで並行してレンダリングするとしたときに、コンポーネントが一度に並行で呼び出されるのでAPIも並行して実行される。
コンポーネントのレンダリングのたびに呼び出しを発生させることになるので、テーブルのような構造のコンポーネントをレンダリングなどを行うと大量のリクエストが実行されてしまうことになる。

データローダは同時に個別で処理されるリクエストを一回のリクエストにまとめることができます。

```Typescript
// new DataLoaderに関しての言及
1. NGパターン サーバープロセスに当たり、ユーザー全体で一度だけデータローダーが作成されて、共有されてしまう。
const dataLoader = new DataLoader((keys: number[]) => batchFn)

2. OKパターン React.cache
// React.cache を使って、リクエストごとに 1 つだけデータローダーを作成する。
// 同じリクエスト内のコンポーネントは同じデータローダーを使うので、呼び出しが 1 回にまとまる。
// React cacheのキャッシュはリクエストごとで、リクエストが終わると捨てられる
const dataLoader = React.cache(() => new DataLoader((keys: number[]) => batchFn))

```

| 商品一覧 | クエリ回数 |
|---|---|
| DataLoader なし(/anti/n-plus-one) | 4 回(id 一覧 1 回 + カード 3 回) |
| DataLoader あり(/products) | 2 回(id 一覧 1 回 + `WHERE id = ANY(...)` 1 回) |

NG パターン(/anti/shared-loader/1)では、DB の価格を更新しても古い価格が返り続けました。DataLoader は取得した値をキャッシュするので、プロセス全体で共有すると別のリクエスト(別のユーザー)にデータが漏れます。ログイン中ユーザーのデータでこれが起きると、他人のデータが見える事故になります。

## 細粒度のREST API設計

> **見せたいこと**: コロケーション + DataLoader を活かすには、バックエンドの API も「id の一覧」と「id 指定でまとめて取得」のように細かく分かれている必要がある。
>
> | デモ | URL | 見る場所 |
> |---|---|---|
> | 一覧は id だけ返す | http://localhost:3000/api/products | 画面(`[1,2,3]`) |
> | id 指定でまとめて取得 | http://localhost:3000/api/products?id=1&id=2 | 画面(2 件の JSON) |
> | ❌ 粗い API(一覧で `detail` まで全部取る) | http://localhost:3000/anti/props-drilling | コード(`app/anti/_lib/products.ts` の `getAllProducts`) |

コロケーション + DataLoader と相性がいいのは、細かい単位で取得できる API です。

- 一覧は id だけ返す: `GET /api/products` → `[1, 2, 3]`
- 中身は id 指定でまとめて取れる: `GET /api/products?id=1&id=2`(DataLoader のバッチ関数から呼ぶ)

一覧 API が詳細の長文まで全部返すような粗い API だと、一覧には不要なデータまで取得することになり(オーバーフェッチ)、ページで一括取得して props で配る形に戻ってしまいます。

## サーバー関数とuseStateAction

サーバー関数はClient Component, Server Componentのどちらからでも呼び出すことができるAPIです。
処理としてはBFF側で処理を任せる仕組みですね。データの取得には不向きでレスポンスのキャッシュを行ないません。
ブラウザからのリクエストに対して、サーバー関数を呼び出すと、BFF側で処理を行い、結果を返す仕組みです。
基本的にPOST処理のために用います。サーバー関数とはいいますがただのPOSTリクエストなので、しっかり認証の認可の仕組みを実装する必要があります。

UI操作に紐づく部分的な再レンダリングには、useActionStateで実装しましょう。SSRだとサーバー側でJSを実行したものがレンダリングされるため、部分的な変更が生じたときに再レンダリングすることは不向きです。そういった場合に用います。

```Typescript
const [state, formAction, isPending] = useActionState(サーバー関数, 初期値)
// state: サーバー関数の戻り値 / formAction: <form action={formAction}> に渡す関数 / isPending: 実行中かどうか
```

この記事読んでいて思ったことがapp router前提の話が多いですね。
page routerだとデータ取得がページに集まるので N+1 は起きにくいですが、その代わりコロケーションができません。app routerは Server Components のおかげで、コロケーションしたまま 1 クエリにまとめられるのが大きいと感じました。
みなさんフロントエンドはapp routerか page routerどっち？

// クライアントから誤って import されたらビルドエラーにする(DB 接続情報を漏らさない)
import 'server-only'
import { cache } from 'react'
import DataLoader from 'dataloader'
import { query } from './db'

export type Product = {
  id: number
  name: string
  price: number
  description: string
}

export type ProductDetail = Product & {
  detail: string
}

// 一覧は id だけを返す細粒度な API にし、各商品の中身は getProduct で取得する
// React.cache で同一リクエスト内の重複呼び出しを 1 回にまとめる(Request Memoization)
export const getProductIds = cache(async (): Promise<number[]> => {
  const { rows } = await query<{ id: number }>(
    'getProductIds',
    'SELECT id FROM products ORDER BY id'
  )
  return rows.map((row) => row.id)
})

// 複数 id をまとめて 1 クエリで取得するバッチ API
// DataLoader の約束どおり、keys と同じ順序・同じ長さで返す
export const getProductsByIds = async (
  ids: readonly number[]
): Promise<(ProductDetail | null)[]> => {
  const { rows } = await query<ProductDetail>(
    `getProductsByIds [${ids.join(', ')}]`,
    'SELECT id, name, price, description, detail FROM products WHERE id = ANY($1::int[])',
    [ids]
  )
  const productById = new Map(rows.map((row) => [row.id, row]))
  return ids.map((id) => productById.get(id) ?? null)
}

// DataLoader はモジュールスコープで new するとユーザー間で共有されてしまうため、
// React.cache でリクエストごとに 1 つだけ作る
const getProductLoader = cache(
  () => new DataLoader((ids: readonly number[]) => getProductsByIds(ids))
)

// コンポーネントごとに呼んでも、同じタイミングの呼び出しは 1 クエリにまとまる(N+1 対策)
export const getProduct = async (id: number): Promise<ProductDetail | null> => {
  return getProductLoader().load(id)
}

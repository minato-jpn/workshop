// ⚠️ 学習用のアンチパターン集。推奨版は app/lib/products.ts
import 'server-only'
import DataLoader from 'dataloader'
import { query } from '@/app/lib/db'
import { getProductsByIds, type ProductDetail } from '@/app/lib/products'

// ❌ React.cache なし: 同じリクエスト内で何度呼んでも、そのたびに DB へ行く
export const getProductIdsNoCache = async (): Promise<number[]> => {
  const { rows } = await query<{ id: number }>(
    'getProductIdsNoCache',
    'SELECT id FROM products ORDER BY id'
  )
  return rows.map((row) => row.id)
}

// ❌ 1 件ずつ取得: コンポーネントごとに呼ぶと N+1 になる。React.cache もない
export const getProductNoCache = async (id: number): Promise<ProductDetail | null> => {
  const { rows } = await query<ProductDetail>(
    `getProductNoCache [${id}]`,
    'SELECT id, name, price, description, detail FROM products WHERE id = $1',
    [id]
  )
  return rows[0] ?? null
}

// ❌ モジュールスコープの DataLoader: サーバープロセスで 1 つだけ作られ、全ユーザー・全リクエストで共有される
// DataLoader は load した値をキャッシュし続けるので、DB を更新しても古い値が返り続ける
const sharedLoader = new DataLoader((ids: readonly number[]) => getProductsByIds(ids))

export const getProductShared = async (id: number): Promise<ProductDetail | null> => {
  return sharedLoader.load(id)
}

// ❌ 粗い API: 一覧に不要な detail まで全件まとめて返す。ページで取得して props で配るしかなくなる
export const getAllProducts = async (): Promise<ProductDetail[]> => {
  const { rows } = await query<ProductDetail>(
    'getAllProducts',
    'SELECT id, name, price, description, detail FROM products ORDER BY id'
  )
  return rows
}

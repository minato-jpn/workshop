import Link from 'next/link'
import { getProduct } from '@/app/lib/products'
import { Card as BaseCard } from '../common'

type Props = {
  id: number
}

// データフェッチ コロケーション: 表示に使うデータはこのコンポーネント自身が取得する
// 一覧で N 個並んでも DataLoader が 1 クエリにまとめる
export const Card = async ({ id }: Props) => {
  const product = await getProduct(id)
  if (!product) return null

  return (
    <Link href={`/products/${product.id}`}>
      <BaseCard title={product.name}>
        <p>{product.description}</p>
        <p>¥{product.price.toLocaleString()}</p>
      </BaseCard>
    </Link>
  )
}

import Link from 'next/link'
import type { Product } from '@/app/lib/products'
import { Card as BaseCard } from '@/app/components/common'

type Props = {
  product: Product
}

// アンチパターン各ページで使う、データを受け取って表示するだけのカード
export const ProductCard = ({ product }: Props) => {
  return (
    <Link href={`/products/${product.id}`}>
      <BaseCard title={product.name}>
        <p>{product.description}</p>
        <p>¥{product.price.toLocaleString()}</p>
      </BaseCard>
    </Link>
  )
}

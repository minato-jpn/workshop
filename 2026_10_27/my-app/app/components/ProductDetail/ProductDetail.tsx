import { getProduct } from '@/app/lib/products'
import styles from './ProductDetail.module.css'

type Props = {
  id: number
}

// ページ側でも同じ id で getProduct を呼んでいるが、Request Memoization で DB アクセスは 1 回
export const ProductDetail = async ({ id }: Props) => {
  const product = await getProduct(id)
  if (!product) return null

  return (
    <article>
      <h1>{product.name}</h1>
      <p className={styles.price}>¥{product.price.toLocaleString()}</p>
      <p>{product.description}</p>
      <p className={styles.detail}>{product.detail}</p>
    </article>
  )
}

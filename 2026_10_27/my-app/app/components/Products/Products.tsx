import { getProductIds } from '@/app/lib/products'
import { Card } from '../Card/Card'
import styles from './Products.module.css'

type Props = {
  // 詳細ページの「ほかの商品」で、表示中の商品を除くために使う
  excludeId?: number
}

// 一覧の preload 用。詳細ページなどで、ほかの await より先に取得を始めておく
export const preloadProducts = () => {
  void getProductIds()
}

// Server Component: id の一覧だけを取得し、各商品の中身は Card 自身が取得する
export const Products = async ({ excludeId }: Props) => {
  const ids = await getProductIds()

  return (
    <div className={styles.grid}>
      {ids
        .filter((id) => id !== excludeId)
        .map((id) => (
          <Card key={id} id={id} />
        ))}
    </div>
  )
}

import { Suspense } from 'react'
import { Loading } from '@/app/components/common'
import { getProductIdsNoCache, getProductNoCache } from '../_lib/products'
import { Note } from '../_components/Note'
import { ProductCard } from '../_components/ProductCard'
import styles from '@/app/components/Products/Products.module.css'

export default function NPlusOnePage() {
  return (
    <main>
      <Note title="コロケーションしたが DataLoader を使わない(N+1)" goodHref="/products">
        <p>
          カードごとに 1 件ずつ取得するので、id 一覧 1 回 + カード N 回のクエリが飛びます。ターミナルに
          getProductNoCache [1] / [2] / [3] が別々に出るのを確認してください。
        </p>
        <p>推奨版 /products では getProductsByIds [1, 2, 3] の 1 回にまとまります。</p>
      </Note>
      <Suspense fallback={<Loading />}>
        <Products />
      </Suspense>
    </main>
  )
}

const Products = async () => {
  const ids = await getProductIdsNoCache()
  return (
    <div className={styles.grid}>
      {ids.map((id) => (
        <Card key={id} id={id} />
      ))}
    </div>
  )
}

// ❌ 1 件ずつ取得する関数をそのまま呼ぶ
const Card = async ({ id }: { id: number }) => {
  const product = await getProductNoCache(id)
  if (!product) return null
  return <ProductCard product={product} />
}

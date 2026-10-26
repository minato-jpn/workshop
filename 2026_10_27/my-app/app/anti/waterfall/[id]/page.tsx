import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Loading } from '@/app/components/common'
import { ProductDetail } from '@/app/components/ProductDetail/ProductDetail'
import { Products } from '@/app/components/Products/Products'
import { getProduct } from '@/app/lib/products'
import { Note } from '../../_components/Note'

type Props = {
  params: Promise<{ id: string }>
}

// ❌ 推奨版 /products/[id] から preloadProducts() を消しただけのページ
// 商品の取得を待ってから Products がレンダリングされ、そこで初めて id 一覧の取得が始まる
export default async function WaterfallPage({ params }: Props) {
  const { id } = await params
  const productId = Number(id)
  if (!Number.isInteger(productId)) notFound()

  const product = await getProduct(productId)
  if (!product) notFound()

  return (
    <main>
      <Note title="ウォーターフォール(preload なし)" goodHref={`/products/${productId}`}>
        <p>
          DB_DELAY_MS=500 で起動して、ターミナルのログを推奨版と比べてください。ここでは
          getProductsByIds [{productId}] の end の後に getProductIds の start が出ます(直列)。推奨版では 2
          つの start が先に並びます(並行)。
        </p>
      </Note>
      <ProductDetail id={productId} />
      <section>
        <h2>ほかの商品</h2>
        <Suspense fallback={<Loading />}>
          <Products excludeId={productId} />
        </Suspense>
      </section>
    </main>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ProductDetail } from '@/app/components/ProductDetail/ProductDetail'
import { preloadProducts, Products } from '@/app/components/Products/Products'
import { Loading } from '@/app/components/common'
import { getProduct } from '@/app/lib/products'

type Props = {
  params: Promise<{ id: string }>
}

const parseId = (id: string) => {
  const productId = Number(id)
  return Number.isInteger(productId) ? productId : null
}

// ページ本体・ProductDetail と同じ getProduct を呼ぶが、DB アクセスは 1 回にまとまる
export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const productId = parseId((await params).id)
  const product = productId === null ? null : await getProduct(productId)
  return { title: product?.name ?? '商品が見つかりません' }
}

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
      <Link href="/products">← 商品一覧へ戻る</Link>
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

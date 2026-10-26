import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductNoCache } from '../../_lib/products'
import { Note } from '../../_components/Note'

type Props = {
  params: Promise<{ id: string }>
}

// ❌ React.cache なしの関数を、generateMetadata・ページ・子コンポーネントの 3 か所で呼ぶ
export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const product = await getProductNoCache(Number((await params).id))
  return { title: product?.name ?? '商品が見つかりません' }
}

export default async function NoMemoizationPage({ params }: Props) {
  const { id } = await params
  const productId = Number(id)
  if (!Number.isInteger(productId)) notFound()

  const product = await getProductNoCache(productId)
  if (!product) notFound()

  return (
    <main>
      <Note title="Request Memoization なし" goodHref={`/products/${productId}`}>
        <p>
          同じ商品を 3 か所で取得しているので、ターミナルに getProductNoCache [{productId}] が 3
          回出ます。推奨版では 3 か所で呼んでも getProductsByIds [{productId}] の 1 回だけです。
        </p>
        <p>
          重複を避けようとしてページで取得して props で渡すと、今度はバケツリレーになります。Request
          Memoization があるから、各コンポーネントで気軽に呼べます。
        </p>
      </Note>
      <Detail id={productId} />
    </main>
  )
}

const Detail = async ({ id }: { id: number }) => {
  const product = await getProductNoCache(id)
  if (!product) return null
  return (
    <article>
      <h2>{product.name}</h2>
      <p>¥{product.price.toLocaleString()}</p>
      <p>{product.description}</p>
    </article>
  )
}

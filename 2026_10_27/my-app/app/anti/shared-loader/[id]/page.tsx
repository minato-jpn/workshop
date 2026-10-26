import { notFound } from 'next/navigation'
import { getProductShared } from '../../_lib/products'
import { Note } from '../../_components/Note'

type Props = {
  params: Promise<{ id: string }>
}

export default async function SharedLoaderPage({ params }: Props) {
  const { id } = await params
  const productId = Number(id)
  if (!Number.isInteger(productId)) notFound()

  // ❌ プロセス全体で共有された DataLoader から取得する
  const product = await getProductShared(productId)
  if (!product) notFound()

  return (
    <main>
      <Note title="DataLoader をモジュールスコープで作る" goodHref={`/products/${productId}`}>
        <p>次の手順で、別リクエスト(別ユーザー)にキャッシュが漏れることを確認できます。</p>
        <ol>
          <li>このページを開く(ターミナルに getProductsByIds [{productId}] が出る)</li>
          <li>
            DB の価格を変える:
            <code>
              docker exec workshop-db psql -U postgres -d workshop -c &quot;UPDATE products SET
              price = price + 100 WHERE id = {productId}&quot;
            </code>
          </li>
          <li>リロードする → 価格が古いまま。ログにクエリも出ない</li>
          <li>推奨版を開く → 新しい価格が出る(リクエストごとに DataLoader を作り直しているため)</li>
        </ol>
        <p>ログイン中ユーザーのデータでこれが起きると、他人のデータが見える事故になります。</p>
      </Note>
      <article>
        <h2>{product.name}</h2>
        <p>¥{product.price.toLocaleString()}</p>
      </article>
    </main>
  )
}

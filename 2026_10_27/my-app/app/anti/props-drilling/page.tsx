import type { ProductDetail } from '@/app/lib/products'
import { getAllProducts } from '../_lib/products'
import { Note } from '../_components/Note'
import { ProductCard } from '../_components/ProductCard'
import styles from '@/app/components/Products/Products.module.css'

// ❌ ページで全データを取得し、props でバケツリレーする(Pages Router の getServerSideProps と同じ構造)
export default async function PropsDrillingPage() {
  const products = await getAllProducts()

  return (
    <main>
      <Note title="ページで一括取得して props でバケツリレー" goodHref="/products">
        <p>
          クエリは 1 回ですが、カードが何のデータを使うかをページが知っている必要があります。カードに項目を足すたびに
          getAllProducts・ページ・ProductList の全部を直すことになります(コロケーションが崩れる)。
        </p>
        <p>
          また一覧には不要な detail(長文)まで取得しています(粗い API によるオーバーフェッチ)。推奨版の Card
          は id だけを受け取り、自分で取得します。
        </p>
      </Note>
      <ProductList products={products} />
    </main>
  )
}

// 中継するだけのコンポーネント。自分では使わない products を受け取って子に渡す
const ProductList = ({ products }: { products: ProductDetail[] }) => {
  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

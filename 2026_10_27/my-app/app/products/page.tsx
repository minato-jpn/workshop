import { Suspense } from 'react'
import { Products } from '../components/Products/Products'
import { Loading } from '../components/common'

export default function ProductsPage() {
  return (
    <main>
      <h1>商品一覧</h1>
      <Suspense fallback={<Loading />}>
        <Products />
      </Suspense>
    </main>
  )
}

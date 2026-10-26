import { Note } from '../_components/Note'
import { ClientProducts } from './ClientProducts'

export default function ClientFetchPage() {
  return (
    <main>
      <Note title="Client Component でデータフェッチ" goodHref="/products">
        <p>
          ブラウザで JS が動いてから API を叩くので、表示が遅れます。DevTools の Network
          タブで、/api/products と /api/products?id=... が HTML の後に直列で飛ぶのを確認してください。
        </p>
        <p>
          「ページのソースを表示」すると、推奨版の HTML には商品名が入っていますが、こちらの HTML
          には入っていません(Loading だけ)。
        </p>
      </Note>
      <ClientProducts />
    </main>
  )
}

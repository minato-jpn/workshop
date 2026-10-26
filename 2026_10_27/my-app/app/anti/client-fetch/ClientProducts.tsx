'use client'
import { useEffect, useState } from 'react'
import type { Product } from '@/app/lib/products'
import { Loading } from '@/app/components/common'
import { ProductCard } from '../_components/ProductCard'
import styles from '@/app/components/Products/Products.module.css'

// ❌ Client Component でのデータフェッチ
// HTML → JS 読み込み → ハイドレーション → fetch(id 一覧) → fetch(中身) と、ブラウザ⇔サーバーの往復が直列に重なる
export const ClientProducts = () => {
  const [products, setProducts] = useState<Product[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const ids: number[] = await (await fetch('/api/products')).json()
        const params = new URLSearchParams(ids.map((id) => ['id', String(id)]))
        setProducts(await (await fetch(`/api/products?${params}`)).json())
      } catch {
        setError(true)
      }
    }
    fetchProducts()
  }, [])

  if (error) return <p>商品の取得に失敗しました</p>
  if (!products) return <Loading />

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

import type { Product } from '@/app/lib/products'

// ブラウザから呼ぶ想定なので、同じオリジンの相対パスで API を叩く
export const productList = async (): Promise<Product[]> => {
  const res = await fetch('/api/products')
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`)
  return res.json()
}

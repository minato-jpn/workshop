import type { ProductDetail } from '@/app/lib/products'

export const getProduct = async (id: string): Promise<ProductDetail> => {
  const res = await fetch(`/api/products/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch product ${id}: ${res.status}`)
  return res.json()
}

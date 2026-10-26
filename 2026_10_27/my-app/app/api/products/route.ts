import type { NextRequest } from 'next/server'
import { getProductIds, getProductsByIds } from '@/app/lib/products'

// GET /api/products          → id の一覧
// GET /api/products?id=1&id=2 → 指定した商品をまとめて取得(バッチ API)
export const GET = async (request: NextRequest) => {
  const ids = request.nextUrl.searchParams.getAll('id').map(Number)
  if (ids.length === 0) return Response.json(await getProductIds())

  if (!ids.every(Number.isInteger)) {
    return Response.json({ error: 'id must be an integer' }, { status: 400 })
  }
  const products = await getProductsByIds(ids)
  return Response.json(products.filter((product) => product !== null))
}

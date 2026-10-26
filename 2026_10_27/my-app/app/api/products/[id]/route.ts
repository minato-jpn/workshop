import { getProduct } from '@/app/lib/products'

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params
  const productId = Number(id)
  if (!Number.isInteger(productId)) {
    return Response.json({ message: 'Invalid id' }, { status: 400 })
  }

  const product = await getProduct(productId)
  if (!product) {
    return Response.json({ message: 'Not found' }, { status: 404 })
  }

  return Response.json(product)
}

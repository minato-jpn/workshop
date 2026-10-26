import type { GetServerSideProps } from "next";
import { Note } from "@/components/Note/Note";
import { ProductDetail } from "@/components/ProductDetail/ProductDetail";
import { Products } from "@/components/Products/Products";
import {
  getProduct,
  getProducts,
  type Product,
  type ProductDetail as ProductDetailType,
} from "@/lib/products";

type Props = {
  product: ProductDetailType;
  otherProducts: Product[];
};

// ❌ /products/[id] の Promise.all を、await の直列に書き換えただけ
export const getServerSideProps: GetServerSideProps<Props, { id: string }> = async ({ params }) => {
  const productId = Number(params?.id);
  if (!Number.isInteger(productId)) return { notFound: true };

  const product = await getProduct(productId);
  if (!product) return { notFound: true };
  const products = await getProducts();

  return {
    props: { product, otherProducts: products.filter((p) => p.id !== productId) },
  };
};

export default function SequentialPage({ product, otherProducts }: Props) {
  return (
    <main>
      <Note title="❌ getServerSideProps 内のウォーターフォール" appRouterPath={`/anti/waterfall/${product.id}`}>
        <p>
          DB_DELAY_MS=500 で起動してログを比べてください。ここでは getProduct の end の後に getProducts の
          start が出ます。推奨版 /products/{product.id} では 2 つの start が先に並びます。
        </p>
      </Note>
      <ProductDetail product={product} />
      <section>
        <h2>ほかの商品</h2>
        <Products products={otherProducts} />
      </section>
    </main>
  );
}

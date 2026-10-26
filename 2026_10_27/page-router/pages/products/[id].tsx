import type { GetServerSideProps } from "next";
import Link from "next/link";
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

// Pages Router の並行データフェッチ: ページで使う全データを Promise.all でまとめて取る
// 「ほかの商品」が何のデータを使うかも、このページが知っている必要がある(コロケーションできない)
export const getServerSideProps: GetServerSideProps<Props, { id: string }> = async ({ params }) => {
  const productId = Number(params?.id);
  if (!Number.isInteger(productId)) return { notFound: true };

  const [product, products] = await Promise.all([getProduct(productId), getProducts()]);
  if (!product) return { notFound: true };

  return {
    props: { product, otherProducts: products.filter((p) => p.id !== productId) },
  };
};

export default function ProductPage({ product, otherProducts }: Props) {
  return (
    <main>
      <Link href="/products">← 商品一覧へ戻る</Link>
      <ProductDetail product={product} />
      <section>
        <h2>ほかの商品</h2>
        <Products products={otherProducts} />
      </section>
    </main>
  );
}

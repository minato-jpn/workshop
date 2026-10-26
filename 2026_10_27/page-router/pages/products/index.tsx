import type { GetServerSideProps } from "next";
import { Products } from "@/components/Products/Products";
import { getProducts, type Product } from "@/lib/products";

type Props = {
  products: Product[];
};

// データ取得はページ単位。完了するまでレンダリングは始まらない
// Card が使う項目もここで取得し、Products → Card へ props でバケツリレーする
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const products = await getProducts();
  return { props: { products } };
};

export default function ProductsPage({ products }: Props) {
  return (
    <main>
      <h1>商品一覧</h1>
      <Products products={products} />
    </main>
  );
}

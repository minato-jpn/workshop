import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Card as BaseCard, Loading } from "@/components/common";
import { Note } from "@/components/Note/Note";
import type { ProductDetail } from "@/lib/products";
import styles from "@/components/Products/Products.module.css";

const fetchJson = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
};

// getServerSideProps を使わず、各コンポーネントが React Query で自分のデータを取る
export default function ClientColocationPage() {
  return (
    <main>
      <Note title="Pages Router でコロケーション(React Query)" appRouterPath="/products">
        <p>
          コンポーネントごとにデータを取れるようになりますが、取得はブラウザで JS が動いてからです。DevTools の
          Network タブで、/api/products の後に /api/products/1・/2・/3 が別々に飛ぶのを確認してください(HTTP
          の N+1 とウォーターフォール)。
        </p>
        <p>
          「ページのソースを表示」すると HTML には商品名がありません。App Router 版は Server Components
          なので、同じコロケーションでも HTML に入り、DataLoader で 1 クエリにまとまります。
        </p>
      </Note>
      <ProductList />
    </main>
  );
}

const ProductList = () => {
  const { data: ids, isError } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchJson<number[]>("/api/products"),
  });

  if (isError) return <p>商品の取得に失敗しました</p>;
  if (!ids) return <Loading />;

  return (
    <div className={styles.grid}>
      {ids.map((id) => (
        <ProductCard key={id} id={id} />
      ))}
    </div>
  );
};

// 同じ queryKey の呼び出しは React Query がまとめる(クライアント版の Request Memoization)
// ただし別の id 同士はまとまらないので、カードの数だけ HTTP リクエストが飛ぶ
const ProductCard = ({ id }: { id: number }) => {
  const { data: product } = useQuery({
    queryKey: ["products", id],
    queryFn: () => fetchJson<ProductDetail>(`/api/products/${id}`),
  });

  if (!product) return <Loading />;

  return (
    <Link href={`/products/${product.id}`}>
      <BaseCard title={product.name}>
        <p>{product.description}</p>
        <p>¥{product.price.toLocaleString()}</p>
      </BaseCard>
    </Link>
  );
};

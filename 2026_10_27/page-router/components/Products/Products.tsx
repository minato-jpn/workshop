import type { Product } from "@/lib/products";
import { Card } from "../Card/Card";
import styles from "./Products.module.css";

type Props = {
  products: Product[];
};

// Pages Router ではページで取得したデータを props で受け取る
export const Products = ({ products }: Props) => {
  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <Card key={product.id} product={product} />
      ))}
    </div>
  );
};

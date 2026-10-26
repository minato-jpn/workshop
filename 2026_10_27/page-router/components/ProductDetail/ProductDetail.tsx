import type { ProductDetail as ProductDetailType } from "@/lib/products";
import styles from "./ProductDetail.module.css";

type Props = {
  product: ProductDetailType;
};

export const ProductDetail = ({ product }: Props) => {
  return (
    <article>
      <h1>{product.name}</h1>
      <p className={styles.price}>¥{product.price.toLocaleString()}</p>
      <p>{product.description}</p>
      <p className={styles.detail}>{product.detail}</p>
    </article>
  );
};

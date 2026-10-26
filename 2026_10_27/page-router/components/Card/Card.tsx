import Link from "next/link";
import type { Product } from "@/lib/products";
import { Card as BaseCard } from "../common";

type Props = {
  product: Product;
};

export const Card = ({ product }: Props) => {
  return (
    <Link href={`/products/${product.id}`}>
      <BaseCard title={product.name}>
        <p>{product.description}</p>
        <p>¥{product.price.toLocaleString()}</p>
      </BaseCard>
    </Link>
  );
};

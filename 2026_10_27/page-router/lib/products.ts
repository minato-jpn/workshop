import { query } from "./db";

export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
};

export type ProductDetail = Product & {
  detail: string;
};

// Pages Router では getServerSideProps と API Route からしか呼ばないので、React.cache や DataLoader は使っていない
// (データ取得がページ単位に集約されるため、そもそも重複呼び出しや N+1 が起きにくい)

export const getProducts = async (): Promise<Product[]> => {
  const { rows } = await query<Product>(
    "getProducts",
    "SELECT id, name, price, description FROM products ORDER BY id",
  );
  return rows;
};

export const getProduct = async (id: number): Promise<ProductDetail | null> => {
  const { rows } = await query<ProductDetail>(
    `getProduct [${id}]`,
    "SELECT id, name, price, description, detail FROM products WHERE id = $1",
    [id],
  );
  return rows[0] ?? null;
};

// 細粒度 API 用: id の一覧だけを返す
export const getProductIds = async (): Promise<number[]> => {
  const { rows } = await query<{ id: number }>(
    "getProductIds",
    "SELECT id FROM products ORDER BY id",
  );
  return rows.map((row) => row.id);
};

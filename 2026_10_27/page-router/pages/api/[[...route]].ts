import { Hono } from "hono";
import { getRequestListener } from "@hono/node-server";
import { getProduct, getProductIds } from "@/lib/products";

// Pages Router の API Route 設定
export const config = {
  api: {
    // Hono 側で body を読むため、Next.js の bodyParser は無効化する
    bodyParser: false,
    // レスポンスは Hono が返すので「未解決」警告を出さない
    externalResolver: true,
  },
};

const app = new Hono().basePath("/api");

app.get("/hello", (c) => {
  return c.json({ message: "Hello from Hono!" });
});

app.get("/users/:id", (c) => {
  const id = c.req.param("id");
  return c.json({ id });
});

app.post("/echo", async (c) => {
  const body = await c.req.json();
  return c.json({ received: body }, 201);
});

// 下位コンポーネントがクライアントから個別に取得するための細粒度な API
// Pages Router でコロケーションしたいと、こうしてブラウザに公開する API が必要になる
app.get("/products", async (c) => {
  return c.json(await getProductIds());
});

app.get("/products/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (!Number.isInteger(id)) return c.json({ error: "id must be an integer" }, 400);

  const product = await getProduct(id);
  if (!product) return c.json({ error: "not found" }, 404);
  return c.json(product);
});

// Node.js の req/res を Hono(Web 標準 Request/Response)に橋渡しする
export default getRequestListener(app.fetch);

"use server";

import { sleep } from "@/lib/mock-data";
import { PRODUCTS_DB, SearchState } from "./types";

// Chapter 09: Server Function として実行される検索関数
export async function searchProductsAction(
  prevState: SearchState,
  formData: FormData
): Promise<SearchState> {
  const start = Date.now();
  const query = ((formData.get("query") as string) || "").trim().toLowerCase();
  const category = ((formData.get("category") as string) || "All").trim();

  console.log(
    `\x1b[32m[Server Function (searchProductsAction)]\x1b[0m 🔍 検索実行: query="${query}", category="${category}"`
  );

  // サーバーサイド検索の遅延シミュレーション（150ms）
  await sleep(150);

  let filtered = PRODUCTS_DB;

  if (category && category !== "All") {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (query) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }

  const duration = Date.now() - start;
  console.log(
    `\x1b[32m[Server Function (searchProductsAction)]\x1b[0m ✅ ヒット件数: ${filtered.length}件 (${duration}ms)`
  );

  return {
    products: filtered,
    query,
    selectedCategory: category,
    searchedAt: new Date().toLocaleTimeString(),
    executionMs: duration,
  };
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  description: string;
}

export const PRODUCTS_DB: ProductItem[] = [
  {
    id: "p1",
    name: "Next.js実践ガイド 2026",
    category: "Books",
    price: 3520,
    inStock: true,
    description: "App Routerの神髄とRSCアーキテクチャを体系的に学ぶ実践書",
  },
  {
    id: "p2",
    name: "React 19 深層解析",
    category: "Books",
    price: 3960,
    inStock: true,
    description: "useActionState, Actions, Compilerの内部構造を徹底解説",
  },
  {
    id: "p3",
    name: "TypeScript 5.x アドバンスド",
    category: "Books",
    price: 3300,
    inStock: false,
    description: "型パズルから実践的なドメインモデリングまで網羅",
  },
  {
    id: "p4",
    name: "メカニカルキーボード (静音赤軸)",
    category: "Hardware",
    price: 18900,
    inStock: true,
    description: "高速タイピングと極上の打鍵感を両立したプロフェッショナル仕様",
  },
  {
    id: "p5",
    name: "4K 超高解像度モニター 27インチ",
    category: "Hardware",
    price: 48500,
    inStock: true,
    description: "コードレビューとデザイン確認に最適な高精細IPSパネル",
  },
  {
    id: "p6",
    name: "エルゴノミクス・アームチェア",
    category: "Hardware",
    price: 72000,
    inStock: true,
    description: "長時間のプログラミングでも腰への負担を最小化する設計",
  },
  {
    id: "p7",
    name: "高性能ワイヤレスノイズキャンセリングヘッドホン",
    category: "Audio",
    price: 32000,
    inStock: true,
    description: "ディープワークに集中するための業界最高水準ノイズキャンセル",
  },
];

export interface SearchState {
  products: ProductItem[];
  query: string;
  selectedCategory: string;
  searchedAt: string;
  executionMs: number;
}

export const INITIAL_SEARCH_STATE: SearchState = {
  products: PRODUCTS_DB,
  query: "",
  selectedCategory: "All",
  searchedAt: "",
  executionMs: 0,
};

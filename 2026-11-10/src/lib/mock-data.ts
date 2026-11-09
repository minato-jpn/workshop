// 模擬バックエンド用データとユーティリティ
// ※ Chapter 08: 「Next.jsが呼び出すバックエンドAPI」をエミュレートするモックデータ

export interface Article {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
  readTimeMin: number;
  content: string;
  authorId: string;
}

export interface Author {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  company: string;
  bio: string;
  followers: number;
}

export interface Metrics {
  articleId: string;
  views: number;
  likes: number;
  bookmarks: number;
  updatedAt: string;
}

export interface Comment {
  id: string;
  articleId: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface AISummary {
  articleId: string;
  summary: string;
  keyTakeaways: string[];
  recommendedTopics: string[];
}

export interface GodArticleResponse {
  article: Article;
  author: Author;
  metrics: Metrics;
  comments: Comment[];
  aiSummary: AISummary;
  meta: {
    endpoint: string;
    servedAt: string;
    totalLatencyMs: number;
    granularity: "coarse-grained (God API)";
  };
}

// データベース相当の静的データ
export const MOCK_DATABASE = {
  article: {
    id: "nextjs-fine-grained-api",
    title: "Next.js App Router と細粒度 REST API 設計の真価",
    category: "Architecture & Performance",
    publishedAt: "2026-11-10",
    readTimeMin: 8,
    authorId: "author-akfm",
    content: `
バックエンドのAPI設計は、フロントエンドの設計にも大きく影響をもたらします。
Pages Router や従来の SPA では、クライアントとサーバー間の物理的な通信オーバーヘッド（高レイテンシ・不安定回線）を避けるため、「1ページに必要な全データを1つのエンドポイントで返す粗粒度 API（God API）」が作られがちでした。

しかし、Next.js App Router (React Server Components) の登場によって前提が一変しました。
RSC はバックエンドと同じプライベートネットワークや高速クラウド内（1〜5ms）で実行されるため、サーバー間通信の回数増加はパフォーマンスの致命傷になりません。

むしろ、REST の本来の姿である「細粒度なリソース指向 API」に分割することで、
1. コンポーネントごとのデータフェッチ（コロケーション）
2. 遅いリソースだけをストリーミングする段階的描画 (Suspense)
3. リソース単位の独立したキャッシュ制御 (Data Cache)
4. props のバケツリレー完全排除
という、これまでにない開発生産性と UX を両立できるのです。
    `.trim(),
  },
  author: {
    id: "author-akfm",
    name: "Sato Akifumi",
    role: "Senior Frontend Architect",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    company: "Next.js Workshop 2026",
    bio: "Webフロントエンドアーキテクチャ、React Server Components、GraphQLの設計思想を探求しています。",
    followers: 12480,
  },
  metrics: {
    articleId: "nextjs-fine-grained-api",
    views: 8940,
    likes: 421,
    bookmarks: 289,
    updatedAt: "2026-11-10T03:55:00Z",
  },
  comments: [
    {
      id: "c1",
      articleId: "nextjs-fine-grained-api",
      author: "Tanaka Tech",
      text: "God APIを作っていた理由が『クライアント通信を減らすため』だったと痛感しました。RSCなら細粒度で全く問題ないですね！",
      createdAt: "10分前",
    },
    {
      id: "c2",
      articleId: "nextjs-fine-grained-api",
      author: "Yamada Backend",
      text: "バックエンド目線でも、画面専用のGod APIを作るより単一リソースCRUDを使い回せる方がAPIの再利用性とテスト性が上がって助かります。",
      createdAt: "25分前",
    },
    {
      id: "c3",
      articleId: "nextjs-fine-grained-api",
      author: "Suzuki Dev",
      text: "GraphQLの思想がRSCに引き継がれているという話、Joe Savona氏の背景を知るととても納得がいきます。",
      createdAt: "1時間前",
    },
  ],
  aiSummary: {
    articleId: "nextjs-fine-grained-api",
    summary:
      "RSCの登場により、バックエンドAPIはページ密結合な『粗粒度（God API）』から、再利用性の高い『細粒度REST API』への回帰が最適解となった。高速なサーバー間通信を活かし、Suspenseストリーミングやリソース単位キャッシュによって、保守性と最高速度のUXを両立できる。",
    keyTakeaways: [
      "Chatty API vs God API はどちらも一長一短だが、RSCは細粒度の弱点（通信遅延）を無効化する",
      "コンポーネントとデータフェッチのコロケーションにより、propsバケツリレーが不要に",
      "重いバックエンド処理（レコメンドやAI生成など）をSuspenseで孤立化させて最速描画",
      "Relay / GraphQL の思想（クライアント要求のサーバー集約）がRSCに受け継がれている",
    ],
    recommendedTopics: [
      "Request Memoization (React.cache)",
      "DataLoaderによるN+1回避",
      "Data Cache とタグベースの再検証",
      "Server Actions とトランザクション",
    ],
  },
};

// 遅延ユーティリティ
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

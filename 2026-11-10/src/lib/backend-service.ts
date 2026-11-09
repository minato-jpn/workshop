import {
  MOCK_DATABASE,
  sleep,
  Article,
  Author,
  Metrics,
  Comment,
  AISummary,
  GodArticleResponse,
} from "./mock-data";

export interface TraceEvent {
  id: string;
  resource: string;
  endpoint: string;
  startTime: number;
  endTime: number;
  durationMs: number;
  granularity: "coarse" | "fine";
  status: "success" | "delayed";
  sizeKb: number;
}

// 粗粒度 (God API) を呼ぶ関数
export async function fetchGodArticle(id: string): Promise<{
  data: GodArticleResponse;
  trace: TraceEvent;
}> {
  const start = Date.now();
  console.log(`\x1b[35m[RSC -> Backend (God API)]\x1b[0m 🚀 リクエスト送信: /api/backend/god-article/${id}`);

  // バックエンド側で全体一括処理（AI要約など最も重い処理に引きずられて1000ms）
  await sleep(1000);

  const end = Date.now();
  const duration = end - start;
  console.log(`\x1b[35m[RSC -> Backend (God API)]\x1b[0m 🏁 受信完了: ${duration}ms (一括全データ 32.4KB)`);

  const trace: TraceEvent = {
    id: `god-${Date.now()}`,
    resource: "All-in-One (God Object)",
    endpoint: `/api/backend/god-article/${id}`,
    startTime: 0,
    endTime: duration,
    durationMs: duration,
    granularity: "coarse",
    status: "success",
    sizeKb: 32.4,
  };

  return {
    data: {
      article: MOCK_DATABASE.article,
      author: MOCK_DATABASE.author,
      metrics: MOCK_DATABASE.metrics,
      comments: MOCK_DATABASE.comments,
      aiSummary: MOCK_DATABASE.aiSummary,
      meta: {
        endpoint: `/api/backend/god-article/${id}`,
        servedAt: new Date().toISOString(),
        totalLatencyMs: duration,
        granularity: "coarse-grained (God API)",
      },
    },
    trace,
  };
}

// 細粒度 (Fine-grained API) の各リソースフェッチャー
export async function fetchArticle(id: string): Promise<{ data: Article; durationMs: number }> {
  const start = Date.now();
  console.log(`\x1b[36m[RSC -> Backend (Fine-grained)]\x1b[0m 🚀 GET /api/backend/articles/${id}`);
  await sleep(60);
  const duration = Date.now() - start;
  console.log(`\x1b[36m[RSC -> Backend (Fine-grained)]\x1b[0m 🏁 記事本文を受信: ${duration}ms`);
  return { data: MOCK_DATABASE.article, durationMs: duration };
}

export async function fetchAuthor(id: string): Promise<{ data: Author; durationMs: number }> {
  const start = Date.now();
  console.log(`\x1b[36m[RSC -> Backend (Fine-grained)]\x1b[0m 🚀 GET /api/backend/authors/${id}`);
  await sleep(50);
  const duration = Date.now() - start;
  console.log(`\x1b[36m[RSC -> Backend (Fine-grained)]\x1b[0m 🏁 著者情報を受信: ${duration}ms`);
  return { data: MOCK_DATABASE.author, durationMs: duration };
}

export async function fetchMetrics(id: string): Promise<{ data: Metrics; durationMs: number }> {
  const start = Date.now();
  console.log(`\x1b[36m[RSC -> Backend (Fine-grained)]\x1b[0m 🚀 GET /api/backend/metrics/${id}`);
  await sleep(130);
  const duration = Date.now() - start;
  console.log(`\x1b[36m[RSC -> Backend (Fine-grained)]\x1b[0m 🏁 メトリクスを受信: ${duration}ms`);
  return { data: MOCK_DATABASE.metrics, durationMs: duration };
}

export async function fetchComments(id: string): Promise<{ data: Comment[]; durationMs: number }> {
  const start = Date.now();
  console.log(`\x1b[36m[RSC -> Backend (Fine-grained)]\x1b[0m 🚀 GET /api/backend/comments/${id}`);
  await sleep(190);
  const duration = Date.now() - start;
  console.log(`\x1b[36m[RSC -> Backend (Fine-grained)]\x1b[0m 🏁 コメント一覧を受信: ${duration}ms`);
  return { data: MOCK_DATABASE.comments, durationMs: duration };
}

export async function fetchAISummary(id: string): Promise<{ data: AISummary; durationMs: number }> {
  const start = Date.now();
  console.log(`\x1b[33m[RSC -> Backend (Heavy API)]\x1b[0m 🚀 GET /api/backend/ai-summary/${id}`);
  await sleep(850);
  const duration = Date.now() - start;
  console.log(`\x1b[33m[RSC -> Backend (Heavy API)]\x1b[0m 🏁 ⚡ AI要約・推薦を受信: ${duration}ms`);
  return { data: MOCK_DATABASE.aiSummary, durationMs: duration };
}

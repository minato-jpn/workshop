import { NextResponse } from "next/server";
import { MOCK_DATABASE, sleep } from "@/lib/mock-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const { id } = await params;

  // 粗粒度 (God API) のシミュレーション:
  // 全リソース（記事、著者、メトリクス、コメント、重いAI要約）をまとめて処理するため、
  // 最も遅い処理（AI要約など）に引きずられて全体が遅延する（1000ms）
  console.log(`\x1b[35m[Backend REST API (God API)]\x1b[0m 🔄 巨大リクエスト受信: /api/backend/god-article/${id}`);
  await sleep(1000);

  const duration = Date.now() - startTime;
  console.log(`\x1b[35m[Backend REST API (God API)]\x1b[0m ✅ 巨大レスポンス完了: ${duration}ms (全データを一括返却)`);

  return NextResponse.json({
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
  });
}

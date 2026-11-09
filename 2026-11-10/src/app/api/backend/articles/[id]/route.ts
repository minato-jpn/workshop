import { NextResponse } from "next/server";
import { MOCK_DATABASE, sleep } from "@/lib/mock-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const { id } = await params;

  // 細粒度API: 記事リソース単体（軽量・高速: 50ms）
  console.log(`\x1b[36m[Backend REST API (Fine-grained)]\x1b[0m 🔄 記事リソース要求: /api/backend/articles/${id}`);
  await sleep(50);

  const duration = Date.now() - startTime;
  console.log(`\x1b[36m[Backend REST API (Fine-grained)]\x1b[0m ✅ 記事リソース返却: ${duration}ms`);

  return NextResponse.json({
    data: MOCK_DATABASE.article,
    meta: {
      endpoint: `/api/backend/articles/${id}`,
      latencyMs: duration,
      cacheRecommendation: "long-term (static/revalidate)",
    },
  });
}

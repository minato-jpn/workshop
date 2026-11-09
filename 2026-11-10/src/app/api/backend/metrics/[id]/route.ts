import { NextResponse } from "next/server";
import { MOCK_DATABASE, sleep } from "@/lib/mock-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const { id } = await params;

  // 細粒度API: リアルタイムメトリクス（中速: 120ms）
  console.log(`\x1b[36m[Backend REST API (Fine-grained)]\x1b[0m 🔄 メトリクス要求: /api/backend/metrics/${id}`);
  await sleep(120);

  const duration = Date.now() - startTime;
  console.log(`\x1b[36m[Backend REST API (Fine-grained)]\x1b[0m ✅ メトリクス返却: ${duration}ms`);

  return NextResponse.json({
    data: MOCK_DATABASE.metrics,
    meta: {
      endpoint: `/api/backend/metrics/${id}`,
      latencyMs: duration,
      cacheRecommendation: "short-term / dynamic (no-store or short revalidate)",
    },
  });
}

import { NextResponse } from "next/server";
import { MOCK_DATABASE, sleep } from "@/lib/mock-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const { id } = await params;

  // 細粒度API: AI要約・推薦（計算・推論コストが高いため重い: 800ms）
  console.log(`\x1b[33m[Backend REST API (Heavy Resource)]\x1b[0m 🔄 AI要約要求開始: /api/backend/ai-summary/${id}`);
  await sleep(800);

  const duration = Date.now() - startTime;
  console.log(`\x1b[33m[Backend REST API (Heavy Resource)]\x1b[0m ⚡ AI要約完了・返却: ${duration}ms`);

  return NextResponse.json({
    data: MOCK_DATABASE.aiSummary,
    meta: {
      endpoint: `/api/backend/ai-summary/${id}`,
      latencyMs: duration,
      cacheRecommendation: "long-term (AI generation is expensive)",
    },
  });
}

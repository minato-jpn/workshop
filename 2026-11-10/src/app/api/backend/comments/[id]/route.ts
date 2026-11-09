import { NextResponse } from "next/server";
import { MOCK_DATABASE, sleep } from "@/lib/mock-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const { id } = await params;

  // 細粒度API: コメント一覧（中速: 180ms）
  console.log(`\x1b[36m[Backend REST API (Fine-grained)]\x1b[0m 🔄 コメント一覧要求: /api/backend/comments/${id}`);
  await sleep(180);

  const duration = Date.now() - startTime;
  console.log(`\x1b[36m[Backend REST API (Fine-grained)]\x1b[0m ✅ コメント一覧返却: ${duration}ms`);

  return NextResponse.json({
    data: MOCK_DATABASE.comments,
    meta: {
      endpoint: `/api/backend/comments/${id}`,
      latencyMs: duration,
      cacheRecommendation: "medium-term or tag-based revalidation",
    },
  });
}

import { fetchGodArticle } from "@/lib/backend-service";
import { GodArticleView } from "@/components/god-api/GodArticleView";
import { NetworkInspector } from "@/components/NetworkInspector";
import Link from "next/link";
import { Layers, ArrowRight, Zap, RefreshCw } from "lucide-react";

// 動的レンダリングを強制して毎リクエストの遅延を体感可能にする
export const dynamic = "force-dynamic";

export default async function GodApiPage() {
  const startTime = Date.now();
  const { data } = await fetchGodArticle("nextjs-fine-grained-api");
  const renderDuration = Date.now() - startTime;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* ページヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              <Layers className="w-5 h-5" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Coarse-grained API Pattern
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
            粗粒度 (God API) によるデータフェッチ
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            ページ最上位で 1回だけ巨大なAPIを呼び、子コンポーネント群へ props バケツリレーする手法
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/fine-grained"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
          >
            <span>細粒度版を試す</span>
            <Zap className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 記事ビュー (God APIデータ) */}
      <GodArticleView data={data} />

      {/* 通信インスペクター */}
      <NetworkInspector
        mode="coarse"
        totalDurationMs={renderDuration}
        ttfbMs={renderDuration}
      />

      {/* コード解説 */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-900 text-zinc-100 p-5 font-mono text-xs overflow-x-auto shadow-md">
        <div className="text-zinc-400 mb-2">// 粗粒度パターンのコード構造 (バケツリレーと全ブロッキング)</div>
        <pre className="text-emerald-400">{`// app/god-api/page.tsx
export default async function Page() {
  // 1つのエンドポイントで全部待つ (最遅のAI要約800msに巻き込まれて1000ms待機)
  const data = await fetchGodArticle("nextjs-fine-grained-api");

  return (
    <div>
      {/* 子コンポーネントすべてに props をバケツリレー */}
      <ArticleAuthor author={data.author} />
      <ArticleContent article={data.article} />
      <EngagementMetrics metrics={data.metrics} />
      <AISummary summary={data.aiSummary} />
      <Comments comments={data.comments} />
    </div>
  );
}`}</pre>
      </div>
    </div>
  );
}

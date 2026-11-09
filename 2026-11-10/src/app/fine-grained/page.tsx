import { Suspense } from "react";
import { ArticleAuthor } from "@/components/fine-grained/ArticleAuthor";
import { ArticleContent } from "@/components/fine-grained/ArticleContent";
import { EngagementSidebar } from "@/components/fine-grained/EngagementSidebar";
import { AISummarySection } from "@/components/fine-grained/AISummarySection";
import { CommentSection } from "@/components/fine-grained/CommentSection";
import {
  AISummarySkeleton,
  CommentsSkeleton,
  AuthorSkeleton,
} from "@/components/fine-grained/skeletons";
import { NetworkInspector } from "@/components/NetworkInspector";
import Link from "next/link";
import { Zap, Layers, Sparkles, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default function FineGrainedPage() {
  const articleId = "nextjs-fine-grained-api";
  const authorId = "author-akfm";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* ページヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <Zap className="w-5 h-5" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Fine-grained API + Colocation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
            細粒度 REST API × RSC コロケーション
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            各コンポーネントが独立してAPIを呼び出し、Suspenseで遅いデータをストリーミング配信
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/god-api"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-colors"
          >
            <span>粗粒度版を見る</span>
            <Layers className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* メリット解説バナー */}
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-emerald-900 dark:text-emerald-200">
              細粒度 REST API の 3大メリット（RSC環境）
            </p>
            <p className="text-emerald-800 dark:text-emerald-300">
              ① <strong>バケツリレーゼロ:</strong> 各コンポーネント自身が必要な細粒度APIを直接フェッチ。
            </p>
            <p className="text-emerald-800 dark:text-emerald-300">
              ② <strong>最速TTFB (~60ms):</strong> 本文と著者が瞬時に表示され、重いAI要約（800ms）は後からストリーミング。
            </p>
            <p className="text-emerald-800 dark:text-emerald-300">
              ③ <strong>独立キャッシュ:</strong> 「いいね数」の更新で記事本文やAI要約のキャッシュが壊されない。
            </p>
          </div>
        </div>
      </div>

      {/* 著者情報 (コロケーション: 自身のAuthor APIをフェッチ) */}
      <Suspense fallback={<AuthorSkeleton />}>
        <ArticleAuthor authorId={authorId} />
      </Suspense>

      {/* 記事本文 (コロケーション: 自身のArticle APIをフェッチ) */}
      <ArticleContent id={articleId} />

      {/* メトリクス (コロケーション: 自身のMetrics APIをフェッチ) */}
      <EngagementSidebar id={articleId} />

      {/* AI要約 (重い処理をSuspenseで孤立化！) */}
      <Suspense fallback={<AISummarySkeleton />}>
        <AISummarySection id={articleId} />
      </Suspense>

      {/* コメント一覧 (Suspenseでストリーミング) */}
      <Suspense fallback={<CommentsSkeleton />}>
        <CommentSection id={articleId} />
      </Suspense>

      {/* 通信インスペクター */}
      <NetworkInspector
        mode="fine"
        totalDurationMs={850}
        ttfbMs={60}
      />

      {/* コード解説 */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-900 text-zinc-100 p-5 font-mono text-xs overflow-x-auto shadow-md">
        <div className="text-zinc-400 mb-2">// 細粒度パターンのコード構造 (バケツリレーなし・Suspense活用)</div>
        <pre className="text-emerald-400">{`// app/fine-grained/page.tsx
export default function Page() {
  return (
    <div>
      {/* 1. 速いコンポーネント (60ms) は即時レンダリング */}
      <ArticleAuthor authorId="author-akfm" />
      <ArticleContent id="nextjs-fine-grained-api" />
      <EngagementSidebar id="nextjs-fine-grained-api" />

      {/* 2. 遅いAI要約 (850ms) はSuspenseで囲んでストリーミング */}
      <Suspense fallback={<AISummarySkeleton />}>
        <AISummarySection id="nextjs-fine-grained-api" />
      </Suspense>

      {/* 3. コメントも独立してフェッチ */}
      <Suspense fallback={<CommentsSkeleton />}>
        <CommentSection id="nextjs-fine-grained-api" />
      </Suspense>
    </div>
  );
}`}</pre>
      </div>
    </div>
  );
}

import Link from "next/link";
import {
  Database,
  Zap,
  MousePointerClick,
  Layers,
  ArrowRight,
  GitCompare,
} from "lucide-react";

export default function DataFetchingIndexPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* ヘッダー */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 mb-2">
          <Database className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Next.jsの考え方 • 第1部
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
          データフェッチ (Data Fetching)
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
          Server Components によるデータフェッチのコロケーションから、バックエンドの細粒度REST API設計、
          そしてユーザー操作に伴う部分再レンダリング（Server Functions & useActionState）までの実践を体験します。
        </p>
      </div>

      {/* チャプターカード一覧 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Ch.08 */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between shadow-xs space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                Chapter 08
              </span>
              <span className="text-xs text-zinc-400 font-mono">REST API Design</span>
            </div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              細粒度のREST API設計
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              なぜ App Router は画面専用の God API ではなく細粒度 REST API と相性が良いのか？
              高速なサーバー間通信を活かしたコロケーションと Suspense ストリーミングを実演。
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <Link
              href="/comparison"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>対決シミュレータ</span>
            </Link>
            <Link
              href="/fine-grained"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>細粒度デモ</span>
            </Link>
            <Link
              href="/guide"
              className="inline-flex items-center space-x-1 text-xs text-zinc-500 hover:underline px-2 py-1.5"
            >
              <span>思想解説 →</span>
            </Link>
          </div>
        </div>

        {/* Ch.09 */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between shadow-xs space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Chapter 09
              </span>
              <span className="text-xs text-zinc-400 font-mono">User Actions</span>
            </div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              ユーザー操作とデータフェッチ
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              ユーザーの検索入力やクリックに伴うデータフェッチに、Server Functions と React 19 の useActionState() を利用。
              ページ全体の再レンダリングを起こさず部分更新する実践。
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <Link
              href="/data-fetching/user-actions"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
            >
              <MousePointerClick className="w-3.5 h-3.5" />
              <span>商品検索デモを体験する</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

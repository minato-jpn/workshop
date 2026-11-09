import Link from "next/link";
import {
  Layers,
  Zap,
  SplitSquareVertical,
  BookOpen,
  Calendar,
  Terminal,
  Activity,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  GitCompare,
  Database,
  Boxes,
  DoorOpen,
  FolderTree,
  MousePointerClick,
  FileCode,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      {/* ヒーローヘッダー */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-blue-950 text-white p-8 sm:p-12 shadow-2xl border border-zinc-800">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <Calendar className="w-3.5 h-3.5" />
              2026-11-10 ワークショップ
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Next.js 16 (App Router) & React 19
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Next.jsの考え方
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              第1部 データフェッチ & 第2部 コンポーネント設計
            </span>
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            akfm_sato 著『Next.jsの考え方』に基づき、
            <strong>「細粒度REST API設計」「useActionStateによる部分再レンダリング」「2つの世界とバンドル境界」「Compositionパターン」「Container/Presentational分離」</strong>
            の核心概念を実際に動かし、コードとログから体感するハンズオン環境です。
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/comparison"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02]"
            >
              <SplitSquareVertical className="w-4 h-4" />
              <span>対決シミュレータ (Ch.08)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/data-fetching/user-actions"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
            >
              <MousePointerClick className="w-4 h-4 text-emerald-400" />
              <span>商品検索デモ (Ch.09)</span>
            </Link>

            <Link
              href="/component-design"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
            >
              <Boxes className="w-4 h-4 text-indigo-400" />
              <span>第2部 コンポーネント設計</span>
            </Link>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 第1部: データフェッチ */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Database className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                第1部: データフェッチ (Data Fetching)
              </h2>
              <p className="text-xs text-zinc-500">
                高速なサーバー間通信を活かした細粒度API設計と、ユーザー操作に伴う部分フェッチ
              </p>
            </div>
          </div>
          <Link
            href="/data-fetching"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>一覧を見る</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/comparison"
            className="p-5 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 hover:border-blue-400 dark:hover:border-blue-600 transition-all group"
          >
            <div className="flex justify-between items-start">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                Chapter 08
              </span>
              <GitCompare className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              細粒度のREST API設計 (粗粒度 vs 細粒度 対決)
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
              最遅処理（800ms）による全画面ブロックと、細粒度＋Suspenseによる70ms最速ストリーミングをリアルタイム対決で比較。
            </p>
          </Link>

          <Link
            href="/data-fetching/user-actions"
            className="p-5 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all group"
          >
            <div className="flex justify-between items-start">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Chapter 09
              </span>
              <MousePointerClick className="w-4 h-4 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              ユーザー操作とデータフェッチ (useActionState)
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
              router.refresh() でページ全体を再レンダリングせず、Server Functions と useActionState() で部分再フェッチする商品検索。
            </p>
          </Link>
        </div>
      </section>

      {/* 第2部: コンポーネント設計 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Boxes className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                第2部: コンポーネント設計 (Component Design)
              </h2>
              <p className="text-xs text-zinc-500">
                Server Components中心の設計と、Client Componentsを適切に分離・合成する設計手法
              </p>
            </div>
          </div>
          <Link
            href="/component-design"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>一覧を見る</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Ch.11 */}
          <Link
            href="/component-design/bundle-boundary"
            className="p-5 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 hover:border-indigo-400 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  Ch.11
                </span>
                <DoorOpen className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500" />
              </div>
              <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 transition-colors">
                バンドル境界
              </h4>
              <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                2つの世界と2つのドア。server-only による機密モジュール保護。
              </p>
            </div>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 mt-3 flex items-center">
              詳細 →
            </span>
          </Link>

          {/* Ch.12 */}
          <Link
            href="/component-design/client-usecases"
            className="p-5 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 hover:border-blue-400 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  Ch.12
                </span>
                <Sparkles className="w-4 h-4 text-zinc-400 group-hover:text-blue-500" />
              </div>
              <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors">
                Clientのユースケース
              </h4>
              <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                イベント・hooks・サードパーティ、そして RSC Payload 転送量の削減実験。
              </p>
            </div>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-3 flex items-center">
              詳細 →
            </span>
          </Link>

          {/* Ch.13 */}
          <Link
            href="/component-design/composition"
            className="p-5 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 hover:border-purple-400 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  Ch.13
                </span>
                <Boxes className="w-4 h-4 text-zinc-400 group-hover:text-purple-500" />
              </div>
              <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 transition-colors">
                Compositionパターン
              </h4>
              <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                children経由でClient内部にServer Componentを安全に埋め込む合成手法。
              </p>
            </div>
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 mt-3 flex items-center">
              詳細 →
            </span>
          </Link>

          {/* Ch.15 */}
          <Link
            href="/component-design/container-presentational"
            className="p-5 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 hover:border-emerald-400 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  Ch.15
                </span>
                <FolderTree className="w-4 h-4 text-zinc-400 group-hover:text-emerald-500" />
              </div>
              <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 transition-colors">
                Container/Presentational
              </h4>
              <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                データ取得と描画を分離し、RTLやStorybookでのテスト容易性を向上。
              </p>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-3 flex items-center">
              詳細 →
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}

import { InteractiveComparison } from "@/components/InteractiveComparison";
import { NetworkInspector } from "@/components/NetworkInspector";
import Link from "next/link";
import {
  SplitSquareVertical,
  Layers,
  Zap,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";

export default function ComparisonPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* ページヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <SplitSquareVertical className="w-5 h-5" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Head-to-Head Benchmark
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
            粗粒度 (God API) vs 細粒度 (Fine-grained REST) 徹底対決
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Next.js App Router 環境において、どちらの設計がなぜ優れているのかをリアルタイムに体感します
          </p>
        </div>
      </div>

      {/* インタラクティブ・シミュレーション */}
      <InteractiveComparison />

      {/* 詳細な対比マトリクス */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          設計観点・トレードオフ徹底比較表
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                <th className="py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-300">比較項目</th>
                <th className="py-3 px-4 font-semibold text-purple-700 dark:text-purple-300">
                  粗粒度 (God API / ページ結合)
                </th>
                <th className="py-3 px-4 font-semibold text-emerald-700 dark:text-emerald-300">
                  細粒度 (Fine-grained REST API)
                </th>
                <th className="py-3 px-4 font-semibold text-zinc-500">Next.js App Routerでの評価</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              <tr>
                <td className="py-3 px-4 font-medium text-zinc-900 dark:text-zinc-100">
                  初回表示 (TTFB)
                </td>
                <td className="py-3 px-4 text-rose-600 dark:text-rose-400">
                  ❌ <strong>遅い (~1000ms)</strong><br />
                  最遅処理（AI要約など）に全体が引きずられる
                </td>
                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                  ✅ <strong>超高速 (~70ms)</strong><br />
                  速いリソースを即時HTML化し先頭描画
                </td>
                <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                  Suspenseストリーミングの恩恵を最大化できる
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-medium text-zinc-900 dark:text-zinc-100">
                  コンポーネント設計
                </td>
                <td className="py-3 px-4 text-rose-600 dark:text-rose-400">
                  ❌ <strong>props バケツリレー地獄</strong><br />
                  最上位で受け取った巨大オブジェクトを分解して渡す
                </td>
                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                  ✅ <strong>コロケーション (自律型)</strong><br />
                  各コンポーネントが自分に必要なAPIを直接呼ぶ
                </td>
                <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                  コンポーネントの再利用性・保守性が劇的に向上
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-medium text-zinc-900 dark:text-zinc-100">
                  キャッシュ粒度 (Data Cache)
                </td>
                <td className="py-3 px-4 text-rose-600 dark:text-rose-400">
                  ❌ <strong>オール・オア・ナッシング</strong><br />
                  「いいね」が1増えただけで巨大キャッシュ全体が揮発
                </td>
                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                  ✅ <strong>リソース単位の部分再検証</strong><br />
                  メトリクスのみ更新し、記事本文はキャッシュ維持
                </td>
                <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                  Data Cache (`revalidateTag`) と相性抜群
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-medium text-zinc-900 dark:text-zinc-100">
                  通信回数 (Chatty API問題)
                </td>
                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400">
                  ✅ <strong>1回のみ</strong>
                </td>
                <td className="py-3 px-4 text-amber-600 dark:text-amber-400">
                  ⚠️ <strong>5回発生 (Chatty API)</strong>
                </td>
                <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                  <strong>サーバー間通信（1〜3ms）なら実質ノーダメージ！</strong><br />
                  ブラウザ↔サーバー間なら致命傷だが、RSC↔Backendなら問題なし
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-medium text-zinc-900 dark:text-zinc-100">
                  バックエンド開発・保守性
                </td>
                <td className="py-3 px-4 text-rose-600 dark:text-rose-400">
                  ❌ <strong>フロントの画面変更に引っ張られる</strong><br />
                  画面専用の「神API」が増え続け、保守不能に
                </td>
                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                  ✅ <strong>単一責任・REST原則に適合</strong><br />
                  CRUDリソース単体なので他システム（モバイル等）と共用可能
                </td>
                <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                  バックエンドチームにとっても設計がシンプルで嬉しい
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ナビゲーション */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/fine-grained"
          className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 hover:border-emerald-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
              細粒度実装コードと詳細を見る →
            </span>
            <Zap className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
            Suspense によるストリーミングとコロケーションの実際の書き方
          </p>
        </Link>

        <Link
          href="/guide"
          className="p-5 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 hover:border-blue-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-blue-900 dark:text-blue-200">
              思想・GraphQLとのアナロジー解説 →
            </span>
            <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
            Joe Savona氏の思想、Relay/GraphQLからRSCへの系譜を解説
          </p>
        </Link>
      </div>
    </div>
  );
}

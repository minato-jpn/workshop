import { BundleVisualizer } from "./BundleVisualizer";
import Link from "next/link";
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  CheckCircle2,
  XCircle,
  FileCode,
} from "lucide-react";

export default function BundleBoundaryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* ページヘッダー */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-2">
          <Layers className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            第2部 コンポーネント設計 • Chapter 11
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
          クライアントとサーバーのバンドル境界
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
          &quot;use client&quot; や &quot;use server&quot; は実行環境を示すものではありません。
          バンドラに対して <strong>「バンドルの境界（Boundary）」</strong> を宣言するためのものです。
        </p>
      </div>

      {/* インタラクティブ・ビジュアライザー */}
      <BundleVisualizer />

      {/* よくある誤解 Q&A */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-500" />
          よくある誤解 Q&A
        </h2>

        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 space-y-1.5">
            <p className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <span className="text-rose-500 font-mono">Q1.</span>
              Server Components には &quot;use server&quot; を付ける必要がある？
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <strong>いいえ、絶対に付けないでください！</strong> &quot;use server&quot; はクライアントから呼ぶ Server Functions（RPC）を公開するディレクティブです。Next.js ではデフォルトのコンポーネントが最初から Server Components です。
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 space-y-1.5">
            <p className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <span className="text-rose-500 font-mono">Q2.</span>
              &quot;use client&quot; を書いたファイルだけが Client Components になる？
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <strong>いいえ。</strong> &quot;use client&quot; があるモジュールから import されたモジュールやその子孫は、&quot;use client&quot; が書かれていなくても<strong>すべて暗黙的に Client Bundle に含まれます</strong>。
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 space-y-1.5">
            <p className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <span className="text-rose-500 font-mono">Q3.</span>
              Client Component の中で Server Component を import して使える？
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <strong>import することはできません。</strong> ただし、親の Server Component から Client Component の <code>children</code> props として渡すことは可能です（これを<strong>Compositionパターン</strong>と呼びます）。
            </p>
          </div>
        </div>
      </div>

      {/* ナビゲーションリンク */}
      <div className="flex justify-between items-center pt-4">
        <Link
          href="/data-fetching/user-actions"
          className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          ← Ch.09 ユーザー操作とデータフェッチ
        </Link>
        <Link
          href="/component-design/client-usecases"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          <span>Ch.12 Client Componentsのユースケースへ進む</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

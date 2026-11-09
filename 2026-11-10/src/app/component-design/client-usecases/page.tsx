import { RscPayloadBenchmark } from "./RscPayloadBenchmark";
import Link from "next/link";
import {
  Sparkles,
  MousePointer,
  Package,
  Layers,
  ArrowRight,
  HardDrive,
  CheckCircle2,
} from "lucide-react";

export default function ClientUseCasesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* ページヘッダー */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-2">
          <Sparkles className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            第2部 コンポーネント設計 • Chapter 12
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
          Client Components のユースケース
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
          Server Components 中心設計の中で、<strong>いつ Client Components にオプトインすべきなのか？</strong>
          代表的な 3大ユースケースを理解しましょう。
        </p>
      </div>

      {/* 3大ユースケース解説カード */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <MousePointer className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
            ① クライアント処理
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            onClick/onChange などのイベントハンドラ、useState/useEffect などのhooks、ブラウザAPI（localStorageなど）の利用。
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
            ② サードパーティ対応
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            RSC未対応のUIライブラリ（アコーディオンやモーダルなど）を &quot;use client&quot; でラップして Client Boundary を明示。
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <HardDrive className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
            ③ RSC Payload 削減
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            巨大なHTML属性やTailwindクラスを含むコンポーネントをClient化し、毎リクエストのRSC Payload転送量を削減する。
          </p>
        </div>
      </div>

      {/* RSC Payload 削減の体験シミュレータ */}
      <RscPayloadBenchmark />

      {/* ナビゲーションリンク */}
      <div className="flex justify-between items-center pt-4">
        <Link
          href="/component-design/bundle-boundary"
          className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          ← Ch.11 クライアントとサーバーのバンドル境界
        </Link>
        <Link
          href="/component-design/composition"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          <span>Ch.13 Compositionパターンへ進む</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

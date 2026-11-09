"use client";

import { useState } from "react";
import {
  Server,
  Monitor,
  DoorOpen,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Sparkles,
  Layers,
  FileCode,
} from "lucide-react";

export function BundleVisualizer() {
  const [activeDoor, setActiveDoor] = useState<"client" | "server" | null>("client");
  const [showSecretLeak, setShowSecretLeak] = useState(false);

  return (
    <div className="space-y-6">
      {/* 操作パネル */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900 text-white shadow-md">
        <div className="flex items-center space-x-2">
          <DoorOpen className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-sm">Dan Abramovの提唱: 「2つの世界、2つのドア」</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveDoor("client")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeDoor === "client"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            🚪 &quot;use client&quot; ドアを見る
          </button>
          <button
            onClick={() => setActiveDoor("server")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeDoor === "server"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            🚪 &quot;use server&quot; ドアを見る
          </button>
        </div>
      </div>

      {/* 2つの世界ビジュアライザー */}
      <div className="grid md:grid-cols-2 gap-6 relative">
        {/* 世界1: Server Bundle */}
        <div
          className={`rounded-2xl border-2 p-6 transition-all ${
            activeDoor === "client"
              ? "border-blue-400/80 bg-blue-50/20 dark:bg-blue-950/20"
              : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center space-x-2">
              <Server className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  Server Bundle (サーバーの世界)
                </h3>
                <p className="text-[11px] text-zinc-500">Node.js / Edge ランタイムでのみ実行</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              デフォルト (指定不要)
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">
                  page.tsx (Server Component)
                </span>
                <span className="text-[10px] text-zinc-400">RSC</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                DB直接クエリ、fsモジュール、プライベートAPI呼び出しが可能
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">
                  db.ts (server-only で保護)
                </span>
                <Lock className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <p className="text-[11px] text-zinc-500">
                秘密鍵やDB接続情報。クライアントバンドルへの漏洩を遮断
              </p>
            </div>

            {/* ドア1: use client */}
            <div
              className={`p-3.5 rounded-xl border-2 border-dashed transition-all ${
                activeDoor === "client"
                  ? "border-blue-500 bg-blue-100/60 dark:bg-blue-950/60 animate-pulse"
                  : "border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                  <DoorOpen className="w-4 h-4" /> &quot;use client&quot; ディレクティブ
                </span>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                  Client Boundary
                </span>
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">
                👉 <strong>役割:</strong> サーバーからクライアントへコンポーネントを公開するドア。ここより下流のモジュールツリーは全て Client Bundle に含まれます。
              </p>
            </div>
          </div>
        </div>

        {/* 世界2: Client Bundle */}
        <div
          className={`rounded-2xl border-2 p-6 transition-all ${
            activeDoor === "server"
              ? "border-emerald-400/80 bg-emerald-50/20 dark:bg-emerald-950/20"
              : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center space-x-2">
              <Monitor className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  Client Bundle (クライアントの世界)
                </h3>
                <p className="text-[11px] text-zinc-500">ブラウザにJavaScriptとしてダウンロード・実行</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              JS バンドル生成
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                  UserProfileForm.tsx (&quot;use client&quot;)
                </span>
                <span className="text-[10px] text-zinc-400">Boundary</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                onClick, useState, ブラウザAPIを使用。Client Boundaryの起点。
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                  SubmitButton.tsx (暗黙的Client)
                </span>
                <span className="text-[10px] text-zinc-400">No &quot;use client&quot;</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                &quot;use client&quot; が無くても、Client BoundaryからimportされているためClient Bundleに含まれる
              </p>
            </div>

            {/* ドア2: use server */}
            <div
              className={`p-3.5 rounded-xl border-2 border-dashed transition-all ${
                activeDoor === "server"
                  ? "border-emerald-500 bg-emerald-100/60 dark:bg-emerald-950/60 animate-pulse"
                  : "border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <DoorOpen className="w-4 h-4" /> &quot;use server&quot; ディレクティブ
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  Server Boundary
                </span>
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">
                👉 <strong>役割:</strong> クライアントからサーバー関数を叩くためのドア（Server Functions）。Server Componentsを作るためのものではありません！
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* server-only による保護の解説 */}
      <div className="p-5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-amber-500" />
            <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              安全装置: `server-only` パッケージの役割
            </h4>
          </div>
          <button
            onClick={() => setShowSecretLeak(!showSecretLeak)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            {showSecretLeak ? "コードを閉じる" : "誤ってimportした場合の挙動を見る"}
          </button>
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          `import &quot;server-only&quot;;` を記述したモジュールを、誤って Client Component から import した場合、
          <strong>Next.js のビルド時に即座にエラーとなってビルドが停止します</strong>。
          これにより、DBパスワードや機密ロジックがクライアントJSに含まれる事故を100%防ぐことができます。
        </p>

        {showSecretLeak && (
          <div className="p-4 rounded-xl bg-zinc-950 text-rose-400 font-mono text-xs space-y-2 border border-rose-900/60 animate-fadeIn">
            <div className="text-zinc-400">// Next.js build failed:</div>
            <pre>{`Error: You're importing a component that needs "server-only". That only works in a Server Component which is not the case here.
  ,----[ ./src/components/UserProfileForm.tsx ]
1 | "use client";
2 | import { dbSecretKey } from "@/lib/secrets"; // <- import "server-only" を含む
  \`----`}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

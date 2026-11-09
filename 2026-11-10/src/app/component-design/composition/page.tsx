import { SideMenuClient } from "./SideMenuClient";
import { ServerUserInfo } from "./ServerUserInfo";
import Link from "next/link";
import {
  Boxes,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Code2,
  FileCode,
  Sparkles,
} from "lucide-react";

export default function CompositionPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* ページヘッダー */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-2">
          <Boxes className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            第2部 コンポーネント設計 • Chapter 13
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
          Composition パターン
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
          Client Bundle は Server Components を <code>import</code> できません。
          しかし、親の Server Component から <strong>children などの props 経由で渡す（Composition）</strong> ことで、
          Client Component の中に Server Component をレンダリングできます。
        </p>
      </div>

      {/* インタラクティブ・実演デモ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            実際の動作デモ: Clientメニューの中にServerユーザー情報が共存
          </h2>
          <span className="text-xs text-zinc-400">折りたたみボタンを押してみてください</span>
        </div>

        {/* Compositionパターンの実践 */}
        <SideMenuClient>
          <ServerUserInfo />
        </SideMenuClient>
      </div>

      {/* コード対比: NGパターン vs OKパターン */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          NGパターン vs OKパターン（Composition）
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 dark:border-rose-900/40 dark:bg-rose-950/20 space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-700 dark:text-rose-400">
              <ShieldAlert className="w-4 h-4" />
              <span>❌ NG: Clientモジュール内で直接import</span>
            </div>
            <pre className="p-3 bg-zinc-950 text-rose-300 rounded-lg font-mono text-[11px] overflow-x-auto">{`"use client";
import { useState } from "react";
// ❌ Client Bundle内でServer Componentをimport不可！
import { ServerUserInfo } from "./server-user-info";

export function SideMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <ServerUserInfo />
    </div>
  );
}`}</pre>
            <p className="text-[11px] text-zinc-500">
              Client Bundle に Server Component のコードが混入し、Node.js 依存やDB直接接続でエラーになります。
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 dark:border-emerald-900/40 dark:bg-emerald-950/20 space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>✅ OK: Compositionパターン (children渡し)</span>
            </div>
            <pre className="p-3 bg-zinc-950 text-emerald-300 rounded-lg font-mono text-[11px] overflow-x-auto">{`// app/page.tsx (Server Component)
import { SideMenuClient } from "./side-menu-client";
import { ServerUserInfo } from "./server-user-info";

export default function Page() {
  return (
    // Server側でchildrenとして合成！
    <SideMenuClient>
      <ServerUserInfo />
    </SideMenuClient>
  );
}`}</pre>
            <p className="text-[11px] text-zinc-500">
              モジュール間の import ではなく、React のコンポーネントツリーとして children に渡すため完全に合法です。
            </p>
          </div>
        </div>
      </div>

      {/* ナビゲーションリンク */}
      <div className="flex justify-between items-center pt-4">
        <Link
          href="/component-design/client-usecases"
          className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          ← Ch.12 Client Componentsのユースケース
        </Link>
        <Link
          href="/component-design/container-presentational"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          <span>Ch.15 Container/Presentationalパターンへ進む</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

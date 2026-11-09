"use client";

import { useState } from "react";
import { Menu, X, ChevronRight, Monitor, Layers } from "lucide-react";

export function SideMenuClient({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm overflow-hidden">
      {/* Client Component のヘッダー (インタラクティブ) */}
      <div className="p-4 bg-zinc-100/70 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="p-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <Monitor className="w-4 h-4" />
          </span>
          <div>
            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
              &lt;SideMenuClient&gt; (Client Component)
            </h4>
            <p className="text-[10px] text-zinc-500">
              開閉のインタラクティブな状態（useState）を管理
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-all cursor-pointer"
        >
          {isOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
          <span>{isOpen ? "折りたたむ" : "展開する"}</span>
        </button>
      </div>

      {/* Composition された children (Server Component がレンダリングされる場所！) */}
      {isOpen ? (
        <div className="p-5 space-y-3 animate-fadeIn">
          <div className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
            <span>&lt;SideMenuClient&gt;</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              &#123;children&#125;
            </span>
            <span>&lt;/SideMenuClient&gt;</span>
          </div>

          {/* ここに Server Component が挿入される */}
          <div className="p-4 rounded-xl border-2 border-dashed border-emerald-400/80 bg-emerald-50/20 dark:bg-emerald-950/20">
            {children}
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-xs text-zinc-400">
          メニューは現在折りたたまれています
        </div>
      )}
    </div>
  );
}

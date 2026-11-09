"use client";

import { useActionState, useState } from "react";
import { searchProductsAction } from "./actions";
import { INITIAL_SEARCH_STATE, SearchState } from "./types";
import {
  Search,
  Loader2,
  Package,
  CheckCircle2,
  XCircle,
  Tag,
  Zap,
  Info,
} from "lucide-react";

export function ProductSearchForm() {
  const [state, formAction, isPending] = useActionState<SearchState, FormData>(
    searchProductsAction,
    INITIAL_SEARCH_STATE
  );

  const products = state?.products ?? [];
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Books", "Hardware", "Audio"];

  return (
    <div className="space-y-6">
      {/* 検索コントロールフォーム */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Zap className="w-4 h-4" />
            </span>
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              Server Functions × useActionState() によるインクリメンタル検索
            </span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            部分再レンダリング (No router.refresh)
          </span>
        </div>

        <form action={formAction} className="space-y-3">
          {/* カテゴリ選択タブ */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-zinc-500 mr-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> カテゴリ:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="submit"
                name="category"
                value={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 検索入力欄 */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="query"
                placeholder="商品名や説明で検索（例: Next.js, キーボード, モニター）..."
                defaultValue={state.query}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-60 transition-all cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>検索中...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>検索実行</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* 状態インスペクター */}
        <div className="flex flex-wrap items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center space-x-2">
            <span>ヒット件数:</span>
            <strong className="text-zinc-900 dark:text-zinc-100 font-mono">
              {products.length} 件
            </strong>
            {state?.executionMs ? (
              <span className="font-mono text-zinc-400">
                (サーバー処理: {state.executionMs}ms)
              </span>
            ) : null}
          </div>
          {state?.searchedAt ? (
            <span className="text-[11px] font-mono text-zinc-400">
              最終更新: {state.searchedAt}
            </span>
          ) : null}
        </div>
      </div>

      {/* 検索結果一覧 (部分再レンダリングされる領域) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <Package className="w-4 h-4 text-zinc-500" />
            検索結果 ({products.length}件)
          </h3>
          {isPending && (
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium animate-pulse flex items-center gap-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> サーバーで再フェッチ中...
            </span>
          )}
        </div>

        {products.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 text-xs">
            該当する商品が見つかりませんでした。別のキーワードでお試しください。
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:border-zinc-300 transition-all space-y-2"
              >
                <div className="flex items-start justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    {product.category}
                  </span>
                  {product.inStock ? (
                    <span className="inline-flex items-center text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3 mr-0.5" /> 在庫あり
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[10px] font-medium text-rose-500">
                      <XCircle className="w-3 h-3 mr-0.5" /> 入荷待ち
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {product.name}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs">
                  <span className="font-bold text-base text-zinc-900 dark:text-zinc-100 font-mono">
                    ¥{product.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">ID: {product.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

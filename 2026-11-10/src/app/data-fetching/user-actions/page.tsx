import { ProductSearchForm } from "./ProductSearchForm";
import Link from "next/link";
import {
  MousePointerClick,
  Zap,
  ArrowRight,
  Share2,
  RefreshCw,
  SlidersHorizontal,
  Code2,
  BookOpen,
} from "lucide-react";

export default function UserActionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* ヘッダー */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 mb-2">
          <MousePointerClick className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            第1部 データフェッチ • Chapter 09
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
          ユーザー操作とデータフェッチ
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
          ユーザーの入力やクリック操作に基づくデータフェッチ・部分再レンダリングには、
          <strong>Server Functions</strong> と React 19 の <strong>useActionState()</strong> を利用します。
        </p>
      </div>

      {/* インタラクティブ・デモ */}
      <ProductSearchForm />

      {/* アーキテクチャ解説 */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          なぜ Server Components 単体では不十分なのか？
        </h2>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Server Components はページの初期表示やルーティング時には最適ですが、「ユーザーがテキストを入力して検索ボタンを押したときに、画面の一部だけを再フェッチしたい」というインタラクションには単体では対応できません。
        </p>

        <div className="grid md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/20 text-xs space-y-1.5">
            <span className="font-bold text-rose-700 dark:text-rose-400">
              ❌ router.refresh() による再レンダリング
            </span>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              ページ全体の Server Components ツリーを再実行するため、関係のないコンポーネントまで再評価され、無駄な通信と画面のチラつきが発生します。
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20 text-xs space-y-1.5">
            <span className="font-bold text-emerald-700 dark:text-emerald-400">
              ✅ Server Functions × useActionState()
            </span>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              サーバー関数を RPC（リモートプロシージャコール）のように呼び出し、その戻り値で特定の State のみ部分更新。余計なページ再レンダリングは一切走りません。
            </p>
          </div>
        </div>
      </div>

      {/* コード構造解説 */}
      <div className="rounded-2xl border border-zinc-200 bg-zinc-900 text-zinc-100 p-6 font-mono text-xs overflow-x-auto shadow-md space-y-4">
        <div className="text-zinc-400">// Server Function と useActionState の連携コード</div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-emerald-400 text-[11px] mb-1">// app/actions.ts ("use server")</div>
            <pre className="text-zinc-300 bg-zinc-950 p-3 rounded-lg border border-zinc-800">{`"use server";

export async function searchProducts(
  prevState: Product[],
  formData: FormData
) {
  const query = formData.get("query") as string;
  const res = await fetch(\`.../search?q=\${query}\`);
  const { products } = await res.json();
  return products; // Client Stateに反映
}`}</pre>
          </div>

          <div>
            <div className="text-blue-400 text-[11px] mb-1">// app/form.tsx ("use client")</div>
            <pre className="text-zinc-300 bg-zinc-950 p-3 rounded-lg border border-zinc-800">{`"use client";
import { useActionState } from "react";
import { searchProducts } from "./actions";

export default function Form() {
  const [products, action, isPending] =
    useActionState(searchProducts, []);

  return (
    <form action={action}>
      <input name="query" />
      <button disabled={isPending}>Search</button>
      <ul>{products.map(...)}</ul>
    </form>
  );
}`}</pre>
          </div>
        </div>
      </div>

      {/* トレードオフ: URL同期 vs useActionState */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          設計の使い分け: URL同期 vs useActionState
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                <th className="py-2.5 px-4 font-semibold text-zinc-700 dark:text-zinc-300">設計パターン</th>
                <th className="py-2.5 px-4 font-semibold text-zinc-700 dark:text-zinc-300">状態の保持先</th>
                <th className="py-2.5 px-4 font-semibold text-zinc-700 dark:text-zinc-300">URLシェア / リロード復元</th>
                <th className="py-2.5 px-4 font-semibold text-zinc-700 dark:text-zinc-300">推奨ユースケース</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              <tr>
                <td className="py-3 px-4 font-semibold text-blue-600 dark:text-blue-400">
                  URL同期パターン<br />
                  <span className="font-normal text-zinc-500">(nuqs / router.replace)</span>
                </td>
                <td className="py-3 px-4">クエリパラメータ (?q=...)</td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">✅ 完全に可能</td>
                <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                  メイン検索画面、EC商品一覧、フィルター一覧など
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                  useActionState パターン<br />
                  <span className="font-normal text-zinc-500">(Server Functions)</span>
                </td>
                <td className="py-3 px-4">メモリ (React State)</td>
                <td className="py-3 px-4 text-zinc-400">△ リロードで初期化</td>
                <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                  サイドバー検索、Cmd+K検索モーダル、一時的なインクリメンタル提案など
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ナビゲーションリンク */}
      <div className="flex justify-between items-center pt-4">
        <Link
          href="/"
          className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          ← トップページ
        </Link>
        <Link
          href="/component-design/bundle-boundary"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          <span>第2部: Chapter 11 バンドル境界へ進む</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

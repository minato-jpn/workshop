import { PostContainer } from "./_containers/post";
import { TestabilityInteractive } from "./TestabilityInteractive";
import Link from "next/link";
import {
  FolderTree,
  FlaskConical,
  ArrowRight,
  ShieldCheck,
  Code2,
  FileCode,
  Layers,
} from "lucide-react";

export default function ContainerPresentationalPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* ページヘッダー */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-2">
          <FolderTree className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            第2部 コンポーネント設計 • Chapter 15
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
          Container/Presentational パターン
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
          データ取得は <strong>Container Components</strong>（サーバー処理）、
          データ参照・表示は <strong>Presentational Components</strong>（純粋UI）に分離し、
          RSC環境におけるテスト容易性と保守性を向上させます。
        </p>
      </div>

      {/* 実際のレンダリング結果 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-500" />
            実際のレンダリング: &lt;PostContainer postId=&quot;1&quot; /&gt;
          </h2>
          <span className="text-xs text-zinc-400 font-mono">_containers/post/container.tsx</span>
        </div>
        <PostContainer postId="1" />
      </div>

      {/* テスト容易性シミュレータ */}
      <TestabilityInteractive />

      {/* ディレクトリ構成解説 */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <FolderTree className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          推奨ディレクトリ構成: Private Folder によるコロケーション
        </h2>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Next.jsの Private Folder（<code>_containers</code>）を活用し、コンポーネント単位でディレクトリをまとめます。
          外部に対しては <code>index.tsx</code> のみを通して Container を公開（re-export）し、Presentationalの実装詳細は隠蔽します。
        </p>

        <div className="p-4 rounded-xl bg-zinc-950 font-mono text-xs text-zinc-300 border border-zinc-800 overflow-x-auto">
          <pre>{`/app/posts/[postId]
├── page.tsx          // ルートページ (Containerを配置)
├── layout.tsx
└── _containers       // Private Folder (URLルートにならない)
    └── post
        ├── index.tsx          // ✅ Public: Containerのみをre-export
        ├── container.tsx      // 非同期Server Component (データフェッチ)
        ├── presentational.tsx // Pure UI Component (RTL/Storybook対象)
        └── ...`}</pre>
        </div>
      </div>

      {/* ナビゲーションリンク */}
      <div className="flex justify-between items-center pt-4">
        <Link
          href="/component-design/composition"
          className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          ← Ch.13 Compositionパターン
        </Link>
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          <span>ダッシュボードに戻る</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

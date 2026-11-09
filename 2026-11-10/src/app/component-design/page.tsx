import Link from "next/link";
import {
  Boxes,
  Layers,
  Sparkles,
  FolderTree,
  ArrowRight,
  ShieldCheck,
  DoorOpen,
  HardDrive,
} from "lucide-react";

export default function ComponentDesignIndexPage() {
  const chapters = [
    {
      num: "11",
      title: "クライアントとサーバーのバンドル境界",
      icon: DoorOpen,
      color: "indigo",
      desc: '"use client" と "use server" は実行環境ではなくバンドル境界の宣言。Dan Abramov氏の「2つの世界、2つのドア」思想と server-only 保護を体験。',
      href: "/component-design/bundle-boundary",
    },
    {
      num: "12",
      title: "Client Components のユースケース",
      icon: Sparkles,
      color: "blue",
      desc: "いつ Client Components にオプトインすべきか？イベント・hooksに加え、巨大なReactElementを分離してRSC Payload転送量を激減させる実践。",
      href: "/component-design/client-usecases",
    },
    {
      num: "13",
      title: "Composition パターン",
      icon: Boxes,
      color: "purple",
      desc: "ClientモジュールはServerモジュールをimport不可だが、childrenなどのprops経由で安全に合成できる！開閉メニューと最新サーバーデータの共存。",
      href: "/component-design/composition",
    },
    {
      num: "15",
      title: "Container/Presentational パターン",
      icon: FolderTree,
      color: "emerald",
      desc: "データ取得はContainer（サーバー）、描画はPresentational（純粋UI）に分離。RTLやStorybookでのテスト容易性を最大化するディレクトリコロケーション。",
      href: "/component-design/container-presentational",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* ヘッダー */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-2">
          <Boxes className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Next.jsの考え方 • 第2部
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
          コンポーネント設計 (Component Design)
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
          Server Components を中心に据え、Client Components を適切に組み合わせていくための設計原則。
          バンドル境界、Compositionパターン、テスト容易性を高めるContainer分離を体系的に学びます。
        </p>
      </div>

      {/* 4つのチャプターカード */}
      <div className="grid md:grid-cols-2 gap-6">
        {chapters.map((ch) => {
          const Icon = ch.icon;
          return (
            <Link
              key={ch.num}
              href={ch.href}
              className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-lg transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    Chapter {ch.num}
                  </span>
                  <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                </div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {ch.title}
                </h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {ch.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>実装とシミュレータを見る</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

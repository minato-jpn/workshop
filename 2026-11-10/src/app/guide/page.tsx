import Link from "next/link";
import {
  BookOpen,
  Layers,
  Zap,
  Globe,
  Server,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  Network,
  Share2,
} from "lucide-react";

export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      {/* ページタイトル */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-2">
          <BookOpen className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Next.jsの考え方 Chapter 08 徹底解説
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
          細粒度のREST API設計
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-400 mt-2">
          なぜ Next.js App Router (RSC) は、画面専用の粗粒度APIではなく「単一リソース単位の細粒度REST API」を求めるのか？
        </p>
        <div className="flex items-center space-x-3 text-xs text-zinc-500 mt-4">
          <span>原著者: akfm_sato 氏</span>
          <span>•</span>
          <span>勉強会・ワークショップ日: 2026年11月10日</span>
        </div>
      </div>

      {/* 注意書き */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800 text-xs">
        <div className="flex items-start space-x-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-900 dark:text-amber-200">
              この章の主題についての重要な前提:
            </strong>
            <p className="text-amber-800 dark:text-amber-300 mt-0.5">
              この Chapter の主題は<strong>「Next.js が呼び出すバックエンド REST API の設計」</strong>です。
              Next.js 自体の Route Handlers（`/app/api/...`）として外部に公開する API の設計ではない点にご注意ください。
            </p>
          </div>
        </div>
      </div>

      {/* セクション 1: 背景とトレードオフ */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-mono dark:bg-blue-950 dark:text-blue-300">
            1
          </span>
          リソース単位の粒度とトレードオフ
        </h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          REST API の原則では、リソース（識別子を持つオブジェクト）単位でできるだけ細かく分割することが基本です。
          しかし、粒度を巡っては古くから次のトレードオフが存在しました。
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/20 space-y-2">
            <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
              <MessageSquare className="w-4 h-4" />
              <span>Chatty API（おしゃべりなAPI）</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              細粒度に分割しすぎた結果、クライアントとの通信回数が爆発する状態。
              モバイル回線や低速なブラウザ環境ではRTT（往復時間）がかさみ、致命的なパフォーマンス悪化を招きます。
            </p>
          </div>

          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 dark:border-purple-900/40 dark:bg-purple-950/20 space-y-2">
            <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-400 font-bold text-sm">
              <Layers className="w-4 h-4" />
              <span>God API（神API / 粗粒度API）</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              通信回数を減らすため、1画面に必要な全データを1つのエンドポイントに詰め込んだ状態。
              画面と密結合になり、汎用性に乏しく、バックエンドの実装・保守が肥大化します。
            </p>
          </div>
        </div>

        {/* ネットワーク環境による違い表 */}
        <div className="mt-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2">
            ネットワーク環境による評価の逆転
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="py-2">リソース単位の粒度</th>
                  <th className="py-2">設計観点 (再利用性・単一責務)</th>
                  <th className="py-2">低速通信 (ブラウザ ↔ サーバー)</th>
                  <th className="py-2">高速通信 (Next.js ↔ バックエンド)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                <tr>
                  <td className="py-2 font-semibold">細粒度 (Fine-grained)</td>
                  <td className="py-2 text-emerald-600 font-bold">✅ 優秀</td>
                  <td className="py-2 text-rose-600 font-bold">❌ 致命的に遅い</td>
                  <td className="py-2 text-emerald-600 font-bold">✅ ほぼノーダメージ！</td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold">粗粒度 (Coarse-grained)</td>
                  <td className="py-2 text-rose-600 font-bold">❌ 密結合・低汎用</td>
                  <td className="py-2 text-emerald-600 font-bold">✅ 通信1回で速い</td>
                  <td className="py-2 text-zinc-500">△ メリットが薄い</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* セクション 2: 歴史的経緯 */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-mono dark:bg-blue-950 dark:text-blue-300">
            2
          </span>
          なぜ Pages Router では粗粒度になりがちだったのか？
        </h2>
        <div className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <p>
            Pages Router では、サーバーサイドデータ取得はページ単位の関数{" "}
            <code className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-xs">
              getServerSideProps()
            </code>{" "}
            に集約されていました。
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>ページ単位の要求がAPIに直結:</strong>{" "}
              「このページで表示する全データを1発でくれ」というフロント側の都合から、画面専用の粗粒度APIが作られやすかった。
            </li>
            <li>
              <strong>Props バケツリレーの強制:</strong>{" "}
              最上位で全データを取得するため、下位の末端コンポーネントまでPropsを何階層も引き渡す必要がありました。
            </li>
            <li>
              <strong>最遅データによる全ブロッキング:</strong>{" "}
              おすすめ記事やAI要約など1つでも遅い処理があると、ページ全体のHTML生成が待たされていました。
            </li>
          </ul>
        </div>
      </section>

      {/* セクション 3: App Router との親和性 */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-mono dark:bg-blue-950 dark:text-blue-300">
            3
          </span>
          App Router (RSC) で細粒度REST APIが真価を発揮する理由
        </h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          App Router では、React Server Components (RSC) によってコンポーネント自身が非同期フェッチを行えます（コロケーション）。
          これにより、細粒度REST APIの価値が劇的に向上します。
        </p>

        <div className="grid sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center space-x-1.5 text-emerald-600 font-bold">
              <Zap className="w-4 h-4" />
              <span>① コロケーション</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              コンポーネント自身が必要なAPIだけを叩くため、親からのバケツリレーが消滅。コンポーネントが自己完結します。
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center space-x-1.5 text-blue-600 font-bold">
              <Server className="w-4 h-4" />
              <span>② Suspense ストリーミング</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              遅いAPI（AI要約など）だけを &lt;Suspense&gt; で囲むことで、本文を最速（~60ms）で先行描画できます。
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center space-x-1.5 text-purple-600 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>③ きめ細かなキャッシュ</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              「いいね数」が更新されても、静的な記事本文キャッシュは壊さず、メトリクスのみを無効化できます。
            </p>
          </div>
        </div>
      </section>

      {/* セクション 4: RSCとGraphQLのアナロジー */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-mono dark:bg-blue-950 dark:text-blue-300">
            4
          </span>
          RSC と GraphQL のアナロジー（精神的後継）
        </h2>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/60 to-blue-50/60 dark:from-indigo-950/20 dark:to-blue-950/20 border border-indigo-200/80 dark:border-indigo-900/40 space-y-3">
          <p className="text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
            細粒度なAPI設計はRSCで初めて注目されたものではなく、従来から <strong>GraphQL BFF に対するバックエンドAPI</strong> で好まれてきました。
          </p>

          <div className="grid sm:grid-cols-2 gap-3 text-xs pt-2">
            <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-indigo-100 dark:border-indigo-900/40">
              <span className="font-bold text-indigo-700 dark:text-indigo-400">従来の GraphQL BFF 構成</span>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                クライアントは GraphQL Query で必要なフィールドを宣言。
                GraphQL サーバーがバックエンドの細粒度 REST API を束ねて解決（Resolver）する。
              </p>
            </div>
            <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-indigo-100 dark:border-indigo-900/40">
              <span className="font-bold text-blue-700 dark:text-blue-400">Next.js App Router (RSC)</span>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                各 Server Component が直接フェッチを宣言。
                Next.js サーバーがバックエンドの細粒度 REST API を叩き、HTML/RSC Payload として集約する。
              </p>
            </div>
          </div>

          <div className="pt-2 text-xs text-indigo-900 dark:text-indigo-300 border-t border-indigo-100 dark:border-indigo-900/40">
            💡 <strong>Joe Savona 氏の系譜:</strong><br />
            RSC の最初の RFC 著者である Joe Savona 氏は、Meta（Facebook）で Relay の初期開発に携わり、GraphQL を通じたデータフェッチのベストプラクティスを追求してきた人物です。
            RSC には「REST API のシンプルさを保ちながら、GraphQL が目指したコロケーションとサーバー集約を実現する」という精神的後継の側面があります。
          </div>
        </div>
      </section>

      {/* セクション 5: バックエンド開発チームとの対話 */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-mono dark:bg-blue-950 dark:text-blue-300">
            5
          </span>
          バックエンド開発チームをどう納得させるか？
        </h2>
        <div className="space-y-3 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <p>
            バックエンドチームから見ると、「Next.js の都合で通信回数を増やされる」「Chatty API はアンチパターンでは？」と懸念されることがあります。
            そこで、フロント側のわがままではなく、<strong>双方にとっての大きなメリット</strong>として伝えるのが効果的です。
          </p>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
              対話のチートシート（バックエンド目線のメリット）
            </div>

            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <span className="text-emerald-600 font-bold">1.</span>
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100">API の再利用性と寿命の長さ:</strong>
                  <p className="text-zinc-500">
                    画面専用のGod APIは、UIリニューアルのたびに修正や廃棄が必要になります。
                    一方、リソース単体の細粒度APIはモバイルアプリや将来の機能でもそのまま使い回せます。
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <span className="text-emerald-600 font-bold">2.</span>
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100">実装と単体テストのシンプル化:</strong>
                  <p className="text-zinc-500">
                    巨大な結合クエリを書く必要がなく、単一テーブルのCRUDに近い素直なAPIとして実装・保守できます。
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <span className="text-emerald-600 font-bold">3.</span>
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100">通信遅延の懸念に対する回答:</strong>
                  <p className="text-zinc-500">
                    「クライアントのスマホから叩くのではなく、同じクラウド内（VPC内/高速ネットワーク 1〜5ms）の Next.js サーバーから叩くため、通信回数はボトルネックになりません」と説明しましょう。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* フッターリンク */}
      <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
        <Link
          href="/comparison"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center space-x-1"
        >
          <span>← リアルタイム対決に戻る</span>
        </Link>
        <a
          href="https://zenn.dev/akfm/books/nextjs-basic-principle/viewer/part_1_fine_grained_api_design"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          Zenn 本編: Chapter 08 細粒度のREST API設計 ↗
        </a>
      </div>
    </div>
  );
}

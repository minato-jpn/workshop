import { GodArticleResponse } from "@/lib/mock-data";
import {
  Clock,
  Tag,
  ShieldCheck,
  Eye,
  Heart,
  Bookmark,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  MessageSquare,
  User,
  AlertTriangle,
  Layers,
} from "lucide-react";

interface Props {
  data: GodArticleResponse;
}

export function GodArticleView({ data }: { data: GodArticleResponse }) {
  const { article, author, metrics, comments, aiSummary, meta } = data;

  return (
    <div className="space-y-6">
      {/* 警告バナー: 粗粒度APIの課題 */}
      <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 dark:bg-purple-950/30 dark:border-purple-800">
        <div className="flex items-start space-x-3">
          <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-purple-900 dark:text-purple-200">
              粗粒度 (God API) パターン: 1リクエストで全データ取得
            </p>
            <p className="text-purple-700 dark:text-purple-300 mt-0.5">
              エンドポイント: <code className="font-mono bg-purple-100 dark:bg-purple-900 px-1 py-0.5 rounded">{meta.endpoint}</code> (所要時間: {meta.totalLatencyMs}ms)
            </p>
            <p className="text-purple-600 dark:text-purple-400 mt-1">
              ※ すべての子コンポーネントへトップレベルから props をバケツリレーしています。重いAI要約の完了を待つため、最初のHTML出力（TTFB）が1秒以上遅延しました。
            </p>
          </div>
        </div>
      </div>

      {/* 著者情報 (propsバケツリレー) */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 dark:bg-zinc-900/60 dark:border-zinc-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow">
            {author.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                {author.name}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                <ShieldCheck className="w-3 h-3 mr-0.5" /> 著者 (via props)
              </span>
            </div>
            <p className="text-xs text-zinc-700 dark:text-zinc-300">
              {author.role} @ {author.company}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          Props from God Response
        </span>
      </div>

      {/* 記事本文 */}
      <article className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            <Tag className="w-3 h-3" />
            {article.category}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
            <Clock className="w-3 h-3" />
            読了目安 {article.readTimeMin} 分
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-snug">
          {article.title}
        </h1>

        <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-zinc-50/50 dark:bg-zinc-900/30 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800">
          {article.content}
        </div>
      </article>

      {/* メトリクス */}
      <div className="p-4 rounded-xl bg-purple-50/40 border border-purple-100 dark:bg-purple-950/20 dark:border-purple-900/40">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-purple-900 dark:text-purple-300">
            エンゲージメント (一括取得)
          </span>
          <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400">
            更新頻度が高いのに全体と共倒れ
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/50 dark:border-zinc-800">
            <Eye className="w-3.5 h-3.5 mx-auto mb-1 text-zinc-400" />
            <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">{metrics.views.toLocaleString()}</p>
            <p className="text-[10px] text-zinc-700 dark:text-zinc-300">Views</p>
          </div>
          <div className="p-2 rounded-lg bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/50 dark:border-zinc-800">
            <Heart className="w-3.5 h-3.5 mx-auto mb-1 text-rose-500 fill-rose-500" />
            <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">{metrics.likes.toLocaleString()}</p>
            <p className="text-[10px] text-zinc-700 dark:text-zinc-300">Likes</p>
          </div>
          <div className="p-2 rounded-lg bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/50 dark:border-zinc-800">
            <Bookmark className="w-3.5 h-3.5 mx-auto mb-1 text-amber-500 fill-amber-500" />
            <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">{metrics.bookmarks.toLocaleString()}</p>
            <p className="text-[10px] text-zinc-700 dark:text-zinc-300">Stock</p>
          </div>
        </div>
      </div>

      {/* AI要約 (待たされた末に表示) */}
      <div className="rounded-xl border border-amber-300 bg-amber-50/50 p-5 dark:border-amber-800/80 dark:bg-amber-950/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-200">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-bold text-sm">AI エグゼクティブ・サマリー (一括フェッチ)</h3>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
            一括同期取得
          </span>
        </div>
        <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed mb-4">
          {aiSummary.summary}
        </p>
        <div className="grid sm:grid-cols-2 gap-2 mb-4">
          {aiSummary.keyTakeaways.map((point, i) => (
            <div
              key={i}
              className="flex items-start space-x-1.5 text-xs text-zinc-700 dark:text-zinc-300 bg-white/70 dark:bg-zinc-900/60 p-2 rounded-lg border border-amber-100 dark:border-amber-900/30"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{point}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-amber-200/60 dark:border-amber-900/40">
          <span className="text-xs text-amber-900 dark:text-amber-300 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5" /> 関連トピック:
          </span>
          {aiSummary.recommendedTopics.map((topic, i) => (
            <span
              key={i}
              className="text-[11px] px-2 py-0.5 rounded bg-amber-200/70 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* コメント一覧 */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center space-x-2 mb-4">
          <MessageSquare className="w-4 h-4 text-zinc-500" />
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
            コミュニティコメント ({comments.length})
          </h3>
        </div>
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">
                    {comment.author}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400">{comment.createdAt}</span>
              </div>
              <p className="text-xs text-zinc-700 dark:text-zinc-300">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

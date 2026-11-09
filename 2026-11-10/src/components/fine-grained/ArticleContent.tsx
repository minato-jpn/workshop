import { fetchArticle } from "@/lib/backend-service";
import { Clock, Tag } from "lucide-react";

export async function ArticleContent({ id }: { id: string }) {
  // 記事データのみを細粒度フェッチ（コロケーション）
  const { data: article, durationMs } = await fetchArticle(id);

  return (
    <article className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <Tag className="w-3 h-3" />
          {article.category}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
          <Clock className="w-3 h-3" />
          読了目安 {article.readTimeMin} 分
        </span>
        <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
          GET /articles/{id} ({durationMs}ms)
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-snug">
        {article.title}
      </h1>

      <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-zinc-50/50 dark:bg-zinc-900/30 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800">
        {article.content}
      </div>
    </article>
  );
}

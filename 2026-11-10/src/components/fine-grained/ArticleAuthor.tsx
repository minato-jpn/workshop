import { fetchAuthor } from "@/lib/backend-service";
import { UserCheck, ShieldCheck } from "lucide-react";

export async function ArticleAuthor({ authorId }: { authorId: string }) {
  // コンポーネント自身が必要な著者APIのみをフェッチ（コロケーション）
  const { data: author, durationMs } = await fetchAuthor(authorId);

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 dark:bg-zinc-900/60 dark:border-zinc-800">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow">
          {author.name.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              {author.name}
            </span>
            <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <ShieldCheck className="w-3 h-3 mr-0.5" /> 著者
            </span>
          </div>
          <p className="text-xs text-zinc-700 dark:text-zinc-300">
            {author.role} @ {author.company}
          </p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          GET /authors/{authorId} ({durationMs}ms)
        </span>
      </div>
    </div>
  );
}

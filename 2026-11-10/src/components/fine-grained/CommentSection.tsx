import { fetchComments } from "@/lib/backend-service";
import { MessageSquare, User } from "lucide-react";

export async function CommentSection({ id }: { id: string }) {
  // コメント一覧を独立フェッチ
  const { data: comments, durationMs } = await fetchComments(id);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-zinc-500" />
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
            コミュニティコメント ({comments.length})
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          GET /comments/{id} ({durationMs}ms)
        </span>
      </div>

      <div className="space-y-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-1.5">
                <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[10px]">
                  <User className="w-3 h-3 text-zinc-500" />
                </div>
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">
                  {comment.author}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400">{comment.createdAt}</span>
            </div>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {comment.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

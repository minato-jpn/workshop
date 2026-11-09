import { fetchMetrics } from "@/lib/backend-service";
import { Eye, Heart, Bookmark, Activity } from "lucide-react";

export async function EngagementSidebar({ id }: { id: string }) {
  // メトリクス情報のみを独立フェッチ（動的データ / 短期キャッシュ推奨）
  const { data: metrics, durationMs } = await fetchMetrics(id);

  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/50 to-purple-50/40 border border-indigo-100 dark:from-indigo-950/20 dark:to-purple-950/10 dark:border-indigo-900/40">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-900 dark:text-indigo-300">
          <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>リアルタイム反応</span>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          GET /metrics/{id} ({durationMs}ms)
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded-lg bg-white/80 dark:bg-zinc-900/80 shadow-xs border border-zinc-200/50 dark:border-zinc-800">
          <div className="flex justify-center mb-1 text-zinc-400">
            <Eye className="w-3.5 h-3.5" />
          </div>
          <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            {metrics.views.toLocaleString()}
          </p>
          <p className="text-[10px] text-zinc-700 dark:text-zinc-300">Views</p>
        </div>

        <div className="p-2 rounded-lg bg-white/80 dark:bg-zinc-900/80 shadow-xs border border-zinc-200/50 dark:border-zinc-800">
          <div className="flex justify-center mb-1 text-rose-500">
            <Heart className="w-3.5 h-3.5 fill-rose-500" />
          </div>
          <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            {metrics.likes.toLocaleString()}
          </p>
          <p className="text-[10px] text-zinc-700 dark:text-zinc-300">Likes</p>
        </div>

        <div className="p-2 rounded-lg bg-white/80 dark:bg-zinc-900/80 shadow-xs border border-zinc-200/50 dark:border-zinc-800">
          <div className="flex justify-center mb-1 text-amber-500">
            <Bookmark className="w-3.5 h-3.5 fill-amber-500" />
          </div>
          <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            {metrics.bookmarks.toLocaleString()}
          </p>
          <p className="text-[10px] text-zinc-700 dark:text-zinc-300">Stock</p>
        </div>
      </div>
      <p className="text-[10px] text-zinc-700 dark:text-zinc-300 mt-2 text-right">
        ※ 独立したキャッシュ戦略（no-store または短時間再検証）
      </p>
    </div>
  );
}

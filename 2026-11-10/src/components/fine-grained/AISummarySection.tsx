import { fetchAISummary } from "@/lib/backend-service";
import { Sparkles, CheckCircle2, Lightbulb } from "lucide-react";

export async function AISummarySection({ id }: { id: string }) {
  // AI要約（重い処理: 約850ms）
  // Suspense と組み合わせることで、この処理を待たずにページ本体が先に描画される！
  const { data: ai, durationMs } = await fetchAISummary(id);

  return (
    <div className="rounded-xl border border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50/50 p-5 dark:border-amber-800/80 dark:from-amber-950/30 dark:to-orange-950/20 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-200">
          <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h3 className="font-bold text-sm">AI エグゼクティブ・サマリー</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
            GET /ai-summary/{id} ({durationMs}ms)
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Streaming完了
          </span>
        </div>
      </div>

      <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed mb-4 font-medium">
        {ai.summary}
      </p>

      <div className="space-y-2 mb-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
          重要ポイント
        </h4>
        <div className="grid sm:grid-cols-2 gap-2">
          {ai.keyTakeaways.map((point, i) => (
            <div
              key={i}
              className="flex items-start space-x-1.5 text-xs text-zinc-700 dark:text-zinc-300 bg-white/70 dark:bg-zinc-900/60 p-2 rounded-lg border border-amber-100 dark:border-amber-900/30"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-amber-200/60 dark:border-amber-900/40">
        <span className="text-xs text-amber-900 dark:text-amber-300 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5" /> 関連トピック:
        </span>
        {ai.recommendedTopics.map((topic, i) => (
          <span
            key={i}
            className="text-[11px] px-2 py-0.5 rounded bg-amber-200/70 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200"
          >
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
}

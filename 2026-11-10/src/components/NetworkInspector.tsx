"use client";

import { Activity, Clock, ShieldCheck, Zap, Layers, RefreshCw } from "lucide-react";

interface RequestItem {
  label: string;
  endpoint: string;
  startMs: number;
  durationMs: number;
  sizeKb: number;
  color: string;
  streaming?: boolean;
}

interface NetworkInspectorProps {
  mode: "coarse" | "fine";
  totalDurationMs: number;
  ttfbMs: number;
}

export function NetworkInspector({ mode, totalDurationMs, ttfbMs }: NetworkInspectorProps) {
  const coarseRequests: RequestItem[] = [
    {
      label: "God Article Endpoint (All-in-One)",
      endpoint: "/api/backend/god-article/nextjs-fine-grained-api",
      startMs: 0,
      durationMs: 1000,
      sizeKb: 32.4,
      color: "bg-purple-500",
      streaming: false,
    },
  ];

  const fineRequests: RequestItem[] = [
    {
      label: "Article Body (本文・メタ)",
      endpoint: "/api/backend/articles/nextjs-fine-grained-api",
      startMs: 0,
      durationMs: 60,
      sizeKb: 3.2,
      color: "bg-blue-500",
    },
    {
      label: "Author Profile (著者情報)",
      endpoint: "/api/backend/authors/author-akfm",
      startMs: 0,
      durationMs: 50,
      sizeKb: 1.1,
      color: "bg-emerald-500",
    },
    {
      label: "Live Metrics (PV・いいね数)",
      endpoint: "/api/backend/metrics/nextjs-fine-grained-api",
      startMs: 0,
      durationMs: 130,
      sizeKb: 0.8,
      color: "bg-indigo-500",
    },
    {
      label: "Comments (コメント一覧)",
      endpoint: "/api/backend/comments/nextjs-fine-grained-api",
      startMs: 0,
      durationMs: 190,
      sizeKb: 4.5,
      color: "bg-cyan-500",
    },
    {
      label: "AI Summary (重い推論処理・Suspense)",
      endpoint: "/api/backend/ai-summary/nextjs-fine-grained-api",
      startMs: 0,
      durationMs: 850,
      sizeKb: 6.8,
      color: "bg-amber-500",
      streaming: true,
    },
  ];

  const requests = mode === "coarse" ? coarseRequests : fineRequests;
  const maxScaleMs = 1100;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-zinc-500" />
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
            サーバー間通信 ガントチャート (Next.js RSC ↔ Backend API)
          </h3>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>TTFB (初回HTML送出):</span>
            <strong className={mode === "fine" ? "text-emerald-600 dark:text-emerald-400" : "text-purple-600 dark:text-purple-400"}>
              ~{ttfbMs}ms
            </strong>
          </div>
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            <span>完了時間:</span>
            <strong className="text-zinc-900 dark:text-zinc-100">
              ~{totalDurationMs}ms
            </strong>
          </div>
        </div>
      </div>

      {/* タイムライン目盛り */}
      <div className="relative mb-2">
        <div className="flex justify-between text-[10px] font-mono text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 pb-1">
          <span>0ms</span>
          <span>250ms</span>
          <span>500ms</span>
          <span>750ms</span>
          <span>1000ms</span>
        </div>
      </div>

      {/* ガントバー一覧 */}
      <div className="space-y-3">
        {requests.map((req, idx) => {
          const widthPercent = Math.max(3, (req.durationMs / maxScaleMs) * 100);
          const leftPercent = (req.startMs / maxScaleMs) * 100;

          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate pr-2">
                  {req.label}
                  {req.streaming && (
                    <span className="ml-1.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-900">
                      Suspense Stream
                    </span>
                  )}
                </span>
                <span className="font-mono text-[11px] text-zinc-500 whitespace-nowrap">
                  {req.durationMs}ms ({req.sizeKb} KB)
                </span>
              </div>
              <div className="relative w-full h-5 bg-zinc-100 dark:bg-zinc-800/80 rounded-md overflow-hidden">
                <div
                  className={`absolute top-0 bottom-0 rounded-md ${req.color} flex items-center justify-end px-2 text-[10px] font-mono text-white font-medium shadow-xs transition-all duration-700`}
                  style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                  }}
                >
                  {req.durationMs}ms
                </div>
              </div>
              <p className="text-[10px] font-mono text-zinc-700 dark:text-zinc-300 truncate">
                GET {req.endpoint}
              </p>
            </div>
          );
        })}
      </div>

      {/* 考察メッセージ */}
      <div className="mt-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
        {mode === "coarse" ? (
          <div>
            <strong className="text-purple-600 dark:text-purple-400">粗粒度の問題点:</strong>{" "}
            バックエンドで一番遅いAI要約（800ms）を待つまでAPIレスポンスが一切返らないため、記事本文や著者情報のような軽量なデータも巻き添えで待たされ、ユーザーの画面は1000ms間真っ白のままになります。
          </div>
        ) : (
          <div>
            <strong className="text-emerald-600 dark:text-emerald-400">細粒度のメリット:</strong>{" "}
            並行フェッチとSuspenseにより、記事本文と著者はわずか<strong>~60ms</strong>で表示開始！
            遅いAI要約（850ms）だけをスケルトンにして後からストリーミングするため、ユーザーの体感表示速度は粗粒度比で<strong>約16倍高速</strong>です。
          </div>
        )}
      </div>
    </div>
  );
}

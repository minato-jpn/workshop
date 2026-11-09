"use client";

import { useState } from "react";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Layers,
  Zap,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Flame,
} from "lucide-react";

type SimState = "idle" | "running" | "finished";

export function InteractiveComparison() {
  const [simState, setSimState] = useState<SimState>("idle");
  const [elapsed, setElapsed] = useState(0);

  // 粗粒度側のステータス
  const [coarseLoaded, setCoarseLoaded] = useState(false);

  // 細粒度側のステータス (段階的描画)
  const [fineArticleLoaded, setFineArticleLoaded] = useState(false);
  const [fineAuthorLoaded, setFineAuthorLoaded] = useState(false);
  const [fineMetricsLoaded, setFineMetricsLoaded] = useState(false);
  const [fineCommentsLoaded, setFineCommentsLoaded] = useState(false);
  const [fineAILoaded, setFineAILoaded] = useState(false);

  const startSimulation = () => {
    setSimState("running");
    setElapsed(0);
    setCoarseLoaded(false);
    setFineArticleLoaded(false);
    setFineAuthorLoaded(false);
    setFineMetricsLoaded(false);
    setFineCommentsLoaded(false);
    setFineAILoaded(false);

    const startTime = Date.now();
    const timer = setInterval(() => {
      const cur = Date.now() - startTime;
      setElapsed(cur);

      // 細粒度の段階的完了
      if (cur >= 60) setFineAuthorLoaded(true);
      if (cur >= 70) setFineArticleLoaded(true);
      if (cur >= 140) setFineMetricsLoaded(true);
      if (cur >= 210) setFineCommentsLoaded(true);
      if (cur >= 880) setFineAILoaded(true);

      // 粗粒度の一括完了
      if (cur >= 1020) {
        setCoarseLoaded(true);
        setSimState("finished");
        clearInterval(timer);
      }
    }, 20);
  };

  const resetSimulation = () => {
    setSimState("idle");
    setElapsed(0);
    setCoarseLoaded(false);
    setFineArticleLoaded(false);
    setFineAuthorLoaded(false);
    setFineMetricsLoaded(false);
    setFineCommentsLoaded(false);
    setFineAILoaded(false);
  };

  return (
    <div className="space-y-6">
      {/* 操作バー */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900 text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm">レンダリング・ストリーミング対決</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300 font-mono">
                {elapsed}ms 経過
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              ボタンを押して、バックエンド通信と画面描画のタイミングの差を体感してください
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {simState === "running" ? (
            <button
              disabled
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600/50 text-white cursor-not-allowed"
            >
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>シミュレーション実行中... ({elapsed}ms)</span>
            </button>
          ) : (
            <button
              onClick={startSimulation}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{simState === "finished" ? "もう一度比較する" : "同時にリクエスト開始！"}</span>
            </button>
          )}

          {simState !== "idle" && (
            <button
              onClick={resetSimulation}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
            >
              リセット
            </button>
          )}
        </div>
      </div>

      {/* 左右スプリット比較ビュー */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 左: 粗粒度 (God API) */}
        <div className="rounded-2xl border-2 border-purple-200 dark:border-purple-900/60 bg-white dark:bg-zinc-900 p-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-purple-900/40">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                  <Layers className="w-4 h-4" />
                </span>
                <span className="font-bold text-sm text-purple-950 dark:text-purple-200">
                  粗粒度 (God API / 1エンドポイント)
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                GET /god-article (一括1000ms)
              </span>
            </div>

            {/* 状態ステータス */}
            <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-purple-900 dark:text-purple-200">
                  描画ステータス:
                </span>
                <span className="font-mono font-bold text-purple-700 dark:text-purple-300">
                  {coarseLoaded ? "✅ 1020msで描画完了" : simState === "running" ? "⏳ 全体ブロック待機中..." : "待機中"}
                </span>
              </div>
              <p className="text-[11px] text-purple-700 dark:text-purple-400 leading-tight">
                最遅のAI要約（800ms）をバックエンドで待つため、1000ms経過するまで画面には一切何も表示されません。
              </p>
            </div>

            {/* 画面プレビュー */}
            <div className="min-h-[380px] rounded-xl border border-dashed border-purple-200 dark:border-purple-800/80 p-4 bg-zinc-50/50 dark:bg-zinc-950/40 flex flex-col justify-center">
              {!coarseLoaded ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-purple-900 dark:text-purple-300">
                    {simState === "running" ? `データ取得中... (${elapsed}ms)` : "リクエスト開始を押してください"}
                  </p>
                  <p className="text-[11px] text-zinc-400 max-w-xs mx-auto">
                    記事本文・著者情報・メトリクスはバックエンドで揃っているのに、AI要約の完了待ちで送出できません
                  </p>
                </div>
              ) : (
                <div className="space-y-3 animate-fadeIn">
                  <div className="p-2.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs flex justify-between">
                    <span className="font-semibold">Sato Akifumi (著者)</span>
                    <span className="text-[10px] text-zinc-400">一括受信</span>
                  </div>
                  <div className="p-3 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1">
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">
                      Next.js App Router と細粒度 REST API 設計の真価
                    </p>
                    <p className="text-[11px] text-zinc-500 line-clamp-2">
                      バックエンドのAPI設計は、フロントエンドの設計にも大きく影響をもたらします...
                    </p>
                  </div>
                  <div className="p-2 rounded bg-purple-100/50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-[11px] text-center font-mono">
                    8,940 Views / 421 Likes / 289 Stock
                  </div>
                  <div className="p-3 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs">
                    <p className="font-bold text-amber-900 dark:text-amber-200 text-[11px]">AI エグゼクティブ・サマリー</p>
                    <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-1">
                      RSCの登場により細粒度REST APIへの回帰が最適解となった...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-100 dark:border-purple-900/40 text-[11px] text-zinc-500">
            初回表示(TTFB): <strong className="text-purple-600 dark:text-purple-400 font-mono">1020ms</strong>
          </div>
        </div>

        {/* 右: 細粒度 (Fine-grained + Suspense) */}
        <div className="rounded-2xl border-2 border-emerald-400 dark:border-emerald-700/80 bg-white dark:bg-zinc-900 p-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100 dark:border-emerald-900/40">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <Zap className="w-4 h-4" />
                </span>
                <span className="font-bold text-sm text-emerald-950 dark:text-emerald-200">
                  細粒度 (Fine-grained API + Suspense)
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                5リソース並行 + ストリーミング
              </span>
            </div>

            {/* 状態ステータス */}
            <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-emerald-900 dark:text-emerald-200">
                  描画ステータス:
                </span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                  {fineArticleLoaded ? "⚡ 70msで本文表示！" : simState === "running" ? "フェッチ中..." : "待機中"}
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-tight">
                速いデータ（記事・著者）は70msで即表示！遅いAI要約だけが後からポンと差し込まれます。
              </p>
            </div>

            {/* 画面プレビュー */}
            <div className="min-h-[380px] rounded-xl border border-dashed border-emerald-200 dark:border-emerald-800/80 p-4 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-3">
              {/* 著者 */}
              {fineAuthorLoaded ? (
                <div className="p-2.5 rounded bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-900 text-xs flex justify-between items-center animate-fadeIn">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">Sato Akifumi (著者)</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    ⚡ 60ms完了
                  </span>
                </div>
              ) : (
                <div className="h-9 rounded bg-zinc-200/60 dark:bg-zinc-800 animate-pulse" />
              )}

              {/* 記事本文 */}
              {fineArticleLoaded ? (
                <div className="p-3 rounded bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-900 text-xs space-y-1 animate-fadeIn">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">
                      Next.js App Router と細粒度 REST API 設計の真価
                    </p>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      ⚡ 70ms完了
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 line-clamp-2">
                    バックエンドのAPI設計は、フロントエンドの設計にも大きく影響をもたらします...
                  </p>
                </div>
              ) : (
                <div className="h-20 rounded bg-zinc-200/60 dark:bg-zinc-800 animate-pulse" />
              )}

              {/* メトリクス */}
              {fineMetricsLoaded ? (
                <div className="p-2 rounded bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-[11px] text-center font-mono flex justify-between px-3 animate-fadeIn">
                  <span>8,940 Views / 421 Likes / 289 Stock</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">140ms</span>
                </div>
              ) : (
                <div className="h-7 rounded bg-zinc-200/60 dark:bg-zinc-800 animate-pulse" />
              )}

              {/* AI要約 (Suspense) */}
              {fineAILoaded ? (
                <div className="p-3 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs animate-fadeIn">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-bold text-amber-900 dark:text-amber-200 text-[11px] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" /> AI エグゼクティブ・サマリー
                    </p>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                      Streaming着弾 (880ms)
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300">
                    RSCの登場により細粒度REST APIへの回帰が最適解となった...
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-lg border border-dashed border-amber-300 dark:border-amber-800/80 bg-amber-50/40 dark:bg-amber-950/20 text-xs animate-pulse">
                  <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 text-[11px]">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                    <span>Suspense fallback: AI要約をバックグラウンド計算中...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-100 dark:border-emerald-900/40 text-[11px] text-zinc-500 flex justify-between">
            <span>
              初回表示(TTFB): <strong className="text-emerald-600 dark:text-emerald-400 font-mono">70ms (約15倍速い！)</strong>
            </span>
            <span>最終完了: 880ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}

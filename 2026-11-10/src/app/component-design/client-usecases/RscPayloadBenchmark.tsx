"use client";

import { useState } from "react";
import {
  Zap,
  ArrowRight,
  HardDrive,
  FileCode,
  Gauge,
  Sparkles,
  Layers,
} from "lucide-react";

export function RscPayloadBenchmark() {
  const [activeTab, setActiveTab] = useState<"server" | "client">("server");

  // シミュレーションデータ
  const serverPayloadSize = 4820; // 4.8 KB (大量のTailwindクラスとJSXツリーがRSC Payloadに入る)
  const clientOptimizedPayloadSize = 340; // 0.34 KB (純粋なデータのみがRSC Payloadに入り、UIはJSバンドル側)

  return (
    <div className="space-y-6">
      {/* 切替タブ */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900 text-white shadow-md">
        <div className="flex items-center space-x-2">
          <Gauge className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-sm">
            RSC Payload 転送量削減シミュレータ
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("server")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "server"
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            パターンA: 全部Server Component
          </button>
          <button
            onClick={() => setActiveTab("client")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "client"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            パターンB: PresentationalをClient化 (推奨)
          </button>
        </div>
      </div>

      {/* ペイロードサイズ比較メーター */}
      <div className="grid md:grid-cols-2 gap-6">
        <div
          className={`p-5 rounded-2xl border-2 transition-all ${
            activeTab === "server"
              ? "border-purple-400 bg-purple-50/20 dark:bg-purple-950/20"
              : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-xs text-purple-900 dark:text-purple-200">
              パターンA: 巨大ReactElementをServer Componentで出力
            </span>
            <span className="font-mono font-bold text-sm text-rose-500">
              {serverPayloadSize.toLocaleString()} Bytes (4.8 KB)
            </span>
          </div>

          <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-purple-500 transition-all duration-500"
              style={{ width: "100%" }}
            />
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            大量のTailwindクラス属性や入れ子DOMがすべて <strong>RSC Payload 文字列</strong> として毎リクエスト転送されます。ページ遷移のたびに転送コストが発生します。
          </p>

          <div className="mt-3 p-3 bg-zinc-950 rounded-xl text-[11px] font-mono text-zinc-300 overflow-x-auto border border-zinc-800">
            <div className="text-purple-400">// RSC Payload (実際の転送ストリーム)</div>
            <div className="text-zinc-500 text-[10px] break-all">
              M1:[&quot;$&quot;,&quot;div&quot;,null,&#123;&quot;className&quot;:&quot;flex flex-col p-6 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800...&quot;,children:[...大量のクラス文字列...]&#125;]
            </div>
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border-2 transition-all ${
            activeTab === "client"
              ? "border-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/20"
              : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-xs text-emerald-900 dark:text-emerald-200">
              パターンB: ReactElement描画をClient Componentに分離
            </span>
            <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
              {clientOptimizedPayloadSize.toLocaleString()} Bytes (0.34 KB)
            </span>
          </div>

          <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: "7%" }}
            />
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            大量のクラス文字列やDOM構造はクライアントのJSバンドルに保持（1度だけダウンロード）。
            RSC Payload には <strong>純粋なデータオブジェクト（JSON）のみ</strong> が乗り、<strong>約93% 削減</strong>！
          </p>

          <div className="mt-3 p-3 bg-zinc-950 rounded-xl text-[11px] font-mono text-zinc-300 overflow-x-auto border border-zinc-800">
            <div className="text-emerald-400">// RSC Payload (軽量化された転送ストリーム)</div>
            <div className="text-zinc-400 text-[10px]">
              M1:[&quot;$&quot;,&quot;$L2&quot;,null,&#123;&quot;product&quot;:&#123;&quot;id&quot;:&quot;p1&quot;,&quot;title&quot;:&quot;Next.js&quot;,&quot;price&quot;:3520&#125;&#125;]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

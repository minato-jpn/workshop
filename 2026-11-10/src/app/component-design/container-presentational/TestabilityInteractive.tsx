"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  FlaskConical,
  Code2,
  FileText,
} from "lucide-react";

export function TestabilityInteractive() {
  const [testMode, setTestMode] = useState<"rtl-presentational" | "rtl-container-fail" | "fn-container">("rtl-presentational");
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<"passed" | "failed" | null>("passed");

  const runTest = (mode: "rtl-presentational" | "rtl-container-fail" | "fn-container") => {
    setTestMode(mode);
    setIsRunning(true);
    setTestResult(null);

    setTimeout(() => {
      setIsRunning(false);
      if (mode === "rtl-container-fail") {
        setTestResult("failed");
      } else {
        setTestResult("passed");
      }
    }, 400);
  };

  return (
    <div className="space-y-5">
      {/* 操作タブ */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900 text-white shadow-md">
        <div className="flex items-center space-x-2">
          <FlaskConical className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-sm">
            RSC テスト容易性シミュレータ (RTL / Vitest)
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => runTest("rtl-presentational")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              testMode === "rtl-presentational"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            ① RTL: Presentationalのテスト
          </button>
          <button
            onClick={() => runTest("rtl-container-fail")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              testMode === "rtl-container-fail"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            ② RTL: Container直接render (失敗例)
          </button>
          <button
            onClick={() => runTest("fn-container")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              testMode === "fn-container"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            ③ Containerを関数としてテスト
          </button>
        </div>
      </div>

      {/* テストコードと実行結果 */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* 左: テストコード */}
        <div className="p-4 rounded-2xl bg-zinc-950 text-zinc-200 font-mono text-xs border border-zinc-800 space-y-2">
          <div className="text-zinc-500 text-[11px]">// 実行するテストコード</div>
          {testMode === "rtl-presentational" && (
            <pre className="text-emerald-400">{`// presentational.test.tsx
test("記事タイトルが表示される", () => {
  const dummyPost = { title: "Next.js 2026" };

  // ✅ Presentationalは純粋な関数なので即render可能！
  render(<PostPresentation post={dummyPost} />);

  expect(
    screen.getByRole("heading", { name: "Next.js 2026" })
  ).toBeInTheDocument();
});`}</pre>
          )}

          {testMode === "rtl-container-fail" && (
            <pre className="text-rose-400">{`// container-fail.test.tsx
test("Containerを直接renderしようとする", async () => {
  // ❌ RTLは非同期Server Componentに対応していません
  await render(<PostContainer postId="1" />);
  // -> Error: Objects are not valid as a React child
  // (found: [object Promise]). An asynchronous
  // Server Component cannot be rendered by RTL.
});`}</pre>
          )}

          {testMode === "fn-container" && (
            <pre className="text-blue-400">{`// container.test.tsx
test("Containerが正しいデータを取得して返す", async () => {
  // ✅ JSXレンダリングせず、単なる非同期関数として実行！
  const { type, props } = await PostContainer({
    postId: "1"
  });

  expect(type).toBe(PostPresentation);
  expect(props.post.title).toContain("Container");
});`}</pre>
          )}
        </div>

        {/* 右: 実行ログと考察 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                テストランナー出力
              </span>
              {isRunning ? (
                <span className="text-xs text-blue-500 animate-pulse">実行中...</span>
              ) : testResult === "passed" ? (
                <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 mr-1" /> PASS (1 passed, 0 failed)
                </span>
              ) : (
                <span className="inline-flex items-center text-xs font-bold text-rose-500">
                  <XCircle className="w-4 h-4 mr-1" /> FAIL (1 failed, 0 passed)
                </span>
              )}
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 font-mono text-xs">
              {testMode === "rtl-presentational" && (
                <p className="text-emerald-700 dark:text-emerald-300">
                  ✓ 記事タイトルが表示される (8ms)<br />
                  <span className="text-[11px] text-zinc-500 font-sans">
                    → DOM検証・Storybookとの統合が従来通り完璧に動作します。
                  </span>
                </p>
              )}

              {testMode === "rtl-container-fail" && (
                <div className="text-rose-600 dark:text-rose-400 space-y-1">
                  <p>✕ Containerを直接renderしようとする</p>
                  <p className="text-[10px] text-rose-800 dark:text-rose-300">
                    Error: Async Server Component not supported in render().
                  </p>
                </div>
              )}

              {testMode === "fn-container" && (
                <p className="text-blue-700 dark:text-blue-300">
                  ✓ Containerが正しいデータを取得して返す (52ms)<br />
                  <span className="text-[11px] text-zinc-500 font-sans">
                    → DOM描画を伴わずに、非同期関数としての戻り値（typeとprops）を検証。
                  </span>
                </p>
              )}
            </div>
          </div>

          <p className="text-[11px] text-zinc-500 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            💡 <strong>結論:</strong> データ取得（Container）と見た目（Presentational）を分離することで、RSC時代でもテスト自動化の恩恵をフルに享受できます。
          </p>
        </div>
      </div>
    </div>
  );
}

import { Server, ShieldCheck, Database, Clock } from "lucide-react";
import { sleep } from "@/lib/mock-data";

export async function ServerUserInfo() {
  // サーバーサイドでのフェッチ処理を模擬
  await sleep(40);

  const serverTime = new Date().toLocaleTimeString();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <Server className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
            &lt;ServerUserInfo&gt; (Server Component)
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          サーバーサイド生成
        </span>
      </div>

      <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
            W
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                Wasub Dev
              </span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-zinc-500">
              wasub@workshop-2026.internal
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
          <span className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-zinc-400" />
            DB権限: Read / Write
          </span>
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            SSR生成: {serverTime}
          </span>
        </div>
      </div>

      <p className="text-[10px] text-zinc-500 leading-relaxed">
        ※ このコンポーネントは <strong>Server Bundle 内の純粋な Server Component</strong> です。
        Client Component (&lt;SideMenuClient&gt;) の中に直接 import されてはいませんが、
        Composition パターンによって <code>children</code> 経由で安全に埋め込まれています！
      </p>
    </div>
  );
}

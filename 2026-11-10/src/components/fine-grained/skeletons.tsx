export function AISummarySkeleton() {
  return (
    <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-5 dark:border-amber-900/40 dark:bg-amber-950/20 animate-pulse">
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-5 h-5 rounded-md bg-amber-300 dark:bg-amber-800" />
        <div className="h-4 w-32 bg-amber-300/80 dark:bg-amber-800/80 rounded" />
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-300">
          Streaming (800ms)
        </span>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-amber-200/60 dark:bg-amber-900/40 rounded w-full" />
        <div className="h-3 bg-amber-200/60 dark:bg-amber-900/40 rounded w-5/6" />
        <div className="h-3 bg-amber-200/60 dark:bg-amber-900/40 rounded w-4/6" />
      </div>
      <div className="mt-4 pt-3 border-t border-amber-200/60 dark:border-amber-900/40 flex gap-2">
        <div className="h-6 w-20 bg-amber-200/60 dark:bg-amber-900/40 rounded-full" />
        <div className="h-6 w-24 bg-amber-200/60 dark:bg-amber-900/40 rounded-full" />
      </div>
    </div>
  );
}

export function CommentsSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-5 dark:border-zinc-800 dark:bg-zinc-900/40 animate-pulse">
      <div className="h-5 w-28 bg-zinc-300 dark:bg-zinc-700 rounded mb-4" />
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200/60 dark:border-zinc-800">
            <div className="flex justify-between mb-2">
              <div className="h-3 w-20 bg-zinc-300 dark:bg-zinc-700 rounded" />
              <div className="h-3 w-12 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>
            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AuthorSkeleton() {
  return (
    <div className="flex items-center space-x-3 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
      <div className="space-y-1.5">
        <div className="h-3.5 w-24 bg-zinc-300 dark:bg-zinc-700 rounded" />
        <div className="h-2.5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
      </div>
    </div>
  );
}

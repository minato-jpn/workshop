export interface PostData {
  id: string;
  title: string;
  author: string;
  publishedAt: string;
  tags: string[];
  excerpt: string;
}

// Presentational Component: データを受け取って純粋に表示するだけ（Shared / Client）
// RTLやStorybookで100%容易にテスト可能！
export function PostPresentation({ post }: { post: PostData }) {
  return (
    <article className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
            >
              #{tag}
            </span>
          ))}
        </div>
        <span className="text-[11px] font-mono text-zinc-400">
          {post.publishedAt}
        </span>
      </div>

      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
        {post.title}
      </h3>

      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
        {post.excerpt}
      </p>

      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs">
        <span className="text-zinc-500 font-medium">投稿者: {post.author}</span>
        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
          PostPresentation (Pure Presentational)
        </span>
      </div>
    </article>
  );
}

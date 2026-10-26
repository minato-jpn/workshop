import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  // 比較対象の App Router 版(my-app, http://localhost:3000)のパス
  appRouterPath: string;
  children: ReactNode;
};

// 比較ページの冒頭に出す「何を確かめるか」の説明
export const Note = ({ title, appRouterPath, children }: Props) => {
  return (
    <aside style={{ padding: 16, marginBottom: 24, background: "#eef4ff", borderRadius: 8 }}>
      <p>
        <Link href="/compare">← 比較一覧</Link> / App Router 版:{" "}
        <a href={`http://localhost:3000${appRouterPath}`}>{appRouterPath}</a>
      </p>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>{title}</h1>
      {children}
    </aside>
  );
};

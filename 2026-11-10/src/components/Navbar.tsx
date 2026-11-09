"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Layers,
  Zap,
  SplitSquareVertical,
  BookOpen,
  Calendar,
  ExternalLink,
  Cpu,
  Database,
  Boxes,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "総合", icon: Cpu },
    { href: "/data-fetching", label: "第1部: データフェッチ", icon: Database },
    { href: "/component-design", label: "第2部: コンポーネント設計", icon: Boxes },
    { href: "/comparison", label: "対決デモ", icon: SplitSquareVertical },
    { href: "/guide", label: "原本解説", icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-200 dark:bg-zinc-950/90 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <span className="font-bold text-xs tracking-wider">NEXT</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Next.jsの考え方
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">
                    2026-11-10
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500">
                  第1部 & 第2部 体系的ワークショップ
                </p>
              </div>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-2">
            <a
              href="https://zenn.dev/akfm/books/nextjs-basic-principle"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
            >
              <span>Zenn原本</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

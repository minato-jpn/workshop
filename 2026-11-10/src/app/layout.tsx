import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "細粒度のREST API設計 | Next.jsの考え方 Ch.08 (2026-11-10)",
  description:
    "Next.js App Router (RSC) とバックエンドの細粒度REST API設計の親和性・Chatty API vs God APIのトレードオフを体感するワークショップアプリケーション",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50/50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <Navbar />
        <main className="flex-1 pb-16">{children}</main>
        <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-500">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              Next.jsの考え方 Chapter 08 ワークショップ教材 (2026-11-10)
            </span>
            <span>
              Based on{" "}
              <a
                href="https://zenn.dev/akfm/books/nextjs-basic-principle/viewer/part_1_fine_grained_api_design"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                akfm_sato 著「Next.jsの考え方」
              </a>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}

# Next.jsの考え方 体系的ハンズオン・ワークショップ (2026-11-10)

> **対象書籍**: [Next.jsの考え方 (akfm_sato 著)](https://zenn.dev/akfm/books/nextjs-basic-principle)  
> **開催日**: 2026年11月10日  
> **構成**: 第1部「データフェッチ」 & 第2部「コンポーネント設計」

---

## 🗺️ アーキテクチャと親パスマップ

関連分野を **`/data-fetching` (第1部)** と **`/component-design` (第2部)** という親パスにグルーピングし、各チャプターの核心概念を動くコードとシミュレータで実装しています。

```text
/                                               # 総合ダッシュボード
│
├── /data-fetching                              # 📦 第1部: データフェッチ
│   ├── /fine-grained-api                       #   └ Ch.08: 細粒度のREST API設計 (粗粒度 vs 細粒度)
│   └── /user-actions                           #   └ Ch.09: ユーザー操作とデータフェッチ (useActionState)
│
└── /component-design                           # 🧩 第2部: コンポーネント設計
    ├── /bundle-boundary                        #   ├ Ch.11: クライアントとサーバーのバンドル境界
    ├── /client-usecases                        #   ├ Ch.12: Client Componentsのユースケース (RSC Payload削減)
    ├── /composition                            #   ├ Ch.13: Compositionパターン (children合成)
    └── /container-presentational               #   └ Ch.15: Container/Presentationalパターン (テスト容易性)
```

---

## 📖 実装チャプターと見どころ

### 【第1部: データフェッチ】
| チャプター | パス | 実装内容・見どころ |
|---|---|---|
| **Ch.08 細粒度のREST API設計** | [`/data-fetching/fine-grained-api`](file:///home/wasub/dev/workshop/2026-11-10/src/app/data-fetching/fine-grained-api/page.tsx) <br />([`/comparison`](file:///home/wasub/dev/workshop/2026-11-10/src/app/comparison/page.tsx)) | **粗粒度 God API vs 細粒度 Fine-grained 対決**<br />最遅処理（800ms）による全画面ブロックと、細粒度＋Suspenseによる70ms先行ストリーミングの速度差をリアルタイムに体験。 |
| **Ch.09 ユーザー操作とデータフェッチ** | [`/data-fetching/user-actions`](file:///home/wasub/dev/workshop/2026-11-10/src/app/data-fetching/user-actions/page.tsx) | **Server Functions × useActionState() によるインクリメンタル検索**<br />`router.refresh()` でページ全体を再レンダリングせず、サーバー関数とStateで検索結果リストのみを部分再フェッチ・再描画。 |

### 【第2部: コンポーネント設計】
| チャプター | パス | 実装内容・見どころ |
|---|---|---|
| **Ch.11 クライアントとサーバーのバンドル境界** | [`/component-design/bundle-boundary`](file:///home/wasub/dev/workshop/2026-11-10/src/app/component-design/bundle-boundary/page.tsx) | **「2つの世界、2つのドア」ビジュアライザー**<br />`"use client"` と `"use server"` は実行環境ではなく境界（ドア）の宣言。`server-only` による機密モジュールのビルド時漏洩防止を実演。 |
| **Ch.12 Client Componentsのユースケース** | [`/component-design/client-usecases`](file:///home/wasub/dev/workshop/2026-11-10/src/app/component-design/client-usecases/page.tsx) | **RSC Payload 転送量削減ベンチマーク**<br />巨大なTailwindクラス属性や入れ子DOMをClient Componentに分離することで、毎リクエストのRSC Payloadを約93%削減（4.8KB → 0.34KB）する手法をメーターで可視化。 |
| **Ch.13 Compositionパターン** | [`/component-design/composition`](file:///home/wasub/dev/workshop/2026-11-10/src/app/component-design/composition/page.tsx) | **children props による Server / Client の安全な合成**<br />開閉State（`useState`）を持つ `<SideMenuClient>` の内部に、DBから非同期フェッチした `<ServerUserInfo>` を安全に埋め込む実践。 |
| **Ch.15 Container/Presentationalパターン** | [`/component-design/container-presentational`](file:///home/wasub/dev/workshop/2026-11-10/src/app/component-design/container-presentational/page.tsx) | **RSCのテスト容易性（Testing）向上シミュレータ**<br />データフェッチ（Container）と描画（Presentational）を分離。RTL未対応な非同期Server ComponentでもStorybookや単体テストを動かすディレクトリコロケーション。 |

---

## 🚀 起動方法

```bash
cd /home/wasub/dev/workshop/2026-11-10
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

---

## 🛠️ 技術スタック

- **Next.js 16.4.5 (Turbopack / App Router)**
- **React 19.3.0 (Server Components / useActionState / Suspense / Streaming)**
- **Tailwind CSS v4**
- **TypeScript 5**
- **Lucide React**

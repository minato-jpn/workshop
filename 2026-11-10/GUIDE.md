# Next.jsの考え方 ワークショップ ハンズオン手順書 (2026-11-10)

本ドキュメントは、2026年11月10日の勉強会用ガイドです。
『Next.jsの考え方』第1部「データフェッチ」および第2部「コンポーネント設計」の各章について、動かしながら確認する手順をまとめています。

---

## 1. 起動方法

```bash
cd /home/wasub/dev/workshop/2026-11-10
npm run dev
```

起動したら、ブラウザで `http://localhost:3000` を開きます。

---

## 2. 親パスごとの確認手順と見どころ

### 📦 第1部: データフェッチ (`/data-fetching`)

#### ① Ch.08 細粒度のREST API設計
- **URL**: `http://localhost:3000/comparison`
- **見どころ**:
  - 「同時にリクエスト開始！」ボタンを押してください。
  - 左側（粗粒度 God API）は 1000ms 経過するまで画面が真っ白のままです。
  - 右側（細粒度 REST API）はわずか **70ms で記事本文が表示**され、重いAI要約（880ms）だけが後からストリーミングされます。
  - 下部のサーバー通信ガントチャートで、並行フェッチとブロッキングの差を確認できます。

#### ② Ch.09 ユーザー操作とデータフェッチ
- **URL**: `http://localhost:3000/data-fetching/user-actions`
- **見どころ**:
  - 検索欄に「キーボード」や「Next.js」と入力して「検索実行」を押すか、カテゴリボタン（「Hardware」等）を押してください。
  - `router.refresh()` と違い、**ページ全体の再レンダリングやURL遷移を起こさず**、`useActionState()` と Server Function（`actions.ts`）によって商品一覧部分だけがサーバー再フェッチ・再描画される様子を確認できます。

---

### 🧩 第2部: コンポーネント設計 (`/component-design`)

#### ③ Ch.11 クライアントとサーバーのバンドル境界
- **URL**: `http://localhost:3000/component-design/bundle-boundary`
- **見どころ**:
  - 「2つの世界、2つのドア」ビジュアライザーで、`"use client"` と `"use server"` のドアをクリックして切り替えてみてください。
  - どちらも「実行環境」ではなく「境界（Boundary）」を宣言していることが視覚的に理解できます。
  - 「誤ってimportした場合の挙動を見る」ボタンで、`server-only` がどのように機密情報のクライアント漏洩をビルド時に防ぐかを確認できます。

#### ④ Ch.12 Client Components のユースケース
- **URL**: `http://localhost:3000/component-design/client-usecases`
- **見どころ**:
  - 「RSC Payload 転送量削減シミュレータ」のタブを切り替えてください。
  - パターンA（巨大なTailwindクラスを含むReactElementをServer Componentで出力した場合: 4.8 KB）と、パターンB（データのみServerで取得し描画をClient Componentに分離した場合: 0.34 KB）のペイロードサイズ差（約93%削減）を確認できます。

#### ⑤ Ch.13 Composition パターン
- **URL**: `http://localhost:3000/component-design/composition`
- **見どころ**:
  - 実際に動くメニューの「折りたたむ / 展開する」ボタンを押してください。
  - `<SideMenuClient>`（Client Component: `useState` で開閉）の内側に、サーバー側で生成された最新の `<ServerUserInfo>`（Server Component: DB権限や生成時刻）が `children` 経由でエラーなく安全に共存・レンダリングされることを確認できます。

#### ⑥ Ch.15 Container/Presentational パターン
- **URL**: `http://localhost:3000/component-design/container-presentational`
- **見どころ**:
  - 「テスト容易性シミュレータ」の3つのボタン（① RTL Presentational, ② RTL Container直接失敗, ③ Container関数テスト）を押してください。
  - なぜ非同期Server Componentを分離するべきなのか、StorybookやRTLで壊れないテストをどう書くのかを体験できます。
  - `_containers` ディレクトリによる Private Folder コロケーションの構造も確認できます。

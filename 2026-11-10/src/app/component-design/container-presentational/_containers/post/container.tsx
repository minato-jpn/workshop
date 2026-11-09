import { PostPresentation, PostData } from "./presentational";
import { sleep } from "@/lib/mock-data";

async function getPostData(postId: string): Promise<PostData> {
  await sleep(50);
  return {
    id: postId,
    title: "Container/Presentationalパターンの再来とRSCのテスト容易性",
    author: "Quramy & akfm_sato",
    publishedAt: "2026-11-10",
    tags: ["Testing", "Architecture", "RSC"],
    excerpt:
      "RSC時代において、Containerはサーバーデータフェッチのみを担い、Presentationalは純粋なUIのみを担う。この責務分離により、RTL未対応なServer Componentsでも堅牢な自動テスト環境を構築できる。",
  };
}

// Container Component: データフェッチ（サーバーサイド処理）のみを担う非同期Server Component
export async function PostContainer({ postId }: { postId: string }) {
  const post = await getPostData(postId);
  return <PostPresentation post={post} />;
}

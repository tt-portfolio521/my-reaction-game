import { posts } from "../posts";
import Link from "next/link";
import { Metadata } from 'next';

// ★変更点1：paramsを Promise（待機するもの）として定義
type Props = {
  params: Promise<{ slug: string }>;
};

// メタデータ生成部分も修正
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // ★変更点2：awaitで中身を取り出す
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: '記事が見つかりません' };
  
  return {
    title: post.title,
    description: `${post.category}に関する解説記事です。`,
  };
}

// 記事ページ本体
export default async function BlogPost({ params }: Props) {
  const { slug } = await params; // ★変更点3：ここでもawaitする

  const post = posts.find((p) => p.slug === slug);

  // 記事がない場合の表示
  if (!post) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">記事が見つかりません😭</h1>
        <p>探しているID: {slug}</p>
        <p className="mt-4">
          <Link href="/blog" className="text-blue-500 underline">一覧に戻る</Link>
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-800">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* ヘッダー */}
        <div className="bg-slate-900 text-white p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] text-9xl opacity-10 select-none">
            {post.emoji}
          </div>
          <div className="relative z-10">
            <span className="inline-block bg-blue-600 text-xs font-bold px-2 py-1 rounded mb-4">
              {post.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold leading-relaxed mb-4">
              {post.title}
            </h1>
            <time className="text-slate-400 text-sm font-mono">
              {post.date}
            </time>
          </div>
        </div>

        {/* 本文 */}
        <div className="p-8 md:p-12 leading-8 text-slate-700">
          <div 
            dangerouslySetInnerHTML={{ __html: post.content }} 
            className="space-y-6"
          />
        </div>

        {/* フッター */}
        <div className="p-8 border-t bg-slate-50 text-center">
            <Link href="/blog" className="inline-block bg-white border border-slate-300 px-6 py-3 rounded-full text-sm font-bold hover:bg-slate-100 transition">
              ← 記事一覧に戻る
            </Link>
        </div>

      </div>
    </main>
  );
}
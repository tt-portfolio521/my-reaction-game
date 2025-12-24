import { posts } from "../posts"; // 先ほどのデータファイルを読み込み
import Link from "next/link";
import { notFound } from "next/navigation";

import { Metadata } from 'next';

// URLのパラメータを受け取る型定義
type Props = {
  params: { slug: string };
};

// メタデータ（タイトルなど）を動的に生成
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return { title: '記事が見つかりません' };
  
  return {
    title: post.title,
    description: `${post.category}に関する解説記事です。`,
  };
}

// 記事ページ本体
export default function BlogPost({ params }: Props) {
  // URLの slug と一致する記事を探す
  const post = posts.find((p) => p.slug === params.slug);

  // 記事がなければ 404 ページへ
  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-800">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* 記事ヘッダー */}
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

        {/* 記事本文 */}
        <div className="p-8 md:p-12 leading-8 text-slate-700">
          {/* HTML文字列を安全に表示するためのReactの機能 */}
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
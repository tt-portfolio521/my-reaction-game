import { posts } from "../posts";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from 'next';
// 作成した部品を読み込む
// ドット3つでフォルダを遡って components を見に行く書き方
import MathRenderer from "../../../components/MathRenderer";

type Props = {
  params: Promise<{ slug: string }>;
};

// メタデータ生成（サーバー側で実行される）
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: '記事が見つかりません' };
  
  return {
    title: post.title,
    description: `${post.category}に関する解説記事です。`,
  };
}

// 記事ページ本体
export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

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

        {/* 記事本文（MathRendererを使って表示） */}
        <div className="p-8 md:p-12 leading-8 text-slate-700">
          <MathRenderer content={post.content} />
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
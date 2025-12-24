import Link from "next/link";
import { Metadata } from 'next';
import { posts } from "./posts"; // ★変更点：別ファイルからデータを読み込む

export const metadata: Metadata = {
  title: 'Tech Lab | 技術・知識の解説',
  description: 'ツールの裏側にある計算ロジックや、Next.js開発の技術的な知見を共有するブログです。',
};

export default function BlogIndex() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto">
        
        {/* ヘッダー */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Tech Lab 🧪</h1>
          <p className="text-slate-500">
            計算の裏側にある「ロジック」と「技術」を紐解く
          </p>
        </header>

        {/* 記事リスト */}
        <div className="grid gap-6">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="group">
              <article className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex items-center gap-6">
                <div className="text-4xl bg-slate-50 p-4 rounded-xl group-hover:bg-blue-50 transition-colors">
                  {post.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2 text-xs font-bold text-slate-400 uppercase">
                    <span className="bg-slate-100 px-2 py-1 rounded text-slate-500">{post.category}</span>
                    <span>{post.date}</span>
                  </div>
                  <h2 className="text-xl font-bold group-hover:text-blue-600 transition-colors leading-relaxed">
                    {post.title}
                  </h2>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-slate-400 hover:text-slate-600 font-bold text-sm">
            ← ツール一覧に戻る
          </Link>
        </div>

      </div>
    </main>
  );
}
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* 左側：ロゴ（クリックでトップへ） */}
        <Link href="/" className="font-extrabold text-xl text-slate-800 tracking-tight hover:text-blue-600 transition flex items-center gap-2">
          <span>📦</span>
          <span>My Tools Box</span>
        </Link>

        {/* 右側：メニューリンク */}
        <div className="flex items-center gap-6 text-sm font-bold text-slate-600">
          <Link href="/" className="hover:text-blue-600 transition hidden md:block">
            ホーム
          </Link>
          
          {/* ツール一覧への簡易リンク（ハッシュリンク） */}
          {/* ※ページ内リンクはトップページにいる時のみ有効ですが、一旦配置します */}
          
          <Link href="/blog" className="flex items-center gap-1 hover:text-blue-600 transition bg-slate-100 px-3 py-2 rounded-full">
            <span>🧪</span>
            <span>Tech Lab</span>
          </Link>
        </div>

      </div>
    </nav>
  );
}
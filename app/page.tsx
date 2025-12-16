import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-8 text-gray-800">
      
      {/* サイトヘッダー */}
      <header className="mb-12 text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 text-slate-800">My Tools Box</h1>
        <p className="text-gray-600 leading-relaxed">
          生活や学習に役立つ計算ツール・シミュレーターを集めたサイトです。<br/>
          人間工学に基づく測定から、お金の計算まで、<br/>
          データと数値を可視化してサポートします。
        </p>
      </header>

      {/* ツール一覧グリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        
        {/* ツール1：反射神経ゲーム */}
        <Link href="/reaction" className="group">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 h-full border border-transparent hover:border-blue-500 flex flex-col">
            <div className="text-4xl mb-4">⚡</div>
            <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600">反射神経テスト</h2>
            <p className="text-gray-500 text-sm mb-4 flex-grow">
              あなたの反応速度をミリ秒単位で正確に計測。平均値・標準偏差でコンディション分析。
            </p>
            <span className="text-blue-500 font-bold text-sm text-right">計測する →</span>
          </div>
        </Link>

        {/* ツール2：資産運用シミュレーター */}
        <Link href="/investment" className="group">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 h-full border border-transparent hover:border-green-500 flex flex-col">
            <div className="text-4xl mb-4">📈</div>
            <h2 className="text-xl font-bold mb-2 group-hover:text-green-600">資産運用シミュレーター</h2>
            <p className="text-gray-500 text-sm mb-4 flex-grow">
              積立投資の複利効果をグラフで可視化。毎月の積立額と年利で将来の資産を計算。
            </p>
            <span className="text-green-600 font-bold text-sm text-right">計算する →</span>
          </div>
        </Link>

        {/* ツール3：ローン返済シミュレーター（★追加！） */}
        <Link href="/loan" className="group">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 h-full border border-transparent hover:border-indigo-500 flex flex-col">
            <div className="text-4xl mb-4">🏠</div>
            <h2 className="text-xl font-bold mb-2 group-hover:text-indigo-600">ローン返済計算機</h2>
            <p className="text-gray-500 text-sm mb-4 flex-grow">
              住宅ローンやカーローンの返済額を計算。元金と利息の割合の推移をグラフ表示。
            </p>
            <span className="text-indigo-600 font-bold text-sm text-right">計算する →</span>
          </div>
        </Link>

      </div>

      <footer className="mt-16 text-gray-400 text-sm flex flex-wrap justify-center gap-4">
        <Link href="/about" className="hover:underline hover:text-gray-600 transition">運営者情報</Link>
        <span className="hidden md:inline">|</span>
        <Link href="/privacy" className="hover:underline hover:text-gray-600 transition">プライバシーポリシー</Link>
        <span className="hidden md:inline">|</span>
        <span>&copy; 2025 My Tools Box</span>
      </footer>
    </main>
  );
}
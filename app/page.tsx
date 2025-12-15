import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-8 text-gray-800">
      
      <header className="mb-12 text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 text-slate-800">My Tools Box</h1>
        <p className="text-gray-600 leading-relaxed">
          生活や学習に役立つ計算ツール・シミュレーターを集めたサイトです。<br/>
          人間工学に基づく測定から、資産形成のシミュレーションまで、<br/>
          データと数値を可視化してサポートします。
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        
        {/* 反射神経ゲームへのリンク */}
        <Link href="/reaction" className="group">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 h-full border border-transparent hover:border-blue-500">
            <div className="text-4xl mb-4">⚡</div>
            <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-600">反射神経テスト</h2>
            <p className="text-gray-500 text-sm mb-4">
              あなたの反応速度（Reaction Time）をミリ秒単位で正確に計測します。
            </p>
            <span className="text-blue-500 font-bold text-sm">計測する →</span>
          </div>
        </Link>

        {/* 投資シミュレーターへのリンク */}
        <Link href="/investment" className="group">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 h-full border border-transparent hover:border-green-500">
            <div className="text-4xl mb-4">📈</div>
            <h2 className="text-2xl font-bold mb-2 group-hover:text-green-600">資産運用シミュレーター</h2>
            <p className="text-gray-500 text-sm mb-4">
              積立投資の複利効果をグラフで可視化。将来の資産推移を計算します。
            </p>
            <span className="text-green-600 font-bold text-sm">計算する →</span>
          </div>
        </Link>

      </div>

      <footer className="mt-16 text-gray-400 text-sm">
        <Link href="/privacy" className="hover:underline">プライバシーポリシー</Link>
        <span className="mx-4">|</span>
        &copy; 2025 My Tools Box
      </footer>
    </main>
  );
}
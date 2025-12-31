import Link from "next/link";
import { Metadata } from 'next';
// Zapアイコンを追加でインポート
import { Zap } from "lucide-react";

// トップページ用のSEO設定
export const metadata: Metadata = {
  title: 'My Tools Box | 便利ツール・シミュレーター集',
  description: '生活や学習に役立つ計算ツール・シミュレーター集。資産運用、ローン返済、減価償却、反射神経テストなど、データを可視化するツールを無料で公開しています。',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center p-8 text-slate-800 font-sans">
      
      {/* サイトヘッダー */}
      <header className="mb-12 text-center max-w-2xl mt-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight">My Tools Box</h1>
        <p className="text-slate-600 leading-relaxed text-lg">
          学習や生活に役立つ計算ツール・シミュレーター集。<br/>
          「数値」と「グラフ」で、あなたの意思決定をサポートします。
        </p>
      </header>

      {/* ツール一覧エリア */}
      <div className="max-w-6xl w-full space-y-16">

        {/* カテゴリ1：お金・会計・ビジネス */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800 border-b border-slate-200 pb-2">
            <span className="text-3xl">💰</span> お金・会計・ビジネス
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 資産運用シミュレーター */}
            <Link href="/investment" className="group">
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 h-full border border-slate-100 hover:border-blue-500 flex flex-col">
                <div className="text-4xl mb-4 bg-blue-50 w-fit p-3 rounded-xl">📈</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600">資産運用シミュレーター</h3>
                <p className="text-slate-500 text-sm mb-4 flex-grow">
                  積立投資の複利効果をグラフで可視化。S&P500やオルカンを想定した長期シミュレーションに。
                </p>
                <span className="text-blue-600 font-bold text-sm text-right">計算する →</span>
              </div>
            </Link>

            {/* ローン返済シミュレーター */}
            <Link href="/loan" className="group">
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 h-full border border-slate-100 hover:border-indigo-500 flex flex-col">
                <div className="text-4xl mb-4 bg-indigo-50 w-fit p-3 rounded-xl">🏠</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600">ローン返済計算機</h3>
                <p className="text-slate-500 text-sm mb-4 flex-grow">
                  住宅・カーローンの返済額を計算。「元金」と「利息」の割合推移をグラフで見える化。
                </p>
                <span className="text-indigo-600 font-bold text-sm text-right">計算する →</span>
              </div>
            </Link>

            {/* 減価償却シミュレーター */}
            <Link href="/depreciation" className="group">
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 h-full border border-slate-100 hover:border-emerald-500 flex flex-col">
                <div className="text-4xl mb-4 bg-emerald-50 w-fit p-3 rounded-xl">📉</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-600">減価償却計算機</h3>
                <p className="text-slate-500 text-sm mb-4 flex-grow">
                  定額法・定率法の違いを比較。簿記学習や経理実務に役立つ資産価値シミュレーション。
                </p>
                <span className="text-emerald-600 font-bold text-sm text-right">計算する →</span>
              </div>
            </Link>

            {/* 損益分岐点(CVP)分析 */}
            <Link href="/cvp" className="group">
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 h-full border border-slate-100 hover:border-rose-500 flex flex-col">
                <div className="text-4xl mb-4 bg-rose-50 w-fit p-3 rounded-xl">📊</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-rose-600">損益分岐点(CVP)分析</h3>
                <p className="text-slate-500 text-sm mb-4 flex-grow">
                  いくら売れば黒字になる？固定費・変動費から利益が出る分岐点をグラフで特定。
                </p>
                <span className="text-rose-600 font-bold text-sm text-right">計算する →</span>
              </div>
            </Link>

          </div>
        </section>

        {/* カテゴリ2：能力・測定・その他 */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800 border-b border-slate-200 pb-2">
            <span className="text-3xl">⚡</span> 能力・測定・その他
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 反射神経テスト */}
            <Link href="/reaction" className="group">
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 h-full border border-slate-100 hover:border-amber-500 flex flex-col">
                <div className="text-4xl mb-4 bg-amber-50 w-fit p-3 rounded-xl">⚡</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-amber-600">反射神経テスト</h3>
                <p className="text-slate-500 text-sm mb-4 flex-grow">
                  あなたの反応速度を精密測定。平均値・標準偏差・偏差値ランクでパフォーマンスを分析。
                </p>
                <span className="text-amber-600 font-bold text-sm text-right">計測する →</span>
              </div>
            </Link>

            {/* 関節トルク・シミュレーター */}
            <Link href="/torque" className="group">
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 h-full border border-slate-100 hover:border-purple-500 flex flex-col">
                <div className="text-4xl mb-4 bg-purple-50 w-fit p-3 rounded-xl">💪</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600">関節トルク計算機</h3>
                <p className="text-slate-500 text-sm mb-4 flex-grow">
                  角度による発揮力の変化をバイオメカニクスの視点で見える化します。
                </p>
                <span className="text-purple-600 font-bold text-sm text-right">計算する →</span>
              </div>
            </Link>

            {/* 筋肉収縮・可動域シミュレーター */}
            <Link href="/excursion" className="group">
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 h-full border border-slate-100 hover:border-cyan-500 flex flex-col">
                <div className="text-4xl mb-4 bg-cyan-50 w-fit p-3 rounded-xl">⚙️</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-600">筋肉収縮シミュレーター</h3>
                <p className="text-slate-500 text-sm mb-4 flex-grow">
                   筋肉の付着位置による「パワー型」と「スピード型」の違いを数学的に体感します。
                </p>
                <span className="text-cyan-600 font-bold text-sm text-right">計算する →</span>
              </div>
            </Link>

            {/* 膝蓋腱反射（伸張反射）シミュレーター */}
            <Link href="/reflex" className="group">
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 h-full border border-slate-100 hover:border-red-500 flex flex-col">
                <div className="text-4xl mb-4 bg-red-50 w-fit p-3 rounded-xl">🦵</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-red-600">膝蓋腱反射シミュレーター</h3>
                <p className="text-slate-500 text-sm mb-4 flex-grow">
                  打撃が神経信号に変わり、筋肉を収縮させる「反射弓」のプロセスを完全可視化。
                </p>
                <span className="text-red-600 font-bold text-sm text-right">体験する →</span>
              </div>
            </Link>

            {/* 脳トレ：シンボル・デコード (今回追加分) */}
            <Link href="/simbol" className="group">
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 h-full border border-slate-100 hover:border-blue-500 flex flex-col">
                <div className="text-4xl mb-4 bg-blue-50 w-fit p-3 rounded-xl text-blue-600">
                  <Zap size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600">脳トレ：シンボル・デコード</h3>
                <p className="text-slate-500 text-sm mb-4 flex-grow">
                  記号と数字を素早く照合して脳の処理速度を鍛えるゲーム。60秒で何問解けるか挑戦！
                </p>
                <span className="text-blue-600 font-bold text-sm text-right">挑戦する →</span>
              </div>
            </Link>

          </div>
        </section>

      </div>

      {/* Tech Lab バナー */}
      <div className="mt-24 w-full max-w-4xl px-4">
        <div className="bg-slate-900 text-white p-10 rounded-3xl shadow-xl relative overflow-hidden group text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4 flex justify-center items-center gap-2">
              Tech Lab <span className="text-2xl">🧪</span>
            </h2>
            <p className="text-slate-300 mb-8 max-w-lg mx-auto leading-relaxed">
              ツールの裏側にある「計算ロジック」や、Next.jsを用いた「開発技術」を解説するブログエリアを開設しました。
            </p>
            <Link 
              href="/blog" 
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full transition-all transform group-hover:scale-105 shadow-lg hover:shadow-blue-500/50"
            >
              記事一覧を見る →
            </Link>
          </div>
        </div>
      </div>

      <footer className="mt-20 text-slate-400 text-sm flex flex-wrap justify-center gap-6 pb-8">
        <Link href="/about" className="hover:text-slate-600 transition">運営者情報</Link>
        <span className="hidden md:inline text-slate-300">|</span>
        <Link href="/privacy" className="hover:text-slate-600 transition">プライバシーポリシー</Link>
        <span className="hidden md:inline text-slate-300">|</span>
        <span>&copy; 2025 My Tools Box</span>
      </footer>
    </main>
  );
}
import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* ヘッダー画像・タイトルエリア */}
        <div className="bg-slate-800 p-8 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">当サイトについて</h1>
          <p className="opacity-80 text-sm">About My Tools Box</p>
        </div>

        <div className="p-8 space-y-10">
          
          {/* サイトのコンセプト */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">
              🛠️ コンセプト
            </h2>
            <p className="text-slate-600 leading-relaxed">
              「My Tools Box」は、日常生活や学習における「数字」や「データ」を、より分かりやすく可視化するためのツールサイトです。<br/><br/>
              直感に頼りがちな「感覚」を数値化したり、複雑な「計算」をグラフ化したりすることで、納得感のある意思決定や効率的な学習をサポートすることを目指しています。
            </p>
          </section>

          {/* 運営者プロフィール */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">
              👨‍💻 運営者プロフィール
            </h2>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* アイコン代わりの文字 */}
              <div className="shrink-0 w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-3xl">
                🎓
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">管理人の専攻・バックグラウンド</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  現在、大学にて<strong>人間工学</strong>および<strong>運動制御（Motor Control）</strong>を専攻しています。<br/>
                  生体信号処理や統計解析の研究を行う傍ら、趣味と実益を兼ねてプログラミング（Web開発）と会計・投資理論の学習に取り組んでいます。
                </p>
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <h4 className="font-bold text-sm text-slate-700 mb-2">保有スキル・学習分野</h4>
                  <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                    <li>工学：人間工学 / 統計学 / 信号処理</li>
                    <li>開発：Python (データ分析) / TypeScript / Next.js</li>
                    <li>会計：日商簿記学習中 / 財務分析</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 技術スタック（エンジニアアピール） */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">
              💻 使用技術
            </h2>
            <p className="text-slate-600 text-sm mb-4">
              当サイトは、以下のモダンな技術スタックを用いて開発・運用されています。SPA（Single Page Application）による高速な動作と、インタラクティブなグラフ描画が特徴です。
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">Next.js (App Router)</span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">React</span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">TypeScript</span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">Tailwind CSS</span>
              <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-full">Recharts</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">Vercel</span>
            </div>
          </section>

          {/* 免責事項（重要） */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">
              ⚠️ 免責事項
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              当サイトの計算ツールやシミュレーション結果は、あくまで目安として提供するものです。<br/>
              正確な計算結果を保証するものではありません。特に投資や会計に関する最終的な判断は、ご自身の責任において行っていただくようお願いいたします。<br/>
              当サイトの利用によって生じた損害等について、運営者は一切の責任を負いかねますのでご了承ください。
            </p>
          </section>

        </div>

        <div className="p-6 bg-slate-50 border-t text-center">
          <Link href="/" className="inline-block px-6 py-2 bg-white border border-slate-300 rounded-full text-slate-600 hover:bg-slate-100 transition font-bold text-sm">
            トップページに戻る
          </Link>
        </div>

      </div>
    </main>
  );
}
// app/reflex/page.tsx
import StretchReflexVisualizer from "../../components/StretchReflexVisualizer";
import Navbar from "../../components/Navbar";
import { Metadata } from "next";
import { Activity, Zap, Brain } from "lucide-react";

export const metadata: Metadata = {
  title: "膝蓋腱反射シミュレーター | 伸張反射のメカニズム",
  description: "膝蓋腱反射を例に、筋紡錘から脊髄、そして運動ニューロンに至る伸張反射のプロセスをアニメーションで詳しく解説します。",
};

export default function ReflexPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-700">
      <Navbar />
      
      {/* 1. ヘッダー */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-blue-100">
            Biomechanics & Neuro Control
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
            膝蓋腱反射シミュレーター
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto leading-loose text-lg">
            打撃という「入力」が、いかにして脳を経由せず脊髄レベルで「運動」に変換されるのか。<br className="hidden md:inline"/>
            伸張反射の驚異的なメカニズムを視覚的に理解しましょう。
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        
        {/* 2. ツール本体 */}
        <div className="relative z-10">
           <div className="shadow-xl rounded-3xl overflow-hidden border border-slate-200 bg-white">
             <StretchReflexVisualizer />
           </div>
           <p className="text-center text-sm text-slate-400 mt-4 flex items-center justify-center gap-2">
             <Zap size={14} /> 腱を叩くアイコンをクリックしてシミュレーションを開始
           </p>
        </div>

        {/* 3. 解説セクション：タイムライン形式に変更 */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 inline-flex items-center gap-3 border-b-4 border-blue-200 pb-2">
              <Activity className="text-blue-500" />
              反射弓 (Reflex Arc) の仕組み
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              膝蓋腱反射は最も単純な「単シナプス反射」です。<br/>
              以下の4ステップが、わずか数十ミリ秒の間に自動的に行われます。
            </p>
          </div>

          {/* タイムライン表示エリア */}
          <div className="relative space-y-8 max-w-3xl mx-auto">
            {/* 左側の連結線（PC表示時） */}
            <div className="hidden md:block absolute left-[27px] top-6 bottom-6 w-0.5 bg-slate-200 -z-10"></div>

            {/* Step 1 */}
            <div className="relative flex flex-col md:flex-row gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition-colors z-10">
              <div className="flex items-center justify-center w-14 h-14 bg-blue-100 text-blue-600 font-bold text-xl rounded-full shrink-0 shadow-sm border-4 border-white md:order-first mb-2 md:mb-0">
                1
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center gap-2">
                  受容器（筋紡錘）
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  ハンマーで腱を叩くと、大腿四頭筋が急激に引き伸ばされます。筋肉の中にあるセンサー<strong>「筋紡錘」</strong>が、この長さの変化を感知します。
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col md:flex-row gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition-colors z-10">
              <div className="flex items-center justify-center w-14 h-14 bg-blue-100 text-blue-600 font-bold text-xl rounded-full shrink-0 shadow-sm border-4 border-white md:order-first mb-2 md:mb-0">
                2
              </div>
              <div>
                {/* 修正：$Ia$ を Ia に変更し、数式レンダリングの問題を解消 */}
                <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center gap-2">
                  求心性路（Ia群線維）
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  感知された信号は、感覚神経である<strong>Ia群求心性神経</strong>を通じて、猛スピードで脊髄の後角（背中側）へと送られます。
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col md:flex-row gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-red-400 transition-colors z-10">
              <div className="flex items-center justify-center w-14 h-14 bg-red-100 text-red-600 font-bold text-xl rounded-full shrink-0 shadow-sm border-4 border-white md:order-first mb-2 md:mb-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center gap-2">
                  中枢（脊髄前角）
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  ここがポイントです。信号は<strong>脳へ行かずに</strong>、脊髄内で直接「運動ニューロン」にバトンタッチ（シナプス伝達）されます。
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative flex flex-col md:flex-row gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-red-400 transition-colors z-10">
              <div className="flex items-center justify-center w-14 h-14 bg-red-100 text-red-600 font-bold text-xl rounded-full shrink-0 shadow-sm border-4 border-white md:order-first mb-2 md:mb-0">
                4
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center gap-2">
                  遠心性路（運動神経）
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  運動ニューロンからの指令が大腿四頭筋に戻り、筋肉が収縮して膝が伸びます（キック動作）。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. コラムセクション */}
        <section className="bg-slate-900 text-slate-300 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Brain size={200} />
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-blue-400">●</span> なぜ「反射」が必要なのか？
            </h2>
            <p className="mb-6 leading-loose text-lg">
              伸張反射の最大の目的は、<strong className="text-white border-b border-blue-500">姿勢を維持し、筋肉の断裂を防ぐこと</strong>です。
            </p>
            <p className="leading-loose mb-8 text-sm md:text-base text-slate-400">
              例えば、電車でカクンと膝が折れそうになったとき、無意識に踏ん張れるのはこの反射のおかげです。脳が「危ない！」と認識して指令を出すには時間がかかりすぎるため、脊髄レベルの高速なフィードバックシステムが私たちの体を守っています。
            </p>
          </div>
        </section>

        {/* 関連リンク */}
        <div className="border-t border-slate-200 pt-8 flex justify-between items-center text-sm font-bold text-slate-500">
          <a href="/torque" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
            ← 関節トルク計算機
          </a>
          <a href="/excursion" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
            筋肉収縮シミュレーター →
          </a>
        </div>

      </div>
    </main>
  );
}
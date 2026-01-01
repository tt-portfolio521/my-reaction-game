// app/reflex/page.tsx
import StretchReflexVisualizer from "../../components/StretchReflexVisualizer";
import Navbar from "../../components/Navbar";
import { Metadata } from "next";
import { ArrowRight, Activity, Zap, BrainCircuit } from "lucide-react"; // アイコンを追加（インストール済み前提）

export const metadata: Metadata = {
  title: "膝蓋腱反射シミュレーター | 伸張反射のメカニズム",
  description: "膝蓋腱反射を例に、筋紡錘から脊髄、そして運動ニューロンに至る伸張反射のプロセスをアニメーションで詳しく解説します。",
};

export default function ReflexPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-700">
      <Navbar />
      
      {/* 1. ヘッダーセクション（背景を白にして区切りを明確化） */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 text-center">
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

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        
        {/* 2. ツール本体（少し浮かせて強調） */}
        <div className="relative z-10 -mt-8 md:-mt-0">
           <div className="shadow-xl rounded-3xl overflow-hidden border border-slate-200 bg-white">
             <StretchReflexVisualizer />
           </div>
           <p className="text-center text-sm text-slate-400 mt-4 flex items-center justify-center gap-2">
             <Zap size={14} /> ハンマーアイコンをクリックしてシミュレーションを開始
           </p>
        </div>

        {/* 3. 解説セクション：反射弓のプロセス */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 inline-flex items-center gap-3 border-b-4 border-blue-200 pb-2">
              <Activity className="text-blue-500" />
              反射弓 (Reflex Arc) の仕組み
            </h2>
            <p className="mt-4 text-slate-600">
              膝蓋腱反射は最も単純な「単シナプス反射」です。<br/>
              以下の4ステップが、わずか数十ミリ秒の間に行われます。
            </p>
          </div>

          {/* ステップ表示（カード型リスト） */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* 矢印（PC表示時のみ） */}
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-200 z-0">
               <ArrowRight size={48} />
            </div>

            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative z-10 hover:border-blue-400 transition-colors">
              <div className="flex items-start gap-4">
                <span className="bg-blue-100 text-blue-700 font-bold w-10 h-10 rounded-full flex items-center justify-center shrink-0">1</span>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">受容器（筋紡錘）</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    ハンマーで腱を叩くと、大腿四頭筋が急激に引き伸ばされます。筋肉の中にあるセンサー<strong>「筋紡錘」</strong>がこの長さの変化を感知します。
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative z-10 hover:border-blue-400 transition-colors">
              <div className="flex items-start gap-4">
                <span className="bg-blue-100 text-blue-700 font-bold w-10 h-10 rounded-full flex items-center justify-center shrink-0">2</span>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">求心性路（$Ia$群線維）</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    感知された信号は、感覚神経である<strong>$Ia$群線維</strong>を通じて、猛スピードで脊髄の後角（背中側）へと送られます。
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative z-10 hover:border-red-400 transition-colors">
              <div className="flex items-start gap-4">
                <span className="bg-red-100 text-red-700 font-bold w-10 h-10 rounded-full flex items-center justify-center shrink-0">3</span>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">中枢（脊髄前角）</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    ここがポイントです。信号は<strong>脳へ行かずに</strong>、脊髄内で直接「運動ニューロン」にバトンタッチ（シナプス伝達）されます。
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative z-10 hover:border-red-400 transition-colors">
              <div className="flex items-start gap-4">
                <span className="bg-red-100 text-red-700 font-bold w-10 h-10 rounded-full flex items-center justify-center shrink-0">4</span>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">遠心性路（運動神経）</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    運動ニューロンからの指令が大腿四頭筋に戻り、筋肉が収縮して膝が伸びます（キック動作）。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. コラムセクション（背景色を変えてリズムを作る） */}
        <section className="bg-slate-900 text-slate-300 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <BrainCircuit size={200} />
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-blue-400">●</span> なぜ「反射」が必要なのか？
            </h2>
            <p className="mb-6 leading-loose text-lg">
              伸張反射の最大の目的は、<strong className="text-white border-b border-blue-500">筋肉の長さを一定に保ち、姿勢を維持すること</strong>です。
            </p>
            <p className="leading-loose mb-8 text-sm md:text-base text-slate-400">
              例えば、重い荷物を急に持たされたとき、腕の筋肉は不意に引き伸ばされます。このとき、脳で「重いから力を入れよう」と考えるよりも早く、反射的に筋肉を収縮させることで、関節が外れたり荷物を落としたりするのを防いでいます。
            </p>
            <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl text-sm italic">
               「反射は最も低次でありながら、生体防御において最も高速で信頼性の高いシステムである」
            </div>
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
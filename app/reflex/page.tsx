// app/reflex/page.tsx
import StretchReflexVisualizer from "../../components/StretchReflexVisualizer";
import Navbar from "../../components/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "膝蓋腱反射シミュレーター | 伸張反射のメカニズム",
  description: "膝蓋腱反射を例に、筋紡錘から脊髄、そして運動ニューロンに至る伸張反射のプロセスをアニメーションで詳しく解説します。",
};

export default function ReflexPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        
        {/* ヘッダーセクション */}
        <div className="text-center mb-10">
          <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Biomechanics & Neuro Control
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-4 mb-4">
            膝蓋腱反射シミュレーター
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
            打撃という「入力」が、いかにして脳を経由せず脊髄レベルで「運動」に変換されるのか。
            伸張反射の驚異的なメカニズムを視覚的に理解しましょう。
          </p>
        </div>

        {/* ツール本体 */}
        <StretchReflexVisualizer />

        {/* 専門的解説セクション（アドセンス対策：情報の網羅性） */}
        <div className="mt-12 space-y-12 bg-white p-8 md:p-12 rounded-[2rem] border border-slate-100 shadow-sm leading-relaxed text-slate-700">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-sm">01</span>
              反射弓（Reflex Arc）の構成要素
            </h2>
            <p className="mb-6">
              膝蓋腱反射は、最も単純な「単シナプス反射」の一つです。以下の4つのステップが、わずか数十ミリ秒の間に自動的に行われます。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-blue-600 mb-2">① 受容器（筋紡錘）</h3>
                <p className="text-sm">大腿四頭筋の中にある「筋紡錘」が、打撃による急激な筋肉の伸びを感知します。</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-blue-600 mb-2">② 求心性路（$Ia$群線維）</h3>
                <p className="text-sm">感知された信号は、$Ia$群求心性神経を通じて脊髄の後半（後角）へと送られます。</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-red-600 mb-2">③ 中枢（脊髄前角）</h3>
                <p className="text-sm">脳の判断を待たず、脊髄内でα運動ニューロンと直接シナプス伝達を行います。</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-red-600 mb-2">④ 遠心性路（運動神経）</h3>
                <p className="text-sm">運動ニューロンからの指令が大腿四頭筋に届き、筋肉が収縮して膝が伸びます。</p>
              </div>
            </div>
          </section>

          <section className="border-t border-slate-100 pt-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-sm">02</span>
              なぜ「反射」が必要なのか
            </h2>
            <p className="mb-4">
              伸張反射の主な目的は、<strong>「筋肉の長さを一定に保つこと」</strong>です。
            </p>
            <p className="mb-4">
              例えば、重い荷物を急に持たされたとき、筋肉が不意に引き伸ばされます。このとき、脳が「持ち上げろ」と考えるよりも早く反射が働くことで、筋肉を即座に収縮させ、姿勢の崩れや関節へのダメージを防いでいるのです。
            </p>
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl text-amber-900 text-sm italic">
              「運動制御（Motor Control）において、反射は最も低次でありながら、最も高速で信頼性の高いフィードバックシステムとして機能しています。」
            </div>
          </section>

        </div>

        {/* 関連リンク */}
        <div className="mt-8 flex justify-center gap-4">
          <a href="/torque" className="text-sm text-blue-600 hover:underline">← トルク計算ツール</a>
          <span className="text-slate-300">|</span>
          <a href="/excursion" className="text-sm text-blue-600 hover:underline">可動域シミュレーター →</a>
        </div>
      </div>
    </main>
  );
}
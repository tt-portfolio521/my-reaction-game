// app/torque/page.tsx
import TorqueVisualizer from "../../components/TorqueVisualizer"; // 修正：相対パスに変更
import Navbar from "../../components/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "関節トルク・シミュレーター",
  description: "バイオメカニクスの視点から、関節角度と発揮トルク（回転力）の関係を視覚化します。",
};

export default function TorquePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        
        {/* タイトルセクション */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-4">
            関節トルク・シミュレーター
          </h1>
          <p className="text-slate-600">
            運動生理学・バイオメカニクスの基礎となる「回転力」の仕組みを体感する
          </p>
        </div>

        {/* ツール本体 */}
        <TorqueVisualizer />

        {/* 専門的解説セクション（アドセンス対策：有用性の向上） */}
        <div className="mt-12 space-y-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm leading-relaxed text-slate-700">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 border-l-4 border-blue-500 pl-4">
              運動制御における「トルク」とは？
            </h2>
            <p>
              人間が関節を動かすとき、筋肉が発生させた「力（Force）」は、関節を中心とした「回転力（Torque）」へと変換されます。この物理的な関係は以下の式で表されます。
            </p>
            <div className="text-center py-6 font-mono text-xl text-blue-600">
              $$\tau = F \times d$$
            </div>
            <p>
              ここで重要なのが $d$（モーメントアーム）です。これは関節中心から筋肉の作用線までの垂直距離を指します。上腕二頭筋を例にとると、肘を曲げる角度によってこの距離が変化するため、たとえ筋肉が同じ力で引っ張っていても、実際に関節を動かす力（トルク）は大きく変動するのです。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 border-l-4 border-blue-500 pl-4">
              なぜ「90度付近」で力が入りやすいのか
            </h2>
            <p>
              シミュレーターを動かすと分かる通り、肘が90度付近でモーメントアームが最大となり、トルクが最も効率よく発生します。逆に、腕が完全に伸びきった状態ではモーメントアームが極端に短くなるため、重いものを持ち上げ始めるには非常に大きな筋力が必要となります。
            </p>
            <p>
              私たちの脳は、この「角度による効率の変化」を事前に予測（フィードフォワード制御）し、適切な神経指令を筋肉へ送ることで、スムーズな運動を実現しています。
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
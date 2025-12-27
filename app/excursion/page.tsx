// app/excursion/page.tsx
import MuscleExcursionVisualizer from "../../components/MuscleExcursionVisualizer";
import Navbar from "../../components/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "筋肉収縮と可動域シミュレーター",
  description: "モーメントアームの長さが関節の可動域や運動速度に与える影響を、書籍の数式に基づき視覚化します。",
};

export default function ExcursionPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-4">
            筋肉収縮 vs 可動域シミュレーター
          </h1>
          <p className="text-slate-600">
            なぜ「力の強い関節」は「動きが遅い」のか？バイオメカニクスのトレードオフを学ぶ
          </p>
        </div>

        <MuscleExcursionVisualizer />

        <div className="mt-12 space-y-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm leading-relaxed text-slate-700">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 border-l-4 border-red-500 pl-4">
              数式 $dq = d\lambda / \rho$ の意味
            </h2>
            <p>
              このシミュレーターは、バイオメカニクスの基礎理論である「筋肉の収縮量（$d\lambda$）と関節角度の変化（$dq$）の関係」を証明するために作成されました。
            </p>
            <p className="mt-4">
              モーメントアーム（$\rho$）が長いと、テコの原理で大きな力を出せますが、同じ収縮量では関節はわずかしか動きません。逆に$\rho$が短いと、力は弱くなりますが、少しの収縮で関節を素早く大きく動かすことができます。
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
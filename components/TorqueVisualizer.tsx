// components/TorqueVisualizer.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function TorqueVisualizer() {
  // 肘の角度（0度=完全に伸びた状態、135度=深く曲げた状態）
  const [angle, setAngle] = useState(90);

  // --- 定数設定（シミュレーション用） ---
  const MUSCLE_FORCE = 500; // 筋肉が引っ張る力（一定と仮定：500N）
  const INSERTION_DISTANCE = 0.05; // 関節中心から筋肉付着部までの距離（5cm = 0.05m）

  // --- 計算ロジック ---
  // ラジアンへの変換
  const radian = (angle * Math.PI) / 180;
  // モーメントアームの計算（簡易モデル：d = L * sin(θ)）
  // ※実際はもっと複雑ですが、視覚化のために単純化しています
  const momentArm = INSERTION_DISTANCE * Math.sin(radian);
  // トルクの計算（τ = F * d）
  const torque = MUSCLE_FORCE * momentArm;

  // --- SVGの座標設定 ---
  const svgWidth = 320;
  const svgHeight = 280;
  const elbowX = svgWidth / 2;
  const elbowY = svgHeight * 0.7;
  const armLength = 100;

  // 前腕の先端の座標計算（角度に合わせて動く）
  const forearmEndX = elbowX + armLength * Math.cos(radian);
  const forearmEndY = elbowY - armLength * Math.sin(radian); // Y軸は上がマイナス

  // 筋肉の付着点（上腕側・固定）
  const muscleOriginX = elbowX - 20;
  const muscleOriginY = elbowY - 80;
  
  // 筋肉の付着点（前腕側・動く）: 肘から少し離れた位置
  const insertionRatio = 0.3; // 前腕の3割の位置に付着
  const muscleInsertionX = elbowX + (armLength * insertionRatio) * Math.cos(radian);
  const muscleInsertionY = elbowY - (armLength * insertionRatio) * Math.sin(radian);


  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm my-8">
      <h3 className="text-xl font-bold text-slate-800 mb-2 text-center">
        💪 腕の角度と「トルク」の関係
      </h3>
      <p className="text-sm text-slate-500 text-center mb-6">
        スライダーを動かして、肘の角度を変えてみましょう。
      </p>

      <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
        {/* --- 左側：アニメーション表示エリア --- */}
        <div className="relative bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
          <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
            {/* 関節（肘）の点 */}
            <circle cx={elbowX} cy={elbowY} r="8" fill="#cbd5e1" />

            {/* 上腕骨（固定） */}
            <line x1={elbowX} y1={elbowY} x2={elbowX} y2={elbowY - 120} stroke="#94a3b8" strokeWidth="12" strokeLinecap="round" />
            <text x={elbowX + 10} y={elbowY - 100} className="text-xs fill-slate-400">上腕</text>

            {/* 前腕骨（動く） */}
            <motion.line
              x1={elbowX} y1={elbowY}
              x2={forearmEndX} y2={forearmEndY}
              stroke="#64748b" strokeWidth="12" strokeLinecap="round"
              // framer-motionで滑らかに動かす
              animate={{ x2: forearmEndX, y2: forearmEndY }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <text x={forearmEndX + 10} y={forearmEndY} className="text-xs fill-slate-500">前腕</text>

            {/* 筋肉（上腕二頭筋） */}
            <motion.line
              x1={muscleOriginX} y1={muscleOriginY}
              x2={muscleInsertionX} y2={muscleInsertionY}
              stroke="#ef4444" strokeWidth="8" strokeLinecap="round"
              className="opacity-80"
              animate={{ x2: muscleInsertionX, y2: muscleInsertionY }}
            />
            <text x={muscleOriginX - 30} y={muscleOriginY + 10} className="text-xs fill-red-500 font-bold">筋肉(力F)</text>

            {/* モーメントアームの可視化（概念的な垂直線） */}
            {angle > 5 && angle < 175 && (
              <>
                {/* 関節から作用線への垂線（イメージ） */}
                <motion.line
                  x1={elbowX} y1={elbowY}
                  x2={muscleInsertionX} y2={elbowY} // 簡易的な水平線で表現
                  stroke="#3b82f6" strokeWidth="3" strokeDasharray="4 2"
                  animate={{ x2: muscleInsertionX, opacity: Math.sin(radian) }} // 角度によって見え方を変える
                />
                 <text x={elbowX + 20} y={elbowY - 5} className="text-xs fill-blue-600 font-bold">モーメントアーム(d)</text>
              </>
            )}
          </svg>
          {/* 角度表示 */}
          <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
            {angle}°
          </div>
        </div>

        {/* --- 右側：計算パラメーター表示エリア --- */}
        <div className="flex-1 w-full max-w-xs space-y-6">
          
          {/* スライダー入力 */}
          <div>
            <label htmlFor="angle-slider" className="block text-sm font-bold text-slate-700 mb-2">
              肘の角度を調整 👇
            </label>
            <input
              id="angle-slider"
              type="range"
              min="0"
              max="160"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>伸びた (0°)</span>
              <span>曲げた (160°)</span>
            </div>
          </div>

          {/* 計算結果リアルタイム表示 */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">筋肉の力 ($F$)</span>
              <span className="font-mono">{MUSCLE_FORCE} N (一定)</span>
            </div>

            {/* モーメントアームの変化を強調 */}
            <div className="flex justify-between items-center text-sm bg-blue-50 p-2 rounded-lg -mx-2">
              <span className="text-blue-800 font-bold">✕ モーメントアーム ($d$)</span>
              <span className={`font-mono font-bold ${momentArm < 0.02 ? 'text-red-500' : 'text-blue-600'}`}>
                {(momentArm * 100).toFixed(1)} cm
              </span>
            </div>
            <div className="text-xs text-slate-500 text-right">
              （関節中心から作用線までの垂直距離）
            </div>

            <div className="border-t border-slate-300 my-2"></div>

            {/* トルクの結果 */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-slate-800">＝ 発揮トルク ($\tau$)</span>
              <span className={`text-2xl font-mono font-extrabold ${torque < 10 ? 'text-slate-400' : 'text-blue-600'}`}>
                {torque.toFixed(1)} <span className="text-sm">Nm</span>
              </span>
            </div>
          </div>

          {/* 簡易解説 */}
          <p className="text-sm text-slate-600 leading-relaxed bg-yellow-50 p-3 rounded-lg border border-yellow-100">
            💡 <strong>ポイント:</strong><br/>
            筋肉の力（500N）は同じでも、角度が変わると「モーメントアーム（てこの長さ）」が変わるため、発揮できるトルクは大きく変化します。<strong>90°付近が最も効率が良い</strong>ことが分かりますね。
          </p>

        </div>
      </div>
    </div>
  );
}
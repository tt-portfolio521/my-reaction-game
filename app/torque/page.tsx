// components/TorqueVisualizer.tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

export default function TorqueVisualizer() {
  const [angle, setAngle] = useState(180);

  // --- 定数設定 ---
  const MUSCLE_FORCE = 500; 
  const INSERTION_DISTANCE = 0.05;
  const TORQUE_SCALE = 4;
  const MIN_ARROW_LENGTH = 20;
  const MAX_ARROW_LENGTH = 100;

  // --- 計算ロジック ---
  const radian = (angle * Math.PI) / 180;
  const momentArm = INSERTION_DISTANCE * Math.sin(radian);
  const torque = Math.abs(MUSCLE_FORCE * momentArm);

  // --- グラフ用データ生成（0度から180度の全データを計算） ---
  const graphPoints = useMemo(() => {
    const points = [];
    for (let a = 0; a <= 180; a += 5) {
      const r = (a * Math.PI) / 180;
      const d = INSERTION_DISTANCE * Math.sin(r);
      const t = Math.abs(MUSCLE_FORCE * d);
      points.push({ a, t });
    }
    return points;
  }, []);

  // --- SVG座標計算（腕のモデル） ---
  const svgWidth = 320;
  const svgHeight = 350;
  const elbowX = svgWidth / 2;
  const elbowY = svgHeight * 0.45;
  const armLength = 120;
  const forearmEndX = elbowX + armLength * Math.sin(radian);
  const forearmEndY = elbowY - armLength * Math.cos(radian);
  const muscleOriginX = elbowX;
  const muscleOriginY = elbowY - 100;
  const insertionRatio = 0.3;
  const muscleInsertionX = elbowX + (armLength * insertionRatio) * Math.sin(radian);
  const muscleInsertionY = elbowY - (armLength * insertionRatio) * Math.cos(radian);
  
  // 力の矢印計算
  const calculatedArrowLength = torque * TORQUE_SCALE;
  const arrowLength = Math.min(Math.max(calculatedArrowLength, MIN_ARROW_LENGTH), MAX_ARROW_LENGTH);
  const dx = muscleOriginX - muscleInsertionX;
  const dy = muscleOriginY - muscleInsertionY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const arrowEndX = muscleInsertionX + (dx / length) * arrowLength;
  const arrowEndY = muscleInsertionY + (dy / length) * arrowLength;

  // --- グラフ描画の設定 ---
  const gWidth = 300;
  const gHeight = 120;
  const maxTorque = 25; // グラフの最大メモリ
  const getGX = (a: number) => (a / 180) * gWidth;
  const getGY = (t: number) => gHeight - (t / maxTorque) * gHeight;

  // グラフの曲線パスを生成
  const pathData = graphPoints.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${getGX(p.a)} ${getGY(p.t)}`
  ).join(' ');

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm my-8">
      <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">
        💪 関節角度とトルクの動的シミュレーション
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* --- 左側：アニメーションとグラフ --- */}
        <div className="space-y-6">
          {/* 腕のアニメーション */}
          <div className="relative bg-slate-50 rounded-2xl border border-slate-100 flex justify-center py-4">
            <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
              <defs>
                <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                  <polygon points="0 0, 6 2, 0 4" fill="#dc2626" />
                </marker>
              </defs>
              <line x1={elbowX} y1={elbowY} x2={elbowX} y2={elbowY - 140} stroke="#cbd5e1" strokeWidth="14" strokeLinecap="round" />
              <motion.line x1={elbowX} y1={elbowY} x2={forearmEndX} y2={forearmEndY} stroke="#64748b" strokeWidth="14" strokeLinecap="round" animate={{ x2: forearmEndX, y2: forearmEndY }} />
              <circle cx={elbowX} cy={elbowY} r="10" fill="#94a3b8" />
              <motion.line x1={muscleOriginX} y1={muscleOriginY} x2={muscleInsertionX} y2={muscleInsertionY} stroke="#fca5a5" strokeWidth="10" strokeLinecap="round" animate={{ x2: muscleInsertionX, y2: muscleInsertionY }} />
              <motion.line x1={muscleInsertionX} y1={muscleInsertionY} x2={arrowEndX} y2={arrowEndY} stroke="#dc2626" strokeWidth="4" markerEnd="url(#arrowhead)" animate={{ x1: muscleInsertionX, y1: muscleInsertionY, x2: arrowEndX, y2: arrowEndY }} transition={{ type: "spring", stiffness: 200, damping: 20 }} />
            </svg>
            <div className="absolute top-4 left-4 bg-white/80 px-3 py-1 rounded-full text-xs font-bold text-slate-500 shadow-sm">
              可視化モデル
            </div>
          </div>

          {/* 【追加】トルク・角度曲線グラフ */}
          <div className="bg-slate-900 p-6 rounded-2xl shadow-inner relative">
            <h4 className="text-white text-xs font-bold mb-4 uppercase tracking-widest opacity-70">Torque-Angle Curve</h4>
            <svg width="100%" height={gHeight + 40} viewBox={`-20 -10 ${gWidth + 40} ${gHeight + 40}`} className="overflow-visible">
              {/* グリッド線 */}
              <line x1="0" y1={gHeight} x2={gWidth} y2={gHeight} stroke="#334155" strokeWidth="1" />
              <line x1="0" y1="0" x2="0" y2={gHeight} stroke="#334155" strokeWidth="1" />
              
              {/* トルク曲線 */}
              <path d={pathData} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" className="opacity-50" />
              
              {/* 現在位置のマーカー */}
              <motion.circle
                cx={getGX(angle)}
                cy={getGY(torque)}
                r="6"
                fill="#3b82f6"
                className="shadow-xl"
                animate={{ cx: getGX(angle), cy: getGY(torque) }}
              />
              <motion.line x1={getGX(angle)} y1="0" x2={getGX(angle)} y2={gHeight} stroke="#3b82f6" strokeWidth="1" strokeDasharray="4" className="opacity-30" animate={{ x1: getGX(angle), x2: getGX(angle) }} />

              {/* 軸ラベル */}
              <text x={gWidth / 2} y={gHeight + 25} textAnchor="middle" className="fill-slate-500 text-[10px]">角度 (deg)</text>
              <text x="-15" y={gHeight / 2} textAnchor="middle" rotate="-90" className="fill-slate-500 text-[10px]">トルク (Nm)</text>
              <text x="0" y={gHeight + 15} textAnchor="middle" className="fill-slate-600 text-[8px]">0°</text>
              <text x={gWidth / 2} y={gHeight + 15} textAnchor="middle" className="fill-slate-600 text-[8px]">90°</text>
              <text x={gWidth} y={gHeight + 15} textAnchor="middle" className="fill-slate-600 text-[8px]">180°</text>
            </svg>
          </div>
        </div>

        {/* --- 右側：操作パネル --- */}
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <label className="block text-sm font-bold text-slate-700 mb-4">
              関節角度の調整: <span className="text-blue-600 ml-1">{angle}°</span>
            </label>
            <input type="range" min="15" max="180" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <div className="flex justify-between text-[10px] text-slate-400 mt-2 uppercase font-bold">
              <span>Flexion</span>
              <span>Extension</span>
            </div>
          </div>

          <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-200">
            <div className="flex justify-between items-center mb-4 opacity-80">
              <span className="text-xs font-bold uppercase">Result Data</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">Real-time</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm opacity-70">Moment Arm ($d$)</span>
                <span className="text-xl font-mono font-bold">{(momentArm * 100).toFixed(1)}<span className="text-xs ml-1">cm</span></span>
              </div>
              <div className="h-px bg-white/20 w-full" />
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold underline decoration-blue-300">Total Torque ($\tau$)</span>
                <span className="text-3xl font-mono font-black">{torque.toFixed(1)}<span className="text-sm ml-1">Nm</span></span>
              </div>
            </div>
          </div>

          <div className="prose prose-sm text-slate-600 bg-amber-50 p-5 rounded-2xl border border-amber-100">
            <p className="m-0 leading-relaxed font-medium">
              <strong className="text-amber-800">📊 グラフの解説:</strong><br/>
              青い曲線は「角度と力の関係」を示しています。<strong>90度付近で山（ピーク）</strong>になっているのは、モーメントアームが最大化されるためです。180度（完全に伸びた状態）に向かうにつれ、物理的な効率が下がりトルクがゼロに近づく様子がグラフ上の点線の動きで確認できます。
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
// components/TorqueVisualizer.tsx
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
// @ts-ignore
import renderMathInElement from "katex/dist/contrib/auto-render";
import "katex/dist/katex.min.css";

export default function TorqueVisualizer() {
  const [angle, setAngle] = useState(180);
  const containerRef = useRef<HTMLDivElement>(null);

  // 数式描画の実行
  useEffect(() => {
    if (containerRef.current) {
      renderMathInElement(containerRef.current, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
        ],
        throwOnError: false,
      });
    }
  }, [angle]); // 角度が変わるたびに再描画（数値更新に対応）

  const MUSCLE_FORCE = 500;
  const INSERTION_DISTANCE = 0.05;
  const radian = (angle * Math.PI) / 180;
  const momentArm = INSERTION_DISTANCE * Math.sin(radian);
  const torque = Math.abs(MUSCLE_FORCE * momentArm);

  const graphPoints = useMemo(() => {
    const points = [];
    for (let a = 15; a <= 180; a += 5) {
      const r = (a * Math.PI) / 180;
      const d = INSERTION_DISTANCE * Math.sin(r);
      const t = Math.abs(MUSCLE_FORCE * d);
      points.push({ a, t });
    }
    return points;
  }, []);

  // SVG座標計算
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

  // グラフ描画の設定
  const gWidth = 280;
  const gHeight = 100;
  const maxTorque = 25;
  const getGX = (a: number) => ((a - 15) / (180 - 15)) * gWidth;
  const getGY = (t: number) => gHeight - (t / maxTorque) * gHeight;
  const pathData = graphPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getGX(p.a)} ${getGY(p.t)}`).join(' ');

  return (
    <div ref={containerRef} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm my-8">
      <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">
        💪 関節角度とトルクの動性シミュレーション
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* 左側：アニメーション */}
        <div className="relative bg-slate-50 rounded-2xl border border-slate-100 flex justify-center py-4">
          <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
            <line x1={elbowX} y1={elbowY} x2={elbowX} y2={elbowY - 140} stroke="#cbd5e1" strokeWidth="14" strokeLinecap="round" />
            <motion.line x1={elbowX} y1={elbowY} x2={forearmEndX} y2={forearmEndY} stroke="#64748b" strokeWidth="14" strokeLinecap="round" animate={{ x2: forearmEndX, y2: forearmEndY }} />
            <circle cx={elbowX} cy={elbowY} r="10" fill="#94a3b8" />
            <motion.line x1={muscleOriginX} y1={muscleOriginY} x2={muscleInsertionX} y2={muscleInsertionY} stroke="#fca5a5" strokeWidth="10" strokeLinecap="round" animate={{ x2: muscleInsertionX, y2: muscleInsertionY }} />
          </svg>
          <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
            {angle}°
          </div>
        </div>

        {/* 右側：操作パネルとグラフ */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">肘の角度（15°〜180°）</label>
            <input type="range" min="15" max="180" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">筋肉の力 ($F$)</span>
              <span className="font-mono font-bold text-slate-800">500 N (一定)</span>
            </div>
            <div className="flex justify-between items-center text-sm bg-blue-50 p-2 rounded-lg -mx-2">
              <span className="text-blue-800 font-bold">✕ モーメントアーム ($d$)</span>
              <span className="font-mono font-bold text-blue-600">{(momentArm * 100).toFixed(1)} cm</span>
            </div>
            <div className="border-t border-slate-300 my-2"></div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-slate-800">＝ 発揮トルク ($\tau$)</span>
              <span className="text-2xl font-mono font-extrabold text-red-600">{torque.toFixed(1)} <span className="text-sm">Nm</span></span>
            </div>
          </div>

          {/* グラフエリアの修正 */}
          <div className="bg-slate-900 p-4 rounded-xl shadow-inner overflow-visible">
            <h4 className="text-white text-[10px] font-bold mb-4 uppercase tracking-widest opacity-70">Torque-Angle Curve</h4>
            <div className="bg-slate-800/50 rounded-lg pt-4 pb-10 px-6">
                <svg width="100%" height="130" viewBox={`-50 -10 ${gWidth + 70} ${gHeight + 45}`} className="overflow-visible">
                  {/* グリッド軸 */}
                  <line x1="0" y1={gHeight} x2={gWidth} y2={gHeight} stroke="#475569" strokeWidth="1.5" />
                  <line x1="0" y1="0" x2="0" y2={gHeight} stroke="#475569" strokeWidth="1.5" />
                  
                  {/* 曲線 */}
                  <path d={pathData} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" className="opacity-60" />
                  
                  {/* インジケーター */}
                  <motion.circle cx={getGX(angle)} cy={getGY(torque)} r="5" fill="#3b82f6" animate={{ cx: getGX(angle), cy: getGY(torque) }} />
                  <motion.line x1={getGX(angle)} y1={0} x2={getGX(angle)} y2={gHeight} stroke="#3b82f6" strokeWidth="1" strokeDasharray="3" className="opacity-40" animate={{ x1: getGX(angle), x2: getGX(angle) }} />

                  {/* 軸ラベル（位置調整済み） */}
                  <text x={gWidth / 2} y={gHeight + 40} textAnchor="middle" className="fill-slate-400 text-[11px] font-bold">角度 (deg)</text>
                  <text transform={`translate(-40, ${gHeight / 2}) rotate(-90)`} textAnchor="middle" className="fill-slate-400 text-[11px] font-bold">トルク (Nm)</text>
                  
                  {/* 目盛り数字（重なり防止） */}
                  <text x="0" y={gHeight + 18} textAnchor="middle" className="fill-slate-500 text-[10px]">15°</text>
                  <text x={gWidth} y={gHeight + 18} textAnchor="middle" className="fill-slate-500 text-[10px]">180°</text>
                  <text x="-12" y={gHeight} textAnchor="end" dominantBaseline="middle" className="fill-slate-500 text-[10px]">0</text>
                  <text x="-12" y={0} textAnchor="end" dominantBaseline="middle" className="fill-slate-500 text-[10px]">{maxTorque}</text>
                </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
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

  // 数式記号 ($...$) をきれいに描画する設定
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
  }, [angle]); // 角度（数値）が変わるたびに再描画

  // --- 定数設定 ---
  const MUSCLE_FORCE = 500;
  const INSERTION_DISTANCE = 0.05;
  const TORQUE_SCALE = 4;
  const MIN_ARROW_LENGTH = 20;
  const MAX_ARROW_LENGTH = 100;

  // --- 計算ロジック（アニメーション用） ---
  const radian = (angle * Math.PI) / 180;
  const momentArm = INSERTION_DISTANCE * Math.sin(radian);
  const torque = Math.abs(MUSCLE_FORCE * momentArm);

  // --- グラフ用データ計算 ---
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

  // --- SVG座標計算（腕モデル用） ---
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
  const momentArmEndX = muscleInsertionX - (momentArm * 150 * Math.cos(radian));
  const momentArmEndY = muscleInsertionY - (momentArm * 150 * Math.sin(radian));
  
  const calculatedArrowLength = torque * TORQUE_SCALE;
  const arrowLength = Math.min(Math.max(calculatedArrowLength, MIN_ARROW_LENGTH), MAX_ARROW_LENGTH);
  const dx = muscleOriginX - muscleInsertionX;
  const dy = muscleOriginY - muscleInsertionY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const arrowEndX = muscleInsertionX + (dx / length) * arrowLength;
  const arrowEndY = muscleInsertionY + (dy / length) * arrowLength;

  // --- グラフ描画の設定（サイズをご指定の300x100に復元） ---
  const gWidth = 300;
  const gHeight = 100;
  const maxTorque = 25;
  const getGX = (a: number) => ((a - 15) / (180 - 15)) * gWidth;
  const getGY = (t: number) => gHeight - (t / maxTorque) * gHeight;

  const pathData = graphPoints.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${getGX(p.a)} ${getGY(p.t)}`
  ).join(' ');

  return (
    <div ref={containerRef} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm my-8">
      <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">
        💪 関節角度とトルクの動的シミュレーション
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* --- 左側：腕のアニメーション --- */}
        <div className="relative bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden flex justify-center py-4">
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
            {angle < 178 && angle > 17 && (
              <>
                <motion.line x1={elbowX} y1={elbowY} x2={momentArmEndX} y2={momentArmEndY} stroke="#3b82f6" strokeWidth="3" strokeDasharray="4 2" animate={{ x2: momentArmEndX, y2: momentArmEndY }} />
                <motion.text x={elbowX + 10} y={elbowY + 20} className="text-xs fill-blue-600 font-bold">d</motion.text>
              </>
            )}
          </svg>
          <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
            {angle}°
          </div>
        </div>

        {/* --- 右側：操作パネルとグラフ --- */}
        <div className="space-y-6">
          {/* スライダー */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              肘の角度（15°〜180°）
            </label>
            <input type="range" min="15" max="180" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>屈曲 (15°)</span>
              <span>伸展 (180°)</span>
            </div>
          </div>

          {/* 数値表示パネル */}
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

          {/* トルク・角度曲線グラフ（ご指定のレイアウトを復元） */}
          <div className="bg-slate-900 p-4 rounded-xl shadow-inner relative">
            <h4 className="text-white text-[10px] font-bold mb-2 uppercase tracking-widest opacity-70">Torque-Angle Curve</h4>
            <div className="pl-6 pb-6 pr-2 pt-2 bg-slate-800/50 rounded-lg">
                <svg width="100%" height="100%" viewBox={`-35 -10 ${gWidth + 50} ${gHeight + 50}`} className="overflow-visible">
                <line x1="0" y1={gHeight} x2={gWidth} y2={gHeight} stroke="#475569" strokeWidth="1" />
                <line x1="0" y1="0" x2="0" y2={gHeight} stroke="#475569" strokeWidth="1" />
                
                <path d={pathData} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" className="opacity-60" />
                
                <motion.circle
                    cx={getGX(angle)}
                    cy={getGY(torque)}
                    r="5"
                    fill="#3b82f6"
                    className="shadow-xl drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                    animate={{ cx: getGX(angle), cy: getGY(torque) }}
                />
                <motion.line
                    x1={getGX(angle)} y1={0}
                    x2={getGX(angle)} y2={gHeight}
                    stroke="#3b82f6" strokeWidth="1" strokeDasharray="3" className="opacity-40"
                    animate={{ x1: getGX(angle), x2: getGX(angle) }}
                />

                {/* 軸ラベルと目盛り（ご指定の座標） */}
                <text x={gWidth / 2} y={gHeight + 35} textAnchor="middle" className="fill-slate-400 text-[10px]">角度 (deg)</text>
                <text transform={`translate(-30, ${gHeight / 2}) rotate(-90)`} textAnchor="middle" className="fill-slate-400 text-[10px]">トルク (Nm)</text>
                
                <text x="0" y={gHeight + 15} textAnchor="middle" className="fill-slate-500 text-[8px]">15°</text>
                <text x={gWidth} y={gHeight + 15} textAnchor="middle" className="fill-slate-500 text-[8px]">180°</text>
                
                <text x="-8" y={gHeight} textAnchor="end" dominantBaseline="middle" className="fill-slate-500 text-[8px]">0</text>
                <text x="-8" y={0} textAnchor="end" dominantBaseline="middle" className="fill-slate-500 text-[8px]">{maxTorque}</text>
                </svg>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed bg-blue-50/50 p-3 rounded-lg border border-blue-100">
            <strong>専門解説:</strong><br/>
            下のグラフは「角度と力の関係」を示しています。90度付近で山（ピーク）になっているのは、物理的な効率（モーメントアーム）が最大化されるためです。
          </p>
        </div>
      </div>
    </div>
  );
}
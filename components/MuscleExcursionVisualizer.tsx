"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
// @ts-ignore
import renderMathInElement from "katex/dist/contrib/auto-render";
import "katex/dist/katex.min.css";

export default function MuscleExcursionVisualizer() {
  const [momentArmRatio, setMomentArmRatio] = useState(0.3);
  const [isContracted, setIsContracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
  }, [momentArmRatio, isContracted]);

  const SVG_WIDTH = 400;
  const SVG_HEIGHT = 350;
  const ELBOW_X = SVG_WIDTH / 2;
  const ELBOW_Y = SVG_HEIGHT * 0.7;
  const ARM_LENGTH_PX = 150;
  const INITIAL_ANGLE_DEG = 90;
  const REAL_ARM_LENGTH_M = 0.3;
  const CONTRACTION_AMOUNT_M = 0.02;

  const momentArmM = REAL_ARM_LENGTH_M * momentArmRatio;
  const angleChangeRad = CONTRACTION_AMOUNT_M / momentArmM;
  const angleChangeDeg = angleChangeRad * (180 / Math.PI);

  const currentAngleRad = isContracted ? ((INITIAL_ANGLE_DEG - angleChangeDeg) * Math.PI) / 180 : (INITIAL_ANGLE_DEG * Math.PI) / 180;
  const initialAngleRad = (INITIAL_ANGLE_DEG * Math.PI) / 180;

  const getCoords = (angleRad: number, ratio: number) => {
    const forearmEnd = {
      x: ELBOW_X + ARM_LENGTH_PX * Math.cos(angleRad),
      y: ELBOW_Y - ARM_LENGTH_PX * Math.sin(angleRad),
    };
    const muscleOrigin = { x: ELBOW_X, y: ELBOW_Y - 100 };
    const insertionDist = ARM_LENGTH_PX * ratio;
    const muscleInsertion = {
      x: ELBOW_X + insertionDist * Math.cos(angleRad),
      y: ELBOW_Y - insertionDist * Math.sin(angleRad),
    };
    return { forearmEnd, muscleOrigin, muscleInsertion };
  };

  const initialCoords = getCoords(initialAngleRad, momentArmRatio);
  const currentCoords = getCoords(currentAngleRad, momentArmRatio);

  return (
    <div ref={containerRef} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm my-8">
      <h3 className="text-xl font-bold text-slate-800 mb-6 text-center leading-tight">
        💪 筋肉の収縮量と関節可動域の関係<br/>
        <span className="text-sm text-slate-500 font-normal">（書籍の数式 $dq = d\lambda / \rho$ の視覚化）</span>
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
          {/* スライダーエリア */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
            <label className="block text-sm font-bold text-slate-700 mb-4">
              1️⃣ 筋肉の付着位置（モーメントアーム $\rho$）を調整
            </label>
            <input
              type="range" min="0.1" max="0.8" step="0.05"
              value={momentArmRatio}
              onChange={(e) => { setMomentArmRatio(Number(e.target.value)); setIsContracted(false); }}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-4"
            />
            {/* エラー修正箇所：文字列として結合 */}
            <div className="font-mono text-blue-600 font-bold">
              {"$\\rho$ = " + (momentArmM * 100).toFixed(1) + " cm"}
            </div>
          </div>

          <div className="bg-red-50 p-5 rounded-2xl border border-red-100 text-center">
            <button
              onClick={() => setIsContracted(!isContracted)}
              className={`px-8 py-3 rounded-full font-bold text-white transition-all ${isContracted ? "bg-slate-400" : "bg-red-500 shadow-lg"}`}
            >
              {isContracted ? "元に戻す" : "筋肉を縮める！"}
            </button>
          </div>

          <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
            <h4 className="font-bold mb-2">📚 計算結果</h4>
            <div className="bg-white p-3 rounded-xl border border-blue-200 text-center shadow-sm font-mono text-slate-800">
              {/* エラー修正箇所：LaTeXと変数をテンプレートリテラルで結合 */}
              {`$dq \\approx ${angleChangeDeg.toFixed(1)}^\\circ \\approx \\frac{2 \\text{ cm}}{${(momentArmM * 100).toFixed(1)} \\text{ cm}}$`}
            </div>
          </div>
        </div>

        {/* 右側：アニメーション */}
        <div className="relative bg-slate-50 rounded-2xl border border-slate-100 flex justify-center py-8">
          <svg width={SVG_WIDTH} height={SVG_HEIGHT} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="overflow-visible">
            <line x1={ELBOW_X} y1={ELBOW_Y} x2={ELBOW_X} y2={ELBOW_Y - 120} stroke="#94a3b8" strokeWidth="12" strokeLinecap="round" />
            <motion.line x1={ELBOW_X} y1={ELBOW_Y} x2={currentCoords.forearmEnd.x} y2={currentCoords.forearmEnd.y} stroke="#64748b" strokeWidth="12" strokeLinecap="round" animate={{ x2: currentCoords.forearmEnd.x, y2: currentCoords.forearmEnd.y }} />
            <circle cx={ELBOW_X} cy={ELBOW_Y} r="8" fill="#cbd5e1" />
            <motion.line x1={currentCoords.muscleOrigin.x} y1={currentCoords.muscleOrigin.y} x2={currentCoords.muscleInsertion.x} y2={currentCoords.muscleInsertion.y} stroke="#ef4444" strokeWidth="8" strokeLinecap="round" animate={{ x2: currentCoords.muscleInsertion.x, y2: currentCoords.muscleInsertion.y }} />
            
            {/* ラベル部分のエラー修正 */}
            <motion.text
              x={ELBOW_X + (currentCoords.muscleInsertion.x - ELBOW_X) / 2}
              y={ELBOW_Y + 50}
              textAnchor="middle"
              className="text-xs fill-blue-600 font-bold"
            >
              {`$\\rho$ = ${(momentArmM * 100).toFixed(1)} cm`}
            </motion.text>
          </svg>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
// @ts-ignore
import renderMathInElement from "katex/dist/contrib/auto-render";
import "katex/dist/katex.min.css";

export default function MuscleExcursionVisualizer() {
  // モーメントアームの比率（前腕の長さに対する付着位置の割合: 0.1〜0.8）
  const [momentArmRatio, setMomentArmRatio] = useState(0.3);
  // 筋肉が収縮しているかどうかの状態
  const [isContracted, setIsContracted] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // 数式レンダリングの設定
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
  }, [momentArmRatio, isContracted]); // 状態が変わるたびに数値を更新して再レンダリング

  // --- 定数・設定 ---
  const SVG_WIDTH = 400;
  const SVG_HEIGHT = 350;
  const ELBOW_X = SVG_WIDTH / 2;
  const ELBOW_Y = SVG_HEIGHT * 0.7;
  const ARM_LENGTH_PX = 150; // 前腕の長さ(px)
  const INITIAL_ANGLE_DEG = 90; // 初期の肘角度（度）
  
  // 物理モデルの設定（表示用）
  const REAL_ARM_LENGTH_M = 0.3; // 実際の前腕長を30cmと仮定
  const CONTRACTION_AMOUNT_M = 0.02; // 筋肉の収縮量 ($d\lambda$) を2cmと仮定

  // --- 計算ロジック ---
  // 1. 現在のモーメントアーム長 ($\rho$)
  const momentArmPx = ARM_LENGTH_PX * momentArmRatio;
  const momentArmM = REAL_ARM_LENGTH_M * momentArmRatio;

  // 2. 書籍の式 $dq = d\lambda / \rho$ に基づく角度変化量の計算
  // ※ここでは簡易的に、関節が90度付近での微小変化として計算します
  const angleChangeRad = CONTRACTION_AMOUNT_M / momentArmM;
  const angleChangeDeg = angleChangeRad * (180 / Math.PI);

  // 3. 現在のアニメーション表示角度
  const currentAngleDeg = isContracted ? INITIAL_ANGLE_DEG - angleChangeDeg : INITIAL_ANGLE_DEG;
  const currentAngleRad = (currentAngleDeg * Math.PI) / 180;
  const initialAngleRad = (INITIAL_ANGLE_DEG * Math.PI) / 180;

  // --- SVG座標計算関数のメモ化 ---
  const getCoords = useMemo(() => (angleRad: number, ratio: number) => {
    const forearmEnd = {
      x: ELBOW_X + ARM_LENGTH_PX * Math.cos(angleRad),
      y: ELBOW_Y - ARM_LENGTH_PX * Math.sin(angleRad),
    };
    const muscleOrigin = { x: ELBOW_X, y: ELBOW_Y - 100 }; // 上腕骨上の固定点
    // 簡易モデル：前腕上の付着点は、関節から一定距離の点とする
    // (厳密なモーメントアームは角度で変わりますが、概念理解のために単純化しています)
    const insertionDist = ARM_LENGTH_PX * ratio;
    const muscleInsertion = {
      x: ELBOW_X + insertionDist * Math.cos(angleRad),
      y: ELBOW_Y - insertionDist * Math.sin(angleRad),
    };
    return { forearmEnd, muscleOrigin, muscleInsertion };
  }, [ELBOW_X, ELBOW_Y, ARM_LENGTH_PX]);

  // 初期位置と現在位置の座標を計算
  const initialCoords = getCoords(initialAngleRad, momentArmRatio);
  const currentCoords = getCoords(currentAngleRad, momentArmRatio);

  return (
    <div ref={containerRef} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm my-8">
      <h3 className="text-xl font-bold text-slate-800 mb-6 text-center leading-tight">
        💪 筋肉の収縮量と関節可動域の関係<br/>
        <span className="text-sm text-slate-500 font-normal">（書籍の数式 $dq = d\lambda / \rho$ の視覚化）</span>
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* --- 左側：シミュレーション操作パネル --- */}
        <div className="space-y-8">
          {/* 1. モーメントアーム調整スライダー */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <label className="block text-sm font-bold text-slate-700 mb-4">
              1️⃣ 筋肉の付着位置（モーメントアーム $\rho$）を調整
            </label>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-xs font-bold text-slate-500">関節寄り<br/>(短い)</span>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={momentArmRatio}
                onChange={(e) => {
                  setMomentArmRatio(Number(e.target.value));
                  setIsContracted(false); // 位置を変えたらリセット
                }}
                className="flex-1 h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-xs font-bold text-slate-500">手首寄り<br/>(長い)</span>
            </div>
            <div className="text-center font-mono text-blue-600 font-bold">
              $\rho$ = {(momentArmM * 100).toFixed(1)} cm
            </div>
          </div>

          {/* 2. 収縮アクションボタン */}
          <div className="bg-red-50 p-5 rounded-2xl border border-red-100 text-center">
            <label className="block text-sm font-bold text-red-800 mb-4">
              2️⃣ 筋肉を一定量（$d\lambda = 2\text{cm}$）縮める
            </label>
            <button
              onClick={() => setIsContracted(!isContracted)}
              className={`px-8 py-3 rounded-full font-bold text-white transition-all shadow-md ${
                isContracted
                  ? "bg-slate-400 hover:bg-slate-500 shadow-inner"
                  : "bg-red-500 hover:bg-red-600 hover:shadow-lg hover:-translate-y-0.5"
              }`}
            >
              {isContracted ? "元に戻す (リセット)" : "筋肉を縮める！ (収縮)"}
            </button>
            <p className="text-xs text-red-600 mt-3">
              ※ボタンを押すと、筋肉が正確に 2cm だけ短くなります。
            </p>
          </div>

          {/* 3. 数式による解説パネル */}
          <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 text-slate-700 leading-relaxed">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              📚 書籍の数式による解説
            </h4>
            <p className="mb-4 text-sm">
              書籍に示された式 (4.1) は、筋肉の収縮量と関節角度の変化量の関係を表しています。
            </p>
            <div className="bg-white p-3 rounded-xl border border-blue-200 text-center my-4 shadow-sm">
              <p className="text-lg font-bold text-blue-800 mb-2">$$dq = \frac{d\lambda}{\rho}$$</p>
              <p className="text-xs text-slate-500">
                (角度変化 = 筋肉の収縮量 ÷ モーメントアーム)
              </p>
            </div>
            <p className="text-sm mb-2">
              今回のシミュレーション設定（$d\lambda = 2\text{cm}$）を当てはめると、
            </p>
            <p className="font-mono text-center font-bold text-lg text-slate-800">
              $${angleChangeDeg.toFixed(1)}^\circ \approx \frac{2 \text{ cm}}{{(momentArmM * 100).toFixed(1)} \text{ cm}}$$
            </p>
            <p className="text-sm mt-4 bg-yellow-100 p-3 rounded-lg border border-yellow-200">
              <strong>💡 結論:</strong><br/>
              モーメントアーム($\rho$)が<strong>{momentArmRatio < 0.4 ? "短い" : "長い"}</strong>ため、分母が<strong>{momentArmRatio < 0.4 ? "小さく" : "大きく"}</strong>なり、結果として角度の変化($dq$)が<strong>{momentArmRatio < 0.4 ? "大きく" : "小さく"}</strong>なっています。これが「トレードオフ」の数学的な証明です。
            </p>
          </div>
        </div>

        {/* --- 右側：アニメーションビジュアライザー --- */}
        <div className="relative bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden flex justify-center items-center py-8" style={{ height: SVG_HEIGHT + 50 }}>
          <svg width={SVG_WIDTH} height={SVG_HEIGHT} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="overflow-visible">
            <defs>
              {/* 寸法線用の矢印 */}
              <marker id="dimArrowStart" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto">
                <path d="M6,0 L0,3 L6,6 Z" fill="#3b82f6" />
              </marker>
              <marker id="dimArrowEnd" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#3b82f6" />
              </marker>
            </defs>

            {/* --- 収縮前の状態（ゴースト表示） --- */}
            <g className="opacity-30">
              {/* 上腕（固定） */}
              <line x1={ELBOW_X} y1={ELBOW_Y} x2={ELBOW_X} y2={ELBOW_Y - 120} stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />
              {/* 前腕（初期位置） */}
              <line x1={ELBOW_X} y1={ELBOW_Y} x2={initialCoords.forearmEnd.x} y2={initialCoords.forearmEnd.y} stroke="#94a3b8" strokeWidth="12" strokeLinecap="round" />
              {/* 筋肉（初期位置） */}
              <line x1={initialCoords.muscleOrigin.x} y1={initialCoords.muscleOrigin.y} x2={initialCoords.muscleInsertion.x} y2={initialCoords.muscleInsertion.y} stroke="#fca5a5" strokeWidth="8" strokeLinecap="round" />
            </g>

            {/* --- 現在の状態（アニメーション） --- */}
            {/* 上腕（固定） */}
            <line x1={ELBOW_X} y1={ELBOW_Y} x2={ELBOW_X} y2={ELBOW_Y - 120} stroke="#94a3b8" strokeWidth="12" strokeLinecap="round" />
            
            {/* 前腕（可動） */}
            <motion.line
              x1={ELBOW_X} y1={ELBOW_Y}
              x2={currentCoords.forearmEnd.x} y2={currentCoords.forearmEnd.y}
              stroke="#64748b" strokeWidth="12" strokeLinecap="round"
              animate={{ x2: currentCoords.forearmEnd.x, y2: currentCoords.forearmEnd.y }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
            />

            {/* 関節 */}
            <circle cx={ELBOW_X} cy={ELBOW_Y} r="8" fill="#cbd5e1" />

            {/* 筋肉（可動・収縮表現） */}
            <motion.line
              x1={currentCoords.muscleOrigin.x} y1={currentCoords.muscleOrigin.y}
              x2={currentCoords.muscleInsertion.x} y2={currentCoords.muscleInsertion.y}
              stroke="#ef4444" strokeWidth="8" strokeLinecap="round"
              animate={{ x2: currentCoords.muscleInsertion.x, y2: currentCoords.muscleInsertion.y }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
            />

            {/* --- モーメントアームの可視化（寸法線） --- */}
            <g>
              {/* 関節中心から作用点への線 */}
              <motion.line
                x1={ELBOW_X} y1={ELBOW_Y}
                x2={currentCoords.muscleInsertion.x} y2={currentCoords.muscleInsertion.y}
                stroke="#3b82f6" strokeWidth="2" strokeDasharray="2 2"
                className="opacity-50"
                animate={{ x2: currentCoords.muscleInsertion.x, y2: currentCoords.muscleInsertion.y }}
              />
              {/* 寸法線本体（関節の下に表示） */}
              <motion.line
                x1={ELBOW_X} y1={ELBOW_Y + 30}
                x2={currentCoords.muscleInsertion.x} y2={ELBOW_Y + 30}
                stroke="#3b82f6" strokeWidth="2"
                markerStart="url(#dimArrowStart)" markerEnd="url(#dimArrowEnd)"
                animate={{ x2: currentCoords.muscleInsertion.x }}
              />
              {/* 寸法線の補助線 */}
              <line x1={ELBOW_X} y1={ELBOW_Y} x2={ELBOW_X} y2={ELBOW_Y + 35} stroke="#3b82f6" strokeWidth="1" className="opacity-50" />
              <motion.line
                x1={currentCoords.muscleInsertion.x} y1={currentCoords.muscleInsertion.y}
                x2={currentCoords.muscleInsertion.x} y2={ELBOW_Y + 35}
                stroke="#3b82f6" strokeWidth="1" className="opacity-50"
                animate={{ x1: currentCoords.muscleInsertion.x, x2: currentCoords.muscleInsertion.x }}
              />
              {/* ラベル */}
              <motion.text
                x={ELBOW_X + (currentCoords.muscleInsertion.x - ELBOW_X) / 2}
                y={ELBOW_Y + 50}
                textAnchor="middle"
                className="text-xs fill-blue-600 font-bold font-mono"
                animate={{ x: ELBOW_X + (currentCoords.muscleInsertion.x - ELBOW_X) / 2 }}
              >
                $\rho$ = {(momentArmM * 100).toFixed(1)}cm
              </motion.text>
            </g>
            
            {/* 角度変化の可視化（収縮時のみ表示） */}
            {isContracted && (
              <g>
                {/* 角度の円弧（簡易表現） */}
                <path
                  d={`M ${ELBOW_X + 30} ${ELBOW_Y} A 30 30 0 0 0 ${ELBOW_X + 30 * Math.cos(currentAngleRad)} ${ELBOW_Y - 30 * Math.sin(currentAngleRad)}`}
                  fill="none" stroke="#ef4444" strokeWidth="2"
                />
                <text x={ELBOW_X + 40} y={ELBOW_Y - 10} className="text-lg fill-red-600 font-bold">
                  $dq \approx {angleChangeDeg.toFixed(0)}^\circ$
                </text>
              </g>
            )}

          </svg>
        </div>
      </div>
    </div>
  );
}
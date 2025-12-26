// components/TorqueVisualizer.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function TorqueVisualizer() {
  // 180度（伸展）〜15度（屈曲）の範囲
  const [angle, setAngle] = useState(180);

  // --- 定数設定 ---
  const MUSCLE_FORCE = 500; // 筋肉の力 (N)
  const INSERTION_DISTANCE = 0.05;
  
  // 【追加】視覚化用のスケール設定
  const TORQUE_SCALE = 4; // トルク(Nm)をピクセル長さに変換する係数
  const MIN_ARROW_LENGTH = 20; // 矢印の最小長さ(px)
  const MAX_ARROW_LENGTH = 100; // 矢印の最大長さ(px)

  // --- 計算ロジック ---
  const radian = (angle * Math.PI) / 180;
  const momentArm = INSERTION_DISTANCE * Math.sin(radian);
  const torque = Math.abs(MUSCLE_FORCE * momentArm);

  // --- SVG座標計算 ---
  const svgWidth = 320;
  const svgHeight = 350;
  const elbowX = svgWidth / 2;
  const elbowY = svgHeight * 0.45;
  const armLength = 120;

  const forearmEndX = elbowX + armLength * Math.sin(radian);
  const forearmEndY = elbowY - armLength * Math.cos(radian);

  const muscleOriginX = elbowX;
  const muscleOriginY = elbowY - 100;
  
  // 力の作用点（筋肉の前腕付着部）
  const insertionRatio = 0.3;
  const muscleInsertionX = elbowX + (armLength * insertionRatio) * Math.sin(radian);
  const muscleInsertionY = elbowY - (armLength * insertionRatio) * Math.cos(radian);

  // モーメントアーム可視化用の終点
  const momentArmEndX = muscleInsertionX - (momentArm * 150 * Math.cos(radian));
  const momentArmEndY = muscleInsertionY - (momentArm * 150 * Math.sin(radian));

  // --- 力のベクトル（矢印）の計算 ---
  // 【変更点1】トルクの大きさに応じて矢印の長さを計算（最小・最大値で制限）
  const calculatedArrowLength = torque * TORQUE_SCALE;
  const arrowLength = Math.min(Math.max(calculatedArrowLength, MIN_ARROW_LENGTH), MAX_ARROW_LENGTH);

  // 筋肉の方向ベクトル（単位ベクトル）
  const dx = muscleOriginX - muscleInsertionX;
  const dy = muscleOriginY - muscleInsertionY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const unitX = dx / length;
  const unitY = dy / length;

  // 矢印の終点座標
  const arrowEndX = muscleInsertionX + unitX * arrowLength;
  const arrowEndY = muscleInsertionY + unitY * arrowLength;


  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm my-8">
      <h3 className="text-xl font-bold text-slate-800 mb-2 text-center">
        💪 肘関節の角度とトルクのシミュレーション
      </h3>
      
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center mt-6">
        {/* アニメーション表示エリア */}
        <div className="relative bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
          <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
            <defs>
              {/* 【変更点2】矢印の先端サイズを小さく調整 */}
              <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                <polygon points="0 0, 6 2, 0 4" fill="#dc2626" />
              </marker>
            </defs>

            {/* 上腕骨・前腕骨・関節・筋肉本体（変更なし） */}
            <line x1={elbowX} y1={elbowY} x2={elbowX} y2={elbowY - 140} stroke="#cbd5e1" strokeWidth="14" strokeLinecap="round" />
            <motion.line
              x1={elbowX} y1={elbowY}
              x2={forearmEndX} y2={forearmEndY}
              stroke="#64748b" strokeWidth="14" strokeLinecap="round"
              animate={{ x2: forearmEndX, y2: forearmEndY }}
            />
            <circle cx={elbowX} cy={elbowY} r="10" fill="#94a3b8" />
            <motion.line
              x1={muscleOriginX} y1={muscleOriginY}
              x2={muscleInsertionX} y2={muscleInsertionY}
              stroke="#fca5a5" strokeWidth="10" strokeLinecap="round"
              animate={{ x2: muscleInsertionX, y2: muscleInsertionY }}
            />

            {/* 力のベクトル（鮮明な赤い矢印） */}
            <motion.line
              x1={muscleInsertionX} y1={muscleInsertionY}
              x2={arrowEndX} y2={arrowEndY}
              stroke="#dc2626" strokeWidth="4"
              markerEnd="url(#arrowhead)"
              // 始点と終点の両方をアニメーションさせることで長さの変化を表現
              animate={{ x1: muscleInsertionX, y1: muscleInsertionY, x2: arrowEndX, y2: arrowEndY }}
              // スムーズな伸縮のためのトランジション設定
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />

            {/* モーメントアーム(d)の可視化（変更なし） */}
            {angle < 178 && angle > 2 && (
              <>
                <motion.line
                  x1={elbowX} y1={elbowY}
                  x2={momentArmEndX} y2={momentArmEndY}
                  stroke="#3b82f6" strokeWidth="3" strokeDasharray="4 2"
                  animate={{ x2: momentArmEndX, y2: momentArmEndY }}
                />
                <motion.text x={elbowX + 10} y={elbowY + 20} className="text-xs fill-blue-600 font-bold">
                  d
                </motion.text>
              </>
            )}
          </svg>
          <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
            {angle}°
          </div>
        </div>

        {/* パラメーター表示エリア（変更なし） */}
        <div className="flex-1 w-full max-w-xs space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              肘の角度（15°〜180°）
            </label>
            <input
              type="range" min="15" max="180" value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>屈曲 (15°)</span>
              <span>伸展 (180°)</span>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">筋肉の力 ($F$)</span>
              <span className="font-mono font-bold text-slate-800">500 N (一定)</span>
            </div>
            <div className="flex justify-between items-center text-sm bg-blue-50 p-2 rounded-lg -mx-2">
              <span className="text-blue-800 font-bold">✕ モーメントアーム ($d$)</span>
              <span className="font-mono font-bold text-blue-600">
                {(momentArm * 100).toFixed(1)} cm
              </span>
            </div>
            <div className="border-t border-slate-300 my-2"></div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-slate-800">＝ 発揮トルク ($\tau$)</span>
              <span className="text-2xl font-mono font-extrabold text-red-600">
                {torque.toFixed(1)} <span className="text-sm">Nm</span>
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed bg-blue-50/50 p-3 rounded-lg border border-blue-100">
            <strong>専門解説:</strong><br/>
            赤い矢印の長さは、発揮される「トルク（回転力）」の大きさを表しています。90度付近で最も矢印が長くなり、180度や15度付近では短くなる様子から、角度による力の伝達効率の違いが直感的に理解できます。
          </p>
        </div>
      </div>
    </div>
  );
}
// components/TorqueVisualizer.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function TorqueVisualizer() {
  // 180度（伸展）〜15度（屈曲）の範囲に設定
  const [angle, setAngle] = useState(180);

  // --- 定数設定 ---
  const MUSCLE_FORCE = 500; 
  const INSERTION_DISTANCE = 0.05; 

  // --- 計算ロジック (物理モデル) ---
  const radian = (angle * Math.PI) / 180;
  // 180度(直立)でsin(180)=0となり、トルクが最小になる物理法則を再現
  const momentArm = INSERTION_DISTANCE * Math.sin(radian);
  const torque = Math.abs(MUSCLE_FORCE * momentArm);

  // --- SVG座標計算 ---
  const svgWidth = 320;
  const svgHeight = 350;
  const elbowX = svgWidth / 2;
  const elbowY = svgHeight * 0.45; // 中心付近に関節を配置
  const armLength = 120;

  // 【座標変換】180度(伸展)で真下、90度で水平、15度(屈曲)で真上に近くなるように計算
  const forearmEndX = elbowX + armLength * Math.sin(radian);
  const forearmEndY = elbowY - armLength * Math.cos(radian); 

  // 筋肉の付着点（上腕側・固定）
  const muscleOriginX = elbowX;
  const muscleOriginY = elbowY - 100;
  
  // 筋肉の付着点（前腕側・連動）
  const insertionRatio = 0.3;
  const muscleInsertionX = elbowX + (armLength * insertionRatio) * Math.sin(radian);
  const muscleInsertionY = elbowY - (armLength * insertionRatio) * Math.cos(radian);

  // モーメントアーム可視化用の終点
  const momentArmEndX = muscleInsertionX - (momentArm * 150 * Math.cos(radian));
  const momentArmEndY = muscleInsertionY - (momentArm * 150 * Math.sin(radian));

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm my-8">
      <h3 className="text-xl font-bold text-slate-800 mb-2 text-center">
        💪 肘関節の角度とトルクのシミュレーション
      </h3>
      
      

      <div className="flex flex-col md:flex-row gap-8 items-center justify-center mt-6">
        {/* アニメーション表示エリア */}
        <div className="relative bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
          <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
            {/* 上腕骨（固定） */}
            <line x1={elbowX} y1={elbowY} x2={elbowX} y2={elbowY - 140} stroke="#cbd5e1" strokeWidth="14" strokeLinecap="round" />
            
            {/* 前腕骨（可動） */}
            <motion.line
              x1={elbowX} y1={elbowY}
              x2={forearmEndX} y2={forearmEndY}
              stroke="#64748b" strokeWidth="14" strokeLinecap="round"
              animate={{ x2: forearmEndX, y2: forearmEndY }}
            />

            {/* 関節（肘） */}
            <circle cx={elbowX} cy={elbowY} r="10" fill="#94a3b8" />

            {/* 筋肉（上腕二頭筋をイメージ） */}
            <motion.line
              x1={muscleOriginX} y1={muscleOriginY}
              x2={muscleInsertionX} y2={muscleInsertionY}
              stroke="#ef4444" strokeWidth="10" strokeLinecap="round"
              animate={{ x2: muscleInsertionX, y2: muscleInsertionY }}
            />

            {/* モーメントアーム(d)の可視化 */}
            {angle < 178 && angle > 2 && (
              <motion.line
                x1={elbowX} y1={elbowY}
                x2={momentArmEndX} y2={momentArmEndY}
                stroke="#3b82f6" strokeWidth="3" strokeDasharray="4 2"
                animate={{ x2: momentArmEndX, y2: momentArmEndY }}
              />
            )}
          </svg>
          <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
            {angle}°
          </div>
        </div>

        {/* パラメーター表示エリア */}
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
              <span className="font-mono">500 N</span>
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
              <span className="text-2xl font-mono font-extrabold text-blue-600">
                {torque.toFixed(1)} <span className="text-sm">Nm</span>
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed bg-blue-50/50 p-3 rounded-lg border border-blue-100">
            <strong>専門解説:</strong><br/>
            腕が真っ直ぐ（180°）に近づくほど、筋肉の作用線が関節の中心を通るため、$d$ がゼロに近づきトルクが低下します。逆に90°付近で効率が最大化されます。
          </p>
        </div>
      </div>
    </div>
  );
}
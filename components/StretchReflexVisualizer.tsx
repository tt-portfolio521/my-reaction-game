"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
// @ts-ignore
import renderMathInElement from "katex/dist/contrib/auto-render";
import "katex/dist/katex.min.css";

export default function StretchReflexVisualizer() {
  const [phase, setPhase] = useState("idle");
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
  }, [phase]);

  const triggerReflex = () => {
    if (phase !== "idle") return;
    setPhase("strike");
    setTimeout(() => setPhase("sensory"), 600);
    setTimeout(() => setPhase("motor"), 1400);
    setTimeout(() => setPhase("extension"), 2000);
    setTimeout(() => setPhase("idle"), 4500);
  };

  // --- 座標設定 ---
  const svgWidth = 350;
  const svgHeight = 380;
  
  const knee = { x: 150, y: 150 };
  const hip = { x: 270, y: 150 };
  
  // 【修正1】下腿長を一定（約130px）に保つための座標計算
  const ankleIdle = { x: 150, y: 280 }; // 真下
  // 伸展時の座標を再計算 (長さ130pxを維持して左斜め前へ)
  const ankleExtended = { x: 50, y: 235 }; 

  // 脊髄の位置
  const spinalCord = { x: 280, y: 60 };

  // 大腿四頭筋のパス
  const musclePathIdle = `M ${hip.x} ${hip.y - 15} Q ${hip.x - 60} ${hip.y - 35}, ${knee.x} ${knee.y - 10} L ${knee.x} ${knee.y + 20}`;
  const musclePathExtended = `M ${hip.x} ${hip.y - 15} Q ${hip.x - 50} ${hip.y - 45}, ${knee.x + 5} ${knee.y - 15} L ${knee.x + 5} ${knee.y + 15}`;

  // 【修正4】膝蓋腱の付着点計算（脛骨の上部約20%の位置に追従させる）
  const getTibiaAttachment = (anklePos: {x: number, y: number}) => ({
    x: knee.x + (anklePos.x - knee.x) * 0.2,
    y: knee.y + (anklePos.y - knee.y) * 0.2,
  });
  const tibiaAttachIdle = getTibiaAttachment(ankleIdle);
  const tibiaAttachExtended = getTibiaAttachment(ankleExtended);
  const patellaBottom = { x: knee.x, y: knee.y + 12 }; // 膝蓋骨下端（固定点）

  return (
    <div ref={containerRef} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm my-8">
      <h3 className="text-xl font-bold text-slate-800 mb-6 text-center leading-tight">
        🦵 膝蓋腱反射（伸張反射）シミュレーター
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* --- 左側：アニメーションエリア --- */}
        <div className="relative bg-slate-50 rounded-2xl border border-slate-100 flex justify-center py-6 h-[400px]">
          <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="overflow-visible">
            
            {/* 脊髄 */}
            <rect x={spinalCord.x - 30} y={spinalCord.y - 40} width="60" height="80" rx="10" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
            <text x={spinalCord.x} y={spinalCord.y - 50} textAnchor="middle" className="text-[10px] fill-slate-400 font-bold uppercase">Spinal Cord</text>

            {/* 大腿骨 */}
            <line x1={hip.x} y1={hip.y} x2={knee.x} y2={knee.y} stroke="#cbd5e1" strokeWidth="20" strokeLinecap="round" />
            
            {/* 下腿骨（可動部） */}
            <motion.line
              x1={knee.x} y1={knee.y}
              x2={ankleIdle.x} y2={ankleIdle.y}
              stroke="#94a3b8" strokeWidth="16" strokeLinecap="round"
              animate={phase === "extension" ? { x2: ankleExtended.x, y2: ankleExtended.y } : { x2: ankleIdle.x, y2: ankleIdle.y }}
              transition={{ type: "spring", stiffness: 180, damping: 12 }}
            />

            {/* 膝関節 */}
            <circle cx={knee.x} cy={knee.y} r="14" fill="#cbd5e1" />

            {/* 【修正2】大腿四頭筋（太さを細く調整） */}
            <motion.path
              d={musclePathIdle}
              fill="none"
              stroke="#ef4444"
              strokeWidth={phase === "extension" ? "13" : "10"} // 18/14 -> 13/10 に変更
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ d: phase === "extension" ? musclePathExtended : musclePathIdle }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />

            {/* 【修正4】膝蓋腱（脚の動きに追従） */}
            <motion.line
              x1={patellaBottom.x} y1={patellaBottom.y}
              x2={tibiaAttachIdle.x} y2={tibiaAttachIdle.y}
              stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round"
              animate={phase === "extension" 
                ? { x2: tibiaAttachExtended.x, y2: tibiaAttachExtended.y } 
                : { x2: tibiaAttachIdle.x, y2: tibiaAttachIdle.y }
              }
              transition={{ type: "spring", stiffness: 180, damping: 12 }} // 脚と同じ動き設定
            />

            {/* 【修正3】神経経路（太く、濃くして視認性向上） */}
            <path d={`M ${knee.x + 10} ${knee.y - 10} C ${knee.x + 40} ${knee.y - 80}, ${spinalCord.x - 60} ${spinalCord.y + 40}, ${spinalCord.x} ${spinalCord.y}`} fill="none" stroke="#3b82f6" 
              strokeWidth="3" strokeDasharray="4 3" className="opacity-70" /> {/* width:2->3, opacity:40->70 */}
            {phase === "sensory" && (
              <motion.circle r="5" fill="#3b82f6" initial={{ offsetDistance: "0%" }} animate={{ offsetDistance: "100%" }} transition={{ duration: 0.7, ease: "linear" }} style={{ offsetPath: `path("M ${knee.x + 10} ${knee.y - 10} C ${knee.x + 40} ${knee.y - 80}, ${spinalCord.x - 60} ${spinalCord.y + 40}, ${spinalCord.x} ${spinalCord.y}")` }} />
            )}
            
            <path d={`M ${spinalCord.x} ${spinalCord.y} C ${spinalCord.x - 20} ${spinalCord.y - 40}, ${hip.x - 40} ${hip.y - 50}, ${hip.x - 60} ${hip.y - 20}`} fill="none" stroke="#ef4444" 
              strokeWidth="3" strokeDasharray="4 3" className="opacity-70" /> {/* width:2->3, opacity:40->70 */}
            {phase === "motor" && (
              <motion.circle r="5" fill="#ef4444" initial={{ offsetDistance: "0%" }} animate={{ offsetDistance: "100%" }} transition={{ duration: 0.7, ease: "linear" }} style={{ offsetPath: `path("M ${spinalCord.x} ${spinalCord.y} C ${spinalCord.x - 20} ${spinalCord.y - 40}, ${hip.x - 40} ${hip.y - 50}, ${hip.x - 60} ${hip.y - 20}")` }} />
            )}

            {/* ハンマー */}
            <motion.g
              initial={{ x: knee.x - 70, y: knee.y + 30, rotate: -45, scaleX: -1 }}
              animate={phase === "strike" ? { x: knee.x - 15, y: knee.y + 25, rotate: -10, scaleX: -1 } : { x: knee.x - 70, y: knee.y + 30, rotate: -45, scaleX: -1 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <rect x="0" y="-5" width="40" height="10" fill="#1e293b" rx="4" />
              <rect x="35" y="-15" width="10" height="30" fill="#475569" rx="2" />
            </motion.g>

            {/* ラベル */}
            <text x={hip.x - 80} y={hip.y - 30} className="text-[10px] fill-red-500 font-bold">大腿四頭筋</text>
            <text x={knee.x - 30} y={knee.y + 55} className="text-[10px] fill-slate-500">膝蓋腱</text>
          </svg>

          {/* フェーズ解説バッジ（変更なし） */}
          <div className="absolute top-4 left-4 bg-white/90 p-3 rounded-xl shadow-sm border border-slate-100 max-w-[160px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-[11px] leading-tight"
              >
                {phase === "idle" && <span className="text-slate-400 font-bold">待機中...<br/>ハンマーをクリック</span>}
                {phase === "strike" && <span className="text-orange-600 font-bold">1. 腱を打撃（左から）<br/><span className="font-normal text-slate-500 text-[10px]">筋肉が一瞬引き伸ばされます</span></span>}
                {phase === "sensory" && <span className="text-blue-600 font-bold">2. 感覚伝達 (求心)<br/><span className="font-normal text-slate-500 text-[10px]">筋紡錘から脊髄へ</span></span>}
                {phase === "motor" && <span className="text-red-600 font-bold">3. 運動指令 (遠心)<br/><span className="font-normal text-slate-500 text-[10px]">脊髄から筋肉へ</span></span>}
                {phase === "extension" && <span className="text-green-600 font-bold">4. 筋肉の収縮<br/><span className="font-normal text-slate-500 text-[10px]">膝が時計回りに伸展</span></span>}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* --- 右側：操作と解説（変更なし） --- */}
        <div className="space-y-6">
          <div className="text-center">
            <button
              onClick={triggerReflex}
              disabled={phase !== "idle"}
              className={`px-10 py-4 rounded-full font-bold text-lg transition-all ${
                phase === "idle" 
                ? "bg-slate-900 text-white hover:bg-black shadow-lg hover:scale-105 active:scale-95" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              腱を叩く（テスト実行）
            </button>
          </div>
          {/* (解説セクション省略) */}
        </div>
      </div>
    </div>
  );
}
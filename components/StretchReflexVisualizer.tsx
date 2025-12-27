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

  // 【修正】アニメーション速度を全体的に遅延
  const triggerReflex = () => {
    if (phase !== "idle") return;
    setPhase("strike");
    setTimeout(() => setPhase("sensory"), 1000);   // 打撃後の余韻を長く
    setTimeout(() => setPhase("motor"), 2500);     // 神経伝達の時間を確保
    setTimeout(() => setPhase("extension"), 4000); // 指令到達までの間隔
    setTimeout(() => setPhase("idle"), 8000);     // 終了後の待機
  };

  const svgWidth = 350;
  const svgHeight = 380;
  const knee = { x: 150, y: 150 };
  const hip = { x: 270, y: 150 };
  const ankleIdle = { x: 150, y: 280 };
  const ankleExtended = { x: 50, y: 235 }; 
  const spinalCordPos = { x: 280, y: 60 };

  const musclePathIdle = `M ${hip.x} ${hip.y - 15} Q ${hip.x - 60} ${hip.y - 25}, ${knee.x} ${knee.y - 10} L ${knee.x} ${knee.y + 20}`;
  const musclePathExtended = `M ${hip.x} ${hip.y - 15} Q ${hip.x - 50} ${hip.y - 50}, ${knee.x + 5} ${knee.y - 15} L ${knee.x + 5} ${knee.y + 15}`;

  const getTibiaAttachment = (anklePos: {x: number, y: number}) => ({
    x: knee.x + (anklePos.x - knee.x) * 0.2,
    y: knee.y + (anklePos.y - knee.y) * 0.2,
  });
  const tibiaAttachIdle = getTibiaAttachment(ankleIdle);
  const tibiaAttachExtended = getTibiaAttachment(ankleExtended);
  const patellaBottom = { x: knee.x, y: knee.y + 12 };

  return (
    <div ref={containerRef} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm my-8">
      <h3 className="text-xl font-bold text-slate-800 mb-6 text-center leading-tight">
        🦵 膝蓋腱反射（伸張反射）シミュレーター
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="relative bg-slate-50 rounded-2xl border border-slate-100 flex justify-center py-6 h-[400px]">
          <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="overflow-visible">
            
            {/* 脊髄 */}
            <g transform={`translate(${spinalCordPos.x - 35}, ${spinalCordPos.y - 40})`}>
              <rect width="70" height="85" rx="15" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
              <path 
                d="M 15 25 Q 25 42, 15 60 M 55 25 Q 45 42, 55 60 M 20 42 L 50 42" 
                fill="none" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" 
              />
              <text x="35" y="100" textAnchor="middle" className="text-[11px] fill-slate-500 font-bold">脊髄</text>
            </g>

            {/* 大腿骨 */}
            <line x1={hip.x} y1={hip.y} x2={knee.x} y2={knee.y} stroke="#cbd5e1" strokeWidth="20" strokeLinecap="round" />
            
            {/* 下腿骨 */}
            <motion.line
              x1={knee.x} y1={knee.y}
              x2={ankleIdle.x} y2={ankleIdle.y}
              stroke="#94a3b8" strokeWidth="16" strokeLinecap="round"
              animate={phase === "extension" ? { x2: ankleExtended.x, y2: ankleExtended.y } : { x2: ankleIdle.x, y2: ankleIdle.y }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }} // 速度調整
            />

            {/* 膝関節 */}
            <circle cx={knee.x} cy={knee.y} r="14" fill="#cbd5e1" />

            {/* 筋肉 */}
            <motion.path
              d={musclePathIdle}
              fill="none"
              stroke="#ef4444"
              strokeWidth={phase === "extension" ? "15" : "8"} 
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ d: phase === "extension" ? musclePathExtended : musclePathIdle }}
              transition={{ duration: 0.8, ease: "easeInOut" }} // 収縮をゆっくり
            />
            {/* 【修正】筋肉の近くにテキストを配置 */}
            <text x={hip.x - 70} y={hip.y - 45} className="text-[10px] fill-red-500 font-bold">大腿四頭筋</text>

            {/* 膝蓋腱 */}
            <motion.line
              x1={patellaBottom.x} y1={patellaBottom.y}
              x2={tibiaAttachIdle.x} y2={tibiaAttachIdle.y}
              stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round"
              animate={phase === "extension" ? { x2: tibiaAttachExtended.x, y2: tibiaAttachExtended.y } : { x2: tibiaAttachIdle.x, y2: tibiaAttachIdle.y }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            />
            <text x={knee.x + 15} y={knee.y + 45} className="text-[10px] fill-slate-500">膝蓋腱</text>

            {/* 神経回路 - Ia群求心性神経（青） */}
            <path d={`M ${knee.x + 10} ${knee.y - 10} C ${knee.x + 40} ${knee.y - 80}, ${spinalCordPos.x - 60} ${spinalCordPos.y + 40}, ${spinalCordPos.x} ${spinalCordPos.y}`} fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="4 3" className="opacity-70" />
            {/* 【修正】青色点線の近くに配置 */}
            <text x={knee.x + 55} y={knee.y - 55} className="text-[9px] fill-blue-500 font-bold">Ia群求心性神経 (求心)</text>
            
            {phase === "sensory" && (
              <motion.circle r="5" fill="#3b82f6" initial={{ offsetDistance: "0%" }} animate={{ offsetDistance: "100%" }} transition={{ duration: 1.5, ease: "linear" }} style={{ offsetPath: `path("M ${knee.x + 10} ${knee.y - 10} C ${knee.x + 40} ${knee.y - 80}, ${spinalCordPos.x - 60} ${spinalCordPos.y + 40}, ${spinalCordPos.x} ${spinalCordPos.y}")` }} />
            )}
            
            {/* 神経回路 - α運動ニューロン（赤） */}
            <path d={`M ${spinalCordPos.x} ${spinalCordPos.y} C ${spinalCordPos.x - 20} ${spinalCordPos.y - 40}, ${hip.x - 40} ${hip.y - 50}, ${hip.x - 60} ${hip.y - 20}`} fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="4 3" className="opacity-70" />
            {/* 【修正】赤色点線の近くに配置 */}
            <text x={hip.x - 60} y={hip.y - 65} className="text-[9px] fill-red-500 font-bold">α運動ニューロン (遠心)</text>
            
            {phase === "motor" && (
              <motion.circle r="5" fill="#ef4444" initial={{ offsetDistance: "0%" }} animate={{ offsetDistance: "100%" }} transition={{ duration: 1.5, ease: "linear" }} style={{ offsetPath: `path("M ${spinalCordPos.x} ${spinalCordPos.y} C ${spinalCordPos.x - 20} ${spinalCordPos.y - 40}, ${hip.x - 40} ${hip.y - 50}, ${hip.x - 60} ${hip.y - 20}")` }} />
            )}

            {/* ハンマー */}
            <motion.g
              initial={{ x: knee.x - 70, y: knee.y + 30, rotate: -45, scaleX: -1 }}
              animate={phase === "strike" ? { x: knee.x - 15, y: knee.y + 25, rotate: -10, scaleX: -1 } : { x: knee.x - 70, y: knee.y + 30, rotate: -45, scaleX: -1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <rect x="0" y="-5" width="40" height="10" fill="#1e293b" rx="4" />
              <rect x="35" y="-15" width="10" height="30" fill="#475569" rx="2" />
            </motion.g>

          </svg>

          {/* フェーズ解説バッジ */}
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
                {phase === "strike" && <span className="text-orange-600 font-bold">1. 腱を打撃<br/><span className="font-normal text-slate-500 text-[10px]">筋肉が伸張されます</span></span>}
                {phase === "sensory" && <span className="text-blue-600 font-bold">2. 感覚伝達<br/><span className="font-normal text-slate-500 text-[10px]">Ia群線維が脊髄へ</span></span>}
                {phase === "motor" && <span className="text-red-600 font-bold">3. 運動指令<br/><span className="font-normal text-slate-500 text-[10px]">運動ニューロンが指令</span></span>}
                {phase === "extension" && <span className="text-green-600 font-bold">4. 筋肉の収縮<br/><span className="font-normal text-slate-500 text-[10px]">膝が伸展</span></span>}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

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
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="text-blue-500">●</span> 伸張反射のメカニズム
            </h4>
            <div className="space-y-4 text-sm leading-relaxed text-slate-600 text-[13px]">
              <p>
                ハンマーで膝蓋腱を叩くと、大腿四頭筋が受動的に引き伸ばされます。筋肉内の筋紡錘がこれを感知し、信号が送られます。
              </p>
              <ul className="space-y-2 list-none p-0">
                <li className="flex gap-2">
                  <span className="font-bold text-blue-600">求心路:</span> <strong>Ia群求心性神経</strong>が脊髄の灰白質（蝶のような形の部分）へ信号を伝達します。
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-red-600">遠心路:</span> 脊髄で直接シナプス伝達が行われ、<strong>α運動ニューロン</strong>が筋肉へ収縮指令を出します。
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
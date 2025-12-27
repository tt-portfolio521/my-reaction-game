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
    setTimeout(() => setPhase("sensory"), 1000);
    setTimeout(() => setPhase("motor"), 2500);
    setTimeout(() => setPhase("extension"), 4000);
    setTimeout(() => setPhase("idle"), 8000);
  };

  const svgWidth = 350;
  const svgHeight = 380;

  // 配置設定
  const knee = { x: 110, y: 190 };
  const hip = { x: 230, y: 190 };
  const ankleIdle = { x: 110, y: 320 };
  const ankleExtended = { x: 20, y: 275 };
  const spinalCordPos = { x: 300, y: 60 };

  const musclePathIdle = `M ${hip.x} ${hip.y - 15} Q ${hip.x - 60} ${hip.y - 25}, ${knee.x} ${knee.y - 10} L ${knee.x} ${knee.y + 20}`;
  const musclePathExtended = `M ${hip.x} ${hip.y - 15} Q ${hip.x - 50} ${hip.y - 50}, ${knee.x + 5} ${knee.y - 15} L ${knee.x + 5} ${knee.y + 15}`;

  // 神経経路のパスデータ
  const sensoryPathD = `M ${knee.x + 10} ${knee.y - 10} C ${knee.x + 40} ${knee.y - 120}, ${spinalCordPos.x - 60} ${spinalCordPos.y + 40}, ${spinalCordPos.x} ${spinalCordPos.y}`;
  const motorPathD = `M ${spinalCordPos.x} ${spinalCordPos.y} C ${spinalCordPos.x - 20} ${spinalCordPos.y - 40}, ${hip.x - 40} ${hip.y - 50}, ${hip.x - 60} ${hip.y - 20}`;

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
              {/* 脊髄ラベル：骨の上側 */}
              <text x="35" y="-10" textAnchor="middle" className="text-[11px] fill-slate-500 font-bold">脊髄</text>
            </g>

            <line x1={hip.x} y1={hip.y} x2={knee.x} y2={knee.y} stroke="#cbd5e1" strokeWidth="20" strokeLinecap="round" />
            
            <motion.line
              x1={knee.x} y1={knee.y}
              x2={ankleIdle.x} y2={ankleIdle.y}
              stroke="#94a3b8" strokeWidth="16" strokeLinecap="round"
              animate={phase === "extension" ? { x2: ankleExtended.x, y2: ankleExtended.y } : { x2: ankleIdle.x, y2: ankleIdle.y }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            />

            <circle cx={knee.x} cy={knee.y} r="14" fill="#cbd5e1" />

            {/* 筋肉 */}
            <motion.path
              d={musclePathIdle}
              fill="none"
              stroke="#ef4444"
              strokeWidth={phase === "extension" ? "9" : "6"} 
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ d: phase === "extension" ? musclePathExtended : musclePathIdle }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            {/* 【修正】大腿四頭筋ラベル：位置を左へ (hip.x - 30 -> hip.x - 80) */}
            <text x={hip.x - 80} y={hip.y - 28} className="text-[10px] fill-red-500 font-bold text-shadow">大腿四頭筋</text>

            {/* 膝蓋腱 */}
            <motion.line
              x1={patellaBottom.x} y1={patellaBottom.y}
              x2={tibiaAttachIdle.x} y2={tibiaAttachIdle.y}
              stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round"
              animate={phase === "extension" ? { x2: tibiaAttachExtended.x, y2: tibiaAttachExtended.y } : { x2: tibiaAttachIdle.x, y2: tibiaAttachIdle.y }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            />
            <text x={knee.x + 15} y={knee.y + 45} className="text-[10px] fill-slate-500">膝蓋腱</text>

            {/* Ia群求心性神経（青） */}
            <path d={sensoryPathD} fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="4 3" className="opacity-70" />
            {/* 【修正】求心性神経ラベル：さらに左へ (knee.x + 15 -> knee.x - 50) */}
            <text x={knee.x - 50} y={knee.y - 85} className="text-[9px] fill-blue-500 font-bold">Ia群求心性神経 (求心)</text>
            
            {phase === "sensory" && (
              /* 【修正】〇を経路に沿わせる：offsetPathにpath()関数を適用し、CSS変数を介さず直接制御 */
              <motion.circle 
                r="6" fill="#3b82f6" 
                initial={{ offsetDistance: "0%", opacity: 0 }} 
                animate={{ offsetDistance: "100%", opacity: 1 }} 
                transition={{ duration: 1.5, ease: "linear" }}
                style={{ offsetPath: `path("${sensoryPathD}")`, offsetRotate: "0deg" }}
              />
            )}
            
            {/* α運動ニューロン（赤） */}
            <path d={motorPathD} fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="4 3" className="opacity-70" />
            {/* 【修正】運動ニューロンラベル：右へ (hip.x - 45 -> hip.x + 20) */}
            <text x={hip.x + 20} y={hip.y - 65} className="text-[9px] fill-red-500 font-bold">α運動ニューロン (遠心)</text>
            
            {phase === "motor" && (
              /* 【修正】〇を経路に沿わせる */
              <motion.circle 
                r="6" fill="#ef4444" 
                initial={{ offsetDistance: "0%", opacity: 0 }} 
                animate={{ offsetDistance: "100%", opacity: 1 }} 
                transition={{ duration: 1.5, ease: "linear" }}
                style={{ offsetPath: `path("${motorPathD}")`, offsetRotate: "0deg" }}
              />
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
          {/* メカニズム解説（引用元に基づく正確な表現） */}
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
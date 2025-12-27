"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
// @ts-ignore
import renderMathInElement from "katex/dist/contrib/auto-render";
import "katex/dist/katex.min.css";

export default function StretchReflexVisualizer() {
  // 反射のステート管理: idle -> strike -> sensory -> motor -> extension -> reset
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

  // 反射アニメーションの実行
  const triggerReflex = () => {
    if (phase !== "idle") return;

    setPhase("strike");
    setTimeout(() => setPhase("sensory"), 600);   // 1. 打撃
    setTimeout(() => setPhase("motor"), 1400);    // 2. Ⅰa群求心性神経の伝達
    setTimeout(() => setPhase("extension"), 2000);// 3. 運動ニューロンの活性化と伸展
    setTimeout(() => setPhase("idle"), 4500);     // リセット
  };

  // SVG座標設定
  const hip = { x: 100, y: 100 };
  const knee = { x: 100, y: 220 };
  const ankleIdle = { x: 100, y: 340 };
  const ankleExtended = { x: 180, y: 300 };
  const spinalCord = { x: 300, y: 80 };

  return (
    <div ref={containerRef} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm my-8">
      <h3 className="text-xl font-bold text-slate-800 mb-6 text-center leading-tight">
        🦵 膝蓋腱反射（伸張反射）シミュレーター
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* --- 左側：アニメーションエリア --- */}
        <div className="relative bg-slate-50 rounded-2xl border border-slate-100 flex justify-center py-10 h-[400px]">
          <svg width="350" height="380" viewBox="0 0 350 380" className="overflow-visible">
            {/* 脊髄（中枢） */}
            <rect x="270" y="40" width="60" height="80" rx="10" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
            <text x="300" y="30" textAnchor="middle" className="text-[10px] fill-slate-400 font-bold uppercase">Spinal Cord (脊髄)</text>

            {/* 大腿（上腕 bone） */}
            <line x1={hip.x} y1={hip.y} x2={knee.x} y2={knee.y} stroke="#cbd5e1" strokeWidth="15" strokeLinecap="round" />
            
            {/* 下腿（可動部） */}
            <motion.line
              x1={knee.x} y1={knee.y}
              x2={ankleIdle.x} y2={ankleIdle.y}
              stroke="#94a3b8" strokeWidth="15" strokeLinecap="round"
              animate={phase === "extension" ? { x2: ankleExtended.x, y2: ankleExtended.y } : { x2: ankleIdle.x, y2: ankleIdle.y }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            />

            {/* 大腿四頭筋（収縮する筋肉） */}
            <motion.path
              d={phase === "extension" 
                ? `M ${hip.x-10} ${hip.y} Q ${hip.x-25} ${knee.y-60}, ${knee.x-5} ${knee.y-10}`
                : `M ${hip.x-10} ${hip.y} Q ${hip.x-15} ${knee.y-60}, ${knee.x-5} ${knee.y-10}`
              }
              fill="none" stroke="#ef4444" strokeWidth={phase === "extension" ? "14" : "10"} strokeLinecap="round"
              animate={{ d: phase === "extension" 
                ? `M ${hip.x-10} ${hip.y} Q ${hip.x-25} ${knee.y-60}, ${knee.x-5} ${knee.y-10}`
                : `M ${hip.x-10} ${hip.y} Q ${hip.x-15} ${knee.y-60}, ${knee.x-5} ${knee.y-10}`
              }}
            />

            {/* Ⅰa群求心性神経（青：感覚） */}
            <path d={`M ${knee.x} ${knee.y} C 200 200, 250 100, ${spinalCord.x} ${spinalCord.y}`} fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" className="opacity-30" />
            {phase === "sensory" && (
              <motion.circle r="4" fill="#3b82f6" initial={{ offsetDistance: "0%" }} animate={{ offsetDistance: "100%" }} transition={{ duration: 0.8 }} style={{ offsetPath: `path("M ${knee.x} ${knee.y} C 200 200, 250 100, ${spinalCord.x} ${spinalCord.y}")` }} />
            )}

            {/* 運動ニューロン（赤：指令） */}
            <path d={`M ${spinalCord.x} ${spinalCord.y} C 250 120, 180 180, ${hip.x} ${hip.y+40}`} fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" className="opacity-30" />
            {phase === "motor" && (
              <motion.circle r="4" fill="#ef4444" initial={{ offsetDistance: "0%" }} animate={{ offsetDistance: "100%" }} transition={{ duration: 0.8 }} style={{ offsetPath: `path("M ${spinalCord.x} ${spinalCord.y} C 250 120, 180 180, ${hip.x} ${hip.y+40}")` }} />
            )}

            {/* ハンマー（打撃） */}
            <motion.g
              initial={{ x: 50, y: 220, rotate: -45 }}
              animate={phase === "strike" ? { rotate: 0, x: 85 } : { rotate: -45, x: 50 }}
              transition={{ duration: 0.2 }}
            >
              <rect x="0" y="0" width="10" height="40" fill="#475569" rx="2" />
              <rect x="-10" y="-10" width="30" height="15" fill="#1e293b" rx="4" />
            </motion.g>

            {/* ラベル */}
            <text x={hip.x-30} y={hip.y+50} className="text-[10px] fill-red-500 font-bold" style={{ writingMode: 'vertical-rl' }}>大腿四頭筋</text>
            <text x={knee.x+10} y={knee.y+10} className="text-[10px] fill-slate-500">膝蓋腱</text>
          </svg>

          {/* フェーズ解説バッジ */}
          <div className="absolute top-4 right-4 bg-white/90 p-3 rounded-xl shadow-sm border border-slate-100 max-w-[150px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-[11px] leading-tight"
              >
                {phase === "idle" && <span className="text-slate-400 font-bold">待機中... ハンマーをクリックしてください</span>}
                {phase === "strike" && <span className="text-orange-600 font-bold">1. 腱を打撃<br/><span className="font-normal text-slate-500 text-[10px]">筋肉が急激に伸展されます</span></span>}
                {phase === "sensory" && <span className="text-blue-600 font-bold">2. 感覚伝達<br/><span className="font-normal text-slate-500 text-[10px]">Ⅰa求心性神経が脊髄へ信号を送る</span></span>}
                {phase === "motor" && <span className="text-red-600 font-bold">3. 運動指令<br/><span className="font-normal text-slate-500 text-[10px]">運動ニューロンが活性化</span></span>}
                {phase === "extension" && <span className="text-green-600 font-bold">4. 筋肉の収縮<br/><span className="font-normal text-slate-500 text-[10px]">膝関節が伸展（跳ね上がる）</span></span>}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* --- 右側：操作と解説 --- */}
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
            <div className="space-y-4 text-sm leading-relaxed text-slate-600">
              <p>
                伸張反射（Stretch Reflex）は、筋肉が受動的に引き伸ばされた際に、その筋肉を収縮させて長さを元に戻そうとする<strong>単シナプス反射</strong>です。
              </p>
              <ul className="space-y-2 list-none p-0">
                <li className="flex gap-2">
                  <span className="font-bold text-slate-800">①</span> 膝蓋腱が叩かれると、大腿四頭筋が急激に引き伸ばされます。
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-slate-800">②</span> 筋肉内の<strong>筋紡錘</strong>がこれを感知し、<strong>Ⅰa群求心性神経</strong>を通じて脊髄へ信号を送ります。
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-slate-800">③</span> 脊髄内でα運動ニューロンに直接伝達され、瞬時に筋肉への収縮指令が出されます。
                </li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-[13px] text-amber-900 leading-snug">
            💡 <strong>アドセンス対策のヒント:</strong><br/>
            この「不随意運動」の理解は、人間工学における「反応時間」と「反射時間」の違いを説明する際に非常に重要です。脊髄レベルで処理されるため、脳を経由する随意的反応（前回の反射神経テスト）よりも圧倒的に高速です。
          </div>
        </div>
      </div>
    </div>
  );
}
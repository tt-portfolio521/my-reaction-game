"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate, MotionValue } from "framer-motion";
// @ts-ignore
import renderMathInElement from "katex/dist/contrib/auto-render";
import "katex/dist/katex.min.css";

export default function StretchReflexVisualizer() {
  const [phase, setPhase] = useState("idle");
  const containerRef = useRef<HTMLDivElement>(null);

  // --- 神経伝達アニメーション用の設定 ---
  const sensoryPathRef = useRef<SVGPathElement>(null);
  const motorPathRef = useRef<SVGPathElement>(null);
  const sensoryProgress = useMotionValue(0);
  const motorProgress = useMotionValue(0);

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

  // アニメーション制御ロジック
  const triggerReflex = () => {
    if (phase !== "idle") return;
    setPhase("strike");
    setTimeout(() => setPhase("sensory"), 1200);   // 打撃の余韻
    setTimeout(() => setPhase("motor"), 3500);     // 求心性神経の伝達時間
    setTimeout(() => setPhase("extension"), 5800); // 遠心性神経の伝達時間
    setTimeout(() => setPhase("idle"), 10000);    // 完了後の静止
  };

  useEffect(() => {
    if (phase === "sensory") {
      sensoryProgress.set(0);
      animate(sensoryProgress, 1, { duration: 2.0, ease: "linear" });
    } else if (phase === "motor") {
      motorProgress.set(0);
      animate(motorProgress, 1, { duration: 2.0, ease: "linear" });
    }
  }, [phase, sensoryProgress, motorProgress]);

  // パス上の座標を動的に取得する関数
  const usePathPosition = (pathRef: React.RefObject<SVGPathElement | null>, progress: MotionValue<number>) => {
    const x = useTransform(progress, (p) => {
      if (!pathRef.current) return 0;
      const length = pathRef.current.getTotalLength();
      return pathRef.current.getPointAtLength(length * p).x;
    });
    const y = useTransform(progress, (p) => {
      if (!pathRef.current) return 0;
      const length = pathRef.current.getTotalLength();
      return pathRef.current.getPointAtLength(length * p).y;
    });
    return { x, y };
  };

  const sensoryPos = usePathPosition(sensoryPathRef, sensoryProgress);
  const motorPos = usePathPosition(motorPathRef, motorProgress);

  // --- 座標・デザイン設定 ---
  const svgWidth = 350;
  const svgHeight = 380;
  const knee = { x: 110, y: 190 };
  const hip = { x: 230, y: 190 };
  const ankleIdle = { x: 110, y: 320 };
  const ankleExtended = { x: 20, y: 275 };
  const spinalCordPos = { x: 300, y: 60 };

  const sensoryPathD = `M ${knee.x + 10} ${knee.y - 10} C ${knee.x + 40} ${knee.y - 120}, ${spinalCordPos.x - 60} ${spinalCordPos.y + 40}, ${spinalCordPos.x} ${spinalCordPos.y}`;
  const motorPathD = `M ${spinalCordPos.x} ${spinalCordPos.y} C ${spinalCordPos.x - 20} ${spinalCordPos.y - 40}, ${hip.x - 40} ${hip.y - 50}, ${hip.x - 60} ${hip.y - 20}`;
  
  const musclePathIdle = `M ${hip.x} ${hip.y - 15} Q ${hip.x - 60} ${hip.y - 25}, ${knee.x} ${knee.y - 10} L ${knee.x} ${knee.y + 20}`;
  const musclePathExtended = `M ${hip.x} ${hip.y - 15} Q ${hip.x - 50} ${hip.y - 50}, ${knee.x + 5} ${knee.y - 15} L ${knee.x + 5} ${knee.y + 15}`;

  const patellaBottom = { x: knee.x, y: knee.y + 12 };
  const tibiaAttachIdle = { x: knee.x, y: knee.y + 38 }; 
  const tibiaAttachExtended = { x: knee.x - 18, y: knee.y + 34 };

  return (
    <div ref={containerRef} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm my-8">
      <h3 className="text-xl font-bold text-slate-800 mb-6 text-center leading-tight">
        🦵 膝蓋腱反射（伸張反射）シミュレーター
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="relative bg-slate-50 rounded-2xl border border-slate-100 flex justify-center py-6 h-[400px]">
          <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="overflow-visible">
            
            {/* 脊髄 */}
            <g transform={`translate(${spinalCordPos.x - 35}, ${spinalCordPos.y - 40})`}>
              <rect width="70" height="85" rx="15" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
              <path d="M 15 25 Q 25 42, 15 60 M 55 25 Q 45 42, 55 60 M 20 42 L 50 42" fill="none" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
              <text x="35" y="-10" textAnchor="middle" className="text-[11px] fill-slate-500 font-bold">脊髄</text>
            </g>

            <line x1={hip.x} y1={hip.y} x2={knee.x} y2={knee.y} stroke="#cbd5e1" strokeWidth="20" strokeLinecap="round" />
            
            {/* 下腿骨 */}
            <motion.line
              x1={knee.x} y1={knee.y}
              x2={ankleIdle.x} y2={ankleIdle.y}
              stroke="#94a3b8" strokeWidth="16" strokeLinecap="round"
              animate={phase === "extension" ? { x2: ankleExtended.x, y2: ankleExtended.y } : { x2: ankleIdle.x, y2: ankleIdle.y }}
              transition={{ type: "spring", stiffness: 60, damping: 15 }}
            />

            <circle cx={knee.x} cy={knee.y} r="14" fill="#cbd5e1" />

            {/* 大腿四頭筋 */}
            <motion.path
              d={phase === "extension" ? musclePathExtended : musclePathIdle}
              fill="none"
              stroke="#ef4444"
              strokeWidth={phase === "extension" ? "9" : "6"} 
              strokeLinecap="round"
              animate={{ d: phase === "extension" ? musclePathExtended : musclePathIdle }}
              transition={{ duration: 1.0 }}
            />
            <text x={hip.x - 50} y={hip.y - 28} className="text-[10px] fill-red-500 font-bold">大腿四頭筋</text>

            {/* 膝蓋腱 */}
            <motion.line
              x1={patellaBottom.x} y1={patellaBottom.y}
              x2={tibiaAttachIdle.x} y2={tibiaAttachIdle.y}
              stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round"
              animate={phase === "extension" ? { x2: tibiaAttachExtended.x, y2: tibiaAttachExtended.y } : { x2: tibiaAttachIdle.x, y2: tibiaAttachIdle.y }}
              transition={{ type: "spring", stiffness: 60, damping: 15 }}
            />
            <text x={knee.x + 15} y={knee.y + 45} className="text-[10px] fill-slate-500">膝蓋腱</text>

            {/* Ia群求心性神経（青） */}
            <path ref={sensoryPathRef} d={sensoryPathD} fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="4 3" className="opacity-70" />
            <text x={knee.x - 50} y={knee.y - 85} className="text-[9px] fill-blue-500 font-bold">Ia群求心性神経 (求心)</text>
            
            {phase === "sensory" && (
              <motion.circle r="6" fill="#3b82f6" style={{ cx: sensoryPos.x, cy: sensoryPos.y }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
            )}
            
            {/* α運動ニューロン（赤） */}
            <path ref={motorPathRef} d={motorPathD} fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="4 3" className="opacity-70" />
            <text x={hip.x + 10} y={hip.y - 65} className="text-[9px] fill-red-500 font-bold">α運動ニューロン (遠心)</text>
            
            {phase === "motor" && (
              <motion.circle r="6" fill="#ef4444" style={{ cx: motorPos.x, cy: motorPos.y }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
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
              <motion.div key={phase} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-[11px] leading-tight" >
                {phase === "idle" && <span className="text-slate-400 font-bold">待機中...<br/>ハンマーをクリック</span>}
                {phase === "strike" && <span className="text-orange-600 font-bold">1. 腱を打撃<br/><span className="font-normal text-slate-500 text-[10px]">筋肉が伸張されます</span></span>}
                {phase === "sensory" && <span className="text-blue-600 font-bold">2. 感覚伝達<br/><span className="font-normal text-slate-500 text-[10px]">Ia群線維が脊髄へ</span></span>}
                {phase === "motor" && <span className="text-red-600 font-bold">3. 運動指令<br/><span className="font-normal text-slate-500 text-[10px]">運動ニューロンが指令</span></span>}
                {phase === "extension" && <span className="text-green-600 font-bold">4. 筋肉の収縮<br/><span className="font-normal text-slate-500 text-[10px]">膝が伸展</span></span>}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* 右側解説パネル */}
        <div className="space-y-6 text-slate-700">
          <div className="text-center">
            <button onClick={triggerReflex} disabled={phase !== "idle"} className={`w-full md:w-auto px-10 py-4 rounded-full font-bold text-lg transition-all ${phase === "idle" ? "bg-slate-900 text-white hover:bg-black shadow-lg hover:scale-105 active:scale-95" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`} >腱を叩く（テスト実行）</button>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><span className="text-blue-500">●</span> 伸張反射のメカニズム</h4>
            <div className="space-y-4 text-sm leading-relaxed text-[13px]">
              <p>膝蓋腱を叩くと大腿四頭筋が急激に伸張されます。この変化を筋肉内の筋紡錘が感知し、信号が脊髄へ送られます。</p>
              
              {/* 修正箇所：flex を削除し、テキストの自然な折り返しを許可 */}
              <ul className="space-y-3 list-none p-0 mt-4">
                <li className="leading-relaxed">
                  <span className="font-bold text-blue-600 mr-1">求心路:</span>
                  <strong>Ia群求心性神経</strong>が信号を脊髄の灰白質へ伝達します。
                </li>
                <li className="leading-relaxed">
                  <span className="font-bold text-red-600 mr-1">遠心路:</span>
                  脊髄内で運動指令に変換され、<strong>α運動ニューロン</strong>が筋肉を収縮させます。
                </li>
              </ul>
              
              <p className="pt-2 border-t border-slate-200 mt-2">これは脳を経由しない「不随意運動」であり、姿勢維持などに重要な役割を果たします。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
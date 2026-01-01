"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, ArrowLeft, Grid3x3, Timer, MousePointerClick } from "lucide-react";
import Link from "next/link";

// 難易度設定
const LEVELS = {
  level1: { count: 9, label: "LEVEL 1 (1~9)", color: "bg-blue-500", text: "text-blue-600", particle: "bg-blue-400", btnSize: 18 },
  level2: { count: 16, label: "LEVEL 2 (1~16)", color: "bg-green-500", text: "text-green-600", particle: "bg-green-400", btnSize: 14 },
  level3: { count: 25, label: "LEVEL 3 (1~25)", color: "bg-orange-500", text: "text-orange-600", particle: "bg-orange-400", btnSize: 10 },
};

type LevelKey = keyof typeof LEVELS;
type Position = { top: number; left: number };
type Explosion = { id: number; x: number; y: number; color: string };

// 💥 爆発エフェクトコンポーネント
const ExplosionEffect = ({ x, y, color }: { x: number; y: number; color: string }) => {
  return (
    <div
      className="absolute pointer-events-none z-20"
      style={{ left: `${x}%`, top: `${y}%`, width: 0, height: 0 }}
    >
      {[...Array(8)].map((_, i) => {
        // 角度と距離をランダムに計算
        const angle = (i * 45) + (Math.random() * 20 - 10); // 8方向にバラす
        const dist = 30 + Math.random() * 30; // 飛び散る距離(px)
        const rad = (angle * Math.PI) / 180;
        const xMove = Math.cos(rad) * dist;
        const yMove = Math.sin(rad) * dist;

        return (
          <motion.div
            key={i}
            className={`absolute rounded-full ${color}`}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: xMove,
              y: yMove,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ width: 8, height: 8, marginLeft: -4, marginTop: -4 }}
          />
        );
      })}
    </div>
  );
};

export default function NumberScanGame() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [level, setLevel] = useState<LevelKey>("level2");
  const [numbers, setNumbers] = useState<number[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [nextNumber, setNextNumber] = useState(1);
  const [explosions, setExplosions] = useState<Explosion[]>([]); // 爆発管理用
  
  const [startTime, setStartTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [penaltyTime, setPenaltyTime] = useState(0);
  const [shake, setShake] = useState(false);

  // 座標生成 (変更なし)
  const generatePositions = (count: number, btnSize: number): Position[] => {
    const newPositions: Position[] = [];
    const maxAttempts = 500;
    for (let i = 0; i < count; i++) {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < maxAttempts) {
        const top = Math.random() * (100 - btnSize);
        const left = Math.random() * (100 - btnSize);
        const overlap = newPositions.some((pos) => {
          const xDist = Math.abs(pos.left - left);
          const yDist = Math.abs(pos.top - top);
          return xDist < btnSize * 1.1 && yDist < btnSize * 1.1;
        });
        if (!overlap) {
          newPositions.push({ top, left });
          placed = true;
        }
        attempts++;
      }
      if (!placed) {
        newPositions.push({ top: Math.random() * (100 - btnSize), left: Math.random() * (100 - btnSize) });
      }
    }
    return newPositions;
  };

  const startGame = (selectedLevel: LevelKey) => {
    const setting = LEVELS[selectedLevel];
    const total = setting.count;
    const nums = Array.from({ length: total }, (_, i) => i + 1);
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    const pos = generatePositions(total, setting.btnSize);

    setNumbers(nums);
    setPositions(pos);
    setLevel(selectedLevel);
    setNextNumber(1);
    setPenaltyTime(0);
    setCurrentTime(0);
    setExplosions([]); // リセット
    setGameState("playing");
    setStartTime(Date.now());
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing") {
      timer = setInterval(() => {
        setCurrentTime(Date.now() - startTime + penaltyTime);
      }, 30);
    }
    return () => clearInterval(timer);
  }, [gameState, startTime, penaltyTime]);

  // タップ処理 (修正：indexを受け取る)
  const handleCardClick = (num: number, index: number) => {
    if (gameState !== "playing") return;

    if (num === nextNumber) {
      // --- 正解時の処理 ---
      
      // 1. 爆発エフェクトを追加
      const pos = positions[index];
      const btnSize = LEVELS[level].btnSize;
      const centerX = pos.left + btnSize / 2; // ボタンの中心X(%)
      const centerY = pos.top + btnSize / 2;  // ボタンの中心Y(%)
      
      const newExplosion = { 
        id: num, 
        x: centerX, 
        y: centerY, 
        color: LEVELS[level].particle 
      };
      setExplosions((prev) => [...prev, newExplosion]);

      // 2. 一定時間後に爆発データを削除（メモリ管理）
      setTimeout(() => {
        setExplosions((prev) => prev.filter(e => e.id !== num));
      }, 500);

      // 3. ゲーム進行
      const total = LEVELS[level].count;
      if (num === total) {
        setGameState("finished");
      } else {
        setNextNumber((prev) => prev + 1);
      }

    } else {
      // --- 不正解時の処理 ---
      setPenaltyTime((prev) => prev + 1000);
      setShake(true);
      setTimeout(() => setShake(false), 300);
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${centiseconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 font-sans text-slate-800 bg-slate-50">
      
      <div className="absolute top-4 left-4 z-10">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold bg-white/80 px-4 py-2 rounded-full shadow-sm hover:shadow transition-all">
          <ArrowLeft size={18} />
          <span>ホームへ</span>
        </Link>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border-4 border-slate-100 overflow-hidden relative flex flex-col min-h-[600px]">
        
        {/* ヘッダー */}
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center z-20 relative">
          <div className="flex flex-col">
            <span className="text-xs font-bold opacity-60">NEXT</span>
            <div className="flex items-baseline gap-1">
                <span className="text-4xl font-mono font-bold leading-none text-yellow-400">
                    {gameState === "finished" ? "END" : nextNumber}
                </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold opacity-60">TIME</span>
            <span className={`text-4xl font-mono font-bold leading-none ${shake ? "text-red-500" : "text-white"}`}>
              {formatTime(currentTime)}
            </span>
          </div>
        </div>

        {/* ゲームエリア */}
        <div className="p-4 md:p-6 flex-1 flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
          
          {gameState === "idle" ? (
            <div className="text-center space-y-8 max-w-md w-full relative z-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-800">ナンバー・スキャン</h2>
                <p className="text-slate-500 font-bold tracking-widest text-sm">ランダムに現れる数字を探せ</p>
                <p className="text-slate-600 text-sm py-2">
                    1から順番に数字を見つけてタップしてください。<br/>
                    お手つきは<span className="text-red-500 font-bold">+1秒</span>のペナルティです。
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => startGame("level1")} className="flex items-center gap-4 p-4 bg-white border-2 border-blue-100 hover:border-blue-400 rounded-2xl shadow-sm hover:shadow-md transition-all group text-left">
                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600 group-hover:scale-110 transition-transform"><Grid3x3 /></div>
                    <div>
                        <div className="font-bold text-lg text-slate-800">LEVEL 1 (1~9)</div>
                        <div className="text-xs text-slate-400">数字が大きくて見つけやすい</div>
                    </div>
                </button>
                <button onClick={() => startGame("level2")} className="flex items-center gap-4 p-4 bg-white border-2 border-green-100 hover:border-green-400 rounded-2xl shadow-sm hover:shadow-md transition-all group text-left">
                    <div className="bg-green-100 p-3 rounded-xl text-green-600 group-hover:scale-110 transition-transform"><Grid3x3 /></div>
                    <div>
                        <div className="font-bold text-lg text-slate-800">LEVEL 2 (1~16)</div>
                        <div className="text-xs text-slate-400">標準的な難易度</div>
                    </div>
                </button>
                <button onClick={() => startGame("level3")} className="flex items-center gap-4 p-4 bg-white border-2 border-orange-100 hover:border-orange-400 rounded-2xl shadow-sm hover:shadow-md transition-all group text-left">
                    <div className="bg-orange-100 p-3 rounded-xl text-orange-600 group-hover:scale-110 transition-transform"><Grid3x3 /></div>
                    <div>
                        <div className="font-bold text-lg text-slate-800">LEVEL 3 (1~25)</div>
                        <div className="text-xs text-slate-400">数字が小さく散らばる</div>
                    </div>
                </button>
              </div>
            </div>
          ) : gameState === "finished" ? (
            <div className="text-center space-y-6 animate-in zoom-in duration-300 relative z-10">
               <div className="bg-yellow-100 p-6 rounded-full text-yellow-600 mb-4 inline-block">
                 <Trophy size={64} />
               </div>
               <h2 className="text-3xl font-bold">CLEAR!</h2>
               
               <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm w-64 mx-auto">
                 <div className="text-xs text-slate-400 font-bold uppercase mb-1">Time</div>
                 <div className="text-5xl font-black text-slate-800 tracking-tight">{formatTime(currentTime)}<span className="text-lg font-normal text-slate-400 ml-1">s</span></div>
                 <div className="text-xs text-slate-400 mt-2 font-bold bg-slate-100 py-1 rounded">{LEVELS[level].label}</div>
               </div>

               <div className="flex gap-4 justify-center mt-8">
                 <button onClick={() => setGameState("idle")} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition">
                    戻る
                 </button>
                 <button
                    onClick={() => startGame(level)}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
                >
                    <RotateCcw size={18} />
                    もう一度
                </button>
               </div>
            </div>
          ) : (
            // ゲームプレイエリア（枠なし）
            <motion.div 
                className="relative w-full max-w-[400px] aspect-square"
                animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.3 }}
            >
                {/* 爆発エフェクトのレンダリング */}
                {explosions.map((exp) => (
                  <ExplosionEffect key={exp.id} x={exp.x} y={exp.y} color={exp.color} />
                ))}

                <AnimatePresence>
                    {numbers.map((num, i) => {
                        const isCleared = num < nextNumber;
                        const pos = positions[i] || { top: 0, left: 0 };
                        const btnSize = LEVELS[level].btnSize;
                        
                        return (
                            <motion.button
                                key={num}
                                layout
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ 
                                    opacity: isCleared ? 0 : 1, 
                                    scale: isCleared ? 0.5 : 1, // 正解済みは小さくフェードアウト
                                    top: `${pos.top}%`,
                                    left: `${pos.left}%`,
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                // index(i) を渡して座標を特定できるようにする
                                onClick={() => handleCardClick(num, i)}
                                className={`
                                    absolute rounded-full font-bold shadow-md border-b-4 active:border-b-0 active:translate-y-1 active:shadow-none transition-colors flex items-center justify-center select-none
                                    ${isCleared ? "pointer-events-none" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"}
                                    ${level === "level3" ? "text-xl" : "text-2xl md:text-3xl"}
                                `}
                                style={{
                                    width: `${btnSize}%`,
                                    height: `${btnSize}%`,
                                }}
                            >
                                {num}
                            </motion.button>
                        );
                    })}
                </AnimatePresence>
            </motion.div>
          )}

        </div>
      </div>

      {/* SEO用コンテンツ */}
      <article className="mt-24 max-w-3xl w-full px-6 pb-20 text-slate-700">
        <h1 className="text-3xl font-bold text-slate-900 mb-6 border-b-4 border-green-500 inline-block pb-1">
          ナンバー・スキャン | 周辺視野と探索速度のトレーニング
        </h1>
        
        <p className="mb-10 text-lg leading-relaxed text-slate-600">
          「ナンバー・スキャン」は、ランダムに配置された数字を順番に見つけ出し、タップする速さを競う脳トレゲームです。心理学的な実験手法「シュルテ・テーブル（Schulte Table）」をベースにしており、<strong>周辺視野の拡大</strong>と<strong>視覚的探索能力</strong>を鍛えることができます。
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="bg-green-100 text-green-600 p-2 rounded-lg text-xl">👁️</span>
            トレーニングの効果
          </h2>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">周辺視野 (Peripheral Vision) の拡大</h3>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                一点を凝視するのではなく、ぼんやりと全体を眺めながら目的の数字を探すことで、視野の広さを鍛えます。これは速読スキルの向上や、スポーツにおける状況判断力の向上に役立ちます。
              </p>
            </div>
            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">選択的注意 (Selective Attention)</h3>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                多数の妨害刺激（関係ない数字）の中から、特定のターゲット（次の数字）を瞬時に選び出す能力です。情報のノイズをカットし、必要な情報だけにフォーカスする集中力を養います。
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-100 p-8 rounded-3xl mt-16 text-center">
          <h3 className="font-bold text-slate-800 mb-4">他の脳トレにも挑戦！</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/simbol" className="bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-6 rounded-full shadow-sm border border-slate-200 transition">
              🧩 シンボル・デコード
            </Link>
            <Link href="/reaction" className="bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-6 rounded-full shadow-sm border border-slate-200 transition">
              ⚡ 反射神経テスト
            </Link>
          </div>
        </section>
      </article>

    </div>
  );
}
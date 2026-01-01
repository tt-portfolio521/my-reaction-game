"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Trophy, ArrowLeft, Grid3x3, Grid2x2, Timer, Eye, MousePointerClick } from "lucide-react";
import Link from "next/link";

// 難易度設定
const LEVELS = {
  easy: { size: 3, label: "EASY (3x3)", color: "bg-blue-500", border: "border-blue-200", text: "text-blue-600" },
  normal: { size: 4, label: "NORMAL (4x4)", color: "bg-green-500", border: "border-green-200", text: "text-green-600" },
  hard: { size: 5, label: "HARD (5x5)", color: "bg-orange-500", border: "border-orange-200", text: "text-orange-600" },
};

type LevelKey = keyof typeof LEVELS;

export default function NumberScanGame() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [level, setLevel] = useState<LevelKey>("normal");
  const [numbers, setNumbers] = useState<number[]>([]);
  const [nextNumber, setNextNumber] = useState(1);
  
  // タイム計測用
  const [startTime, setStartTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [penaltyTime, setPenaltyTime] = useState(0); // ペナルティ加算用

  // 演出用
  const [shake, setShake] = useState(false); // 不正解時のシェイク
  const [lastClickedPos, setLastClickedPos] = useState<{x:number, y:number} | null>(null);

  // ゲーム開始
  const startGame = (selectedLevel: LevelKey) => {
    const size = LEVELS[selectedLevel].size;
    const total = size * size;
    
    // 1〜totalまでの数字を作成してシャッフル
    const nums = Array.from({ length: total }, (_, i) => i + 1);
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }

    setNumbers(nums);
    setLevel(selectedLevel);
    setNextNumber(1);
    setPenaltyTime(0);
    setCurrentTime(0);
    setGameState("playing");
    setStartTime(Date.now());
  };

  // タイマー処理 (10ミリ秒単位)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing") {
      timer = setInterval(() => {
        // 現在時刻 - 開始時刻 + ペナルティ
        setCurrentTime(Date.now() - startTime + penaltyTime);
      }, 30); // 描画更新頻度
    }
    return () => clearInterval(timer);
  }, [gameState, startTime, penaltyTime]);

  // タップ処理
  const handleCardClick = (num: number, e: React.MouseEvent | React.TouchEvent) => {
    if (gameState !== "playing") return;

    if (num === nextNumber) {
      // 正解
      // 座標を取得してエフェクト（今回はシンプルに波紋の代わりに正解音的な処理）
      // 最後の数字ならクリア
      const size = LEVELS[level].size;
      if (num === size * size) {
        setGameState("finished");
      } else {
        setNextNumber((prev) => prev + 1);
      }
    } else {
      // 不正解（ペナルティ）
      setPenaltyTime((prev) => prev + 1000); // 1秒加算
      setShake(true);
      setTimeout(() => setShake(false), 300);
    }
  };

  // 時間のフォーマット (00.00)
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${centiseconds.toString().padStart(2, "0")}`;
  };

  // グリッドのクラス動的生成
  const getGridClass = (size: number) => {
    if (size === 3) return "grid-cols-3";
    if (size === 4) return "grid-cols-4";
    if (size === 5) return "grid-cols-5";
    return "grid-cols-4";
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 font-sans text-slate-800 bg-slate-50">
      
      {/* 戻るボタン */}
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
        <div className="p-4 md:p-8 flex-1 flex flex-col items-center justify-center bg-slate-50/50">
          
          {gameState === "idle" ? (
            <div className="text-center space-y-8 max-w-md w-full">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-800">ナンバー・スキャン</h2>
                <p className="text-slate-500 font-bold tracking-widest text-sm">周辺視野と探索速度を鍛える</p>
                <p className="text-slate-600 text-sm py-2">
                    1から順番に数字を見つけてタップしてください。<br/>
                    お手つきは<span className="text-red-500 font-bold">+1秒</span>のペナルティです。
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => startGame("easy")} className="flex items-center gap-4 p-4 bg-white border-2 border-blue-100 hover:border-blue-400 rounded-2xl shadow-sm hover:shadow-md transition-all group text-left">
                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600 group-hover:scale-110 transition-transform"><Grid2x2 /></div>
                    <div>
                        <div className="font-bold text-lg text-slate-800">EASY (3x3)</div>
                        <div className="text-xs text-slate-400">初心者向け / リハビリに</div>
                    </div>
                </button>
                <button onClick={() => startGame("normal")} className="flex items-center gap-4 p-4 bg-white border-2 border-green-100 hover:border-green-400 rounded-2xl shadow-sm hover:shadow-md transition-all group text-left">
                    <div className="bg-green-100 p-3 rounded-xl text-green-600 group-hover:scale-110 transition-transform"><Grid3x3 /></div>
                    <div>
                        <div className="font-bold text-lg text-slate-800">NORMAL (4x4)</div>
                        <div className="text-xs text-slate-400">一般的な難易度</div>
                    </div>
                </button>
                <button onClick={() => startGame("hard")} className="flex items-center gap-4 p-4 bg-white border-2 border-orange-100 hover:border-orange-400 rounded-2xl shadow-sm hover:shadow-md transition-all group text-left">
                    <div className="bg-orange-100 p-3 rounded-xl text-orange-600 group-hover:scale-110 transition-transform"><Grid3x3 /></div>
                    <div>
                        <div className="font-bold text-lg text-slate-800">HARD (5x5)</div>
                        <div className="text-xs text-slate-400">周辺視野の限界に挑戦</div>
                    </div>
                </button>
              </div>
            </div>
          ) : gameState === "finished" ? (
            <div className="text-center space-y-6 animate-in zoom-in duration-300">
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
            <motion.div 
                className={`grid gap-3 w-full max-w-md aspect-square ${getGridClass(LEVELS[level].size)}`}
                animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.3 }}
            >
                <AnimatePresence>
                    {numbers.map((num) => {
                        const isNext = num === nextNumber;
                        const isCleared = num < nextNumber;
                        
                        return (
                            <motion.button
                                key={num}
                                layout
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ 
                                    opacity: isCleared ? 0 : 1, 
                                    scale: isCleared ? 0.8 : 1,
                                }}
                                onClick={(e) => handleCardClick(num, e)}
                                className={`
                                    relative rounded-xl font-bold shadow-sm border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center select-none
                                    ${isCleared ? "pointer-events-none" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}
                                    ${level === "hard" ? "text-2xl" : "text-3xl md:text-4xl"}
                                `}
                            >
                                {num}
                                {isNext && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                                    </span>
                                )}
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
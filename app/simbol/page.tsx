"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Circle, Square, Triangle, Diamond, Hexagon, Play, RotateCcw, Trophy, Eye, EyeOff, Brain } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// ゲーム設定
const GAME_DURATION = 60; // 秒
const SYMBOL_COUNT = 5;   // 覚える個数（5個くらいがワーキングメモリの限界に近い）

// アイコン定義
const ICONS = [
  { id: "star", component: Star, color: "text-yellow-500" },
  { id: "circle", component: Circle, color: "text-blue-500" },
  { id: "square", component: Square, color: "text-red-500" },
  { id: "triangle", component: Triangle, color: "text-green-500" },
  { id: "diamond", component: Diamond, color: "text-purple-500" },
  { id: "hexagon", component: Hexagon, color: "text-orange-500" },
];

type SymbolMap = {
  number: number;
  iconIdx: number;
};

type Difficulty = "normal" | "memory";

export default function SymbolDecodeGame() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [keyMap, setKeyMap] = useState<SymbolMap[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<SymbolMap | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  
  // Memoryモード用の視認状態
  const [isLegendVisible, setIsLegendVisible] = useState(true);
  const [isPeeking, setIsPeeking] = useState(false); // ヒントを見ているか

  // ゲーム開始
  const startGame = (selectedDifficulty: Difficulty) => {
    // 1. マップ作成
    const indices = Array.from({ length: ICONS.length }, (_, i) => i);
    // Shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const selectedIndices = indices.slice(0, SYMBOL_COUNT);
    const newMap = selectedIndices.map((iconIdx, i) => ({
      number: i + 1,
      iconIdx: iconIdx,
    }));

    setKeyMap(newMap);
    setDifficulty(selectedDifficulty);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameState("playing");
    nextQuestion(newMap);

    // Memoryモードの場合、初期表示タイマーを設定
    if (selectedDifficulty === "memory") {
      setIsLegendVisible(true);
      setTimeout(() => {
        setIsLegendVisible(false); // 3秒後に消す
      }, 3000);
    } else {
      setIsLegendVisible(true);
    }
  };

  const nextQuestion = (map: SymbolMap[]) => {
    const randomIndex = Math.floor(Math.random() * map.length);
    setCurrentQuestion(map[randomIndex]);
    setFeedback(null);
  };

  const handleInput = useCallback((inputNumber: number) => {
    if (gameState !== "playing" || !currentQuestion) return;

    if (inputNumber === currentQuestion.number) {
      setScore((prev) => prev + 1);
      setFeedback("correct");
      setTimeout(() => {
        nextQuestion(keyMap);
      }, 100);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback(null), 300);
    }
  }, [gameState, currentQuestion, keyMap]);

  // キーボード入力
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        // 数字キー入力
        const num = parseInt(e.key);
        if (!isNaN(num) && num >= 1 && num <= SYMBOL_COUNT) {
            handleInput(num);
        }
        // スペースキーでヒント（Memoryモードのみ）
        if (e.code === "Space" && difficulty === "memory") {
            setIsPeeking(true);
        }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        if (e.code === "Space" && difficulty === "memory") {
            setIsPeeking(false);
        }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleInput, difficulty]);

  // タイマー
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === "playing") {
      setGameState("finished");
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-800">
      
      {/* 戻るボタン */}
      <div className="absolute top-4 left-4 z-10">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold bg-white/80 px-4 py-2 rounded-full shadow-sm hover:shadow transition-all">
          <ArrowLeft size={18} />
          <span>ホームへ</span>
        </Link>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative flex flex-col min-h-[600px]">
        
        {/* ヘッダー */}
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center z-20 relative">
          <div className="font-bold text-xl flex items-center gap-2">
            <span>SCORE:</span>
            <span className="text-2xl text-yellow-400 font-mono">{score}</span>
          </div>
          <div className="flex items-center gap-4">
             {gameState === "playing" && (
                <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${difficulty === "memory" ? "bg-purple-500 text-white" : "bg-blue-500 text-white"}`}>
                    {difficulty === "memory" && <Brain size={14} />}
                    {difficulty}
                </div>
            )}
            <div className="font-bold text-xl flex items-center gap-2">
                <span>TIME:</span>
                <span className={`text-2xl font-mono ${timeLeft < 10 ? "text-red-400" : "text-white"}`}>
                {timeLeft}
                </span>
            </div>
          </div>
        </div>

        {/* プログレスバー */}
        {gameState === "playing" && (
          <motion.div 
            className={`h-1 origin-left z-20 relative ${difficulty === "memory" ? "bg-purple-500" : "bg-blue-500"}`}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: timeLeft / GAME_DURATION }}
            transition={{ ease: "linear", duration: 1 }}
          />
        )}

        <div className="p-6 md:p-8 flex-1 flex flex-col">
          
          {gameState !== "playing" ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 text-center">
              {gameState === "idle" ? (
                <>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-800">シンボル・デコード</h2>
                    <p className="text-slate-500 font-bold tracking-widest text-sm">脳のワーキングメモリを強化</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 w-full max-w-xs mt-4">
                    <button
                        onClick={() => startGame("normal")}
                        className="group relative w-full py-4 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-2xl border-2 border-blue-200 hover:border-blue-300 transition-all flex items-center justify-center gap-3"
                    >
                        <Play size={24} className="fill-blue-600" />
                        <div className="text-left">
                            <div className="font-black text-lg">NORMAL</div>
                            <div className="text-xs font-bold opacity-70">凡例を常に表示</div>
                        </div>
                    </button>

                    <button
                        onClick={() => startGame("memory")}
                        className="group relative w-full py-4 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-2xl border-2 border-purple-200 hover:border-purple-300 transition-all flex items-center justify-center gap-3"
                    >
                        <Brain size={24} className="fill-purple-600" />
                        <div className="text-left">
                            <div className="font-black text-lg">MEMORY</div>
                            <div className="text-xs font-bold opacity-70">凡例が消えます (暗記)</div>
                        </div>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-yellow-100 p-6 rounded-full text-yellow-600 mb-4">
                    <Trophy size={48} />
                  </div>
                  <h2 className="text-3xl font-bold">Time Up!</h2>
                  <div className="text-5xl font-black text-slate-800 my-4">{score} <span className="text-lg font-normal text-slate-500">pt</span></div>
                  
                  <div className="flex gap-4 mt-4">
                     <button onClick={() => setGameState("idle")} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition">
                        戻る
                     </button>
                     <button
                        onClick={() => startGame(difficulty)}
                        className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
                    >
                        <RotateCcw size={18} />
                        もう一度
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              {/* 1. 凡例（キー）エリア - Memoryモードではフェードアウト */}
              <div className="relative mb-6 h-24">
                <motion.div 
                    className={`bg-slate-100 rounded-xl p-2 border border-slate-200 absolute inset-0 transition-opacity duration-500 ${
                        (isLegendVisible || isPeeking || difficulty === "normal") ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <div className="flex justify-around items-center h-full">
                    {keyMap.map((item) => {
                        const Icon = ICONS[item.iconIdx].component;
                        return (
                        <div key={item.number} className="flex flex-col items-center gap-1">
                            <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center border border-slate-200">
                                <Icon className={ICONS[item.iconIdx].color} size={20} strokeWidth={2.5} />
                            </div>
                            <span className="font-bold text-lg text-slate-600">{item.number}</span>
                        </div>
                        );
                    })}
                    </div>
                </motion.div>

                {/* Memoryモード時の目隠しメッセージ */}
                {difficulty === "memory" && !(isLegendVisible || isPeeking) && (
                     <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm font-bold bg-slate-50/50 rounded-xl border border-slate-200 border-dashed">
                        <div className="flex items-center gap-2 animate-pulse">
                            <EyeOff size={16} />
                            <span>Hold Space for Hint</span>
                        </div>
                     </div>
                )}
              </div>

              {/* 2. 問題エリア */}
              <div className="flex-1 flex flex-col items-center justify-center relative py-4">
                <AnimatePresence mode="wait">
                  {currentQuestion && (
                    <motion.div
                      key={score}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.2, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="relative"
                    >
                      {(() => {
                        const QuestionIcon = ICONS[currentQuestion.iconIdx].component;
                        return (
                          <div className="w-48 h-48 bg-white rounded-[2rem] shadow-xl border-4 border-slate-100 flex items-center justify-center">
                            <QuestionIcon 
                              className={ICONS[currentQuestion.iconIdx].color} 
                              size={100} 
                              strokeWidth={2} 
                            />
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* フィードバック */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`absolute bottom-0 text-3xl font-black ${feedback === "correct" ? "text-green-500" : "text-red-500"}`}
                    >
                      {feedback === "correct" ? "NICE!" : "MISS!"}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. 入力パッド */}
              <div className="grid grid-cols-5 gap-3 mt-4">
                {Array.from({ length: SYMBOL_COUNT }).map((_, i) => {
                  const num = i + 1;
                  return (
                    <button
                      key={num}
                      // スマホ用: 長押しでヒントを見る機能もつけたい場合はここを調整
                      onPointerDown={() => difficulty === "memory" ? setIsPeeking(true) : null}
                      onPointerUp={() => difficulty === "memory" ? setIsPeeking(false) : null}
                      // 本来のクリック処理はこれだが、スマホでの長押しとバッティングしないよう注意
                      onClick={() => handleInput(num)}
                      className="h-16 rounded-xl bg-white border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 shadow-sm text-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all"
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
              
              {difficulty === "memory" && (
                <div className="mt-4 text-center">
                    <button 
                        className="text-xs font-bold text-slate-400 bg-slate-100 px-4 py-2 rounded-full active:bg-slate-200 md:hidden"
                        onPointerDown={() => setIsPeeking(true)}
                        onPointerUp={() => setIsPeeking(false)}
                        onPointerLeave={() => setIsPeeking(false)}
                    >
                        {isPeeking ? "離して隠す" : "長押しでヒント"}
                    </button>
                     <div className="hidden md:block text-slate-400 text-xs mt-2">Spaceキー長押しでヒントを表示</div>
                </div>
              )}

            </>
          )}
        </div>
      </div>
    </div>
  );
}
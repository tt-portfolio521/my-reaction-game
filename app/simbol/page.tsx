"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, Circle, Square, Triangle, Diamond, Hexagon, 
  Play, RotateCcw, Trophy, ArrowLeft, Flame, Zap 
} from "lucide-react";
import Link from "next/link";

// ゲーム設定
const GAME_DURATION = 60; // 秒
const SYMBOL_COUNT = 5;   // 使用する記号の数
const FEVER_THRESHOLD = 10; // フィーバー発動に必要なコンボ数

// アイコン定義
const ICONS = [
  { id: "star", component: Star, color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-200" },
  { id: "circle", component: Circle, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200" },
  { id: "square", component: Square, color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
  { id: "triangle", component: Triangle, color: "text-green-500", bg: "bg-green-50", border: "border-green-200" },
  { id: "diamond", component: Diamond, color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-200" },
  { id: "hexagon", component: Hexagon, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200" },
];

type SymbolMap = {
  number: number;
  iconIdx: number;
};

export default function SymbolDecodeGame() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [keyMap, setKeyMap] = useState<SymbolMap[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<SymbolMap | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  // 没頭要素：コンボとフィーバー
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [isFever, setIsFever] = useState(false);

  // ゲーム開始
  const startGame = () => {
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
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setIsFever(false);
    setTimeLeft(GAME_DURATION);
    setGameState("playing");
    nextQuestion(newMap);
  };

  const nextQuestion = (map: SymbolMap[]) => {
    const randomIndex = Math.floor(Math.random() * map.length);
    setCurrentQuestion(map[randomIndex]);
    setFeedback(null);
  };

  const handleInput = useCallback((inputNumber: number) => {
    if (gameState !== "playing" || !currentQuestion) return;

    if (inputNumber === currentQuestion.number) {
      // 正解処理
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      // フィーバー判定
      const feverActive = newCombo >= FEVER_THRESHOLD;
      setIsFever(feverActive);

      // スコア加算（通常10点、フィーバー時は20点）
      const points = feverActive ? 20 : 10;
      setScore((prev) => prev + points);

      setFeedback("correct");
      
      // コンボ時は次への遷移を少し早くする（テンポアップ）
      setTimeout(() => {
        nextQuestion(keyMap);
      }, feverActive ? 80 : 100);

    } else {
      // 不正解処理
      setCombo(0);
      setIsFever(false);
      setFeedback("wrong");
      setTimeout(() => setFeedback(null), 300);
    }
  }, [gameState, currentQuestion, keyMap, combo, maxCombo]);

  // キーボード入力
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        const num = parseInt(e.key);
        if (!isNaN(num) && num >= 1 && num <= SYMBOL_COUNT) {
            handleInput(num);
        }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleInput]);

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
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 font-sans text-slate-800 transition-colors duration-500 ${isFever ? "bg-orange-50" : "bg-slate-50"}`}>
      
      {/* 戻るボタン */}
      <div className="absolute top-4 left-4 z-10">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold bg-white/80 px-4 py-2 rounded-full shadow-sm hover:shadow transition-all">
          <ArrowLeft size={18} />
          <span>ホームへ</span>
        </Link>
      </div>

      <div className={`w-full max-w-2xl bg-white rounded-3xl shadow-xl border-4 overflow-hidden relative flex flex-col min-h-[600px] transition-all duration-300 ${isFever ? "border-orange-400 shadow-orange-200" : "border-slate-100"}`}>
        
        {/* ヘッダー */}
        <div className={`text-white p-4 flex justify-between items-center z-20 relative transition-colors duration-300 ${isFever ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-slate-900"}`}>
          <div className="flex flex-col">
            <span className="text-xs font-bold opacity-80">SCORE</span>
            <span className="text-3xl font-mono font-bold leading-none">{score}</span>
          </div>

          {/* コンボ表示（フィーバー時は激しく） */}
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            {combo > 1 && (
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    key={combo}
                    className={`font-black italic flex items-center gap-1 ${isFever ? "text-yellow-200 text-4xl" : "text-slate-200 text-2xl"}`}
                >
                    {combo} <span className="text-sm not-italic font-normal">COMBO</span>
                    {isFever && <Flame className="fill-yellow-200 animate-pulse" />}
                </motion.div>
            )}
            {isFever && <div className="text-xs font-bold text-yellow-100 tracking-widest animate-pulse">FEVER TIME!! x2</div>}
          </div>

          <div className="flex flex-col items-end">
            <span className="text-xs font-bold opacity-80">TIME</span>
            <span className={`text-3xl font-mono font-bold leading-none ${timeLeft < 10 && !isFever ? "text-red-400" : "text-white"}`}>
              {timeLeft}
            </span>
          </div>
        </div>

        {/* プログレスバー */}
        {gameState === "playing" && (
          <motion.div 
            className={`h-2 origin-left z-20 relative ${isFever ? "bg-yellow-400" : "bg-blue-500"}`}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: timeLeft / GAME_DURATION }}
            transition={{ ease: "linear", duration: 1 }}
          />
        )}

        <div className="p-6 md:p-8 flex-1 flex flex-col relative overflow-hidden">
            {/* フィーバー時の背景演出 */}
            {isFever && (
                <div className="absolute inset-0 bg-orange-500/5 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
                    <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="w-[800px] h-[800px] border-[40px] border-dashed border-orange-200/50 rounded-full"
                    />
                </div>
            )}

          {gameState !== "playing" ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 text-center z-10">
              {gameState === "idle" ? (
                <>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-800">シンボル・デコード</h2>
                    <p className="text-slate-500 font-bold tracking-widest text-sm">脳の処理速度を限界まで加速せよ</p>
                  </div>

                  <div className="flex flex-col gap-2 items-center text-sm text-slate-500 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="flex items-center gap-2"><Zap size={16} className="text-yellow-500 fill-yellow-500"/> 連続正解でコンボボーナス！</p>
                    <p className="flex items-center gap-2"><Flame size={16} className="text-orange-500 fill-orange-500"/> 10コンボでFEVERモード突入 (Score x2)</p>
                  </div>
                  
                  <button
                    onClick={startGame}
                    className="group relative w-full max-w-xs py-5 bg-slate-900 text-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3"
                  >
                    <Play size={28} className="fill-white" />
                    <div className="text-left">
                        <div className="font-black text-xl tracking-wider">START GAME</div>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-yellow-100 p-6 rounded-full text-yellow-600 mb-4">
                    <Trophy size={48} />
                  </div>
                  <h2 className="text-3xl font-bold">Time Up!</h2>
                  
                  <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="text-xs text-slate-400 font-bold uppercase mb-1">Total Score</div>
                        <div className="text-3xl font-black text-slate-800">{score}</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="text-xs text-slate-400 font-bold uppercase mb-1">Max Combo</div>
                        <div className="text-3xl font-black text-slate-800">{maxCombo}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mt-4">
                     <button onClick={() => setGameState("idle")} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition">
                        戻る
                     </button>
                     <button
                        onClick={startGame}
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
              {/* 1. 凡例（キー）エリア */}
              <div className="relative mb-6 z-10">
                <div className="bg-white/80 backdrop-blur rounded-xl p-3 border border-slate-200 shadow-sm">
                    <div className="flex justify-around items-center">
                    {keyMap.map((item) => {
                        const iconDef = ICONS[item.iconIdx];
                        const Icon = iconDef.component;
                        return (
                        <div key={item.number} className="flex flex-col items-center gap-1 group">
                            <div className={`w-12 h-12 ${iconDef.bg} ${iconDef.border} rounded-xl border-2 flex items-center justify-center transition-transform group-hover:scale-110`}>
                                <Icon className={iconDef.color} size={24} strokeWidth={2.5} />
                            </div>
                            <span className="font-bold text-lg text-slate-600 font-mono">{item.number}</span>
                        </div>
                        );
                    })}
                    </div>
                </div>
              </div>

              {/* 2. 問題エリア */}
              <div className="flex-1 flex flex-col items-center justify-center relative py-4 z-10">
                <AnimatePresence mode="wait">
                  {currentQuestion && (
                    <motion.div
                      key={score} // スコア変化(正解)のたびにアニメーション
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="relative"
                    >
                      {(() => {
                        const iconDef = ICONS[currentQuestion.iconIdx];
                        const QuestionIcon = iconDef.component;
                        return (
                          <div className={`w-40 h-40 bg-white rounded-[2rem] shadow-xl border-4 flex items-center justify-center transition-colors duration-200 ${isFever ? "border-orange-300 shadow-orange-100" : "border-slate-100"}`}>
                            <QuestionIcon 
                              className={iconDef.color} 
                              size={90} 
                              strokeWidth={2} 
                            />
                            {/* フィーバー時のキラキラ演出 */}
                            {isFever && (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0"
                                >
                                    <Zap className="absolute top-2 right-4 text-yellow-400 fill-yellow-400 animate-bounce" size={20} />
                                    <Zap className="absolute bottom-4 left-4 text-yellow-400 fill-yellow-400 animate-pulse" size={16} />
                                </motion.div>
                            )}
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
                      initial={{ opacity: 0, y: 10, scale: 0.5 }}
                      animate={{ opacity: 1, y: 0, scale: 1.2 }}
                      exit={{ opacity: 0, scale: 1.5 }}
                      className={`absolute bottom-0 text-4xl font-black italic z-20 ${feedback === "correct" ? (isFever ? "text-orange-500 drop-shadow-md" : "text-blue-500") : "text-slate-400"}`}
                    >
                      {feedback === "correct" ? (isFever ? "FEVER!!" : "NICE!") : "MISS"}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. 入力パッド */}
              <div className="grid grid-cols-5 gap-3 mt-4 z-10">
                {Array.from({ length: SYMBOL_COUNT }).map((_, i) => {
                  const num = i + 1;
                  return (
                    <button
                      key={num}
                      onClick={() => handleInput(num)}
                      className={`h-16 rounded-2xl border-b-4 active:border-b-0 active:translate-y-1 shadow-sm text-2xl font-bold transition-all ${
                          isFever 
                          ? "bg-gradient-to-br from-orange-100 to-white border-orange-200 text-orange-600 hover:from-orange-200" 
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-4 text-center text-xs font-bold text-slate-400/60 uppercase tracking-widest">
                Keyboard {Array.from({length: SYMBOL_COUNT}).map((_,i)=>i+1).join("-")} Supported
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
}
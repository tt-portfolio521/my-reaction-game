"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Circle, Square, Triangle, Diamond, Hexagon, Play, RotateCcw, Trophy } from "lucide-react";

// ゲーム設定
const GAME_DURATION = 60; // 秒
const SYMBOL_COUNT = 6;   // 使用するシンボルの数（1〜6）

// 使用するアイコンの定義
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

export default function SymbolDecodeGame() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [keyMap, setKeyMap] = useState<SymbolMap[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<SymbolMap | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  // ゲーム開始処理
  const startGame = () => {
    // 1. シンボルと数字のペアをシャッフルして作成
    const indices = Array.from({ length: ICONS.length }, (_, i) => i);
    // Fisher-Yates Shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    
    // 使う数だけ取り出す
    const selectedIndices = indices.slice(0, SYMBOL_COUNT);
    const newMap = selectedIndices.map((iconIdx, i) => ({
      number: i + 1,
      iconIdx: iconIdx,
    }));

    setKeyMap(newMap);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameState("playing");
    nextQuestion(newMap);
  };

  // 次の問題を作成
  const nextQuestion = (map: SymbolMap[]) => {
    const randomIndex = Math.floor(Math.random() * map.length);
    setCurrentQuestion(map[randomIndex]);
    setFeedback(null);
  };

  // 判定ロジック
  const handleInput = useCallback((inputNumber: number) => {
    if (gameState !== "playing" || !currentQuestion) return;

    if (inputNumber === currentQuestion.number) {
      // 正解
      setScore((prev) => prev + 1);
      setFeedback("correct");
      // 少し遅延させて次の問題へ（視覚的フィードバックのため）
      setTimeout(() => {
        nextQuestion(keyMap);
      }, 100);
    } else {
      // 不正解
      setFeedback("wrong");
      // 不正解時はスコア減点などのペナルティを入れても良い（今回はエフェクトのみ）
      setTimeout(() => setFeedback(null), 300);
    }
  }, [gameState, currentQuestion, keyMap]);

  // キーボードイベントのリスナー
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

  // タイマー処理
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
      
      {/* メインカード */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative">
        
        {/* ヘッダー：スコアとタイマー */}
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
          <div className="font-bold text-xl flex items-center gap-2">
            <span>SCORE:</span>
            <span className="text-2xl text-yellow-400 font-mono">{score}</span>
          </div>
          <div className="font-bold text-xl flex items-center gap-2">
            <span>TIME:</span>
            <span className={`text-2xl font-mono ${timeLeft < 10 ? "text-red-400" : "text-white"}`}>
              {timeLeft}
            </span>
          </div>
        </div>

        {/* プログレスバー */}
        {gameState === "playing" && (
          <motion.div 
            className="h-1 bg-blue-500 origin-left"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: timeLeft / GAME_DURATION }}
            transition={{ ease: "linear", duration: 1 }}
          />
        )}

        <div className="p-6 md:p-8 space-y-8 min-h-[500px] flex flex-col">
          
          {/* 待機画面・終了画面 */}
          {gameState !== "playing" ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">
              {gameState === "idle" ? (
                <>
                  <div className="bg-blue-100 p-6 rounded-full text-blue-600 mb-4">
                    <Play size={48} fill="currentColor" />
                  </div>
                  <h2 className="text-3xl font-bold">シンボル・デコード</h2>
                  <p className="text-slate-500 max-w-md">
                    上の表を見て、表示された記号に対応する数字を素早く入力してください。<br/>
                    (キーボードの数字キー 1-{SYMBOL_COUNT} も使えます)
                  </p>
                </>
              ) : (
                <>
                  <div className="bg-yellow-100 p-6 rounded-full text-yellow-600 mb-4">
                    <Trophy size={48} />
                  </div>
                  <h2 className="text-3xl font-bold">Time Up!</h2>
                  <div className="text-5xl font-black text-slate-800 my-4">{score} <span className="text-lg font-normal text-slate-500">points</span></div>
                  <p className="text-slate-500">脳の処理速度スコア</p>
                </>
              )}
              
              <button
                onClick={startGame}
                className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
              >
                {gameState === "idle" ? "スタート" : "もう一度挑戦"}
                {gameState === "finished" && <RotateCcw size={20} />}
              </button>
            </div>
          ) : (
            /* ゲームプレイ画面 */
            <>
              {/* 1. 凡例（キー）エリア */}
              <div className="bg-slate-100 rounded-xl p-4 border border-slate-200">
                <div className="flex justify-around items-center">
                  {keyMap.map((item) => {
                    const Icon = ICONS[item.iconIdx].component;
                    return (
                      <div key={item.number} className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-lg shadow-sm flex items-center justify-center border border-slate-200">
                           <Icon className={ICONS[item.iconIdx].color} size={24} strokeWidth={2.5} />
                        </div>
                        <span className="font-bold text-xl text-slate-600">{item.number}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. 問題エリア */}
              <div className="flex-1 flex flex-col items-center justify-center relative py-8">
                <AnimatePresence mode="wait">
                  {currentQuestion && (
                    <motion.div
                      key={score} // スコアが変わるたびに再レンダリング＝新しい問題
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.2, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="relative"
                    >
                      {(() => {
                        const QuestionIcon = ICONS[currentQuestion.iconIdx].component;
                        return (
                          <div className="w-40 h-40 bg-white rounded-3xl shadow-lg border-2 border-slate-100 flex items-center justify-center">
                            <QuestionIcon 
                              className={ICONS[currentQuestion.iconIdx].color} 
                              size={80} 
                              strokeWidth={2} 
                            />
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 正解・不正解フィードバック */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`absolute bottom-0 text-2xl font-black ${feedback === "correct" ? "text-green-500" : "text-red-500"}`}
                    >
                      {feedback === "correct" ? "NICE!" : "MISS!"}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. 入力パッド（モバイル・マウス用） */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {Array.from({ length: SYMBOL_COUNT }).map((_, i) => {
                  const num = i + 1;
                  return (
                    <button
                      key={num}
                      onClick={() => handleInput(num)}
                      className="h-16 rounded-xl bg-white border-2 border-slate-200 shadow-sm text-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:scale-105 active:scale-95 transition-all"
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-6 text-slate-400 text-sm">
        Keyboard keys 1-{SYMBOL_COUNT} also supported
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect, useRef } from "react";
// ★グラフ部品の読み込み
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
  const [gameState, setGameState] = useState("waiting");
  const [reactionTime, setReactionTime] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const MAX_TRIALS = 5;

  const startTimeRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setGameState("waiting");
    setReactionTime(0);
    const randomTime = Math.floor(Math.random() * 3000) + 2000;
    timerRef.current = setTimeout(() => {
      setGameState("go");
      startTimeRef.current = Date.now();
    }, randomTime);
  };

  useEffect(() => {
    startGame();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const handleTap = () => {
    if (gameState === "waiting") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setGameState("foul");
    } 
    else if (gameState === "go") {
      const endTime = Date.now();
      const timeDiff = endTime - startTimeRef.current;
      setReactionTime(timeDiff);
      
      const newHistory = [...history, timeDiff];
      setHistory(newHistory);

      if (newHistory.length >= MAX_TRIALS) {
        setGameState("finished");
      } else {
        setGameState("result");
      }
    } 
    else if (gameState === "result" || gameState === "foul") {
      startGame();
    }
    else if (gameState === "finished") {
      setHistory([]);
      startGame();
    }
  };

  const getBackgroundColor = () => {
    switch (gameState) {
      case "waiting": return "bg-red-500";
      case "go": return "bg-green-500";
      case "foul": return "bg-yellow-500";
      case "result": return "bg-blue-500";
      case "finished": return "bg-slate-900"; // グラフが見やすいようにさらに暗く
      default: return "bg-gray-500";
    }
  };

  const getStats = () => {
    if (history.length === 0) return { average: 0, best: 0, sd: 0, rating: "" };
    const sum = history.reduce((a, b) => a + b, 0);
    const average = sum / history.length;
    const variance = history.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / history.length;
    const sd = Math.sqrt(variance);

    let rating = "";
    if (sd < 20) rating = "Sランク：機械のような安定感！🤖";
    else if (sd < 40) rating = "Aランク：かなり安定しています👏";
    else if (sd < 70) rating = "Bランク：平均的なばらつきです😐";
    else rating = "Cランク：集中力が切れているかも？🤔";

    return { average: Math.round(average), best: Math.min(...history), sd: Math.round(sd), rating };
  };

  const stats = getStats();

  // ★グラフ用にデータを整形する（Rechartsはオブジェクトの配列が好きなので）
  const graphData = history.map((time, index) => ({
    trial: index + 1, // 1回目, 2回目...
    time: time        // 230ms...
  }));

  return (
    <main
      onClick={handleTap}
      className={`flex min-h-screen flex-col items-center justify-center cursor-pointer select-none transition-colors duration-200 ${getBackgroundColor()}`}
    >
      <div className="text-center text-white w-full max-w-md px-4">
        
        {gameState !== "finished" && (
          <p className="absolute top-10 left-0 right-0 text-center text-2xl font-bold opacity-50">
            試行: {history.length + 1} / {MAX_TRIALS}
          </p>
        )}

        {gameState === "waiting" && (
          <>
            <h1 className="text-6xl font-bold mb-4">待て...</h1>
            <p className="text-xl">緑になったらタップ！</p>
          </>
        )}

        {gameState === "go" && (
          <h1 className="text-8xl font-bold">押せ！</h1>
        )}

        {gameState === "foul" && (
          <>
            <h1 className="text-6xl font-bold mb-4">お手つき！</h1>
            <p className="text-xl">タップしてやり直し</p>
          </>
        )}

        {gameState === "result" && (
          <>
            <p className="text-xl mb-2">今回の記録</p>
            <h1 className="text-8xl font-bold mb-6">{reactionTime} ms</h1>
            <p className="text-lg border border-white px-4 py-2 rounded-full inline-block">
              タップして次へ
            </p>
          </>
        )}

        {gameState === "finished" && (
          <div className="bg-white text-slate-800 p-6 rounded-2xl shadow-2xl w-full">
            <h2 className="text-2xl font-bold mb-4 text-center text-slate-700">測定結果レポート</h2>
            
            {/* 統計データ */}
            <div className="flex justify-around mb-4 bg-slate-100 p-3 rounded-xl">
              <div className="text-center">
                <p className="text-xs text-gray-500">平均 (Mean)</p>
                <p className="text-2xl font-bold text-blue-600">{stats.average}<span className="text-xs">ms</span></p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">標準偏差 (SD)</p>
                <p className="text-2xl font-bold text-purple-600">±{stats.sd}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">自己ベスト</p>
                <p className="text-2xl font-bold text-green-600">{stats.best}<span className="text-xs">ms</span></p>
              </div>
            </div>

            <div className="bg-purple-50 p-2 rounded text-center text-sm font-bold text-purple-800 mb-6">
              {stats.rating}
            </div>

            {/* ★グラフ表示エリア */}
            <div className="h-48 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="trial" label={{ value: '回数', position: 'insideBottomRight', offset: -5 }} />
                  <YAxis domain={['dataMin - 50', 'dataMax + 50']} label={{ value: 'ms', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '10px' }}
                    formatter={(value: number) => [`${value} ms`, "タイム"]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="time" 
                    stroke="#8884d8" 
                    strokeWidth={3}
                    dot={{ r: 6, fill: "#8884d8" }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-center text-xs text-gray-400 mt-1">グラフの形が平らなほど安定しています</p>
            </div>

            <p className="text-center text-slate-400 text-sm animate-pulse cursor-pointer hover:text-blue-500">
              画面タップで再テスト
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
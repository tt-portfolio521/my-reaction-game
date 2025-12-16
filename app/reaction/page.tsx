"use client";

import { useState, useRef } from "react";
import { 
  ComposedChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  ReferenceDot 
} from 'recharts';

export default function ReactionGame() {
  // --- ゲームの状態管理 ---
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'now' | 'clicked' | 'ended'>('waiting');
  const [message, setMessage] = useState("画面をタップしてスタート");
  const [startTime, setStartTime] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- 統計モデル定数（一般成人の平均的な反応速度を想定） ---
  const POPULATION_MEAN = 250; // 平均 250ms
  const POPULATION_SD = 50;    // 標準偏差 50ms

  // --- ゲームロジック ---
  const startGame = () => {
    setGameState('ready');
    // 【修正①】文言を変更
    setMessage("色が変化したらタップ！");
    setScore(null);

    const randomDelay = Math.floor(Math.random() * 2000) + 2000; // 2~4秒

    timerRef.current = setTimeout(() => {
      setGameState('now');
      setMessage("今だ！！！");
      setStartTime(Date.now());
    }, randomDelay);
  };

  const handleClick = () => {
    if (gameState === 'waiting' || gameState === 'ended') {
      if (gameState === 'ended') setAttempts([]);
      startGame();
    } else if (gameState === 'ready') {
      if (timerRef.current) clearTimeout(timerRef.current);
      setGameState('waiting');
      setMessage("早すぎます！もう一度タップしてリトライ");
    } else if (gameState === 'now') {
      const endTime = Date.now();
      const reactionTime = endTime - startTime;
      setScore(reactionTime);
      setGameState('clicked');
      
      const newAttempts = [...attempts, reactionTime];
      setAttempts(newAttempts);

      if (newAttempts.length >= 5) {
        setMessage("計測終了！分析結果を表示します...");
        setTimeout(() => setGameState('ended'), 1000);
      } else {
        setMessage(`${reactionTime}ms！ 画面をタップして次へ (${newAttempts.length}/5)`);
      }
    } else if (gameState === 'clicked') {
      startGame();
    }
  };

  // --- 統計計算ロジック ---
  const normalPDF = (x: number, mean: number, sd: number) => {
    return (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / sd, 2));
  };

  const getPercentile = (value: number, mean: number, sd: number) => {
    const z = (value - mean) / sd;
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp(-z * z / 2);
    let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    if (z > 0) p = 1 - p;
    return Math.max(0.1, p * 100); 
  };

  const myAverage = attempts.length > 0 
    ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length) 
    : 0;

  const mySD = attempts.length > 0
    ? Math.sqrt(attempts.map(x => Math.pow(x - myAverage, 2)).reduce((a, b) => a + b, 0) / attempts.length)
    : 0;

  const myRankPercentile = getPercentile(myAverage, POPULATION_MEAN, POPULATION_SD);

  // 【修正②】グラフの表示範囲を動的に計算する関数
  // ユーザーのスコアがグラフ範囲（デフォルト100-400）を飛び出している場合、範囲を拡張する
  const getGraphDomain = () => {
    const minX = Math.min(100, myAverage - 100); // 自分のスコア-100ms か 100ms の小さい方
    const maxX = Math.max(450, myAverage + 100); // 自分のスコア+100ms か 450ms の大きい方
    return { minX, maxX };
  };

  const { minX, maxX } = getGraphDomain();

  const generateGraphData = () => {
    const data = [];
    // 動的に計算した範囲でグラフを描画
    for (let i = minX; i <= maxX; i += 10) {
      data.push({
        ms: i,
        density: normalPDF(i, POPULATION_MEAN, POPULATION_SD),
      });
    }
    return data;
  };

  return (
    <main 
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-200 cursor-pointer select-none
        ${gameState === 'waiting' || gameState === 'ended' ? 'bg-slate-100 text-slate-800' : ''}
        ${gameState === 'ready' ? 'bg-rose-600 text-white' : ''}
        ${gameState === 'now' ? 'bg-emerald-500 text-white' : ''}
        ${gameState === 'clicked' ? 'bg-slate-800 text-white' : ''}
      `}
      onMouseDown={handleClick}
      // スマホ対応：タッチイベントも追加
      onTouchStart={handleClick}
    >
      
      {gameState !== 'ended' ? (
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-8 leading-tight">{message}</h1>
          {score !== null && (
            <div className="text-7xl md:text-8xl font-mono font-bold mb-4">{score} ms</div>
          )}
          <p className="opacity-60 text-lg mt-4">
            {gameState === 'waiting' ? "5回計測して平均を出します" : "画面ならどこを押してもOK"}
          </p>
          <div className="mt-8 flex justify-center gap-2 flex-wrap">
            {attempts.map((t, i) => (
              <span key={i} className="px-3 py-1 bg-white/20 rounded font-mono text-sm">
                {i + 1}: {t}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden text-slate-800 cursor-auto" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
          
          <div className="bg-slate-800 p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2 opacity-80">あなたの平均反応速度</h2>
            <div className="text-6xl md:text-7xl font-mono font-bold mb-4">{myAverage}<span className="text-3xl ml-2">ms</span></div>
            
            <div className="flex justify-center gap-4 md:gap-8 mt-6">
              <div className="bg-white/10 px-4 py-3 rounded-xl">
                <p className="text-xs opacity-70 mb-1">偏差値ランク</p>
                <p className="text-lg md:text-xl font-bold text-emerald-400">上位 {myRankPercentile.toFixed(1)} %</p>
              </div>
              <div className="bg-white/10 px-4 py-3 rounded-xl">
                <p className="text-xs opacity-70 mb-1">ばらつき (標準偏差)</p>
                <p className="text-lg md:text-xl font-bold">±{Math.round(mySD)} ms</p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                📊 正規分布での位置
              </h3>
              <div className="h-64 w-full border border-slate-100 rounded-xl p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={generateGraphData()} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    {/* X軸の範囲を動的に設定 */}
                    <XAxis 
                      dataKey="ms" 
                      type="number" 
                      domain={[minX, maxX]} 
                      label={{ value: '反応速度 (ms)', position: 'insideBottom', offset: -10 }} 
                    />
                    <YAxis hide />
                    <Tooltip content={() => null} />
                    
                    <Area type="monotone" dataKey="density" stroke="#94a3b8" fill="#e2e8f0" fillOpacity={0.5} name="一般平均" />
                    
                    <ReferenceLine x={myAverage} stroke="#ef4444" strokeWidth={2} label={{ value: 'あなた', position: 'top', fill: '#ef4444' }} />
                    <ReferenceDot x={myAverage} y={normalPDF(myAverage, POPULATION_MEAN, POPULATION_SD)} r={6} fill="#ef4444" stroke="white" />
                    
                    <ReferenceLine x={POPULATION_MEAN} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: '一般平均', position: 'top', fill: '#94a3b8', fontSize: 12 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">
                ※左に行くほど（タイムが短いほど）優秀です。
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
                <h4 className="font-bold text-emerald-800 mb-2">🏆 上位 {myRankPercentile.toFixed(1)}% とは？</h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  もし100人の人がこのテストを受けたら、あなたは <span className="font-bold underline">{Math.ceil(myRankPercentile)}番目</span> くらいの順位になります。
                </p>
              </div>

              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-2">📉 標準偏差（SD）とは？</h4>
                <p className="text-sm text-slate-700 leading-relaxed mb-2">
                  タイムの「ばらつき」です。あなたのSDは <span className="font-bold">{Math.round(mySD)}ms</span> でした。
                </p>
                <ul className="text-xs text-slate-600 list-disc ml-4 space-y-1">
                  <li>小さいほど、常に同じタイムを出せるアスリート型です。</li>
                  <li>大きいほど、集中力にムラがある状態です。</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t flex flex-col md:flex-row justify-center gap-4">
            <button 
              onClick={() => { setGameState('waiting'); setAttempts([]); setMessage("画面をタップしてスタート"); }}
              className="px-8 py-3 bg-slate-800 text-white rounded-full font-bold hover:bg-slate-700 transition shadow-lg"
            >
              もう一度挑戦する
            </button>
            <a href="/" className="px-8 py-3 bg-white text-slate-600 border border-slate-300 rounded-full font-bold hover:bg-slate-100 transition text-center">
              メニューに戻る
            </a>
          </div>

        </div>
      )}
    </main>
  );
}
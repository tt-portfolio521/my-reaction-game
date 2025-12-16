"use client";

import { useState, useRef } from "react";
import { 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  ReferenceDot 
} from 'recharts';

export default function ReactionGame() {
  // --- ゲームの状態管理 ---
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'now' | 'clicked' | 'ended'>('waiting');
  const [message, setMessage] = useState("画面をクリックしてスタート");
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
    setMessage("赤くなったらクリック！");
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
      // リセットして再開
      if (gameState === 'ended') setAttempts([]);
      startGame();
    } else if (gameState === 'ready') {
      // お手つき
      if (timerRef.current) clearTimeout(timerRef.current);
      setGameState('waiting');
      setMessage("早すぎます！もう一度クリックしてリトライ");
    } else if (gameState === 'now') {
      // 計測成功
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
        setMessage(`${reactionTime}ms！ 画面をクリックして次へ (${newAttempts.length}/5)`);
      }
    } else if (gameState === 'clicked') {
      startGame();
    }
  };

  // --- 統計計算ロジック ---

  // 正規分布の確率密度関数 (Probability Density Function)
  const normalPDF = (x: number, mean: number, sd: number) => {
    return (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / sd, 2));
  };

  // 累積分布関数を用いたパーセンタイル計算（近似式）
  const getPercentile = (value: number, mean: number, sd: number) => {
    const z = (value - mean) / sd;
    // 誤差関数(erf)の近似を使用して累積確率を計算
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp(-z * z / 2);
    let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    if (z > 0) p = 1 - p;
    
    // 反応速度は「低い方が良い」ので、累積確率が低いほど「上位」になる
    // 例: 上位1% = 全体の1%の人しか出せない速さ
    return Math.max(0.1, p * 100); 
  };

  // 平均値の計算
  const myAverage = attempts.length > 0 
    ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length) 
    : 0;

  // 標準偏差の計算（標本標準偏差）
  const mySD = attempts.length > 0
    ? Math.sqrt(attempts.map(x => Math.pow(x - myAverage, 2)).reduce((a, b) => a + b, 0) / attempts.length)
    : 0;

  // 上位何%か？
  const myRankPercentile = getPercentile(myAverage, POPULATION_MEAN, POPULATION_SD);

  // グラフ用データの生成
  const generateGraphData = () => {
    const data = [];
    // 100ms 〜 400ms の範囲を描画
    for (let i = 100; i <= 400; i += 5) {
      data.push({
        ms: i,
        density: normalPDF(i, POPULATION_MEAN, POPULATION_SD), // 一般人の分布
      });
    }
    return data;
  };

  return (
    <main 
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-200 cursor-pointer
        ${gameState === 'waiting' || gameState === 'ended' ? 'bg-slate-100 text-slate-800' : ''}
        ${gameState === 'ready' ? 'bg-rose-600 text-white' : ''}
        ${gameState === 'now' ? 'bg-emerald-500 text-white' : ''}
        ${gameState === 'clicked' ? 'bg-slate-800 text-white' : ''}
      `}
      onMouseDown={handleClick}
    >
      
      {gameState !== 'ended' ? (
        // --- ゲーム中の画面 ---
        <div className="text-center select-none">
          <h1 className="text-5xl font-black mb-8">{message}</h1>
          {score !== null && (
            <div className="text-8xl font-mono font-bold mb-4">{score} ms</div>
          )}
          <p className="opacity-60 text-lg mt-4">
            {gameState === 'waiting' ? "5回計測して平均を出します" : "画面ならどこを押してもOK"}
          </p>
          <div className="mt-8 flex justify-center gap-2">
            {attempts.map((t, i) => (
              <span key={i} className="px-3 py-1 bg-white/20 rounded font-mono text-sm">
                {i + 1}: {t}ms
              </span>
            ))}
          </div>
        </div>
      ) : (
        // --- 結果発表＆解説画面（ここを実装！） ---
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden text-slate-800 cursor-auto" onMouseDown={(e) => e.stopPropagation()}>
          
          {/* 結果ヘッダー */}
          <div className="bg-slate-800 p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2 opacity-80">あなたの平均反応速度</h2>
            <div className="text-7xl font-mono font-bold mb-4">{myAverage}<span className="text-3xl ml-2">ms</span></div>
            
            <div className="flex justify-center gap-8 mt-6">
              <div className="bg-white/10 px-6 py-3 rounded-xl">
                <p className="text-xs opacity-70 mb-1">偏差値ランク</p>
                <p className="text-xl font-bold text-emerald-400">上位 {myRankPercentile.toFixed(1)} %</p>
              </div>
              <div className="bg-white/10 px-6 py-3 rounded-xl">
                <p className="text-xs opacity-70 mb-1">ばらつき (標準偏差)</p>
                <p className="text-xl font-bold">±{Math.round(mySD)} ms</p>
              </div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* 左側：グラフ表示 */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                📊 正規分布での位置
              </h3>
              <div className="h-64 w-full border border-slate-100 rounded-xl p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={generateGraphData()} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <XAxis dataKey="ms" type="number" domain={[100, 400]} label={{ value: '反応速度 (ms)', position: 'insideBottom', offset: -10 }} />
                    <YAxis hide />
                    <Tooltip content={() => null} /> {/* ツールチップは隠す */}
                    
                    {/* 正規分布の山 */}
                    <Area type="monotone" dataKey="density" stroke="#94a3b8" fill="#e2e8f0" fillOpacity={0.5} name="一般平均" />
                    
                    {/* ユーザーの位置を示す線 */}
                    <ReferenceLine x={myAverage} stroke="#ef4444" strokeWidth={2} label={{ value: 'あなた', position: 'top', fill: '#ef4444' }} />
                    <ReferenceDot x={myAverage} y={normalPDF(myAverage, POPULATION_MEAN, POPULATION_SD)} r={6} fill="#ef4444" stroke="white" />
                    
                    {/* 平均の位置 */}
                    <ReferenceLine x={POPULATION_MEAN} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: '一般平均', position: 'top', fill: '#94a3b8', fontSize: 12 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">
                ※一般成人の平均を250ms、標準偏差を50msと仮定した分布図です。
                左に行くほど（タイムが短いほど）優秀です。
              </p>
            </div>

            {/* 右側：統計解説 */}
            <div className="space-y-6">
              
              {/* 解説1：パーセンタイル */}
              <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
                <h4 className="font-bold text-emerald-800 mb-2">🏆 上位 {myRankPercentile.toFixed(1)}% とは？</h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  もし100人の人がこのテストを受けたら、あなたは <span className="font-bold underline">{Math.ceil(myRankPercentile)}番目</span> くらいの順位になります。<br/>
                  これは統計学の「正規分布（ベルカーブ）」を使って計算しています。
                </p>
              </div>

              {/* 解説2：標準偏差 */}
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-2">📉 標準偏差（SD）とは？</h4>
                <p className="text-sm text-slate-700 leading-relaxed mb-2">
                  あなたのタイムの「ばらつき」を表す数値です。<br/>
                  今回のあなたのSDは <span className="font-bold">{Math.round(mySD)}ms</span> でした。
                </p>
                <ul className="text-xs text-slate-600 list-disc ml-4 space-y-1">
                  <li>数値が<strong>小さい</strong>ほど、常に安定して同じタイムを出せています（アスリート向き）。</li>
                  <li>数値が<strong>大きい</strong>ほど、速い時と遅い時のムラがあります（集中力に波がある状態）。</li>
                </ul>
              </div>

            </div>
          </div>

          {/* フッターアクション */}
          <div className="p-6 bg-slate-50 border-t flex justify-center gap-4">
            <button 
              onClick={() => { setGameState('waiting'); setAttempts([]); setMessage("画面をクリックしてスタート"); }}
              className="px-8 py-3 bg-slate-800 text-white rounded-full font-bold hover:bg-slate-700 transition shadow-lg transform active:scale-95"
            >
              もう一度挑戦する
            </button>
            <a href="/" className="px-8 py-3 bg-white text-slate-600 border border-slate-300 rounded-full font-bold hover:bg-slate-100 transition">
              メニューに戻る
            </a>
          </div>

        </div>
      )}
    </main>
  );
}
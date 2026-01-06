"use client";

import { useState, useRef, useEffect } from "react";

export default function BodyClockGame() {
  // --- ゲームの状態管理 ---
  const [gameState, setGameState] = useState<'waiting' | 'counting' | 'stopped'>('waiting');
  const [message, setMessage] = useState("スタートボタンを押して10秒を測ってみよう");
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- 定数 ---
  const TARGET_TIME = 10000; // 10秒

  // --- 時間フォーマット関数 (1.23 -> 1:23) ---
  const formatTime = (timeInSeconds: number) => {
    const seconds = Math.floor(timeInSeconds);
    const centiseconds = Math.floor((timeInSeconds % 1) * 100);
    // 1桁の場合は0埋めする (例: 5 -> 05)
    return `${seconds}:${centiseconds.toString().padStart(2, '0')}`;
  };

  // --- ゲームロジック ---
  const startGame = () => {
    setGameState('counting');
    setMessage("まずは2秒間カウントアップを見てタイミングを覚えよう！");
    setElapsedTime(null);
    setCurrentTime(0);
    
    // 正確な計測のために現在時刻を変数に保持
    const now = Date.now();
    setStartTime(now);

    // リアルタイム更新開始
    intervalRef.current = setInterval(() => {
      const currentTimestamp = Date.now();
      const elapsed = (currentTimestamp - now) / 1000;
      setCurrentTime(elapsed);

      // 2秒経過したらメッセージを変更
      // (表示の非表示はJSX側の条件分岐で行います)
      if (elapsed >= 2.0 && message !== "今度は頭の中で10秒を数えて、ストップボタンを押そう！") {
        setMessage("今度は頭の中で10秒を数えて、ストップボタンを押そう！");
      }
    }, 10); // 10ms間隔で更新
  };

  const stopGame = () => {
    if (gameState === 'counting') {
      if (intervalRef.current) clearInterval(intervalRef.current);

      const endTime = Date.now();
      const actualElapsed = endTime - startTime;
      setElapsedTime(actualElapsed);
      setGameState('stopped');

      const error = (actualElapsed - TARGET_TIME) / 1000; // 秒単位の誤差（正負あり）
      const errorAbs = Math.abs(error);

      if (errorAbs === 0) {
        setMessage(`奇跡！ 誤差 0.00秒 (人間卒業)`);
      } else if (errorAbs <= 0.1) {
        setMessage(`素晴らしい！ 誤差${error >= 0 ? '+' : ''}${error.toFixed(2)}秒`);
      } else if (errorAbs <= 0.5) {
        setMessage(`いい感じ！ 誤差${error >= 0 ? '+' : ''}${error.toFixed(2)}秒`);
      } else {
        setMessage(`がんばりましょう！ 誤差${error >= 0 ? '+' : ''}${error.toFixed(2)}秒`);
      }

      // 3秒後にリセット
      setTimeout(() => {
        setGameState('waiting');
        setMessage("スタートボタンを押して10秒を測ってみよう");
        setCurrentTime(0); // リセット時に数字を0に戻す
      }, 3000);
    }
  };

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-100 text-slate-800">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">

        <div className="p-8 text-center">
          <h1 className="text-3xl md:text-4xl font-black mb-8">体内時計 10秒チャレンジ</h1>

          {/* リアルタイムストップウォッチ表示エリア */}
          {/* counting状態、かつ2.0秒以下のときだけ表示 */}
          <div className="h-32 mb-8 flex items-center justify-center">
            {gameState === 'counting' && currentTime <= 2.0 ? (
              <div className="text-8xl md:text-9xl font-mono font-bold text-blue-600 tabular-nums">
                {formatTime(currentTime)}
              </div>
            ) : (
              /* 2秒過ぎたら「??:??」を表示して隠す */
              gameState === 'counting' && (
                <div className="text-8xl md:text-9xl font-mono font-bold text-slate-200 tabular-nums">
                  ??:??
                </div>
              )
            )}
          </div>

          <p className="text-lg mb-8 text-slate-600 h-8">{message}</p>

          {/* ボタン群 */}
          <div className="flex justify-center gap-4 mb-8">
            {gameState === 'waiting' && (
              <button
                onClick={startGame}
                className="px-8 py-4 bg-emerald-500 text-white rounded-full font-bold text-xl hover:bg-emerald-600 transition shadow-lg"
              >
                🚀 スタート
              </button>
            )}

            {gameState === 'counting' && (
              <button
                onClick={stopGame}
                className="px-10 py-10 bg-red-500 text-white rounded-full font-bold text-2xl hover:bg-red-600 transition shadow-lg animate-pulse w-32 h-32 flex items-center justify-center"
              >
                STOP
              </button>
            )}
          </div>

          {/* 結果表示（stopped状態のみ） */}
          {gameState === 'stopped' && elapsedTime !== null && (
            <div className="text-6xl md:text-7xl font-mono font-bold mb-4 text-emerald-600">
              {/* 結果表示もフォーマットを統一するなら formatTime(elapsedTime / 1000) を使用 */}
              {(elapsedTime / 1000).toFixed(2)} 秒
            </div>
          )}

          {/* メニューに戻るボタン */}
          <div className="mt-8">
            <a href="/" className="px-6 py-2 bg-slate-300 text-slate-600 rounded-full font-bold hover:bg-slate-400 transition inline-block">
              メニューに戻る
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
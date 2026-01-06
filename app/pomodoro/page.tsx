'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25分 in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true); // true for work, false for break
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Session completed
      if (isWorkSession) {
        setSessionsCompleted(prev => prev + 1);
        // Switch to break
        setIsWorkSession(false);
        setTimeLeft(5 * 60); // 5 minute break
      } else {
        // Switch to work
        setIsWorkSession(true);
        setTimeLeft(25 * 60); // 25 minute work
      }
      setIsRunning(false);
      alert(isWorkSession ? '作業セッション完了！休憩タイムです。' : '休憩終了！次の作業を開始しましょう。');
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isWorkSession]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isWorkSession ? 25 * 60 : 5 * 60);
  };

  const switchSession = () => {
    setIsRunning(false);
    setIsWorkSession(!isWorkSession);
    setTimeLeft(isWorkSession ? 5 * 60 : 25 * 60);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center p-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Timer size={32} className="text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-800">ポモドーロタイマー</h1>
          </div>
          <p className="text-slate-600">
            作業セッション: {sessionsCompleted} 回完了
          </p>
        </div>

        <div className="text-center mb-8">
          <div className="text-6xl font-mono font-bold text-slate-800 mb-4">
            {formatTime(timeLeft)}
          </div>
          <div className="text-lg font-semibold text-blue-600">
            {isWorkSession ? '作業時間' : '休憩時間'}
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full flex items-center gap-2 transition"
            >
              <Play size={20} />
              スタート
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-full flex items-center gap-2 transition"
            >
              <Pause size={20} />
              ストップ
            </button>
          )}

          <button
            onClick={resetTimer}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-full flex items-center gap-2 transition"
          >
            <RotateCcw size={20} />
            リセット
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={switchSession}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition"
          >
            {isWorkSession ? '休憩に切替' : '作業に切替'}
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>ポモドーロテクニック: 25分の集中作業 + 5分の休憩</p>
          <p>4セッション後に15-30分の長い休憩を取ることをおすすめします</p>
        </div>
      </div>
    </main>
  );
}

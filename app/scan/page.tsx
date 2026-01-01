"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, ArrowLeft, Grid3x3, Timer, Share2, Medal } from "lucide-react";
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

// 💥 爆発エフェクト
const ExplosionEffect = ({ x, y, color }: { x: number; y: number; color: string }) => {
  return (
    <div className="absolute pointer-events-none z-20" style={{ left: `${x}%`, top: `${y}%`, width: 0, height: 0 }}>
      {[...Array(8)].map((_, i) => {
        const angle = (i * 45) + (Math.random() * 20 - 10);
        const dist = 30 + Math.random() * 30;
        const rad = (angle * Math.PI) / 180;
        const xMove = Math.cos(rad) * dist;
        const yMove = Math.sin(rad) * dist;
        return (
          <motion.div
            key={i}
            className={`absolute rounded-full ${color}`}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: xMove, y: yMove, opacity: 0, scale: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ width: 8, height: 8, marginLeft: -4, marginTop: -4 }}
          />
        );
      })}
    </div>
  );
};

export default function NumberScanGame() {
  const [gameState, setGameState] = useState<"idle" | "countdown" | "playing" | "finished">("idle");
  const [level, setLevel] = useState<LevelKey>("level2");
  const [numbers, setNumbers] = useState<number[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [nextNumber, setNextNumber] = useState(1);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  
  const [startTime, setStartTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [penaltyTime, setPenaltyTime] = useState(0);
  const [shake, setShake] = useState(false);

  // カウントダウン用
  const [countDown, setCountDown] = useState(3);

  // ベストタイム管理
  const [bestTimes, setBestTimes] = useState<Record<LevelKey, number | null>>({
    level1: null,
    level2: null,
    level3: null,
  });
  const [isNewRecord, setIsNewRecord] = useState(false);

  // 初期化時にベストタイムを読み込み
  useEffect(() => {
    const loaded: Record<string, number | null> = { ...bestTimes };
    (Object.keys(LEVELS) as LevelKey[]).forEach((key) => {
      const saved = localStorage.getItem(`numberScan_${key}`);
      if (saved) loaded[key] = parseInt(saved, 10);
    });
    setBestTimes(loaded);
  }, []);

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

  // ゲーム開始フロー（カウントダウン開始）
  const startSequence = (selectedLevel: LevelKey) => {
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
    setExplosions([]);
    setIsNewRecord(false);
    
    // カウントダウン開始
    setCountDown(3);
    setGameState("countdown");
  };

  // カウントダウン処理
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "countdown") {
      if (countDown > 0) {
        timer = setTimeout(() => setCountDown(countDown - 1), 600); // 0.6秒間隔でテンポよく
      } else {
        // カウントダウン終了 -> ゲーム開始
        setGameState("playing");
        setStartTime(Date.now());
      }
    }
    return () => clearTimeout(timer);
  }, [gameState, countDown]);

  // タイマー処理
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing") {
      timer = setInterval(() => {
        setCurrentTime(Date.now() - startTime + penaltyTime);
      }, 30);
    }
    return () => clearInterval(timer);
  }, [gameState, startTime, penaltyTime]);

  const handleCardClick = (num: number, index: number) => {
    if (gameState !== "playing") return;

    if (num === nextNumber) {
      // 正解
      const pos = positions[index];
      const btnSize = LEVELS[level].btnSize;
      const centerX = pos.left + btnSize / 2;
      const centerY = pos.top + btnSize / 2;
      
      const newExplosion = { id: num, x: centerX, y: centerY, color: LEVELS[level].particle };
      setExplosions((prev) => [...prev, newExplosion]);
      setTimeout(() => {
        setExplosions((prev) => prev.filter(e => e.id !== num));
      }, 500);

      const total = LEVELS[level].count;
      if (num === total) {
        finishGame();
      } else {
        setNextNumber((prev) => prev + 1);
      }
    } else {
      // 不正解
      setPenaltyTime((prev) => prev + 1000);
      setShake(true);
      setTimeout(() => setShake(false), 300);
    }
  };

  const finishGame = () => {
    const finalTime = currentTime;
    setGameState("finished");
    
    // ベストタイム更新判定
    const currentBest = bestTimes[level];
    if (currentBest === null || finalTime < currentBest) {
      setIsNewRecord(true);
      setBestTimes((prev) => ({ ...prev, [level]: finalTime }));
      localStorage.setItem(`numberScan_${level}`, finalTime.toString());
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${centiseconds.toString().padStart(2, "0")}`;
  };

  const shareResult = () => {
    const time = formatTime(currentTime);
    const text = `【暇つぶしゲーム】ナンバー・スキャン\n${LEVELS[level].label}を「${time}秒」でクリアしました！\n${isNewRecord ? "🏆自己ベスト更新！\n" : ""}反射神経と周辺視野の限界に挑戦🔥\n#MyToolsBox #脳トレ #暇つぶし`;
    const url = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
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
          
          {/* カウントダウン表示 */}
          <AnimatePresence>
            {gameState === "countdown" && (
              <motion.div
                key={countDown}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="absolute inset-0 z-30 flex items-center justify-center bg-white/50 backdrop-blur-sm"
              >
                <div className="text-9xl font-black text-slate-900 drop-shadow-lg">
                  {countDown === 0 ? "GO!" : countDown}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {gameState === "idle" ? (
            <div className="text-center space-y-8 max-w-md w-full relative z-10">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight">
                  暇つぶしに最適！<br/>ナンバー・スキャン
                </h1>
                <p className="text-slate-500 font-bold tracking-widest text-sm">
                  登録不要・1分で遊べる瞬間脳トレ
                </p>
                <div className="bg-white/80 p-4 rounded-xl text-sm text-slate-600 border border-slate-200">
                    数字を1から順にタップするだけ。<br/>
                    お手つきは<span className="text-red-500 font-bold">+1秒</span>ペナルティ。
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {(Object.keys(LEVELS) as LevelKey[]).map((lvl) => (
                  <button 
                    key={lvl}
                    onClick={() => startSequence(lvl)} 
                    className="flex items-center gap-4 p-4 bg-white border-2 border-slate-100 hover:border-blue-400 rounded-2xl shadow-sm hover:shadow-md transition-all group text-left relative overflow-hidden"
                  >
                    <div className={`${LEVELS[lvl].color.replace("bg-", "bg-opacity-10 bg-")} p-3 rounded-xl ${LEVELS[lvl].text} group-hover:scale-110 transition-transform`}>
                      <Grid3x3 />
                    </div>
                    <div className="flex-1">
                        <div className="font-bold text-lg text-slate-800">{LEVELS[lvl].label}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                          {bestTimes[lvl] ? (
                            <>
                              <Medal size={12} className="text-yellow-500" />
                              Best: <span className="font-mono">{formatTime(bestTimes[lvl] as number)}s</span>
                            </>
                          ) : (
                            "No Record"
                          )}
                        </div>
                    </div>
                    <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 font-bold">
                        PLAY ▶
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : gameState === "finished" ? (
            <div className="text-center space-y-6 animate-in zoom-in duration-300 relative z-10 w-full max-w-xs mx-auto">
               <div className="relative inline-block">
                 <div className="bg-yellow-100 p-6 rounded-full text-yellow-600 mb-4">
                   <Trophy size={64} />
                 </div>
                 {isNewRecord && (
                   <motion.div 
                     initial={{ scale: 0 }} animate={{ scale: 1 }} 
                     className="absolute -top-2 -right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white shadow-sm rotate-12"
                   >
                     NEW RECORD!
                   </motion.div>
                 )}
               </div>
               
               <h2 className="text-3xl font-bold">CLEAR!</h2>
               
               <div className={`bg-white p-6 rounded-2xl border-2 shadow-sm ${isNewRecord ? "border-yellow-400 bg-yellow-50" : "border-slate-200"}`}>
                 <div className="text-xs text-slate-400 font-bold uppercase mb-1">Result Time</div>
                 <div className="text-5xl font-black text-slate-800 tracking-tight">{formatTime(currentTime)}<span className="text-lg font-normal text-slate-400 ml-1">s</span></div>
                 {isNewRecord && <div className="text-orange-500 font-bold text-sm mt-2 flex justify-center items-center gap-1">🎉 自己ベスト更新！</div>}
               </div>

               <button
                 onClick={shareResult}
                 className="w-full py-3 bg-black text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
               >
                 <Share2 size={18} />
                 Xでタイムを自慢する
               </button>

               <div className="flex gap-4 justify-center mt-4">
                 <button onClick={() => setGameState("idle")} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition">
                    戻る
                 </button>
                 <button
                    onClick={() => startSequence(level)}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
                >
                    <RotateCcw size={18} />
                    もう一度
                </button>
               </div>
            </div>
          ) : (
            <motion.div 
                className="relative w-full max-w-[400px] aspect-square"
                animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.3 }}
            >
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
                                    scale: isCleared ? 0.5 : 1,
                                    top: `${pos.top}%`,
                                    left: `${pos.left}%`,
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                onClick={() => handleCardClick(num, i)}
                                className={`
                                    absolute rounded-full font-bold shadow-md border-b-4 active:border-b-0 active:translate-y-1 active:shadow-none transition-colors flex items-center justify-center select-none cursor-pointer
                                    ${isCleared ? "pointer-events-none" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"}
                                    ${level === "level3" ? "text-xl" : "text-2xl md:text-3xl"}
                                `}
                                style={{
                                    width: `${btnSize}%`,
                                    height: `${btnSize}%`,
                                    WebkitTapHighlightColor: "transparent",
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

      <article className="mt-24 max-w-3xl w-full px-6 pb-20 text-slate-700">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b-4 border-green-500 inline-block pb-1">
          暇つぶしに最適！無料で遊べるブラウザゲーム
        </h2>
        
        <p className="mb-10 text-lg leading-relaxed text-slate-600">
          「ナンバー・スキャン」は、<strong>インストール不要</strong>・<strong>登録不要</strong>ですぐに遊べるシンプルな脳トレゲームです。
          ルールは簡単、画面上にバラバラに配置された数字を1から順番にタップするだけ。
          電車での移動中や、ちょっとした待ち時間の<strong>暇つぶし</strong>に最適です。
        </p>

        <section className="mb-12">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="bg-green-100 text-green-600 p-2 rounded-lg text-xl">🚀</span>
            なぜ「暇つぶし」におすすめ？
          </h3>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li><strong>1プレイ30秒〜1分：</strong> 短い時間でサクッと遊んで、すぐにやめられます。</li>
                <li><strong>PCでもスマホでも：</strong> ブラウザさえあれば、デバイスを選ばずどこでもプレイ可能。</li>
                <li><strong>適度な没頭感：</strong> シンプルですが、自己ベスト更新を目指すと意外とハマります。</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg text-xl">🧠</span>
            遊ぶだけで脳トレ効果も
          </h3>
          <p className="text-slate-600 leading-relaxed mb-4">
            ただの暇つぶしではありません。このゲームは心理学的な実験手法「シュルテ・テーブル」をベースにしており、
            <strong>周辺視野の拡大</strong>や<strong>情報処理速度の向上</strong>が期待できます。
            スポーツの動体視力トレーニングや、速読の練習としても活用されています。
          </p>
        </section>

        <section className="bg-slate-100 p-8 rounded-3xl mt-16 text-center">
          <h3 className="font-bold text-slate-800 mb-4">他の暇つぶしゲームにも挑戦！</h3>
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
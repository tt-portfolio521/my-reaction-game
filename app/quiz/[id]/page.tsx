"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, Share2, HelpCircle, ArrowRight } from "lucide-react";
import { quizList, QuizGenre } from "../../data/quizData";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizPlayerPage({ params }: { params: { id: string } }) {
  // 1. URLからクイズデータを検索
  const quiz: QuizGenre | undefined = quizList.find((q) => q.id === params.id);

  if (!quiz) {
    notFound(); // 404ページへ
  }

  // 2. ゲームの状態管理
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentQuestion = quiz.questions[currentQIndex];
  const progress = ((currentQIndex) / quiz.questions.length) * 100;

  // 回答を選択したときの処理
  const handleAnswer = (index: number) => {
    if (isAnswered) return; // 連打防止
    
    setSelectedOptionIndex(index);
    setIsAnswered(true);

    if (currentQuestion.options[index].isCorrect) {
      setScore(score + 1);
    }
  };

  // 次の問題へ進む処理
  const handleNext = () => {
    if (currentQIndex + 1 < quiz.questions.length) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedOptionIndex(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      setIsFinished(true);
    }
  };

  // 最初からやり直す
  const handleRestart = () => {
    setCurrentQIndex(0);
    setScore(0);
    setIsFinished(false);
    setSelectedOptionIndex(null);
    setIsAnswered(false);
    setShowHint(false);
  };

  // シェア機能
  const shareResult = () => {
    const text = `【暇つぶしクイズ】${quiz.title}\n全${quiz.questions.length}問中「${score}問」正解しました！\n#MyToolsBox #クイズ #脳トレ`;
    const url = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };

  // --- 結果画面 ---
  if (isFinished) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    let message = "";
    if (percentage === 100) message = "完璧です！博士級の知識！🎉";
    else if (percentage >= 80) message = "素晴らしい！あと少し！✨";
    else if (percentage >= 60) message = "なかなかやりますね！👍";
    else message = "次はもっといけるはず！💪";

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6">
          <div className="text-6xl mb-2">{percentage === 100 ? "🏆" : "📝"}</div>
          <h2 className="text-3xl font-black text-slate-800">RESULT</h2>
          
          <div className="py-6 border-y border-slate-100">
            <div className="text-sm text-slate-400 font-bold mb-2">SCORE</div>
            <div className="text-5xl font-black text-indigo-600">
              {score} <span className="text-xl text-slate-400 font-normal">/ {quiz.questions.length}</span>
            </div>
            <p className="text-slate-600 mt-4 font-bold">{message}</p>
          </div>

          <div className="space-y-3">
             <button onClick={shareResult} className="w-full py-3 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition">
              <Share2 size={18} /> 結果をシェアする
            </button>
            <button onClick={handleRestart} className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition">
              <RotateCcw size={18} /> もう一度挑戦
            </button>
            <Link href="/quiz" className="block w-full py-3 text-slate-400 font-bold hover:text-slate-600 text-sm">
              他のクイズを探す
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- クイズプレイ画面 ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 px-4 font-sans text-slate-800">
      
      {/* ヘッダーエリア */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <Link href="/quiz" className="text-slate-400 hover:text-slate-600 p-2 bg-white rounded-full shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-bold text-slate-600 text-sm md:text-base truncate max-w-[200px] md:max-w-none">
          {quiz.title}
        </h1>
        <div className="text-slate-400 font-bold text-sm bg-white px-3 py-1 rounded-full shadow-sm">
          Q.{currentQIndex + 1}
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[500px]">
        
        {/* プログレスバー */}
        <div className="w-full h-2 bg-slate-100">
          <motion.div 
            className="h-full bg-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="p-6 md:p-8 flex-grow flex flex-col">
          
          {/* 問題文 */}
          <div className="mb-8">
             <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed">
               {currentQuestion.question}
             </h2>
          </div>

          {/* 選択肢エリア */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              // 判定ロジック
              let btnClass = "bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-indigo-200";
              let icon = null;

              if (isAnswered) {
                if (option.isCorrect) {
                  // 正解の選択肢
                  btnClass = "bg-green-50 border-2 border-green-500 text-green-700 font-bold";
                  icon = <CheckCircle2 className="text-green-500" />;
                } else if (index === selectedOptionIndex) {
                  // 間違って選んだ選択肢
                  btnClass = "bg-red-50 border-2 border-red-500 text-red-700 opacity-60";
                  icon = <XCircle className="text-red-500" />;
                } else {
                  // 選ばなかった不正解
                  btnClass = "bg-slate-50 border-slate-100 text-slate-300 opacity-50";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl text-left transition-all flex justify-between items-center ${btnClass}`}
                >
                  <span>{option.text}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {/* 解説エリア（回答後のみ表示） */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-auto bg-slate-50 p-5 rounded-2xl border border-slate-100"
              >
                <div className="font-bold text-sm text-slate-400 mb-2">解説</div>
                <p className="text-slate-700 text-sm leading-relaxed mb-4">
                  {currentQuestion.options.find(o => o.isCorrect)?.rationale}
                </p>
                <button 
                  onClick={handleNext}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                  {currentQIndex + 1 === quiz.questions.length ? "結果を見る" : "次の問題へ"} <ArrowRight size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ヒント機能（回答前のみ） */}
          {!isAnswered && (
             <div className="mt-auto pt-4 text-center">
               {!showHint ? (
                 <button 
                   onClick={() => setShowHint(true)}
                   className="text-xs text-slate-400 flex items-center justify-center gap-1 mx-auto hover:text-indigo-500 transition"
                 >
                   <HelpCircle size={14} /> ヒントを見る
                 </button>
               ) : (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-indigo-500 font-bold bg-indigo-50 py-2 px-4 rounded-full inline-block">
                   ヒント: {currentQuestion.hint}
                 </motion.div>
               )}
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
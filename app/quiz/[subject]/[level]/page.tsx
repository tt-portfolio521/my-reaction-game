"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, Share2, HelpCircle, ArrowRight } from "lucide-react";
import { quizData } from "../../../data/quizData"; // 階層は ../../../

import { motion, AnimatePresence } from "framer-motion";

export default function QuizPlayerPage({ params }: { params: { subject: string; level: string } }) {
  // データ検索
  const subject = quizData.find((s) => s.id === params.subject);
  const difficulty = subject?.difficulties.find((d) => d.id === params.level);

  if (!subject || !difficulty) {
    notFound();
  }

  const questions = difficulty.questions;
  
  // 準備中画面
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center font-sans text-slate-800">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">準備中です</h2>
        <p className="text-slate-600 mb-8">このレベルの問題はまだ登録されていません。</p>
        <Link href={`/quiz/${subject.id}`} className="px-6 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-700 transition">
          難易度選択に戻る
        </Link>
      </div>
    );
  }

  // ゲームの状態管理
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentQuestion = questions[currentQIndex];
  const progress = ((currentQIndex) / questions.length) * 100;

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedOptionIndex(index);
    setIsAnswered(true);
    if (currentQuestion.options[index].isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedOptionIndex(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQIndex(0);
    setScore(0);
    setIsFinished(false);
    setSelectedOptionIndex(null);
    setIsAnswered(false);
    setShowHint(false);
  };

  const shareResult = () => {
    const text = `【${subject.title}クイズ：${difficulty.title}】\n全${questions.length}問中「${score}問」正解しました！\n#MyToolsBox #クイズ #脳トレ`;
    const url = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    let message = "";
    if (percentage === 100) message = "完璧です！天才！🎉";
    else if (percentage >= 80) message = "素晴らしい成績です！✨";
    else if (percentage >= 60) message = "合格ラインです！👍";
    else message = "次はもっといけるはず！💪";

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-800">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6 animate-in zoom-in duration-300">
          <div className="text-6xl mb-2">{percentage === 100 ? "🏆" : "📝"}</div>
          <div>
            <h2 className="text-3xl font-black text-slate-800">RESULT</h2>
            <p className="text-slate-500 font-bold text-sm mt-1">{subject.title} - {difficulty.title}</p>
          </div>
          <div className="py-6 border-y border-slate-100">
            <div className="text-sm text-slate-400 font-bold mb-2">SCORE</div>
            <div className={`text-5xl font-black ${subject.color}`}>
              {score} <span className="text-xl text-slate-400 font-normal">/ {questions.length}</span>
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
            <div className="grid grid-cols-2 gap-3">
                <Link href={`/quiz/${subject.id}`} className="w-full py-3 bg-white border-2 border-slate-100 text-slate-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:border-slate-300 transition text-sm">
                    難易度選択へ
                </Link>
                <Link href="/quiz" className="w-full py-3 bg-white border-2 border-slate-100 text-slate-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:border-slate-300 transition text-sm">
                    教科選択へ
                </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 px-4 font-sans text-slate-800">
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <Link href={`/quiz/${subject.id}`} className="text-slate-400 hover:text-slate-600 p-2 bg-white rounded-full shadow-sm transition">
          <ArrowLeft size={20} />
        </Link>
        <div className="text-center">
            <h1 className="font-black text-slate-700 text-sm md:text-base">
            {subject.title} <span className="text-slate-400 font-normal">|</span> {difficulty.title}
            </h1>
        </div>
        <div className="text-slate-400 font-bold text-sm bg-white px-3 py-1 rounded-full shadow-sm">
          Q.{currentQIndex + 1}
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[500px]">
        <div className="w-full h-2 bg-slate-100">
          <motion.div 
            className={`h-full ${subject.color.replace('text-', 'bg-')}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="p-6 md:p-8 flex-grow flex flex-col">
          <div className="mb-8">
             <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed">
               {currentQuestion.question}
             </h2>
          </div>

          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              let btnClass = "bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300";
              let icon = null;

              if (isAnswered) {
                if (option.isCorrect) {
                  btnClass = "bg-green-50 border-2 border-green-500 text-green-700 font-bold";
                  icon = <CheckCircle2 className="text-green-500" />;
                } else if (index === selectedOptionIndex) {
                  btnClass = "bg-red-50 border-2 border-red-500 text-red-700 opacity-60";
                  icon = <XCircle className="text-red-500" />;
                } else {
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
                  className={`w-full py-3 text-white rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2 ${subject.color.replace('text-', 'bg-')}`}
                >
                  {currentQIndex + 1 === questions.length ? "結果を見る" : "次の問題へ"} <ArrowRight size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

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
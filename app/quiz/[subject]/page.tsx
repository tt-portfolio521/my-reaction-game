// app/quiz/[subject]/page.tsx
"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";
import { quizData } from "../../data/quizData";

export default function DifficultySelectPage({ params }: { params: { subject: string } }) {
  // 教科データを検索
  const subject = quizData.find((s) => s.id === params.subject);

  if (!subject) {
    notFound();
  }

  // 難易度ごとの装飾設定
  const getLevelStyle = (id: string) => {
    switch (id) {
      case "easy": return { star: 1, color: "text-green-500", border: "border-green-200", bg: "bg-green-50" };
      case "normal": return { star: 2, color: "text-blue-500", border: "border-blue-200", bg: "bg-blue-50" };
      case "hard": return { star: 3, color: "text-red-500", border: "border-red-200", bg: "bg-red-50" };
      default: return { star: 1, color: "text-slate-500", border: "border-slate-200", bg: "bg-slate-50" };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-800">
      
      <div className="absolute top-4 left-4 z-10">
        <Link href="/quiz" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold bg-white/80 px-4 py-2 rounded-full shadow-sm hover:shadow transition-all">
          <ArrowLeft size={18} />
          <span>教科選択へ戻る</span>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto mt-8">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">{subject.icon}</div>
          <h1 className={`text-3xl md:text-4xl font-black mb-2 ${subject.color}`}>
            {subject.title}
          </h1>
          <p className="text-slate-600 font-bold">難易度を選択してください</p>
        </div>

        <div className="space-y-4">
          {subject.difficulties.map((level) => {
            const style = getLevelStyle(level.id);
            const questionCount = level.questions.length;
            
            return (
              <Link href={`/quiz/${subject.id}/${level.id}`} key={level.id} className="block group">
                <div className={`bg-white rounded-2xl p-6 border-2 ${style.border} shadow-sm hover:shadow-md transition-all flex items-center gap-6 relative overflow-hidden`}>
                  {/* 背景装飾 */}
                  <div className={`absolute left-0 top-0 bottom-0 w-3 ${style.bg.replace("bg-", "bg-opacity-50 bg-")}`} />
                  
                  <div className={`w-16 h-16 rounded-xl ${style.bg} flex flex-col items-center justify-center shrink-0`}>
                    <div className="flex gap-0.5">
                      {[...Array(style.star)].map((_, i) => (
                        <Star key={i} size={14} className={`fill-current ${style.color}`} />
                      ))}
                    </div>
                    <span className={`text-xs font-bold mt-1 uppercase ${style.color}`}>{level.id}</span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-slate-600 transition-colors">
                      {level.title}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                      {level.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                      全{questionCount}問
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
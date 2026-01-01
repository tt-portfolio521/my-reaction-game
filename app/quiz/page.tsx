// app/quiz/page.tsx
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { quizData } from "../data/quizData";

export default function QuizSubjectMenu() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-800">
      
      <div className="absolute top-4 left-4 z-10">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold bg-white/80 px-4 py-2 rounded-full shadow-sm hover:shadow transition-all">
          <ArrowLeft size={18} />
          <span>ホームへ</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto mt-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-sm font-bold mb-4 tracking-wider">
            SCHOOL QUIZ
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            教科を選んでください
          </h1>
          <p className="text-slate-600 leading-relaxed max-w-xl mx-auto">
            懐かしの小中学校クイズに挑戦。<br/>
            得意だった教科、苦手だった教科、どれから始めますか？
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizData.map((subject) => (
            <Link href={`/quiz/${subject.id}`} key={subject.id} className="group">
              <div className={`rounded-3xl p-6 shadow-sm border-2 border-slate-100 transition-all h-full flex flex-col ${subject.bg}`}>
                <div className="flex items-center justify-center mb-6">
                  <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {subject.icon}
                  </div>
                </div>
                <div className="text-center">
                  <h2 className={`text-2xl font-black mb-2 ${subject.color}`}>
                    {subject.title}
                  </h2>
                  <p className="text-slate-500 text-sm font-bold">
                    全3レベル (初級・中級・上級)
                  </p>
                </div>
                <div className="mt-6 text-center">
                   <span className={`inline-block border-2 font-bold text-sm px-6 py-2 rounded-full transition-colors ${subject.color.replace('text-', 'border-').replace('600', '200')} bg-white`}>
                     選択する
                   </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
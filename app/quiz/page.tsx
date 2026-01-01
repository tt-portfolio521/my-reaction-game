import Link from "next/link";
import { ArrowLeft, BookOpen, Brain, Coffee } from "lucide-react";
import { quizList } from "../data/quizData"; // パスは適宜調整してください

export default function QuizMenuPage() {
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
            BRAIN TRAINING QUIZ
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            暇つぶしクイズ・道場
          </h1>
          <p className="text-slate-600 leading-relaxed max-w-xl mx-auto">
            移動中や待ち時間の暇つぶしに最適。<br/>
            大人も子供も楽しめるクイズで脳の体操をしましょう。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizList.map((quiz) => (
            <Link href={`/quiz/${quiz.id}`} key={quiz.id} className="group">
              <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-100 hover:border-indigo-400 hover:shadow-lg transition-all h-full flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${quiz.color} text-white`}>
                    {quiz.icon}
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {quiz.title}
                  </h2>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
                  {quiz.description}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                    全{quiz.questions.length}問
                  </span>
                  <span className="text-indigo-600 font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    挑戦する →
                  </span>
                </div>
              </div>
            </Link>
          ))}
          
          {/* カミングスーン枠 */}
          <div className="bg-slate-100 rounded-3xl p-6 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center opacity-70">
            <div className="bg-slate-200 p-4 rounded-full mb-3">
              <Coffee className="text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-500">新しいクイズを準備中...</h3>
            <p className="text-xs text-slate-400 mt-2">近日公開予定！</p>
          </div>
        </div>

      </div>
    </div>
  );
}
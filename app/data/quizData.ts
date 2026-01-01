// app/data/quizData.ts

export type Option = {
  text: string;
  rationale: string;
  isCorrect: boolean;
};

export type Question = {
  questionNumber: number;
  question: string;
  options: Option[];
  hint: string;
};

export type DifficultyLevel = {
  id: "easy" | "normal" | "hard";
  title: string; // 例: "初級（低学年）"
  description: string;
  questions: Question[];
};

export type QuizSubject = {
  id: string; // URLになります (例: kokugo, sansu)
  title: string;
  icon: string; // 絵文字
  color: string; // テーマカラー
  bg: string; // 背景色
  difficulties: DifficultyLevel[];
};

export const quizData: QuizSubject[] = [
  {
    id: "kokugo",
    title: "国語",
    icon: "📕",
    color: "text-red-600",
    bg: "bg-red-50 hover:border-red-400",
    difficulties: [
      {
        id: "easy",
        title: "初級 (低学年)",
        description: "漢字の読み書きや、ことわざの基本。",
        questions: [
          {
            questionNumber: 1,
            question: "「犬」の読み方は？",
            options: [
              { text: "ねこ", rationale: "それは🐱です。", isCorrect: false },
              { text: "いぬ", rationale: "正解！", isCorrect: true },
              { text: "とり", rationale: "それは🐦です。", isCorrect: false },
              { text: "うし", rationale: "それは🐮です。", isCorrect: false },
            ],
            hint: "「い」から始まります。",
          },
          // ... 他の問題
        ],
      },
      {
        id: "normal",
        title: "中級 (中学年)",
        description: "熟語の構成や、少し難しい漢字。",
        questions: [
          /* 省略 */
        ],
      },
      {
        id: "hard",
        title: "上級 (高学年)",
        description: "敬語の使い方や、古文の基礎。",
        questions: [
          /* 省略 */
        ],
      },
    ],
  },
  {
    id: "sansu",
    title: "算数",
    icon: "📐",
    color: "text-blue-600",
    bg: "bg-blue-50 hover:border-blue-400",
    difficulties: [
      {
        id: "easy",
        title: "初級 (低学年)",
        description: "足し算、引き算、時計の読み方。",
        questions: [
          {
            questionNumber: 1,
            question: "5 + 8 はいくつ？",
            options: [
              { text: "12", rationale: "惜しい！", isCorrect: false },
              { text: "13", rationale: "正解！", isCorrect: true },
              { text: "14", rationale: "少し多いです。", isCorrect: false },
              { text: "15", rationale: "多すぎます。", isCorrect: false },
            ],
            hint: "5に5を足すと10です。あと3残っています。",
          },
        ],
      },
      {
        id: "normal",
        title: "中級 (中学年)",
        description: "割り算、少数、図形の面積。",
        questions: [],
      },
      {
        id: "hard",
        title: "上級 (高学年)",
        description: "分数、割合、立体の体積。",
        questions: [],
      },
    ],
  },
  {
    id: "eigo",
    title: "英語",
    icon: "🔤",
    color: "text-orange-600",
    bg: "bg-orange-50 hover:border-orange-400",
    difficulties: [
      { id: "easy", title: "初級", description: "アルファベットと簡単な単語。", questions: [] },
      { id: "normal", title: "中級", description: "日常会話と基本的な文法。", questions: [] },
      { id: "hard", title: "上級", description: "長文読解と少し複雑な表現。", questions: [] },
    ],
  },
  {
    id: "shakai",
    title: "社会",
    icon: "🌏",
    color: "text-green-600",
    bg: "bg-green-50 hover:border-green-400",
    difficulties: [
      { id: "easy", title: "初級", description: "身近な地域や生活について。", questions: [] },
      { id: "normal", title: "中級", description: "都道府県や日本の産業。", questions: [] },
      { id: "hard", title: "上級", description: "日本の歴史と政治・憲法。", questions: [] },
    ],
  },
  {
    id: "rika",
    title: "理科",
    icon: "🔬",
    color: "text-purple-600",
    bg: "bg-purple-50 hover:border-purple-400",
    difficulties: [
      { id: "easy", title: "初級", description: "植物、虫、磁石の性質。", questions: [] },
      { id: "normal", title: "中級", description: "電気の働き、星の動き。", questions: [] },
      { id: "hard", title: "上級", description: "水溶液、人体のつくり、てこ。", questions: [] },
    ],
  },
];
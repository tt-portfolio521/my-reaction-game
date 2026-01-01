export type Option = {
  text: string;
  rationale: string; // 解説
  isCorrect: boolean;
};

export type Question = {
  questionNumber: number;
  question: string;
  options: Option[];
  hint: string;
};

export type QuizGenre = {
  id: string; // URLになります (例: school, trivia, kanji)
  title: string;
  description: string;
  icon: string; // 絵文字
  color: string; // テーマカラー (Tailwindクラス)
  questions: Question[];
};

export const quizList: QuizGenre[] = [
  {
    id: "school",
    title: "懐かしの小中学校クイズ",
    description: "大人が意外と忘れている？歴史、理科、数学など、懐かしの教科から出題！",
    icon: "🏫",
    color: "bg-indigo-500",
    questions: [
      {
        questionNumber: 1,
        question: "【社会・歴史】戦国時代を終わらせ、1603年に江戸幕府を開いた人物は誰でしょう？",
        options: [
          { text: "織田信長", rationale: "信長は室町幕府を滅ぼしましたが、道半ばで倒れました。", isCorrect: false },
          { text: "豊臣秀吉", rationale: "秀吉は天下統一しましたが、幕府は開いていません。", isCorrect: false },
          { text: "徳川家康", rationale: "正解！関ヶ原の戦いの後、征夷大将軍となり幕府を開きました。", isCorrect: true },
          { text: "足利尊氏", rationale: "足利尊氏は室町幕府の初代将軍です。", isCorrect: false },
        ],
        hint: "「鳴かぬなら鳴くまで待とう...」",
      },
      {
        questionNumber: 2,
        question: "【理科・化学】青色のリトマス試験紙をある水溶液に浸したところ、赤色に変化しました。この水溶液の性質は何でしょう？",
        options: [
          { text: "酸性", rationale: "正解！「お母さん（青→赤＝酸）信号無視」などの覚え方があります。", isCorrect: true },
          { text: "中性", rationale: "中性では色は変化しません。", isCorrect: false },
          { text: "アルカリ性", rationale: "アルカリ性は赤から青に変化します。", isCorrect: false },
          { text: "揮発性", rationale: "それは蒸発しやすい性質のことです。", isCorrect: false },
        ],
        hint: "レモンやお酢の性質です。",
      },
      {
        questionNumber: 3,
        question: "【国語・文学】「メロスは激怒した。」という書き出しで有名な、太宰治の小説のタイトルは何でしょう？",
        options: [
          { text: "羅生門", rationale: "羅生門は芥川龍之介の作品です。", isCorrect: false },
          { text: "走れメロス", rationale: "正解！友との約束を守るために走り続ける物語です。", isCorrect: true },
          { text: "山月記", rationale: "山月記は中島敦の作品（虎になる話）です。", isCorrect: false },
          { text: "蜘蛛の糸", rationale: "蜘蛛の糸もお釈迦様が出てくる芥川龍之介の作品です。", isCorrect: false },
        ],
        hint: "主人公の名前がそのままタイトルです。",
      },
      {
        questionNumber: 4,
        question: "【算数・数学】円の面積を求める公式として正しいものはどれでしょう？（半径r, 円周率π）",
        options: [
          { text: "2πr", rationale: "それは円周の長さです。", isCorrect: false },
          { text: "πr²", rationale: "正解！半径×半径×円周率ですね。", isCorrect: true },
          { text: "0.5πr²", rationale: "それは半円の面積です。", isCorrect: false },
          { text: "4πr²", rationale: "それは球の表面積です。", isCorrect: false },
        ],
        hint: "半径 × 半径 × ...",
      },
      {
        questionNumber: 5,
        question: "【英語】インターネットでよく使われる「SNS」は何の略でしょう？",
        options: [
          { text: "Social Networking Service", rationale: "正解！社会的な繋がりを作るサービスです。", isCorrect: true },
          { text: "Super Network System", rationale: "強そうですが違います。", isCorrect: false },
          { text: "Simple News Site", rationale: "ニュースサイトではありません。", isCorrect: false },
          { text: "System Navigation Support", rationale: "システム用語っぽいですが違います。", isCorrect: false },
        ],
        hint: "SはSocialの略です。",
      },
      // ... 他の問題もここに追加 ...
    ],
  },
  // 将来的にここに新しいジャンルを追加できます
  // { id: "anime", title: "90年代アニメクイズ", ... }
];
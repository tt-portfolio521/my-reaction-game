export type CrosswordClue = {
  number: number;
  text: string;
  row: number; // 開始位置(行) 0始まり
  col: number; // 開始位置(列) 0始まり
  direction: "across" | "down"; // ヨコ or タテ
  answer: string;
};

export type CrosswordPuzzle = {
  id: string;
  title: string;
  size: number;
  grid: string[][]; // 正解の文字配置（黒マスは '■'）
  clues: {
    across: CrosswordClue[];
    down: CrosswordClue[];
  };
};

// 【決定版】Vol.3 動物と自然クロスワード
export const activeCrossword: CrosswordPuzzle = {
  id: "cw_03",
  title: "暇つぶしクロスワード Vol.3",
  size: 5,
  grid: [
    ["ヒ", "マ", "ワ", "リ", "■"],
    ["ヨ", "■", "ニ", "ス", "■"],
    ["コ", "ア", "ラ", "■", "ウ"],
    ["■", "リ", "■", "シ", "シ"],
    ["■", "ス", "イ", "カ", "■"],
  ],
  clues: {
    across: [
      { number: 1, text: "夏に咲く大きな黄色い花", row: 0, col: 0, direction: "across", answer: "ヒマワリ" },
      { number: 4, text: "オーストラリアにいる木登り上手な動物", row: 2, col: 0, direction: "across", answer: "コアラ" },
      { number: 7, text: "「百獣の王」と呼ばれる動物を漢字で。「〇〇舞い」", row: 3, col: 3, direction: "across", answer: "シシ" },
      { number: 8, text: "夏に食べる、緑と黒のしま模様の果実", row: 4, col: 1, direction: "across", answer: "スイカ" },
    ],
    down: [
      { number: 1, text: "ニワトリの子供", row: 0, col: 0, direction: "down", answer: "ヒヨコ" },
      { number: 2, text: "大きな口と鋭い歯を持つ、水辺の爬虫類", row: 0, col: 2, direction: "down", answer: "ワニ" },
      { number: 3, text: "ドングリが好きな、尻尾の大きな小動物", row: 0, col: 3, direction: "down", answer: "リス" },
      { number: 5, text: "不思議の国に迷い込んだ少女の名前", row: 2, col: 1, direction: "down", answer: "アリス" },
      { number: 6, text: "牧場にいる、牛乳を出してくれる動物", row: 2, col: 4, direction: "down", answer: "ウシ" },
      { number: 7, text: "奈良公園にたくさんいる動物", row: 3, col: 3, direction: "down", answer: "シカ" },
    ],
  }
};
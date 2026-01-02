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

// 【決定版】Vol.4 中級〜上級：観光・社会
export const activeCrossword: CrosswordPuzzle = {
  id: "cw_04",
  title: "暇つぶしクロスワード Vol.1",
  size: 5,
  grid: [
    ["キ", "ン", "カ", "ク", "ジ"],
    ["ン", "■", "イ", "■", "シ"],
    ["ニ", "ッ", "コ", "ウ", "ン"], // 修正: 最後を '■' から 'ン' に変更（ジシン用）
    ["ク", "■", "ン", "■", "ウ"], // 修正: 最後を 'ン' から 'ウ' に変更（ウン用）
    ["■", "ロ", "ン", "ド", "ン"],
  ],
  clues: {
    across: [
      { number: 1, text: "京都にある金色のお寺。足利義満が建てました", row: 0, col: 0, direction: "across", answer: "キンカクジ" },
      { number: 4, text: "「見ざる言わざる聞かざる」で有名な栃木県の観光地", row: 2, col: 0, direction: "across", answer: "ニッコウ" },
      { number: 6, text: "イギリスの首都。ビッグベンがある都市", row: 4, col: 1, direction: "across", answer: "ロンドン" },
    ],
    down: [
      { number: 1, text: "トレーニングで鍛える体の部位。「〇〇〇は裏切らない」", row: 0, col: 0, direction: "down", answer: "キンニク" },
      { number: 2, text: "地面が揺れること。避難訓練で備えます", row: 0, col: 4, direction: "down", answer: "ジシン" },
      { number: 3, text: "荒れ地を耕して田畑にすること。「〇〇〇〇地」", row: 0, col: 2, direction: "down", answer: "カイコン" },
      { number: 5, text: "ラッキーなこと。ツキ。「〇〇がいい」", row: 3, col: 4, direction: "down", answer: "ウン" },
    ],
  }
};
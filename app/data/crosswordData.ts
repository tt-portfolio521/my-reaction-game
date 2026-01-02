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

// 【決定版】Vol.4 中級〜上級：観光・社会（ひらがな版）
export const activeCrossword: CrosswordPuzzle = {
  id: "cw_04",
  title: "暇つぶしクロスワード Vol.4",
  size: 5,
  // ▼ gridをすべて「ひらがな」に変更しました
  grid: [
    ["き", "ん", "か", "く", "じ"],
    ["ん", "■", "い", "■", "し"],
    ["に", "っ", "こ", "う", "ん"], // 配置修正済み
    ["く", "■", "ん", "■", "う"], // 配置修正済み
    ["■", "ろ", "ん", "ど", "ん"],
  ],
  clues: {
    across: [
      // ▼ answerをすべて「ひらがな」に変更しました
      { number: 1, text: "京都にある金色のお寺。足利義満が建てました", row: 0, col: 0, direction: "across", answer: "きんかくじ" },
      { number: 4, text: "「見ざる言わざる聞かざる」で有名な栃木県の観光地", row: 2, col: 0, direction: "across", answer: "にっこう" },
      { number: 6, text: "イギリスの首都。ビッグベンがある都市", row: 4, col: 1, direction: "across", answer: "ろんどん" },
    ],
    down: [
      // ▼ answerをすべて「ひらがな」に変更しました
      { number: 1, text: "トレーニングで鍛える体の部位。「〇〇〇は裏切らない」", row: 0, col: 0, direction: "down", answer: "きんにく" },
      { number: 2, text: "地面が揺れること。避難訓練で備えます", row: 0, col: 4, direction: "down", answer: "じしん" },
      { number: 3, text: "荒れ地を耕して田畑にすること。「〇〇〇〇地」", row: 0, col: 2, direction: "down", answer: "かいこん" },
      { number: 5, text: "ラッキーなこと。ツキ。「〇〇がいい」", row: 3, col: 4, direction: "down", answer: "うん" },
    ],
  }
};
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, RotateCcw, HelpCircle, Delete } from "lucide-react";
import { motion } from "framer-motion";
import { activeCrossword } from "../data/crosswordData";

// 文字の変換グループ（濁点、半濁点、小文字）
const CHAR_VARIANTS = [
  ['あ', 'ぁ'], ['い', 'ぃ'], ['う', 'ぅ', 'ゔ'], ['え', 'ぇ'], ['お', 'ぉ'],
  ['か', 'が'], ['き', 'ぎ'], ['く', 'ぐ'], ['け', 'げ'], ['こ', 'ご'],
  ['さ', 'ざ'], ['し', 'じ'], ['す', 'ず'], ['せ', 'ぜ'], ['そ', 'ぞ'],
  ['た', 'だ'], ['ち', 'ぢ'], ['つ', 'っ', 'づ'], ['て', 'で'], ['と', 'ど'],
  ['は', 'ば', 'ぱ'], ['ひ', 'び', 'ぴ'], ['ふ', 'ぶ', 'ぷ'], ['へ', 'べ', 'ぺ'], ['ほ', 'ぼ', 'ぽ'],
  ['や', 'ゃ'], ['ゆ', 'ゅ'], ['よ', 'ょ'],
  ['わ', 'ゎ'],
];

// 五十音キーボードのレイアウト
const KEYBOARD_ROWS = [
  ['あ', 'い', 'う', 'え', 'お'],
  ['か', 'き', 'く', 'け', 'こ'],
  ['さ', 'し', 'す', 'せ', 'そ'],
  ['た', 'ち', 'つ', 'て', 'と'],
  ['な', 'に', 'ぬ', 'ね', 'の'],
  ['は', 'ひ', 'ふ', 'へ', 'ほ'],
  ['ま', 'み', 'む', 'め', 'も'],
  ['や', 'ゆ', 'よ', 'わ', 'を'],
  ['ら', 'り', 'る', 'れ', 'ろ'],
  ['ん', 'ー'] // 特殊キーは別途配置
];

export default function CrosswordPage() {
  const puzzle = activeCrossword;
  const size = puzzle.size;

  const [userGrid, setUserGrid] = useState<string[][]>(
    Array(size).fill(null).map(() => Array(size).fill(""))
  );
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [direction, setDirection] = useState<"across" | "down">("across");
  const [isCleared, setIsCleared] = useState(false);
  
  // スマホでの入力フォームへのフォーカスを防ぐため、物理キーボード用refは維持しつつ自動フォーカスはしない
  const inputRef = useRef<HTMLInputElement>(null);

  // マス選択
  const handleCellClick = (r: number, c: number) => {
    if (puzzle.grid[r][c] === "■") return;
    if (selectedCell?.r === r && selectedCell?.c === c) {
      setDirection((prev) => (prev === "across" ? "down" : "across"));
    } else {
      setSelectedCell({ r, c });
    }
  };

  // 文字入力処理
  const insertChar = (char: string) => {
    if (!selectedCell) return;
    
    const newGrid = [...userGrid];
    if (!newGrid[selectedCell.r]) newGrid[selectedCell.r] = [...userGrid[selectedCell.r]];
    else newGrid[selectedCell.r] = [...newGrid[selectedCell.r]];
    
    newGrid[selectedCell.r][selectedCell.c] = char;
    setUserGrid(newGrid);

    moveFocus(true);
  };

  // バックスペース処理
  const handleDelete = () => {
    if (!selectedCell) return;
    
    const newGrid = [...userGrid];
    // 今のマスが空なら一つ戻って消す
    if (userGrid[selectedCell.r][selectedCell.c] === "") {
      moveFocus(false);
      // 移動先（以前のマス）を消す処理はmoveFocus後にstate更新が必要なため、簡易的に「戻る」だけにするか、
      // ここでロジックを書く必要がありますが、ボタン式なら「戻ってから消す」操作でも違和感は少ないです。
      // ユーザー体験向上のため、戻った先の文字を消す処理を追加：
      // (※実装が複雑になるため、今回は「空なら戻る」「文字があれば消す」という挙動にします)
    } else {
      newGrid[selectedCell.r][selectedCell.c] = "";
      setUserGrid(newGrid);
    }
  };

  // 濁点・半濁点・小文字変換
  const handleModifier = () => {
    if (!selectedCell) return;
    const currentChar = userGrid[selectedCell.r][selectedCell.c];
    if (!currentChar) return;

    // 現在の文字が含まれるグループを探す
    const group = CHAR_VARIANTS.find(g => g.includes(currentChar));
    if (group) {
      const currentIndex = group.indexOf(currentChar);
      const nextIndex = (currentIndex + 1) % group.length;
      const nextChar = group[nextIndex];
      
      const newGrid = [...userGrid];
      newGrid[selectedCell.r][selectedCell.c] = nextChar;
      setUserGrid(newGrid);
    }
  };

  // フォーカス移動
  const moveFocus = (forward: boolean) => {
    if (!selectedCell) return;
    let { r, c } = selectedCell;
    let tries = 0;
    while (tries < size * size) {
      if (direction === "across") {
        c = forward ? c + 1 : c - 1;
      } else {
        r = forward ? r + 1 : r - 1;
      }
      if (r < 0 || r >= size || c < 0 || c >= size) break;
      if (puzzle.grid[r][c] !== "■") {
        setSelectedCell({ r, c });
        return;
      }
      tries++;
    }
  };

  // 物理キーボード対応（PC用）
  const handlePhysicalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      handleDelete();
    }
    // その他の入力はonChangeで拾うが、IME制御が難しいため
    // 基本的にボタン入力を推奨するUIにします
  };

  const handlePhysicalInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(-1);
    if (val) {
      insertChar(val);
      e.target.value = "";
    }
  };

  const checkAnswer = () => {
    let correct = true;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (puzzle.grid[r][c] !== "■") {
          if (userGrid[r][c] !== puzzle.grid[r][c]) {
            correct = false;
          }
        }
      }
    }
    if (correct) {
      setIsCleared(true);
    } else {
      alert("間違いがあります！");
    }
  };

  const getCellNumber = (r: number, c: number) => {
    const clue = [...puzzle.clues.across, ...puzzle.clues.down].find(
      (clue) => clue.row === r && clue.col === c
    );
    return clue ? clue.number : null;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-800 pb-40">
      
      {/* 物理キーボード用（画面外） */}
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 pointer-events-none"
        onChange={handlePhysicalInput}
        onKeyDown={handlePhysicalKeyDown}
      />

      <div className="absolute top-4 left-4 z-10">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold bg-white/80 px-4 py-2 rounded-full shadow-sm hover:shadow transition-all">
          <ArrowLeft size={18} />
          <span>ホームへ</span>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto mt-4 flex flex-col lg:flex-row gap-8 items-start justify-center">
        
        {/* ■■■ 左カラム：パズル盤面 ■■■ */}
        <div className="flex flex-col items-center w-full lg:w-auto">
          <div className="text-center mb-4">
            <span className="inline-block bg-pink-100 text-pink-600 px-4 py-1 rounded-full text-sm font-bold mb-2 tracking-wider">
              CROSSWORD
            </span>
            <h1 className="text-2xl font-black text-slate-900">
              {puzzle.title}
            </h1>
          </div>

          <div 
            className="bg-slate-800 p-2 rounded-xl shadow-xl relative select-none"
            style={{ 
              display: "grid", 
              gridTemplateColumns: `repeat(${size}, 1fr)`,
              gap: "4px",
              width: "100%",
              maxWidth: "350px", // 少し小さめに
              aspectRatio: "1/1"
            }}
          >
            {puzzle.grid.map((row, r) => (
              row.map((cellChar, c) => {
                const isBlack = cellChar === "■";
                const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                const cellNum = getCellNumber(r, c);
                const isRelated = selectedCell && !isBlack && (
                  (direction === "across" && selectedCell.r === r) ||
                  (direction === "down" && selectedCell.c === c)
                );

                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`
                      relative flex items-center justify-center text-2xl font-bold cursor-pointer rounded-md transition-colors
                      ${isBlack ? "bg-slate-800" : "bg-white"}
                      ${isSelected ? "ring-4 ring-pink-400 z-10" : ""}
                      ${!isSelected && isRelated && !isBlack ? "bg-pink-50" : ""}
                    `}
                  >
                    {!isBlack && (
                      <>
                        {cellNum && (
                          <span className="absolute top-0.5 left-1 text-[10px] text-slate-400 font-normal leading-none">
                            {cellNum}
                          </span>
                        )}
                        <span className="text-slate-800 mt-1">
                          {userGrid[r][c]}
                        </span>
                      </>
                    )}
                  </div>
                );
              })
            ))}
          </div>
          
          {/* 操作ボタン（リセット・答え合わせ） */}
          <div className="flex gap-4 mt-6 w-full max-w-[350px]">
            <button 
              onClick={() => {
                if(confirm("入力をリセットしますか？")) {
                  setUserGrid(Array(size).fill(null).map(() => Array(size).fill("")));
                  setIsCleared(false);
                }
              }}
              className="flex-1 py-3 bg-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-300 transition flex items-center justify-center gap-2 text-sm"
            >
              <RotateCcw size={16} /> リセット
            </button>
            <button 
              onClick={checkAnswer}
              className="flex-1 py-3 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 shadow-lg transition flex items-center justify-center gap-2 text-sm"
            >
              <CheckCircle2 size={16} /> 答え合わせ
            </button>
          </div>

           {isCleared && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-6 p-4 bg-yellow-100 border-2 border-yellow-400 text-yellow-800 rounded-2xl text-center w-full max-w-[350px]"
            >
              <div className="text-3xl mb-1">🎉</div>
              <h3 className="text-xl font-bold">CLEAR!</h3>
              <p className="text-sm font-bold">おめでとうございます！</p>
            </motion.div>
          )}
        </div>

        {/* ■■■ 中央カラム：五十音キーボード ■■■ */}
        <div className="w-full max-w-[400px] bg-white p-4 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-center text-slate-500 font-bold mb-3 text-sm">文字を入力してください</h3>
          
          <div className="grid grid-cols-5 gap-1.5 mb-2">
            {KEYBOARD_ROWS.map((row, rowIndex) => (
              row.map((char, charIndex) => (
                <button
                  key={`${rowIndex}-${charIndex}`}
                  onClick={() => insertChar(char)}
                  className="bg-slate-50 hover:bg-slate-100 border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 text-slate-700 font-bold rounded-lg py-3 text-lg transition-all"
                >
                  {char}
                </button>
              ))
            ))}
          </div>
          {/* 機能キー */}
          <div className="grid grid-cols-4 gap-2 mt-2">
             <button
               onClick={() => insertChar("ん")}
               className="bg-slate-50 hover:bg-slate-100 border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 text-slate-700 font-bold rounded-lg py-3 text-lg"
             >
               ん
             </button>
             <button
               onClick={() => insertChar("ー")}
               className="bg-slate-50 hover:bg-slate-100 border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 text-slate-700 font-bold rounded-lg py-3 text-lg"
             >
               ー
             </button>
             <button
               onClick={handleModifier}
               className="bg-pink-50 hover:bg-pink-100 border-b-4 border-pink-200 active:border-b-0 active:translate-y-1 text-pink-600 font-bold rounded-lg py-3 text-sm flex flex-col items-center justify-center leading-none"
             >
               <span>゛゜</span>
               <span className="text-[10px]">小文字</span>
             </button>
             <button
               onClick={handleDelete}
               className="bg-slate-200 hover:bg-slate-300 border-b-4 border-slate-300 active:border-b-0 active:translate-y-1 text-slate-600 font-bold rounded-lg py-3 flex items-center justify-center"
             >
               <Delete size={20} />
             </button>
          </div>
        </div>

        {/* ■■■ 右カラム：ヒントリスト ■■■ */}
        <div className="w-full lg:w-[300px] bg-white rounded-3xl shadow-sm border border-slate-200 p-6 self-start">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <HelpCircle className="text-slate-400" />
            <h2 className="font-bold text-slate-700">カギ（ヒント）</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-pink-500 mb-3 flex items-center gap-2 text-sm">
                <span className="bg-pink-100 px-2 py-0.5 rounded text-xs">ヨコ</span> のカギ
              </h3>
              <ul className="space-y-2">
                {puzzle.clues.across.map((clue) => (
                  <li key={clue.number} className="text-sm text-slate-600 hover:bg-slate-50 p-2 rounded cursor-pointer transition"
                      onClick={() => {
                        setSelectedCell({ r: clue.row, c: clue.col });
                        setDirection("across");
                      }}
                  >
                    <span className="font-bold text-slate-800 mr-2">{clue.number}.</span>
                    {clue.text}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-blue-500 mb-3 flex items-center gap-2 text-sm">
                <span className="bg-blue-100 px-2 py-0.5 rounded text-xs">タテ</span> のカギ
              </h3>
              <ul className="space-y-2">
                {puzzle.clues.down.map((clue) => (
                  <li key={clue.number} className="text-sm text-slate-600 hover:bg-slate-50 p-2 rounded cursor-pointer transition"
                      onClick={() => {
                        setSelectedCell({ r: clue.row, c: clue.col });
                        setDirection("down");
                      }}
                  >
                    <span className="font-bold text-slate-800 mr-2">{clue.number}.</span>
                    {clue.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
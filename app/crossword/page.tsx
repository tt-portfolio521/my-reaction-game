"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, RotateCcw, HelpCircle } from "lucide-react";
// ▼ 修正点: motion を追加インポートしました
import { motion } from "framer-motion"; 
import { activeCrossword, CrosswordClue } from "../data/crosswordData";

export default function CrosswordPage() {
  const puzzle = activeCrossword;
  const size = puzzle.size;

  // ユーザーの入力を管理する2次元配列
  const [userGrid, setUserGrid] = useState<string[][]>(
    Array(size).fill(null).map(() => Array(size).fill(""))
  );

  // 選択中のマス {row, col}
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  
  // 入力方向 "across"(横) or "down"(縦)
  const [direction, setDirection] = useState<"across" | "down">("across");

  // クリア状態
  const [isCleared, setIsCleared] = useState(false);

  // 入力フォームへの参照（スマホでキーボードを出すため）
  const inputRef = useRef<HTMLInputElement>(null);

  // マスを選択したときの処理
  const handleCellClick = (r: number, c: number) => {
    if (puzzle.grid[r][c] === "■") return; // 黒マスは無視

    // 同じマスを再度クリックしたら方向を切り替え
    if (selectedCell?.r === r && selectedCell?.c === c) {
      setDirection((prev) => (prev === "across" ? "down" : "across"));
    } else {
      setSelectedCell({ r, c });
    }
    
    // inputにフォーカスを当てる
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // 文字が入力されたときの処理
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCell) return;
    const val = e.target.value.slice(-1); // 最後の1文字だけ取る（全角対応）

    if (!val) return; // 空なら何もしない

    const newGrid = [...userGrid];
    newGrid[selectedCell.r] = [...newGrid[selectedCell.r]];
    newGrid[selectedCell.r][selectedCell.c] = val;
    setUserGrid(newGrid);

    // 次のマスへ移動
    moveFocus(true);
    
    // 入力欄をクリア（常に空にしておく）
    e.target.value = "";
  };

  // Backspaceキーなどの処理
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!selectedCell) return;
      
      const newGrid = [...userGrid];
      // 現在のマスが空なら、一つ戻って消す
      if (userGrid[selectedCell.r][selectedCell.c] === "") {
        moveFocus(false);
        // state更新は非同期なので、移動先の削除は少し複雑になるが、
        // 簡易的に「今のマスを消す」だけで十分操作感は良い
      } else {
        newGrid[selectedCell.r][selectedCell.c] = "";
        setUserGrid(newGrid);
      }
    }
  };

  // フォーカス移動ロジック
  const moveFocus = (forward: boolean) => {
    if (!selectedCell) return;
    let { r, c } = selectedCell;
    
    // 無限ループ防止用カウンタ
    let tries = 0;
    while (tries < size * size) {
      if (direction === "across") {
        c = forward ? c + 1 : c - 1;
      } else {
        r = forward ? r + 1 : r - 1;
      }

      // 範囲外に出たら止める（または次の行へ行くロジックも可）
      if (r < 0 || r >= size || c < 0 || c >= size) break;

      // 黒マスでなければ移動完了
      if (puzzle.grid[r][c] !== "■") {
        setSelectedCell({ r, c });
        return;
      }
      tries++;
    }
  };

  // 正誤判定
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

  // マスに表示する番号を計算
  const getCellNumber = (r: number, c: number) => {
    const clue = [...puzzle.clues.across, ...puzzle.clues.down].find(
      (clue) => clue.row === r && clue.col === c
    );
    return clue ? clue.number : null;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-800">
      
      {/* 隠し入力フォーム（スマホキーボード用） */}
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 top-0 left-0 h-0 w-0"
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />

      <div className="absolute top-4 left-4 z-10">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold bg-white/80 px-4 py-2 rounded-full shadow-sm hover:shadow transition-all">
          <ArrowLeft size={18} />
          <span>ホームへ</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto mt-8 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* 左側：パズル盤面 */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="text-center mb-6">
            <span className="inline-block bg-pink-100 text-pink-600 px-4 py-1 rounded-full text-sm font-bold mb-2 tracking-wider">
              CROSSWORD
            </span>
            <h1 className="text-2xl font-black text-slate-900">
              {puzzle.title}
            </h1>
          </div>

          <div 
            className="bg-slate-800 p-2 rounded-xl shadow-xl relative"
            style={{ 
              display: "grid", 
              gridTemplateColumns: `repeat(${size}, 1fr)`,
              gap: "4px",
              width: "100%",
              maxWidth: "400px",
              aspectRatio: "1/1"
            }}
          >
            {puzzle.grid.map((row, r) => (
              row.map((cellChar, c) => {
                const isBlack = cellChar === "■";
                const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                const cellNum = getCellNumber(r, c);
                
                // 関連する列・行のハイライト（オプション）
                const isRelated = selectedCell && !isBlack && (
                  (direction === "across" && selectedCell.r === r) ||
                  (direction === "down" && selectedCell.c === c)
                );

                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`
                      relative flex items-center justify-center text-xl font-bold select-none cursor-pointer rounded-md transition-colors
                      ${isBlack ? "bg-slate-800" : "bg-white"}
                      ${isSelected ? "ring-4 ring-pink-400 z-10" : ""}
                      ${!isSelected && isRelated && !isBlack ? "bg-pink-50" : ""}
                    `}
                  >
                    {!isBlack && (
                      <>
                        {/* マス番号 */}
                        {cellNum && (
                          <span className="absolute top-0.5 left-1 text-[10px] text-slate-400 font-normal">
                            {cellNum}
                          </span>
                        )}
                        {/* 入力文字 */}
                        <span className="text-slate-800">
                          {userGrid[r][c]}
                        </span>
                      </>
                    )}
                  </div>
                );
              })
            ))}
          </div>

          {/* 操作ボタン */}
          <div className="flex gap-4 mt-8 w-full max-w-[400px]">
            <button 
              onClick={() => {
                if(confirm("入力をリセットしますか？")) {
                  setUserGrid(Array(size).fill(null).map(() => Array(size).fill("")));
                  setIsCleared(false);
                }
              }}
              className="flex-1 py-3 bg-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-300 transition flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} /> リセット
            </button>
            <button 
              onClick={checkAnswer}
              className="flex-1 py-3 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 shadow-lg transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} /> 答え合わせ
            </button>
          </div>

          {/* クリアメッセージ */}
          {isCleared && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-6 p-6 bg-yellow-100 border-2 border-yellow-400 text-yellow-800 rounded-2xl text-center w-full max-w-[400px]"
            >
              <div className="text-3xl mb-2">🎉</div>
              <h3 className="text-xl font-bold">CLEAR!</h3>
              <p className="text-sm font-bold">おめでとうございます！全問正解です！</p>
            </motion.div>
          )}
        </div>

        {/* 右側：ヒントリスト */}
        <div className="w-full lg:w-1/2 bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <HelpCircle className="text-slate-400" />
            <h2 className="font-bold text-slate-700">カギ（ヒント）</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-pink-500 mb-3 flex items-center gap-2">
                <span className="bg-pink-100 px-2 py-0.5 rounded text-xs">ヨコ</span> のカギ
              </h3>
              <ul className="space-y-2">
                {puzzle.clues.across.map((clue) => (
                  <li key={clue.number} className="text-sm text-slate-600 hover:bg-slate-50 p-2 rounded cursor-pointer transition"
                      onClick={() => {
                        setSelectedCell({ r: clue.row, c: clue.col });
                        setDirection("across");
                        setTimeout(() => inputRef.current?.focus(), 0);
                      }}
                  >
                    <span className="font-bold text-slate-800 mr-2">{clue.number}.</span>
                    {clue.text}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-blue-500 mb-3 flex items-center gap-2">
                <span className="bg-blue-100 px-2 py-0.5 rounded text-xs">タテ</span> のカギ
              </h3>
              <ul className="space-y-2">
                {puzzle.clues.down.map((clue) => (
                  <li key={clue.number} className="text-sm text-slate-600 hover:bg-slate-50 p-2 rounded cursor-pointer transition"
                      onClick={() => {
                        setSelectedCell({ r: clue.row, c: clue.col });
                        setDirection("down");
                        setTimeout(() => inputRef.current?.focus(), 0);
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
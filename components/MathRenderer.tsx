"use client"; // ブラウザで動かすための宣言

import { useEffect, useRef } from "react";
// @ts-ignore
import renderMathInElement from "katex/dist/contrib/auto-render";
import "katex/dist/katex.min.css";

export default function MathRenderer({ content }: { content: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      // HTML内の $$...$$ や $...$ を探して数式に変換する
      renderMathInElement(rootRef.current, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
        ],
        throwOnError: false,
      });
    }
  }, [content]);

  return (
    <div 
      ref={rootRef} 
      dangerouslySetInnerHTML={{ __html: content }} 
      className="space-y-6"
    />
  );
}
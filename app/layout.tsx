import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// ★重要：Next.js用のスクリプト部品を読み込み
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "反射神経測定ゲーム",
  description: "あなたの反応速度を計測・分析します",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* ★ここにAdSenseの審査用コードを貼ります */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8743068387408631"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
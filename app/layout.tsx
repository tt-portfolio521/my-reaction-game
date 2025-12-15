import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
        {/* ★ここにAdSense確認用のメタタグを設置 */}
        <meta name="google-adsense-account" content="ca-pub-8743068387408631" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
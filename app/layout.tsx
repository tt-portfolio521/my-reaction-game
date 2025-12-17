import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | My Tools Box', // ページごとのタイトルの後ろに "| My Tools Box" を自動でつける
    default: 'My Tools Box | 計算・シミュレーションツール集', // タイトルがないページのデフォルト
  },
  description: '生活、学習、ビジネスに役立つ計算ツール・シミュレーター集。人間工学や会計の知識に基づき、データを分かりやすく可視化します。',
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
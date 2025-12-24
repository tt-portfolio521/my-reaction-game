import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 1. GoogleAnalytics をインポート
import { GoogleAnalytics } from '@next/third-parties/google';

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
        {/* AdSense確認用のメタタグを維持 */}
        <meta name="google-adsense-account" content="ca-pub-8743068387408631" />

        <meta name="google-site-verification" content="whoIkah3tDL9lZaSdTviSzmc1evNYOPCxBKtLLcM_-I" />
      </head>
      <body className={inter.className}>
        {children}
        {/* 2. Googleアナリティクスを導入（画像で確認したIDを使用） */}
        <GoogleAnalytics gaId="G-7VXZ35NVDC" />
      </body>
    </html>
  );
}
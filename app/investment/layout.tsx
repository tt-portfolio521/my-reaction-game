import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '資産運用シミュレーター',
  description: 'S&P500やオールカントリー（オルカン）などの利回りを想定し、積立投資の複利効果を計算・グラフ化するツール。',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
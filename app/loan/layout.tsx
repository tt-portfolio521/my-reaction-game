import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ローン返済計算機',
  description: '住宅ローンやカーローンの返済額シミュレーション。元利均等返済における元金と利息の内訳推移をグラフで可視化します。',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
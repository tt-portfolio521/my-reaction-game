import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '減価償却計算機',
  description: '定額法・定率法（200%定率法）による減価償却費を自動計算。耐用年数ごとの帳簿価額の推移をグラフと表で確認できます。',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
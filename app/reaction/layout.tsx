import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '反射神経テスト',
  description: 'あなたの反応速度をミリ秒単位で正確に測定。平均値・標準偏差を算出し、正規分布グラフを用いて上位何％かを判定します。',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
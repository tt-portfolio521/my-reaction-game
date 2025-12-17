import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '損益分岐点(CVP)分析',
  description: '固定費・変動費・販売単価から損益分岐点（BEP）を計算。利益が出る売上ラインをグラフで可視化し、限界利益率も算出します。',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function InvestmentSimulator() {
  // 入力値の状態管理
  const [initialAmount, setInitialAmount] = useState(100); // 初期投資額（万円）
  const [monthlyAmount, setMonthlyAmount] = useState(5);   // 毎月積立額（万円）
  const [rate, setRate] = useState(7.0);                   // 年利（%）※S&P500等を意識してデフォルトを少し上げました
  const [years, setYears] = useState(20);                  // 運用期間（年）
  const [data, setData] = useState<any[]>([]);
  const [finalAmount, setFinalAmount] = useState(0);

  // 計算ロジック
  useEffect(() => {
    let currentAmount = initialAmount * 10000;
    let totalPrincipal = initialAmount * 10000;
    const newData = [];

    newData.push({
      year: 0,
      principal: Math.round(totalPrincipal / 10000),
      interest: 0,
      total: Math.round(currentAmount / 10000),
    });

    for (let i = 1; i <= years; i++) {
      for (let m = 0; m < 12; m++) {
        currentAmount = currentAmount * (1 + (rate / 100) / 12) + (monthlyAmount * 10000);
        totalPrincipal += monthlyAmount * 10000;
      }

      newData.push({
        year: i,
        principal: Math.round(totalPrincipal / 10000),
        interest: Math.round((currentAmount - totalPrincipal) / 10000),
        total: Math.round(currentAmount / 10000),
      });
    }

    setData(newData);
    setFinalAmount(Math.round(currentAmount));
  }, [initialAmount, monthlyAmount, rate, years]);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* ヘッダー */}
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold">📈 資産運用シミュレーター</h1>
          <p className="text-sm opacity-90">S&P500やオルカンを想定した積立シミュレーション</p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* 左側：入力フォーム */}
          <div className="space-y-6 bg-slate-50 p-4 rounded-xl h-fit">
            <div>
              <label className="block text-sm font-bold mb-2">初期投資額 (万円)</label>
              <input 
                type="number" 
                value={initialAmount} 
                onChange={(e) => setInitialAmount(Number(e.target.value))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">毎月の積立額 (万円)</label>
              <input 
                type="number" 
                value={monthlyAmount} 
                onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">想定年利 (%)</label>
              <input 
                type="number" 
                step="0.1"
                value={rate} 
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input 
                type="range" min="0" max="15" step="0.1"
                value={rate} 
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full mt-2"
              />
              <p className="text-xs text-gray-400 mt-1">※S&P500の平均は7%〜10%程度</p>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">運用期間 ({years}年)</label>
              <input 
                type="range" min="1" max="50" 
                value={years} 
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* 右側：結果とグラフ */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <div className="mb-6 text-center bg-blue-50 p-4 rounded-xl border border-blue-100">
              <p className="text-sm text-gray-500 mb-1">{years}年後の資産合計</p>
              <p className="text-4xl font-bold text-blue-700">
                {(finalAmount / 10000).toLocaleString(undefined, { maximumFractionDigits: 1 })}
                <span className="text-lg ml-1 text-gray-600">万円</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                (元本: {data[data.length-1]?.principal.toLocaleString()}万円 + <span className="text-blue-600 font-bold">利益: {data[data.length-1]?.interest.toLocaleString()}万円</span>)
              </p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#CBD5E1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#CBD5E1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" />
                  <YAxis unit="万" />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <Tooltip formatter={(value: number) => `${value.toLocaleString()}万円`} />
                  <Area type="monotone" dataKey="total" stroke="#3B82F6" fillOpacity={1} fill="url(#colorTotal)" name="資産合計" />
                  <Area type="monotone" dataKey="principal" stroke="#94a3b8" fillOpacity={1} fill="url(#colorPrincipal)" name="元本" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* ▼▼▼ 追加した解説セクション（S&P500 vs オルカン） ▼▼▼ */}
        <div className="bg-slate-50 p-8 border-t border-slate-200">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
            <span className="text-3xl">📊</span> 利回りは何%に設定すべき？
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* S&P500 の解説 */}
            <section className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-blue-500">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-slate-800">🇺🇸 S&P500</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">米国株式</span>
              </div>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                GoogleやAppleなど、米国の代表的な優良企業500社にまとめて投資する指数です。<br/>
                過去30年以上の歴史を見ると、非常に高いリターンを記録しています。
              </p>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">過去の平均リターン（円ベース）</p>
                <p className="text-xl font-bold text-blue-600">約 7% 〜 10%</p>
                <p className="text-xs text-gray-400 mt-1">※インフレ調整後の実質リターンは7%前後と言われます</p>
              </div>
            </section>

            {/* オルカン の解説 */}
            <section className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-teal-500">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-slate-800">🌍 全世界株式 (オルカン)</h3>
                <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-1 rounded">MSCI ACWI</span>
              </div>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                「eMAXIS Slim 全世界株式」などで人気。米国だけでなく、欧州・日本・新興国など世界中に分散投資します。<br/>
                リスクが分散される分、S&P500よりリターンはややマイルドになる傾向があります。
              </p>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">過去の平均リターン（円ベース）</p>
                <p className="text-xl font-bold text-teal-600">約 5% 〜 7%</p>
                <p className="text-xs text-gray-400 mt-1">※より堅実にシミュレーションしたい場合におすすめ</p>
              </div>
            </section>

          </div>

          <div className="mt-8 bg-yellow-50 p-4 rounded-xl border border-yellow-100">
            <p className="text-sm text-yellow-800 font-bold mb-1">💡 複利（ふくり）の力とは？</p>
            <p className="text-xs text-yellow-700 leading-relaxed">
              グラフの「青い部分（利益）」が年々急速に膨らんでいくのが分かりますか？<br/>
              これは「増えた利益が、さらに新しい利益を生む」雪だるま式の効果（複利効果）です。
              S&P500のようなインデックス投資では、<strong>「時間を味方につける（長く続ける）」</strong>ことが最大の必勝法と言われています。
            </p>
          </div>
        </div>
        {/* ▲▲▲ 解説セクション終了 ▲▲▲ */}

        <div className="p-4 text-center border-t bg-white">
            <a href="/" className="text-blue-500 hover:underline">← トップページに戻る</a>
        </div>
      </div>
    </main>
  );
}
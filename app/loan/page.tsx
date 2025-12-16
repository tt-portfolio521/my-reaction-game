"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function LoanSimulator() {
  // 入力値の状態管理
  const [amount, setAmount] = useState(3000);   // 借入額（万円）
  const [rate, setRate] = useState(1.5);        // 年利（%）
  const [years, setYears] = useState(35);       // 返済期間（年）

  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [graphData, setGraphData] = useState<any[]>([]);

  // 計算ロジック（元利均等返済）
  useEffect(() => {
    // 単位を「円」に変換して計算
    const principal = amount * 10000;
    const monthlyRate = (rate / 100) / 12;
    const numPayments = years * 12;

    let pmt = 0;
    
    // 金利が0%の場合の対応
    if (rate === 0) {
      pmt = principal / numPayments;
    } else {
      pmt = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    }

    // 各月の内訳を計算
    let balance = principal;
    let currentTotalInterest = 0;
    const newData = [];

    // グラフ用データ（年単位で集計して間引く）
    for (let i = 1; i <= numPayments; i++) {
      const interestPart = balance * monthlyRate;
      const principalPart = pmt - interestPart;
      
      balance -= principalPart;
      currentTotalInterest += interestPart;

      // 1年ごと（12ヶ月目）にデータを記録（グラフが見やすくなるように）
      if (i % 12 === 0 || i === 1) {
        newData.push({
          year: Math.ceil(i / 12),
          principalPayment: Math.round(principalPart), // その月の元金返済分
          interestPayment: Math.round(interestPart),   // その月の利息支払い分
          balance: Math.round(balance / 10000),        // 残高（万円）
        });
      }
    }

    setMonthlyPayment(Math.round(pmt));
    setTotalInterest(Math.round(currentTotalInterest));
    setTotalPayment(Math.round(principal + currentTotalInterest));
    setGraphData(newData);

  }, [amount, rate, years]);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* ヘッダー */}
        <div className="bg-indigo-600 p-6 text-white">
          <h1 className="text-2xl font-bold">🏠 ローン返済シミュレーター</h1>
          <p className="text-sm opacity-90">毎月の返済額と、元金・利息の推移を計算します（元利均等返済）</p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* 左側：入力フォーム */}
          <div className="space-y-6 bg-slate-50 p-4 rounded-xl h-fit">
            <div>
              <label className="block text-sm font-bold mb-2">借入金額 (万円)</label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input 
                type="range" min="100" max="10000" step="10"
                value={amount} 
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">金利 (年利 %)</label>
              <input 
                type="number" 
                step="0.01"
                value={rate} 
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input 
                type="range" min="0" max="5" step="0.01"
                value={rate} 
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">返済期間 ({years}年)</label>
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
            {/* 結果サマリー */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-center">
                <p className="text-xs text-gray-500 mb-1">毎月の返済額</p>
                <p className="text-2xl font-bold text-indigo-700">
                  {monthlyPayment.toLocaleString()}
                  <span className="text-sm ml-1 text-gray-600">円</span>
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
                <p className="text-xs text-gray-500 mb-1">総支払額（利息込み）</p>
                <p className="text-xl font-bold text-orange-700">
                  {(totalPayment / 10000).toLocaleString(undefined, { maximumFractionDigits: 1 })}
                  <span className="text-sm ml-1 text-gray-600">万円</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">うち利息: {(totalInterest / 10000).toLocaleString(undefined, { maximumFractionDigits: 1 })}万円</p>
              </div>
            </div>

            {/* グラフ：返済内訳の推移 */}
            <div className="h-64 w-full">
              <p className="text-center text-xs text-gray-500 mb-2">毎月の返済内訳の推移（積み上げグラフ）</p>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={graphData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" label={{ value: '年数', position: 'insideBottomRight', offset: -5 }} />
                  <YAxis unit="円" />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <Tooltip formatter={(value: number) => `${value.toLocaleString()}円`} />
                  <Legend verticalAlign="top" height={36}/>
                  <Area type="monotone" dataKey="interestPayment" stackId="1" stroke="#d97706" fill="url(#colorInterest)" name="利息分" />
                  <Area type="monotone" dataKey="principalPayment" stackId="1" stroke="#4f46e5" fill="url(#colorPrincipal)" name="元金分" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">※ ボーナス払いなし、元利均等返済方式での概算です。</p>
          </div>
        </div>
        
        <div className="p-4 text-center border-t">
            <a href="/" className="text-indigo-500 hover:underline">← トップページに戻る</a>
        </div>
      </div>
    </main>
  );
}
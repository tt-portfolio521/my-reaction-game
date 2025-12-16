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
    const principal = amount * 10000;
    const monthlyRate = (rate / 100) / 12;
    const numPayments = years * 12;

    let pmt = 0;
    
    if (rate === 0) {
      pmt = principal / numPayments;
    } else {
      pmt = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    }

    let balance = principal;
    let currentTotalInterest = 0;
    const newData = [];

    for (let i = 1; i <= numPayments; i++) {
      const interestPart = balance * monthlyRate;
      const principalPart = pmt - interestPart;
      
      balance -= principalPart;
      currentTotalInterest += interestPart;

      // グラフ用データ（1年ごとに集計して表示）
      if (i % 12 === 0 || i === 1) {
        newData.push({
          year: Math.ceil(i / 12),
          principalPayment: Math.round(principalPart), 
          interestPayment: Math.round(interestPart),
          balance: Math.round(balance / 10000),
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

            <div className="h-64 w-full">
              <p className="text-center text-xs text-gray-500 mb-2">返済内訳の推移（積み上げグラフ）</p>
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
            <p className="text-xs text-gray-400 mt-2 text-center">※ グラフのオレンジ色が「利息」です。最初は利息の割合が多いことが分かります。</p>
          </div>
        </div>
        
        {/* ▼▼▼ 追加した解説セクション ▼▼▼ */}
        <div className="bg-slate-50 p-8 border-t border-slate-200">
          <h2 className="text-2xl font-bold mb-8 text-slate-800 flex items-center gap-2">
            <span className="text-3xl">💡</span> ローン返済の仕組み
          </h2>
          
          <div className="space-y-8">
            <section className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-500">
              <h3 className="text-lg font-bold text-indigo-800 mb-3">元利均等返済（がんりきんとう）とは？</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                このシミュレーターで採用している方式です。
                <strong>「毎月の支払額がずっと一定」</strong>になるように計算されています。<br/><br/>
                メリットは「毎月の家計管理が楽」なことですが、
                デメリットは「最初は支払額のほとんどが利息で、なかなか元金（借金そのもの）が減らない」ことです。
                上のグラフでオレンジ色（利息）が最初の方に多いのはそのためです。
              </p>
            </section>

            <section className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-3">金利1%の違いによる衝撃</h3>
              <p className="text-slate-600 leading-relaxed text-sm mb-4">
                住宅ローンのような長期返済では、わずか数％の金利差が数百万円の違いになります。
                例えば「3000万円・35年返済」の場合を比較してみましょう。
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-1">金利 1.5% の場合</p>
                  <p className="font-bold text-blue-700">総支払額：約 3,858万円</p>
                  <p className="text-xs text-gray-400">(利息 858万円)</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-1">金利 2.5% の場合</p>
                  <p className="font-bold text-orange-700">総支払額：約 4,510万円</p>
                  <p className="text-xs text-gray-400">(利息 1,510万円)</p>
                </div>
              </div>
              <p className="text-xs text-right text-gray-500 mt-2">
                差額：なんと <span className="font-bold text-red-500 text-sm">約650万円</span> も変わります！
              </p>
            </section>
          </div>
        </div>
        {/* ▲▲▲ 解説セクション終了 ▲▲▲ */}

        <div className="p-4 text-center border-t bg-white">
            <a href="/" className="text-indigo-500 hover:underline font-bold">← トップページに戻る</a>
        </div>
      </div>
    </main>
  );
}
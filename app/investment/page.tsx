"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function InvestmentSimulator() {
  // 入力値の状態管理
  const [initialAmount, setInitialAmount] = useState(100); // 初期投資額（万円）
  const [monthlyAmount, setMonthlyAmount] = useState(3);   // 毎月積立額（万円）
  const [rate, setRate] = useState(5);                     // 年利（%）
  const [years, setYears] = useState(20);                  // 運用期間（年）
  const [data, setData] = useState<any[]>([]);
  const [finalAmount, setFinalAmount] = useState(0);

  // 計算ロジック
  useEffect(() => {
    let currentAmount = initialAmount * 10000;
    let totalPrincipal = initialAmount * 10000; // 元本合計
    const newData = [];

    // 0年目のデータ
    newData.push({
      year: 0,
      principal: Math.round(totalPrincipal / 10000),
      interest: 0,
      total: Math.round(currentAmount / 10000),
    });

    for (let i = 1; i <= years; i++) {
      // 1年分の複利計算（月利計算の簡易版として年利/12を毎月適用）
      for (let m = 0; m < 12; m++) {
        currentAmount = currentAmount * (1 + (rate / 100) / 12) + (monthlyAmount * 10000);
        totalPrincipal += monthlyAmount * 10000;
      }

      newData.push({
        year: i,
        principal: Math.round(totalPrincipal / 10000), // 元本（万円）
        interest: Math.round((currentAmount - totalPrincipal) / 10000), // 運用益（万円）
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
          <p className="text-sm opacity-90">毎月の積立と複利の効果を計算・可視化します</p>
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
            {/* 結果サマリー */}
            <div className="mb-6 text-center bg-blue-50 p-4 rounded-xl border border-blue-100">
              <p className="text-sm text-gray-500 mb-1">{years}年後の資産合計</p>
              <p className="text-4xl font-bold text-blue-700">
                {(finalAmount / 10000).toLocaleString(undefined, { maximumFractionDigits: 1 })}
                <span className="text-lg ml-1 text-gray-600">万円</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                (元本: {data[data.length-1]?.principal.toLocaleString()}万円 + 利益: {data[data.length-1]?.interest.toLocaleString()}万円)
              </p>
            </div>

            {/* グラフ */}
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
        
        <div className="p-4 text-center border-t">
            <a href="/" className="text-blue-500 hover:underline">← トップページに戻る</a>
        </div>
      </div>
    </main>
  );
}
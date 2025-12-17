"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, ComposedChart } from 'recharts';

export default function CVPSimulator() {
  // 入力値
  const [fixedCost, setFixedCost] = useState(100);    // 固定費 (万円)
  const [price, setPrice] = useState(1000);           // 販売単価 (円)
  const [variableCost, setVariableCost] = useState(300); // 変動費 (円)
  
  const [bepUnits, setBepUnits] = useState(0);       // 損益分岐点販売数量
  const [bepSales, setBepSales] = useState(0);       // 損益分岐点売上高
  const [marginalProfitRatio, setMarginalProfitRatio] = useState(0); // 限界利益率
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // 限界利益 @ 1個
    const marginalProfitPerUnit = price - variableCost;
    
    // エラー回避
    if (marginalProfitPerUnit <= 0) {
      setBepUnits(0);
      setBepSales(0);
      setMarginalProfitRatio(0);
      setData([]);
      return;
    }

    // 限界利益率 = 限界利益 / 売上高
    const ratio = (marginalProfitPerUnit / price) * 100;
    setMarginalProfitRatio(ratio);

    // 損益分岐点（個数） = 固定費 / 1個あたり限界利益
    const bepU = Math.ceil((fixedCost * 10000) / marginalProfitPerUnit);
    const bepS = bepU * price;

    setBepUnits(bepU);
    setBepSales(bepS);

    // グラフ用データ作成
    const maxUnits = Math.ceil(bepU * 1.5); 
    const step = Math.ceil(maxUnits / 20); 

    const newData = [];
    for (let i = 0; i <= maxUnits; i += step) {
      const sales = i * price;
      const totalCost = (fixedCost * 10000) + (i * variableCost);
      
      newData.push({
        units: i,
        sales: Math.round(sales / 10000),      // 万円表記
        totalCost: Math.round(totalCost / 10000), // 万円表記
        fixedCost: fixedCost,
      });
    }

    // 正確なクロスポイントを追加
    newData.push({
      units: bepU,
      sales: Math.round(bepS / 10000),
      totalCost: Math.round(((fixedCost * 10000) + (bepU * variableCost)) / 10000),
      fixedCost: fixedCost,
      isBEP: true, 
    });

    newData.sort((a, b) => a.units - b.units);
    setData(newData);

  }, [fixedCost, price, variableCost]);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        <div className="bg-rose-600 p-6 text-white">
          <h1 className="text-2xl font-bold">📊 損益分岐点（CVP）分析</h1>
          <p className="text-sm opacity-90">いくら売れば黒字になるか？限界利益と採算ラインを計算</p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* 左側：入力フォーム */}
          <div className="space-y-6 bg-slate-50 p-4 rounded-xl h-fit">
            <div>
              <label className="block text-sm font-bold mb-2">固定費 (万円/月)</label>
              <p className="text-xs text-gray-400 mb-1">家賃、人件費など</p>
              <input type="number" value={fixedCost} onChange={(e) => setFixedCost(Number(e.target.value))} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"/>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">販売単価 (円/個)</label>
              <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"/>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">変動費 (円/個)</label>
              <p className="text-xs text-gray-400 mb-1">原価、材料費など</p>
              <input type="number" value={variableCost} onChange={(e) => setVariableCost(Number(e.target.value))} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500"/>
            </div>
            
            {price <= variableCost && (
              <div className="p-2 bg-red-100 text-red-600 text-xs rounded font-bold">
                ⚠ 単価が変動費以下です。売るほど赤字になります。
              </div>
            )}
          </div>

          {/* 右側：結果とグラフ */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 text-center">
                <p className="text-xs text-gray-500 mb-1">損益分岐点 (販売数)</p>
                <p className="text-2xl font-bold text-rose-700">
                  {bepUnits.toLocaleString()}
                  <span className="text-sm ml-1 text-gray-600">個</span>
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                <p className="text-xs text-gray-500 mb-1">損益分岐点 (売上高)</p>
                <p className="text-xl font-bold text-gray-700">
                  {(bepSales / 10000).toLocaleString(undefined, { maximumFractionDigits: 1 })}
                  <span className="text-sm ml-1 text-gray-600">万円</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">限界利益率: {marginalProfitRatio.toFixed(1)}%</p>
              </div>
            </div>

            <div className="h-64 w-full">
               <p className="text-center text-xs text-gray-500 mb-2">売上線と総費用線のクロスポイント</p>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="units" label={{ value: '販売数', position: 'insideBottomRight', offset: -5 }} type="number" domain={['dataMin', 'dataMax']} />
                  <YAxis unit="万" />
                  <Tooltip formatter={(value: number) => `${value.toLocaleString()}万円`} labelFormatter={(label) => `${Number(label).toLocaleString()}個`} />
                  
                  <Line type="monotone" dataKey="sales" stroke="#e11d48" strokeWidth={2} dot={false} name="売上高" />
                  <Line type="monotone" dataKey="totalCost" stroke="#4b5563" strokeWidth={2} dot={false} name="総費用" />
                  
                  {bepSales > 0 && (
                    <ReferenceDot x={bepUnits} y={bepSales / 10000} r={6} fill="#e11d48" stroke="white" />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              赤線がグレー線を上回る部分（右側）が利益エリアです。
            </p>
          </div>
        </div>
        
        {/* ▼▼▼ 追加した解説セクション ▼▼▼ */}
        <div className="bg-slate-50 p-8 border-t border-slate-200">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
            <span className="text-3xl">📖</span> CVP分析の用語解説
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <section className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-rose-500">
              <h3 className="text-lg font-bold text-slate-800 mb-2">固定費 (Fixed Cost)</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                売上がゼロでも必ず発生する費用のことです。<br/>
                （例：店舗の家賃、正社員の人件費、機械の減価償却費など）<br/>
                グラフでは、グレーの線（総費用）のスタート地点が「固定費」の金額になります。
              </p>
            </section>

            <section className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-gray-500">
              <h3 className="text-lg font-bold text-slate-800 mb-2">変動費 (Variable Cost)</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                売上（販売数）に比例して増えていく費用のことです。<br/>
                （例：商品の仕入原価、材料費、販売手数料など）<br/>
                グラフのグレーの線の「傾き」が急なほど、変動費が高いことを意味します。
              </p>
            </section>

          </div>

          <div className="mt-6 bg-rose-50 p-6 rounded-xl border border-rose-100">
            <h3 className="text-lg font-bold text-rose-800 mb-2">💡 限界利益（Marginal Profit）とは？</h3>
            <p className="text-slate-700 text-sm leading-relaxed mb-4">
              <strong>「売上高 - 変動費」</strong> で計算される利益のことです。<br/>
              ビジネスにおいては、「まずは限界利益で固定費を回収し、それを超えた分が最終的な利益になる」と考えます。
            </p>
            <div className="bg-white p-4 rounded-lg border border-rose-200">
              <p className="text-xs font-bold text-slate-500 mb-1">損益分岐点の計算式（公式）</p>
              <p className="text-lg font-mono font-bold text-rose-600">
                損益分岐点売上高 ＝ 固定費 ÷ 限界利益率
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              ※このツールを使えば、複雑な割り算をしなくても一瞬で分岐点が分かります。
            </p>
          </div>
        </div>
        {/* ▲▲▲ 解説セクション終了 ▲▲▲ */}

        <div className="p-4 text-center border-t bg-white">
            <a href="/" className="text-rose-500 hover:underline">← トップページに戻る</a>
        </div>
      </div>
    </main>
  );
}
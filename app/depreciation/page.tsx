"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function DepreciationSimulator() {
  // --- 状態管理 (State) ---
  const [cost, setCost] = useState(100);       // 取得原価 (万円)
  const [life, setLife] = useState(5);         // 耐用年数 (年)
  const [method, setMethod] = useState("straight"); // straight(定額法) or declining(定率法)

  const [data, setData] = useState<any[]>([]);

  // --- 計算ロジック ---
  useEffect(() => {
    const acquisitionCost = cost * 10000;
    const usefulLife = life;
    let currentBookValue = acquisitionCost;
    
    const newData = [];

    // 0年目（取得時）のデータ
    newData.push({
      year: 0,
      bookValue: Math.round(currentBookValue / 10000), // 万円表記
      depreciation: 0,
    });

    // 償却率の計算
    // 定額法の償却率 = 1 / 耐用年数
    const straightRate = 1 / usefulLife;
    // 200%定率法の償却率 = 定額法の償却率 × 2
    let decliningRate = straightRate * 2; 

    for (let i = 1; i <= usefulLife; i++) {
      let depreciationAmount = 0;

      if (method === "straight") {
        // --- 定額法 ---
        // 毎年同じ額を償却する
        // 最後は備忘価額（1円）を残す
        if (i === usefulLife) {
          depreciationAmount = currentBookValue - 1; 
        } else {
          depreciationAmount = Math.floor(acquisitionCost / usefulLife);
        }
      } else {
        // --- 定率法 (200%定率法) ---
        // 未償却残高 × 償却率
        const basicDepreciation = Math.floor(currentBookValue * decliningRate);
        
        // 償却保証額（取得原価 × 保証率）との比較
        // ※簡易的に「定額法の償却額」と比較して判定するロジックを実装
        const averageDepreciation = Math.floor(acquisitionCost / usefulLife);

        // 償却額が「平均的な償却額」を下回るようになれば、均等償却に切り替える（改定償却率の適用イメージ）
        if (basicDepreciation < averageDepreciation && i > usefulLife / 2) { 
           // 残りの期間で均等に割る
           const remainingYears = usefulLife - i + 1;
           if (i === usefulLife) {
             depreciationAmount = currentBookValue - 1;
           } else {
             depreciationAmount = Math.floor((currentBookValue - 1) / remainingYears);
           }
        } else {
           depreciationAmount = basicDepreciation;
        }
        
        // 最終年の強制調整（1円残し）
        if (i === usefulLife) {
             depreciationAmount = currentBookValue - 1;
        }
      }

      // 計算上のマイナス防止
      if (currentBookValue - depreciationAmount < 1) {
        depreciationAmount = currentBookValue - 1;
      }

      currentBookValue -= depreciationAmount;

      newData.push({
        year: i,
        bookValue: Math.round(currentBookValue / 10000),      // 帳簿価額
        depreciation: Math.round(depreciationAmount / 10000), // その年の減価償却費
      });
    }

    setData(newData);

  }, [cost, life, method]);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* ヘッダーエリア */}
        <div className="bg-emerald-600 p-6 text-white">
          <h1 className="text-2xl font-bold">📉 減価償却シミュレーター</h1>
          <p className="text-sm opacity-90">定額法・定率法による資産価値の減少を計算・比較します</p>
        </div>

        {/* ツール本体エリア */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* 左側：入力フォーム */}
          <div className="space-y-6 bg-slate-50 p-4 rounded-xl h-fit">
            <div>
              <label className="block text-sm font-bold mb-2">取得原価 (万円)</label>
              <input 
                type="number" 
                value={cost} 
                onChange={(e) => setCost(Number(e.target.value))} 
                className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">耐用年数 ({life}年)</label>
              <input 
                type="range" 
                min="2" max="50" 
                value={life} 
                onChange={(e) => setLife(Number(e.target.value))} 
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">計算方法</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setMethod("straight")}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${method === "straight" ? "bg-emerald-600 text-white shadow-md" : "bg-white border text-gray-600 hover:bg-gray-50"}`}
                >
                  定額法
                </button>
                <button 
                  onClick={() => setMethod("declining")}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${method === "declining" ? "bg-emerald-600 text-white shadow-md" : "bg-white border text-gray-600 hover:bg-gray-50"}`}
                >
                  定率法
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">※定率法は200%定率法（平成24年4月1日以後）を適用</p>
            </div>
          </div>

          {/* 右側：グラフと表 */}
          <div className="md:col-span-2">
            {/* グラフ */}
            <div className="h-64 w-full">
               <p className="text-center text-xs text-gray-500 mb-2">帳簿価額（資産価値）の推移グラフ</p>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBook" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" label={{ value: '年数', position: 'insideBottomRight', offset: -5 }} />
                  <YAxis unit="万" />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <Tooltip formatter={(value: number) => `${value.toLocaleString()}万円`} />
                  <Legend />
                  <Area type="monotone" dataKey="bookValue" stroke="#059669" fill="url(#colorBook)" name="帳簿価額" animationDuration={1000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            {/* 詳細テーブル */}
            <div className="mt-6 overflow-x-auto max-h-48 overflow-y-auto border rounded-lg scrollbar-thin">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2">年数</th>
                    <th className="px-4 py-2">減価償却費</th>
                    <th className="px-4 py-2">期末帳簿価額</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.year} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-bold">{row.year}年目</td>
                      <td className="px-4 py-2 font-medium text-emerald-600">{row.depreciation.toLocaleString()} 万円</td>
                      <td className="px-4 py-2">{row.bookValue.toLocaleString()} 万円</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ▼▼▼ 解説セクション（SEO対策・学習用コンテンツ） ▼▼▼ */}
        <div className="bg-slate-50 p-8 border-t border-slate-200">
          <h2 className="text-2xl font-bold mb-8 text-slate-800 flex items-center gap-2">
            <span className="text-3xl">📚</span> 減価償却の基礎知識
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 定額法の解説 */}
            <section className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-emerald-500">
              <h3 className="text-lg font-bold text-emerald-800 mb-3">定額法（Straight-line Method）</h3>
              <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                毎年<strong>「一定の金額」</strong>を経費として計上する方法です。<br/>
                計算式がシンプルで、毎年の利益への影響が均等になります。
              </p>
              <div className="bg-emerald-50 p-3 rounded-lg">
                <p className="text-xs font-bold text-emerald-900 mb-1">💡 計算式</p>
                <p className="text-xs font-mono text-emerald-700">取得原価 ÷ 耐用年数</p>
              </div>
              <p className="text-xs text-slate-400 mt-2">主な対象：建物、無形固定資産（ソフトウェアなど）</p>
            </section>

            {/* 定率法の解説 */}
            <section className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-emerald-500">
              <h3 className="text-lg font-bold text-emerald-800 mb-3">定率法（Declining-balance Method）</h3>
              <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                初年度に<strong>「多額の経費」</strong>を計上し、年々減っていく方法です。<br/>
                「資産は買った直後が一番価値が下がる」という考え方に基づいています。
              </p>
              <div className="bg-emerald-50 p-3 rounded-lg">
                <p className="text-xs font-bold text-emerald-900 mb-1">💡 計算式（200%定率法）</p>
                <p className="text-xs font-mono text-emerald-700">未償却残高 × (1÷耐用年数×2)</p>
              </div>
              <p className="text-xs text-slate-400 mt-2">主な対象：機械装置、車両、備品など</p>
            </section>
          </div>

          <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-400">
            <h3 className="text-lg font-bold text-slate-800 mb-2">簿記学習のポイント 📝</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              現在の税法（200%定率法）では、計算上の償却額が<strong>「償却保証額」</strong>を下回ったタイミングで計算方法が切り替わります。
              その後は「改定償却率」を使って、残りの期間で均等に償却していきます（これを「改定取得価額」といいます）。
              <br/><br/>
              グラフを見ると、定率法の線が途中から真っ直ぐ（定額）になっているのが分かるはずです。この「折れ曲がるポイント」が試験で重要になります。
            </p>
          </div>
        </div>
        {/* ▲▲▲ 解説セクション終了 ▲▲▲ */}

        <div className="p-4 text-center border-t bg-white">
            <a href="/" className="text-emerald-500 hover:underline font-bold">← トップページに戻る</a>
        </div>
      </div>
    </main>
  );
}
export default function AdUnit() {
  return (
    <div className="my-8 p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
      <p className="text-sm font-bold text-slate-500 mb-3">
        ▼ おすすめの証券口座 ▼
      </p>
      
      {/* ★ここにA8.netなどの広告コードを貼ります 
         今は練習用のダミー広告（A8の公式バナー）を入れています
      */}
      <div className="inline-block hover:opacity-80 transition-opacity">
        <a href="https://www.a8.net/as/as_promo/" target="_blank" rel="nofollow noopener noreferrer">
          {/* JSXルール: imgタグは必ず最後に「/」で閉じる！ */}
          <img 
            src="https://www18.a8.net/0.gif?a8mat=XXXXXX+XXXXXX+0000+00000" 
            alt="A8.net" 
            width="300" 
            height="250" 
            style={{ border: "none" }} // styleの書き方も注意
          />
          {/* ダミー画像を表示するためのプレースホルダー */}
          <div className="w-[300px] h-[250px] bg-slate-200 flex items-center justify-center text-slate-400 text-xs">
            ここに広告バナーが表示されます<br/>(300x250)
          </div>
        </a>
      </div>

      <p className="text-xs text-slate-400 mt-2 text-left">
        ※シミュレーション結果を実現するには、手数料の安いネット証券での積立が必須です。楽天証券やSBI証券なら、ポイントも貯まりお得に投資を始められます。
      </p>
    </div>
  );
}
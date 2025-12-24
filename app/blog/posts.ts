export type Post = {
  slug: string;
  title: string;
  date: string;
  emoji: string;
  category: string;
  content: string; // HTMLとしてレンダリングする本文
};

export const posts: Post[] = [
  {
    slug: "investment-logic",
    title: "【資産運用】S&P500の30年後をどう予測する？モンテカルロ法ではないシンプルな計算ロジック",
    date: "2025-01-24",
    emoji: "📈",
    category: "ファイナンス",
    content: `
      <p>資産運用シミュレーターを作る際、最も悩ましいのが「将来の株価をどう予測するか」という点です。</p>
      <h2 class="text-2xl font-bold mt-8 mb-4">一定の利回りで計算することの是非</h2>
      <p>一般的に、S&P500の平均利回りは年利5%〜7%と言われています。当サイトのシミュレーターでは、あえて複雑な「モンテカルロ法（確率的なゆらぎを含めた計算）」を採用せず、毎月一定の複利計算を採用しています。</p>
      <p>その理由は、ユーザーが「積立の効果」を直感的に理解するためには、ノイズを排除した純粋な指数関数のカーブを見せる方が教育的効果が高いと判断したからです。</p>
      <div class="bg-slate-100 p-4 rounded-lg my-6 border-l-4 border-blue-500">
        <p class="font-bold">計算式（Next.jsでの実装）</p>
        <code class="block mt-2 text-sm">futureValue = principal * Math.pow((1 + rate), years);</code>
      </div>
      <p>もちろん、実際には暴落も暴騰もありますが、長期投資のゴール設定としてはこの「平均回帰性」を信じることが第一歩となります。</p>
    `,
  },
  {
    slug: "reaction-time-stats",
    title: "反射神経は0.2秒が限界？人間工学から見る「反応速度」の平均と偏差値",
    date: "2025-01-24",
    emoji: "⚡",
    category: "人間工学",
    content: `
      <p>「反射神経が良い」とは具体的に何秒のことでしょうか？人間工学の分野では、視覚刺激に対する単純反応時間は平均して <strong>0.2秒〜0.25秒</strong> とされています。</p>
      <h2 class="text-2xl font-bold mt-8 mb-4">0.1秒の壁</h2>
      <p>陸上競技では、スタートの号砲から0.1秒未満で反応すると「フライング」と判定されます。これは、人間の脳が音を聞いてから筋肉に信号を送るまでに、生理学的にどうしても0.1秒かかるためです。</p>
      <p>当サイトの反射神経テストで「0.15秒」などを叩き出した場合、それは予測ではなく純粋な反応速度として、アスリート級の数値と言えるでしょう。</p>
    `,
  },
  {
    slug: "nextjs-chart",
    title: "Rechartsで直感的なグラフを作る！Next.js(App Router)への導入と実装",
    date: "2025-01-24",
    emoji: "💻",
    category: "プログラミング",
    content: `
      <p>Reactでグラフを描画するライブラリは多数ありますが、今回はカスタマイズ性と軽さを重視して <strong>Recharts</strong> を採用しました。</p>
      <h2 class="text-2xl font-bold mt-8 mb-4">なぜRechartsなのか？</h2>
      <ul class="list-disc list-inside space-y-2 ml-4">
        <li>SVGベースで描画が綺麗</li>
        <li>Reactコンポーネントとして宣言的に書ける</li>
        <li>レスポンシブ対応がResponsiveContainerで一発</li>
      </ul>
      <p>特にスマホでの閲覧が多い個人開発ツールにおいては、画面幅に合わせて自動でリサイズしてくれる機能は必須でした。</p>
    `,
  },
];
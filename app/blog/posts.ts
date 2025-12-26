export type Post = {
  slug: string;
  title: string;
  date: string;
  emoji: string;
  category: string;
  content: string;
};

export const posts: Post[] = [
  {
    slug: "mechanism-of-reaction",
    title: "「反応速度」の正体とは？フィードフォワード制御と0.1秒の壁",
    date: "2025-01-24", // 今日の日付
    emoji: "⚡",
    category: "運動制御", // あえて「人間工学」ではなく専門的なカテゴリ名に
    content: `
      <p>「反射神経が良い」という言葉は日常よく使われますが、私たちの体内では具体的にどのような信号のやり取りが行われているのでしょうか？</p>
      <p>今回は、神経生理学的なメカニズムと、運動制御における「予測」の重要性、そしてスポーツにおけるフライングの科学について解説します。</p>

      <h2 class="text-2xl font-bold mt-8 mb-4">1. 目から筋肉へ：信号の伝達ルート</h2>
      <p>画面の色が変わった瞬間にボタンを押す。この単純な動作の間、体内では以下のリレーが行われています。</p>
      <ul class="list-disc list-inside space-y-2 ml-4 my-4 bg-slate-50 p-4 rounded-lg">
        <li><strong>受容器（網膜）</strong>：光の刺激を電気信号に変換</li>
        <li><strong>求心性神経</strong>：視神経を通って脳へ情報を送る</li>
        <li><strong>中枢（脳）</strong>：信号を認識し、「押せ」という指令を下す</li>
        <li><strong>遠心性神経</strong>：脊髄を通って筋肉へ指令を送る</li>
        <li><strong>効果器（筋肉）</strong>：指の筋肉が収縮し、ボタンを押す</li>
      </ul>
      <p>この一連の流れにかかる時間が「単純反応時間」です。視覚刺激の場合、一般的な平均値は <strong>0.2秒前後（約200ms）</strong> と言われています。</p>

      <h2 class="text-2xl font-bold mt-8 mb-4">2. 動きを制御する2つのシステム</h2>
      <p>人間の運動制御には、大きく分けて2つのメカニズムが存在します。</p>

      <h3 class="text-xl font-bold mt-6 mb-2 text-blue-600">フィードバック制御</h3>
      <p>結果を確認しながら修正を行う制御です。例えば、「エアコンの設定温度と室温のズレを感知して調整する」のがこれにあたります。<br>
      運動においては正確ですが、修正に時間がかかるため、瞬時の反応には不向きです。</p>

      <h3 class="text-xl font-bold mt-6 mb-2 text-blue-600">フィードフォワード制御</h3>
      <p>これから起こることを「予測」して、事前に指令を送る制御です。<br>
      飛んでくるボールを打つ、合図に合わせてスタートするなど、高速な運動にはこの制御が不可欠です。脳内に構築された「内部モデル」に基づいて、結果が出る前に指令が出されるため、遅延のない動きが可能になります。</p>

      <h2 class="text-2xl font-bold mt-8 mb-4">3. スポーツにおける「0.1秒の壁」</h2>
      <p>陸上競技や水泳の世界大会では、スタートの合図から <strong>0.1秒（100ms）未満</strong> に反応すると「フライング（不正スタート）」と判定されます。</p>
      <p>なぜ「本当に反応が速い人」とは認められないのでしょうか？</p>
      <p>それは、生理学的に<strong>「音が耳に届き、脳が認識して筋肉が動くまでには、どうしても0.1秒かかる」</strong>という限界が存在するからです。<br>
      つまり、0.1秒未満で動いたということは、合図を聞いてから反応したのではなく、<strong>「ヤマを張って（予測だけで）動いた」</strong>とみなされるのです。</p>

      <h2 class="text-2xl font-bold mt-8 mb-4">4. その日のコンディションを数値化する</h2>
      <p>反応速度は一定ではありません。睡眠不足、疲労、ストレス、あるいは加齢によって、脳の情報処理速度は低下します。</p>
      <p>「今日はなんだか集中できないな」と感じる時、実際に反応時間が遅くなっていることが多いものです。このツールを、単なるゲームとしてだけでなく、<strong>「脳の疲労度チェック」</strong>として活用してみてください。</p>
      <p>あなたの今の状態は、平均より速いでしょうか？それとも…</p>

      <div class="mt-8 text-center">
        <a href="/reaction" class="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition transform hover:scale-105">
          反射神経テストに挑戦する ⚡
        </a>
      </div>
    `,
  },
  {
    slug: "boki2-depreciation-logic",
    title: "【簿記2級】減価償却は「暗記」不要？計算ロジックを整理してミスを防ぐ方法",
    date: "2025-12-24", // 今日の日付
    emoji: "🧮",
    category: "会計・簿記",
    content: `
      <p>簿記2級の商業簿記において、多くの受験生が苦手意識を持つのが「減価償却」です。特に定率法の計算や、年度の途中で資産を取得・売却した際の月割計算は、ケアレスミスが起きやすいポイントです。</p>
      <p>今回は、簿記2級を取得している筆者の視点から、減価償却を「数式」ではなく「価値の消費」というロジックで捉える覚え方を解説します。</p>

      <h2 class="text-2xl font-bold mt-8 mb-4">1. なぜ「定率法」は複雑に感じるのか</h2>
      <p>定額法が「毎年同じ額」を引くだけなのに対し、定率法は「未償却残高（帳簿価額）」に一定の率をかけます。このロジックの根底にあるのは、<strong>「資産は使い始めほど収益に貢献し、価値の減り方も大きい」</strong>という考え方です。</p>
      
      <div class="bg-blue-50 p-4 rounded-lg my-6">
        <p class="font-bold text-blue-800">💡 ミスを防ぐ計算の型</p>
        <p class="text-sm mt-2">（取得原価 － <strong>減価償却累計額</strong>）× 償却率 ＝ 当期純利益</p>
        <p class="text-xs text-slate-500 mt-1">※この「累計額を引く」作業を忘れるのが定率法の最大の不合格パターンです。</p>
      </div>

      <h2 class="text-2xl font-bold mt-8 mb-4">2. 難関：年度途中の「月割計算」の攻略</h2>
      <p>簿記2級では、4月1日以外に購入・売却するケースが標準です。ここで重要なのは、<strong>「タイムライン（時間軸）を脳内に描く」</strong>ことです。</p>
      <ul class="list-disc list-inside space-y-2 ml-4 my-4">
        <li><strong>取得時</strong>：使った月から決算月まで（例：10月取得なら 6/12ヶ月）</li>
        <li><strong>売却時</strong>：期首から売却した月まで（例：7月末売却なら 4/12ヶ月）</li>
      </ul>
      <p>この計算は、実はプログラミングのロジックや統計の計算にも通じる「期間配分」の考え方です。指折り数えるのではなく、「決算月 － 取得月 ＋ 1」といった自分なりの計算式を確立しましょう。</p>
<h2 class="text-2xl font-bold mt-8 mb-4">3. 実践：数値で見る「定額法 vs 定率法」</h2>
      <p>以下の条件で、1年目と2年目の減価償却費がどう変わるかシミュレーションしてみましょう。</p>
      
      <div class="bg-slate-50 p-6 rounded-xl border border-slate-200 my-4">
        <ul class="space-y-1 text-sm">
          <li><strong>取得原価</strong>：1,000,000円</li>
          <li><strong>取得日</strong>：10月1日（決算は3月31日）</li>
          <li><strong>耐用年数</strong>：5年</li>
          <li><strong>償却率</strong>：定額法 0.200 / 定率法 0.400</li>
        </ul>
      </div>

      <h3 class="text-lg font-bold mt-6 mb-2">【1年目】月割計算の適用（6ヶ月分）</h3>
      <p>10月から3月までの6ヶ月分のみを計上します。</p>
      <ul class="list-disc list-inside space-y-2 ml-4 text-sm">
        <li><strong>定額法</strong>：1,000,000 × 0.200 × <strong>6/12</strong> ＝ <span class="font-bold text-blue-600">100,000円</span></li>
        <li><strong>定率法</strong>：1,000,000 × 0.400 × <strong>6/12</strong> ＝ <span class="font-bold text-blue-600">200,000円</span></li>
      </ul>

      <h3 class="text-lg font-bold mt-6 mb-2">【2年目】「未償却残高」に注意</h3>
      <p>2年目は1年間フルで使用しますが、定率法は「1年目に引いた分」を除外して計算します。</p>
      <ul class="list-disc list-inside space-y-2 ml-4 text-sm">
        <li><strong>定額法</strong>：1,000,000 × 0.200 ＝ <span class="font-bold text-blue-600">200,000円</span></li>
        <li><strong>定率法</strong>：(1,000,000 － <span class="text-red-500 font-bold">200,000</span>) × 0.400 ＝ <span class="font-bold text-blue-600">320,000円</span></li>
      </ul>

      <div class="overflow-x-auto my-6">
        <table class="w-full text-sm text-left border-collapse">
          <thead>
            <tr class="bg-slate-100">
              <th class="border p-2">計算方法</th>
              <th class="border p-2">1年目費用</th>
              <th class="border p-2">2年目費用</th>
              <th class="border p-2">2年目末の帳簿価額</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border p-2 font-bold">定額法</td>
              <td class="border p-2">100,000</td>
              <td class="border p-2">200,000</td>
              <td class="border p-2">700,000</td>
            </tr>
            <tr>
              <td class="border p-2 font-bold">定率法</td>
              <td class="border p-2">200,000</td>
              <td class="border p-2">320,000</td>
              <td class="border p-2">480,000</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-sm text-slate-600 italic">
        ※定率法の方が、初期に大きく費用化されていることがわかります。これが「収益との対応」を考えた会計のロジックです。
      </p>
      
      <div class="mt-12 bg-slate-900 text-white p-8 rounded-2xl text-center">
        <h3 className="text-xl font-bold mb-4">実際の数値でシミュレーションしてみよう</h3>
        <p className="text-slate-400 mb-6 text-sm">
          定額法と定率法で、数年後の帳簿価額にどれくらいの差が出るか知っていますか？<br>
          自作の計算機で、グラフを使って視覚的に確認してみてください。
        </p>
        <a href="/depreciation" class="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full transition transform hover:scale-105">
          減価償却シミュレーターを使う 📉
        </a>
      </div>
    `,
  },
{
    slug: "investment-logic",
    title: "【資産運用】S&P500の30年後をどう予測する？積立シミュレーションの数学的背景とリスクの正体",
    date: "2025-12-26",
    emoji: "📈",
    category: "ファイナンス / 統計学",
    content: `
      <p>資産運用シミュレーターを作成する際、最も重要なのは「将来の期待収益率をどう設定し、その背景にある数学的リスクをどう解釈するか」という点です。巷にある多くのツールは単純な複利計算のみを表示していますが、実際の資産形成には統計学的な「ゆらぎ」が大きく影響します。</p>
      
      <p>今回は、当サイトのシミュレーターが採用している計算ロジックに加え、アクチュアリー試験等の高度な会計・統計学習でも重要となる「ボラティリティ・ドラッグ」や「幾何平均」の概念について深く掘り下げます。</p>

      <h2 class="text-2xl font-bold mt-8 mb-4">1. なぜ「一定の利回り」計算には注意が必要なのか？</h2>
      <p>一般的に、S&P500や全世界株式（オルカン）の長期平均利回りは年利5%〜7%と言われています。しかし、この「平均」という言葉には落とし穴があります。投資の世界では、<strong>「算術平均リターン」と「幾何平均リターン（実効リターン）」は一致しない</strong>からです。</p>
      
      <p>例えば、ある年に+50%上昇し、翌年に-50%下落した資産を考えてみましょう。算術平均は $(50 - 50) / 2 = 0\%$ ですが、実際の資産は $100 \times 1.5 \times 0.5 = 75$ となり、25%も減少しています。この差を「ボラティリティ・ドラッグ」と呼びます。当サイトでは、この乖離を理解した上で、最も現実的な「幾何平均」に基づいた予測値を提示しています。</p>

      <h2 class="text-2xl font-bold mt-8 mb-4">2. 複利計算の数学的ロジックと実装</h2>
      <p>当シミュレーターでは、毎月の積立額が期首に投資されると仮定し、以下の漸化式に基づいて計算を行っています。</p>

<div class="bg-slate-50 p-6 rounded-xl border border-slate-200 my-6 text-center">
  <p class="text-sm mb-4 font-bold text-slate-700">毎月の積立計算式（等比数列の和）</p>
  <div class="text-xl font-mono text-blue-600 mb-4">
    $$S_n = A \\frac{(1 + r)((1 + r)^n - 1)}{r}$$
  </div>
  <ul class="text-xs text-left text-slate-500 space-y-1 inline-block">
    <li>$S_n$: $n$ ヶ月後の将来価値</li>
    <li>$A$: 毎月の積立額</li>
    <li>$r$: 月利（年利 / 12）</li>
    <li>$n$: 積立月数</li>
  </ul>
</div>

      <h2 class="text-2xl font-bold mt-8 mb-4">3. リスク（標準偏差）と「72の法則」</h2>
      <p>投資のリスクとは「価格が下落すること」だけではなく、「リターンの振れ幅（標準偏差）」を指します。統計学的には、株価の変動は対数正規分布に従うと仮定されることが多いです。</p>
      <p>また、資産が2倍になる期間を簡易的に計算する「72の法則」も有用です。例えば利回り6%なら $72 / 6 = 12$年で資産が倍増する計算になります。当シミュレーターのグラフで、自分の資産がいつ「2倍の壁」を突破するかを確認してみてください。</p>

      

[Image of Normal distribution curve showing standard deviation]


      <h2 class="text-2xl font-bold mt-8 mb-4">4. インフレリスクと「実質リターン」の重要性</h2>
      <p>30年という長期のスパンでは、お金そのものの価値が下がる「インフレ（物価上昇）」を無視できません。名目利回りが5%であっても、インフレ率が2%であれば、購買力ベースの実質利回りは3%程度になります。</p>
      <p>アドバイスとして、当ツールを使用する際は<strong>「控えめな利回り（3〜4%）」</strong>でシミュレーションすることをお勧めします。これが、将来の購買力を維持した上での、より現実的な予測に繋がります。</p>

      <h2 class="text-2xl font-bold mt-8 mb-4">5. NISA・iDeCo等の非課税制度の活用</h2>
      <p>日本の投資環境において、税金（通常は約20%）の影響は甚大です。同じ利回り5%でも、非課税制度を利用するかどうかで、30年後の手残りは数百万円単位で変わります。当サイトのツールで算出した結果から、さらに20%が差し引かれる可能性を考慮し、非課税枠の最大活用を検討する一助としてください。</p>

      <div class="mt-12 bg-slate-900 text-white p-10 rounded-3xl text-center shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500"></div>
        <h3 class="text-2xl font-bold mb-4">データに基づいた確かな投資判断を</h3>
        <p class="text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          数学的なロジックを理解することは、市場の暴落時でもパニックにならずに投資を継続する「精神的な支え」になります。数値の力で、感情に左右されない資産形成をサポートします。
        </p>
        <a href="/investment" class="inline-block bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-4 px-12 rounded-full transition transform hover:scale-105 shadow-lg">
          シミュレーターをフル活用する 📈
        </a>
      </div>
    `,
  },
  {
    slug: "nextjs-chart",
    title: "Rechartsで直感的なグラフを作る！Next.js(App Router)への導入と実装",
    date: "2025-01-15",
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
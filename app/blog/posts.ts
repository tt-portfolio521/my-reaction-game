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

      <h2 class="text-2xl font-bold mt-8 mb-4">3. 税効果会計への繋がり</h2>
      <p>2級の範囲である「税効果会計」においても、減価償却の「会計上の費用」と「税務上の損金」のズレが論点になります。一見別物に見える論点も、<strong>「資産の価値をいつ認識するか」</strong>という一点で繋がっています。</p>
      <p>これらを体系的に理解することで、暗記に頼らずに試験現場で解法を導き出せるようになります。</p>

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
    title: "【資産運用】S&P500の30年後をどう予測する？モンテカルロ法ではないシンプルな計算ロジック",
    date: "2025-01-20",
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
export type Option = {
  text: string;
  rationale?: string; // 解説
  isCorrect: boolean;
};

export type Question = {
  questionNumber: number;
  question: string;
  options: Option[];
  hint: string;
};

export type DifficultyLevel = {
  id: "easy" | "normal" | "hard";
  title: string;
  description: string;
  questions: Question[];
};

export type QuizSubject = {
  id: string; // URLパラメータと一致させる
  title: string;
  icon: string;
  color: string;
  bg: string;
  difficulties: DifficultyLevel[];
};

export const quizData: QuizSubject[] = [
  // --- 国語 ---
  {
    id: "kokugo",
    title: "国語",
    icon: "📕",
    color: "text-red-600",
    bg: "bg-red-50",
    difficulties: [
      {
        id: "easy",
        title: "初級 (低学年)",
        description: "漢字の読み書きや、ことわざの基本。",
        questions: [
          {
            questionNumber: 1,
            question: "「犬」の読み方は？",
            options: [
              { text: "ねこ", isCorrect: false },
              { text: "いぬ", isCorrect: true, rationale: "正解です！" },
              { text: "とり", isCorrect: false },
              { text: "うし", isCorrect: false },
            ],
            hint: "「い」から始まります。",
          },
          {
            questionNumber: 2,
            question: "「林」という漢字は、「木」がいくつある？",
            options: [
              { text: "1つ", isCorrect: false },
              { text: "2つ", isCorrect: true, rationale: "「木」が2つで「林（はやし）」、3つで「森（もり）」です。" },
              { text: "3つ", isCorrect: false },
              { text: "4つ", isCorrect: false },
            ],
            hint: "森（もり）よりは少ないです。",
          },
          {
            questionNumber: 3,
            question: "「お早う」の読み方は？",
            options: [
              { text: "こんにちは", isCorrect: false },
              { text: "こんばんは", isCorrect: false },
              { text: "おはよう", isCorrect: true, rationale: "朝の挨拶ですね。" },
              { text: "さようなら", isCorrect: false },
            ],
            hint: "朝のあいさつです。",
          },
        ],
      },
      {
        id: "normal",
        title: "中級 (中学年)",
        description: "熟語の構成や、少し難しい漢字。",
        questions: [
          {
            questionNumber: 1,
            question: "「五月雨」の読み方は？",
            options: [
              { text: "さつきあめ", isCorrect: false },
              { text: "ごがつあめ", isCorrect: false },
              { text: "さみだれ", isCorrect: true, rationale: "梅雨の時期に降る長雨のことです。" },
              { text: "しぐれ", isCorrect: false },
            ],
            hint: "「さ」から始まる4文字です。",
          },
          {
            questionNumber: 2,
            question: "「画竜点睛」の「睛」は何を指す？",
            options: [
              { text: "龍のツノ", isCorrect: false },
              { text: "龍の瞳（ひとみ）", isCorrect: true, rationale: "最後に瞳を描き入れて完成させることから、物事の肝心な部分を指します。" },
              { text: "龍のウロコ", isCorrect: false },
              { text: "龍の尾", isCorrect: false },
            ],
            hint: "顔にあるパーツです。",
          },
          {
            questionNumber: 3,
            question: "「他人の力で利益を得ること」を意味することわざは？",
            options: [
              { text: "人の褌（ふんどし）で相撲を取る", isCorrect: true, rationale: "自分は何も持ち出さずに、他人の物を利用して自分の利益を図ることです。" },
              { text: "猫に小判", isCorrect: false },
              { text: "馬の耳に念仏", isCorrect: false },
              { text: "猿も木から落ちる", isCorrect: false },
            ],
            hint: "お相撲さんが関係します。",
          },
        ],
      },
      {
        id: "hard",
        title: "上級 (高学年)",
        description: "敬語の使い方や、古文・文学史。",
        questions: [
          {
            questionNumber: 1,
            question: "「吾輩は猫である」の作者は？",
            options: [
              { text: "太宰治", isCorrect: false },
              { text: "芥川龍之介", isCorrect: false },
              { text: "夏目漱石", isCorrect: true, rationale: "正解！冒頭の「名前はまだ無い」も有名ですね。" },
              { text: "宮沢賢治", isCorrect: false },
            ],
            hint: "1000円札の肖像画にもなった人物です（以前の）。",
          },
          {
            questionNumber: 2,
            question: "相手の家を敬って言う言葉は？",
            options: [
              { text: "拙宅（せったく）", isCorrect: false },
              { text: "御社（おんしゃ）", isCorrect: false },
              { text: "お宅（おたく）", isCorrect: true, rationale: "相手の家や家庭を指す丁寧な言い方です。ビジネスでは「貴社」なども使います。" },
              { text: "弊社（へいしゃ）", isCorrect: false },
            ],
            hint: "「お」がつきます。",
          },
          {
            questionNumber: 3,
            question: "「春はあけぼの」で始まる随筆は？",
            options: [
              { text: "徒然草", isCorrect: false },
              { text: "方丈記", isCorrect: false },
              { text: "枕草子", isCorrect: true, rationale: "清少納言によって書かれました。" },
              { text: "源氏物語", isCorrect: false },
            ],
            hint: "清少納言が作者です。",
          },
        ],
      },
    ],
  },
  // --- 算数 ---
  {
    id: "sansu",
    title: "算数",
    icon: "📐",
    color: "text-blue-600",
    bg: "bg-blue-50",
    difficulties: [
      {
        id: "easy",
        title: "初級 (低学年)",
        description: "足し算、引き算、時計の読み方。",
        questions: [
          {
            questionNumber: 1,
            question: "5 + 8 はいくつ？",
            options: [
              { text: "12", isCorrect: false },
              { text: "13", isCorrect: true, rationale: "正解！" },
              { text: "14", isCorrect: false },
              { text: "15", isCorrect: false },
            ],
            hint: "5に5を足すと10です。あと3残っています。",
          },
          {
            questionNumber: 2,
            question: "1日は何時間？",
            options: [
              { text: "12時間", isCorrect: false },
              { text: "24時間", isCorrect: true, rationale: "午前12時間と午後12時間を合わせて24時間です。" },
              { text: "36時間", isCorrect: false },
              { text: "48時間", isCorrect: false },
            ],
            hint: "時計の針が2周します。",
          },
          {
            questionNumber: 3,
            question: "100円玉が3枚と10円玉が4枚。あわせていくら？",
            options: [
              { text: "304円", isCorrect: false },
              { text: "340円", isCorrect: true, rationale: "300円 + 40円 = 340円です。" },
              { text: "430円", isCorrect: false },
              { text: "134円", isCorrect: false },
            ],
            hint: "300 + 40 を計算しましょう。",
          },
        ],
      },
      {
        id: "normal",
        title: "中級 (中学年)",
        description: "割り算、少数、図形の面積。",
        questions: [
          {
            questionNumber: 1,
            question: "三角形の面積を求める公式は？",
            options: [
              { text: "底辺 × 高さ", isCorrect: false },
              { text: "底辺 × 高さ ÷ 2", isCorrect: true, rationale: "四角形の半分と考えると分かりやすいですね。" },
              { text: "(上底 + 下底) × 高さ ÷ 2", isCorrect: false },
              { text: "半径 × 半径 × 3.14", isCorrect: false },
            ],
            hint: "四角形の面積の半分です。",
          },
          {
            questionNumber: 2,
            question: "1km（キロメートル）は何m（メートル）？",
            options: [
              { text: "100m", isCorrect: false },
              { text: "1000m", isCorrect: true, rationale: "k（キロ）は1000倍という意味です。" },
              { text: "10000m", isCorrect: false },
              { text: "10m", isCorrect: false },
            ],
            hint: "キロは「1000」を表します。",
          },
          {
            questionNumber: 3,
            question: "24 ÷ 6 の答えは？",
            options: [
              { text: "3", isCorrect: false },
              { text: "4", isCorrect: true, rationale: "6 × 4 = 24 です。" },
              { text: "5", isCorrect: false },
              { text: "6", isCorrect: false },
            ],
            hint: "九九の「ろく」の段を思い出して。",
          },
        ],
      },
      {
        id: "hard",
        title: "上級 (高学年)",
        description: "分数、割合、速さの計算。",
        questions: [
          {
            questionNumber: 1,
            question: "円周率（パイ）のおよその数は？",
            options: [
              { text: "1.41", isCorrect: false },
              { text: "3.14", isCorrect: true, rationale: "無限に続きますが、小学校では3.14として計算します。" },
              { text: "2.71", isCorrect: false },
              { text: "1.73", isCorrect: false },
            ],
            hint: "3.1...",
          },
          {
            questionNumber: 2,
            question: "時速60kmで2時間走ると、何km進む？",
            options: [
              { text: "30km", isCorrect: false },
              { text: "90km", isCorrect: false },
              { text: "120km", isCorrect: true, rationale: "速さ × 時間 = 道のり です。60 × 2 = 120km。" },
              { text: "100km", isCorrect: false },
            ],
            hint: "「速さ × 時間」です。",
          },
          {
            questionNumber: 3,
            question: "内角の和が180度になる図形は？",
            options: [
              { text: "三角形", isCorrect: true, rationale: "正解！四角形は360度、五角形は540度です。" },
              { text: "四角形", isCorrect: false },
              { text: "五角形", isCorrect: false },
              { text: "六角形", isCorrect: false },
            ],
            hint: "一番角が少ない多角形です。",
          },
        ],
      },
    ],
  },
  // --- 英語 ---
  {
    id: "eigo",
    title: "英語",
    icon: "🔤",
    color: "text-orange-600",
    bg: "bg-orange-50",
    difficulties: [
      {
        id: "easy",
        title: "初級 (単語)",
        description: "アルファベットと簡単な単語。",
        questions: [
          {
            questionNumber: 1,
            question: "「りんご」を英語で言うと？",
            options: [
              { text: "Banana", isCorrect: false },
              { text: "Apple", isCorrect: true, rationale: "正解です！" },
              { text: "Orange", isCorrect: false },
              { text: "Grape", isCorrect: false },
            ],
            hint: "Aから始まります。",
          },
          {
            questionNumber: 2,
            question: "数字の「10」は英語で？",
            options: [
              { text: "Two", isCorrect: false },
              { text: "Five", isCorrect: false },
              { text: "Ten", isCorrect: true, rationale: "One, Two...Ten!" },
              { text: "One", isCorrect: false },
            ],
            hint: "Tから始まります。",
          },
          {
            questionNumber: 3,
            question: "「猫」は英語で？",
            options: [
              { text: "Dog", isCorrect: false },
              { text: "Cat", isCorrect: true, rationale: "正解！Dogは犬ですね。" },
              { text: "Bird", isCorrect: false },
              { text: "Fish", isCorrect: false },
            ],
            hint: "Cから始まります。",
          },
        ],
      },
      {
        id: "normal",
        title: "中級 (文法)",
        description: "日常会話と基本的な文法。",
        questions: [
          {
            questionNumber: 1,
            question: "「私の名前はケンです」正しい英語は？",
            options: [
              { text: "I is Ken.", isCorrect: false },
              { text: "My name are Ken.", isCorrect: false },
              { text: "My name is Ken.", isCorrect: true, rationale: "be動詞はisを使います。" },
              { text: "Me is Ken.", isCorrect: false },
            ],
            hint: "My name ...",
          },
          {
            questionNumber: 2,
            question: "「ありがとう」は英語で？",
            options: [
              { text: "Hello", isCorrect: false },
              { text: "Thank you", isCorrect: true, rationale: "感謝を伝える言葉です。" },
              { text: "Good bye", isCorrect: false },
              { text: "Sorry", isCorrect: false },
            ],
            hint: "Tから始まります。",
          },
          {
            questionNumber: 3,
            question: "12月を英語で言うと？",
            options: [
              { text: "November", isCorrect: false },
              { text: "December", isCorrect: true, rationale: "クリスマスがある月ですね。" },
              { text: "January", isCorrect: false },
              { text: "August", isCorrect: false },
            ],
            hint: "Dから始まります。",
          },
        ],
      },
      {
        id: "hard",
        title: "上級 (長文・熟語)",
        description: "少し複雑な表現や疑問詞。",
        questions: [
          {
            questionNumber: 1,
            question: "「彼は今、何をしていますか？」正しい英語は？",
            options: [
              { text: "What does he do?", isCorrect: false },
              { text: "What is he doing now?", isCorrect: true, rationale: "現在進行形（be動詞 + doing）を使います。" },
              { text: "When is he do?", isCorrect: false },
              { text: "Who is he?", isCorrect: false },
            ],
            hint: "現在進行形を使います。",
          },
          {
            questionNumber: 2,
            question: "「I have a pen.」これを過去形にすると？",
            options: [
              { text: "I has a pen.", isCorrect: false },
              { text: "I had a pen.", isCorrect: true, rationale: "haveの過去形はhadです。" },
              { text: "I having a pen.", isCorrect: false },
              { text: "I will have a pen.", isCorrect: false },
            ],
            hint: "have の過去形は...",
          },
          {
            questionNumber: 3,
            question: "SNSは何の略？",
            options: [
              { text: "Social Networking Service", isCorrect: true, rationale: "社会的な繋がりを作るサービスです。" },
              { text: "Super Network System", isCorrect: false },
              { text: "Simple News Site", isCorrect: false },
              { text: "System Navigation Support", isCorrect: false },
            ],
            hint: "Social...",
          },
        ],
      },
    ],
  },
  // --- 社会 ---
  {
    id: "shakai",
    title: "社会",
    icon: "🌏",
    color: "text-green-600",
    bg: "bg-green-50",
    difficulties: [
      {
        id: "easy",
        title: "初級 (生活)",
        description: "地図記号や身近な社会。",
        questions: [
          {
            questionNumber: 1,
            question: "地図で「交番」を表す記号は？",
            options: [
              { text: "×（バツ）", isCorrect: true, rationale: "警棒を2本交差させた形が由来です。" },
              { text: "○（マル）", isCorrect: false },
              { text: "文", isCorrect: false },
              { text: "〒", isCorrect: false },
            ],
            hint: "警棒がクロスしている形です。",
          },
          {
            questionNumber: 2,
            question: "日本の首都はどこ？",
            options: [
              { text: "大阪", isCorrect: false },
              { text: "京都", isCorrect: false },
              { text: "東京", isCorrect: true, rationale: "現在の首都は東京です。" },
              { text: "福岡", isCorrect: false },
            ],
            hint: "東にある京（みやこ）です。",
          },
          {
            questionNumber: 3,
            question: "消防車を呼ぶときの電話番号は？",
            options: [
              { text: "110", isCorrect: false },
              { text: "119", isCorrect: true, rationale: "火事や救急は119番です。110番は警察です。" },
              { text: "104", isCorrect: false },
              { text: "117", isCorrect: false },
            ],
            hint: "警察は110番、では消防は？",
          },
        ],
      },
      {
        id: "normal",
        title: "中級 (地理・歴史)",
        description: "都道府県や歴史人物。",
        questions: [
          {
            questionNumber: 1,
            question: "日本で一番広い都道府県は？",
            options: [
              { text: "岩手県", isCorrect: false },
              { text: "北海道", isCorrect: true, rationale: "ダントツの広さです。" },
              { text: "長野県", isCorrect: false },
              { text: "東京都", isCorrect: false },
            ],
            hint: "北にある大きな島です。",
          },
          {
            questionNumber: 2,
            question: "1603年に江戸幕府を開いたのは？",
            options: [
              { text: "織田信長", isCorrect: false },
              { text: "豊臣秀吉", isCorrect: false },
              { text: "徳川家康", isCorrect: true, rationale: "関ヶ原の戦いに勝ち、江戸（東京）に幕府を開きました。" },
              { text: "坂本龍馬", isCorrect: false },
            ],
            hint: "「鳴かぬなら鳴くまで待とう...」",
          },
          {
            questionNumber: 3,
            question: "琵琶湖がある県はどこ？",
            options: [
              { text: "滋賀県", isCorrect: true, rationale: "滋賀県の面積の6分の1を占めます。" },
              { text: "京都府", isCorrect: false },
              { text: "大阪府", isCorrect: false },
              { text: "兵庫県", isCorrect: false },
            ],
            hint: "京都の隣です。",
          },
        ],
      },
      {
        id: "hard",
        title: "上級 (公民・現代)",
        description: "政治の仕組みや世界遺産。",
        questions: [
          {
            questionNumber: 1,
            question: "国の政治を行う機関、国会・内閣・裁判所の3つが独立している仕組みを何という？",
            options: [
              { text: "三権分立", isCorrect: true, rationale: "権力の集中を防ぐための仕組みです。" },
              { text: "地方自治", isCorrect: false },
              { text: "国民主権", isCorrect: false },
              { text: "基本的人権", isCorrect: false },
            ],
            hint: "3つの権力が分かれています。",
          },
          {
            questionNumber: 2,
            question: "フランシスコ・ザビエルが日本に伝えた宗教は？",
            options: [
              { text: "仏教", isCorrect: false },
              { text: "キリスト教", isCorrect: true, rationale: "1549年に鹿児島に上陸し布教しました。" },
              { text: "イスラム教", isCorrect: false },
              { text: "ヒンドゥー教", isCorrect: false },
            ],
            hint: "イエズス会の宣教師です。",
          },
          {
            questionNumber: 3,
            question: "国民の三大義務に含まれないものは？",
            options: [
              { text: "教育を受けさせる義務", isCorrect: false },
              { text: "勤労の義務", isCorrect: false },
              { text: "納税の義務", isCorrect: false },
              { text: "選挙に行く義務", isCorrect: true, rationale: "選挙（投票）は「権利」であり、義務ではありません。" },
            ],
            hint: "「権利」であって「義務」ではないものです。",
          },
        ],
      },
    ],
  },
  // --- 理科 ---
  {
    id: "rika",
    title: "理科",
    icon: "🔬",
    color: "text-purple-600",
    bg: "bg-purple-50",
    difficulties: [
      {
        id: "easy",
        title: "初級 (生き物)",
        description: "植物や昆虫の育ち方。",
        questions: [
          {
            questionNumber: 1,
            question: "カエルになる前の姿は？",
            options: [
              { text: "ヤゴ", isCorrect: false },
              { text: "オタマジャクシ", isCorrect: true, rationale: "足が生え、手が生え、尻尾がなくなってカエルになります。" },
              { text: "ケムシ", isCorrect: false },
              { text: "ボウフラ", isCorrect: false },
            ],
            hint: "水の中を泳いでいます。",
          },
          {
            questionNumber: 2,
            question: "アサガオの種をまく季節は？",
            options: [
              { text: "春", isCorrect: true, rationale: "5月ごろに種をまき、夏に花が咲きます。" },
              { text: "夏", isCorrect: false },
              { text: "秋", isCorrect: false },
              { text: "冬", isCorrect: false },
            ],
            hint: "小学校で入学してすぐ育てますね。",
          },
          {
            questionNumber: 3,
            question: "磁石のN極とS極を近づけるとどうなる？",
            options: [
              { text: "引き合う", isCorrect: true, rationale: "違う極同士は引き合い、同じ極同士は反発します。" },
              { text: "しりぞけ合う", isCorrect: false },
              { text: "何も起きない", isCorrect: false },
              { text: "回転する", isCorrect: false },
            ],
            hint: "違う極同士は仲良しです。",
          },
        ],
      },
      {
        id: "normal",
        title: "中級 (実験)",
        description: "電気の働きや水溶液。",
        questions: [
          {
            questionNumber: 1,
            question: "植物が光を受けて養分を作る働きを何という？",
            options: [
              { text: "呼吸", isCorrect: false },
              { text: "蒸散", isCorrect: false },
              { text: "光合成", isCorrect: true, rationale: "二酸化炭素と水から、デンプンと酸素を作ります。" },
              { text: "発芽", isCorrect: false },
            ],
            hint: "光を合成します。",
          },
          {
            questionNumber: 2,
            question: "青色のリトマス紙が赤色に変わりました。この液体の性質は？",
            options: [
              { text: "酸性", isCorrect: true, rationale: "「お母さん（青→赤＝酸）信号無視」と覚えたりします。" },
              { text: "アルカリ性", isCorrect: false },
              { text: "中性", isCorrect: false },
              { text: "磁性", isCorrect: false },
            ],
            hint: "レモン汁やお酢の仲間です。",
          },
          {
            questionNumber: 3,
            question: "てこの原理で、力を加える場所を何という？",
            options: [
              { text: "支点", isCorrect: false },
              { text: "力点", isCorrect: true, rationale: "支える点が支点、作用する点が作用点、力を加える点が力点です。" },
              { text: "作用点", isCorrect: false },
              { text: "頂点", isCorrect: false },
            ],
            hint: "力を入れる点です。",
          },
        ],
      },
      {
        id: "hard",
        title: "上級 (科学)",
        description: "人体や天体の動き。",
        questions: [
          {
            questionNumber: 1,
            question: "心臓から送り出される血液が通る血管を何という？",
            options: [
              { text: "静脈", isCorrect: false },
              { text: "動脈", isCorrect: true, rationale: "勢いよく流れるのが動脈、戻ってくるのが静脈です。" },
              { text: "毛細血管", isCorrect: false },
              { text: "リンパ管", isCorrect: false },
            ],
            hint: "ドクドクと脈打つ方です。",
          },
          {
            questionNumber: 2,
            question: "地球の周りを回っている天体は？",
            options: [
              { text: "太陽", isCorrect: false },
              { text: "月", isCorrect: true, rationale: "月は地球の衛星です。" },
              { text: "火星", isCorrect: false },
              { text: "金星", isCorrect: false },
            ],
            hint: "夜に見えます。",
          },
          {
            questionNumber: 3,
            question: "水が沸騰して気体になったものを何という？",
            options: [
              { text: "水蒸気", isCorrect: true, rationale: "液体が気体になることを蒸発といいます。" },
              { text: "湯気", isCorrect: false },
              { text: "ドライアイス", isCorrect: false },
              { text: "氷", isCorrect: false },
            ],
            hint: "目には見えません。",
          },
        ],
      },
    ],
  },
];
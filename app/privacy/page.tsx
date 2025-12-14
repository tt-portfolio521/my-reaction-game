export default function PrivacyPolicy() {
  return (
    <main className="max-w-3xl mx-auto p-8 text-gray-800 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">プライバシーポリシー</h1>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">個人情報の利用目的</h2>
        <p className="mb-4">
          当アプリ（[反射神経測定ゲーム]）では、お問い合わせや記事へのコメントの際、名前やメールアドレス等の個人情報を入力いただく場合がございます。<br />
          取得した個人情報は、お問い合わせに対する回答や必要な情報を電子メールなどでご連絡する場合に利用させていただくものであり、これらの目的以外では利用いたしません。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">広告について</h2>
        <p className="mb-4">
          当アプリでは、第三者配信の広告サービス（Googleアドセンス）を利用しており、ユーザーの興味に応じた商品やサービスの広告を表示するため、クッキー（Cookie）を使用しております。<br />
          クッキーを使用することで当サイトはお客様のコンピュータを識別できるようになりますが、お客様個人を特定できるものではありません。
        </p>
        <p className="mb-4">
          Cookieを無効にする方法やGoogleアドセンスに関する詳細は<a href="https://policies.google.com/technologies/ads?hl=ja" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">「広告 – ポリシーと規約 – Google」</a>をご確認ください。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">免責事項</h2>
        <p className="mb-4">
          当アプリからのリンクやバナーなどで移動したサイトで提供される情報、サービス等について一切の責任を負いません。<br />
          また当アプリのコンテンツ・情報について、できる限り正確な情報を提供するように努めておりますが、正確性や安全性を保証するものではありません。情報が古くなっていることもございます。<br />
          当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
        </p>
      </section>

      <div className="mt-12 text-sm text-gray-500">
        <p>制定日：2025年●月●日</p>
      </div>
      
      <div className="mt-8 text-center">
        <a href="/" className="text-blue-500 hover:underline">← ホームに戻る</a>
      </div>
    </main>
  );
}
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">税務調査立会ドットコム</h3>
            <p className="text-gray-400">
              元国税調査官による税務調査の専門サポート。
              追徴税額を最小限に抑え、安心の税務調査対応を提供します。
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">主なサービス</h4>
            <ul className="space-y-2 text-gray-400">
              <li>税務調査立会サポート</li>
              <li>重加算税回避対策</li>
              <li>無申告案件対応</li>
              <li>元国税調査官による専門相談</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">お問い合わせ</h4>
            <a 
              href="https://zeimusyo.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
            >
              無料相談はこちら
            </a>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; 2025 税務調査立会ドットコム All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

import Header from '../components/Header';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import { articles } from '../data/articles_full';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                税務調査でお困りですか?
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                元国税調査官が、あなたの税務調査を全力でサポートします
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://zeimusyo.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
                >
                  今すぐ無料相談する
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              私たちの強み
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🛡️</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">元国税調査官の知見</h3>
                <p className="text-gray-600">
                  調査官の思考パターンと交渉術を熟知した専門家が対応
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💰</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">追徴税額を大幅削減</h3>
                <p className="text-gray-600">
                  平均30〜50%の追徴税額削減実績。重加算税の回避も可能
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📞</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">全国対応・即日対応</h3>
                <p className="text-gray-600">
                  全国どこでも対応可能。急な税務調査にも即日対応します
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Articles Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              税務調査の知識を深める
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">
              税務調査の連絡が来たら、まずはご相談ください
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              初回相談無料・完全成功報酬制プランあり
            </p>
            <a 
              href="https://zeimusyo.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
            >
              今すぐ無料相談する
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

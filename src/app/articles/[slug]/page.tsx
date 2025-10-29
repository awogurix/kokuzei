import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { articles } from '../../../data/articles_full';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = articles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  // Convert content to HTML-like structure
  const contentParagraphs = article.content.split('\n').filter(p => p.trim());

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 bg-gray-50">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link href="/" className="text-primary-600 hover:text-primary-700 text-sm">
              ← 記事一覧に戻る
            </Link>
          </nav>

          {/* Article Header */}
          <header className="bg-white rounded-xl shadow-md p-8 mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                {article.category}
              </span>
              <time className="text-gray-500">{article.date}</time>
              <span className="text-gray-500">{article.readTime}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {article.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span 
                  key={tag}
                  className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          {/* Article Content */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <div className="article-content prose prose-lg max-w-none">
              {contentParagraphs.map((paragraph, index) => {
                // Handle headings
                if (paragraph.startsWith('# ')) {
                  return (
                    <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-gray-900">
                      {paragraph.replace(/^# /, '')}
                    </h1>
                  );
                }
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-gray-900">
                      {paragraph.replace(/^## /, '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-gray-800">
                      {paragraph.replace(/^### /, '')}
                    </h3>
                  );
                }
                // Handle bold text (**text**)
                if (paragraph.includes('**')) {
                  const parts = paragraph.split(/(\*\*.*?\*\*)/g);
                  return (
                    <p key={index} className="mb-4 leading-relaxed text-gray-700">
                      {parts.map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={i}>{part.replace(/\*\*/g, '')}</strong>;
                        }
                        return part;
                      })}
                    </p>
                  );
                }
                // Handle list items
                if (paragraph.match(/^[-\d+\.]/)) {
                  return (
                    <li key={index} className="ml-6 mb-2 text-gray-700">
                      {paragraph.replace(/^[-\d+\.]\s*/, '')}
                    </li>
                  );
                }
                // Regular paragraphs
                return (
                  <p key={index} className="mb-4 leading-relaxed text-gray-700">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-primary-600 text-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              税務調査でお困りの方へ
            </h2>
            <p className="text-lg mb-6 text-primary-100">
              元国税調査官による専門サポートで、追徴税額を最小限に抑えます
            </p>
            <a 
              href="https://zeimusyo.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
            >
              今すぐ無料相談する
            </a>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}

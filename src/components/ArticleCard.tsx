import Link from 'next/link';
import { Article } from '../types/article';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.slug}`}>
      <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
              {article.category}
            </span>
            <span className="text-gray-500 text-sm">{article.readTime}</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 flex-1">
            {article.title}
          </h2>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            <time className="text-sm text-gray-500">{article.date}</time>
            <div className="flex gap-2">
              {article.tags.slice(0, 2).map((tag) => (
                <span 
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

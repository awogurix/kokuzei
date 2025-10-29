import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-700">
              税務調査立会ドットコム
            </h1>
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition">
              記事一覧
            </Link>
            <a 
              href="https://zeimusyo.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              無料相談する
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

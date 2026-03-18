import Link from "next/link";

export default function MarketingNav() {
  return (
    <nav className="w-full border-b border-neutral-100 dark:border-neutral-900 pb-4 mb-8">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold text-neutral-900 dark:text-white hover:opacity-80 transition-opacity"
        >
          Talk To Your Computer
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/blog"
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/"
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
          >
            Try Free
          </Link>
        </div>
      </div>
    </nav>
  );
}

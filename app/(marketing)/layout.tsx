import Link from "next/link";
import MarketingNav from "@/components/MarketingNav";
import { getAllPostSlugs } from "@/lib/content/posts";
import { getAllCompetitorSlugs } from "@/lib/content/competitors";
import { posts } from "@/lib/content/posts";
import { competitors } from "@/lib/content/competitors";
import { allTools } from "@/lib/content/tools";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const postSlugs = getAllPostSlugs();
  const competitorSlugs = getAllCompetitorSlugs();

  return (
    <div className="select-text w-full">
      <MarketingNav />
      {children}

      {/* Site footer — links every page for users + Google */}
      <footer className="w-full border-t border-neutral-100 dark:border-neutral-900 mt-16 pt-10 pb-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-600 mb-3">
                Blog
              </p>
              <ul className="space-y-2">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-600 mb-3">
                Compare
              </p>
              <ul className="space-y-2">
                {competitors.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/vs/${c.slug}`}
                      className="text-sm text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                      vs {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-600 mb-3">
                Learn with AI
              </p>
              <ul className="space-y-2">
                {allTools.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/learn/${t.slug}`}
                      className="text-sm text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-600 mb-3">
                Product
              </p>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-sm text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Try for free
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-sm text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/learn"
                    className="text-sm text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Learn with AI
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-100 dark:border-neutral-900 pt-6 flex items-center justify-between">
            <Link
              href="/"
              className="text-sm font-semibold text-neutral-900 dark:text-white"
            >
              Talk To Your Computer
            </Link>
            <p className="text-xs text-neutral-400 dark:text-neutral-600">
              Made by{" "}
              <a
                href="https://x.com/josefbuettgen"
                className="hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Josef Büttgen
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

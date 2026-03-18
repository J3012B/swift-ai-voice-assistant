import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getAllPostSlugs } from "@/lib/content/posts";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `https://www.talktoyour.computer/blog/${slug}`;
  return {
    title: post.metaTitle,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.metaTitle,
      description: post.description,
      type: 'article',
      url,
      publishedTime: post.date,
      authors: ['Josef Büttgen'],
      images: [{ url: '/opengraph-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle,
      description: post.description,
      images: ['/opengraph-image.png'],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Person', name: 'Josef Büttgen', url: 'https://x.com/josefbuettgen' },
    publisher: { '@type': 'Organization', name: 'Talk To Your Computer', url: 'https://www.talktoyour.computer' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.talktoyour.computer/blog/${slug}` },
    image: 'https://www.talktoyour.computer/opengraph-image.png',
  };

  return (
    <div className="max-w-3xl mx-auto w-full pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors mb-8"
      >
        ← Back to Blog
      </Link>

      <article>
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4 text-sm text-neutral-500 dark:text-neutral-500">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
          <h1 className="text-3xl font-bold leading-tight">{post.title}</h1>
        </header>

        <div className="prose-neutral">{post.content}</div>
      </article>

      <div className="mt-16 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold mb-2">
          Try Talk To Your Computer free
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Share your screen, start talking. No install required.
        </p>
        <Link
          href="/"
          className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-full font-medium transition-colors"
        >
          Get Started Free
        </Link>
      </div>
    </div>
  );
}

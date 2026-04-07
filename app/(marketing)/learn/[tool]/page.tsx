import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTool, getAllToolSlugs } from "@/lib/content/tools";

type Props = {
  params: Promise<{ tool: string }>;
};

export async function generateStaticParams() {
  return getAllToolSlugs().map((tool) => ({ tool }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool: slug } = await params;
  const data = getTool(slug);
  if (!data) return {};
  const url = `https://www.talktoyour.computer/learn/${slug}`;
  return {
    title: data.metaTitle,
    description: data.description,
    alternates: { canonical: url },
    openGraph: {
      title: data.metaTitle,
      description: data.description,
      type: "website",
      url,
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: data.metaTitle,
      description: data.description,
      images: ["/opengraph-image.png"],
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { tool: slug } = await params;
  const data = getTool(slug);

  if (!data) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto w-full pb-16">
      <Link
        href="/learn"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors mb-8"
      >
        &larr; All tools
      </Link>

      {/* Category badge */}
      <div className="mb-4">
        <span className="inline-block text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
          {data.category}
        </span>
      </div>

      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold leading-tight mb-3">
          {data.headline}
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {data.subheadline}
        </p>
      </div>

      {/* Why hard */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">
          Why {data.name} Has a Steep Learning Curve
        </h2>
        {data.whyHard}
      </div>

      {/* How TTYC helps */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">
          How Talk To Your Computer Changes This
        </h2>
        {data.howTtycHelps}
      </div>

      {/* Example prompts */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">What You Can Ask</h2>
        <div className="space-y-3">
          {data.examplePrompts.map((prompt) => (
            <div
              key={prompt}
              className="flex items-start gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-neutral-400 dark:text-neutral-600 shrink-0 mt-0.5"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
              <span className="text-[15px] text-neutral-700 dark:text-neutral-300 leading-relaxed">
                &ldquo;{prompt}&rdquo;
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content sections */}
      <div className="space-y-12">
        {data.sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
            {section.body}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold mb-2">
          Try it free &mdash; no install needed
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Share your screen. Hold the mic button. Ask anything.
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

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompetitor, getAllCompetitorSlugs } from "@/lib/content/competitors";
import VsHero from "@/components/VsHero";

type Props = {
  params: Promise<{ competitor: string }>;
};

export async function generateStaticParams() {
  return getAllCompetitorSlugs().map((competitor) => ({ competitor }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { competitor } = await params;
  const data = getCompetitor(competitor);
  if (!data) return {};
  const url = `https://www.talktoyour.computer/vs/${competitor}`;
  return {
    title: data.metaTitle,
    description: data.description,
    alternates: { canonical: url },
    openGraph: {
      title: data.metaTitle,
      description: data.description,
      type: 'website',
      url,
      images: [{ url: '/opengraph-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.metaTitle,
      description: data.description,
      images: ['/opengraph-image.png'],
    },
  };
}

export default async function CompetitorPage({ params }: Props) {
  const { competitor } = await params;
  const data = getCompetitor(competitor);

  if (!data) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto w-full pb-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors mb-8"
      >
        ← Home
      </Link>

      {/* Logo lockup */}
      <VsHero competitorName={data.name} competitorLogoPath={data.logoPath} />

      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold leading-tight mb-3">
          {data.heroHeadline}
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {data.heroSubheadline}
        </p>
      </div>

      {/* Comparison Table */}
      <div className="mb-12 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
              <th className="text-left px-5 py-3 font-semibold text-neutral-900 dark:text-white">
                Feature
              </th>
              <th className="text-center px-5 py-3 font-semibold text-neutral-900 dark:text-white">
                Talk To Your Computer
              </th>
              <th className="text-center px-5 py-3 font-semibold text-neutral-900 dark:text-white">
                {data.name}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.features.map((row, i) => (
              <tr
                key={row.feature}
                className={
                  i % 2 === 0
                    ? "bg-white dark:bg-black"
                    : "bg-neutral-50 dark:bg-neutral-900/50"
                }
              >
                <td className="px-5 py-3 text-neutral-700 dark:text-neutral-300">
                  {row.feature}
                </td>
                <td className="px-5 py-3 text-center">
                  {row.ttyc ? (
                    <span className="text-green-500 font-bold text-base">✓</span>
                  ) : (
                    <span className="text-red-400 font-bold text-base">✗</span>
                  )}
                </td>
                <td className="px-5 py-3 text-center">
                  {row.competitor ? (
                    <span className="text-green-500 font-bold text-base">✓</span>
                  ) : (
                    <span className="text-red-400 font-bold text-base">✗</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Main content */}
      <div className="space-y-6">{data.content}</div>

      {/* CTA */}
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

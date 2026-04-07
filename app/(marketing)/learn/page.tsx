import type { Metadata } from "next";
import Link from "next/link";
import { allTools } from "@/lib/content/tools";

export const metadata: Metadata = {
  title: "Learn Any Software with AI | Talk To Your Computer",
  description:
    "Complex software gets easier when you can just ask. Share your screen, hold the mic button, and get instant help with DaVinci Resolve, Blender, Make.com, After Effects, Notion, Excel, and more.",
  alternates: { canonical: "https://www.talktoyour.computer/learn" },
};

export default function LearnIndex() {
  return (
    <div className="max-w-3xl mx-auto w-full pb-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors mb-8"
      >
        &larr; Home
      </Link>

      <div className="mb-10">
        <h1 className="text-3xl font-bold leading-tight mb-3">
          Learn Any Software with AI
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Complex tools get easier when you can just ask. Pick your tool below.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allTools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/learn/${tool.slug}`}
            className="group flex items-center justify-between gap-3 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
          >
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {tool.name}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-500">
                {tool.category}
              </p>
            </div>
            <span className="text-neutral-400 dark:text-neutral-600 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors text-lg">
              &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

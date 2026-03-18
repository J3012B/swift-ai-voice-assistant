import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/lib/content/posts";

export const metadata: Metadata = {
  title: "Blog — AI Voice Assistant Guides | Talk To Your Computer",
  description:
    "Guides and insights on AI voice assistants, screen-aware AI, and how to talk to your computer more effectively.",
};

export default function BlogPage() {
  return (
    <div className="max-w-3xl mx-auto w-full pb-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Blog</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Guides and insights on AI voice assistants
        </p>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-2 text-sm text-neutral-500 dark:text-neutral-500">
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readingTime}</span>
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors mb-2">
              {post.title}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
              {post.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

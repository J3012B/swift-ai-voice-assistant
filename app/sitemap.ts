import type { MetadataRoute } from 'next';
import { getAllPostSlugs } from './lib/content/posts';
import { getAllCompetitorSlugs } from './lib/content/competitors';
import { getAllToolSlugs } from './lib/content/tools';

const BASE_URL = 'https://www.talktoyour.computer';

export default function sitemap(): MetadataRoute.Sitemap {
	const posts = getAllPostSlugs().map((slug) => ({
		url: `${BASE_URL}/blog/${slug}`,
		lastModified: new Date(),
		changeFrequency: 'monthly' as const,
		priority: 0.7,
	}));

	const competitors = getAllCompetitorSlugs().map((slug) => ({
		url: `${BASE_URL}/vs/${slug}`,
		lastModified: new Date(),
		changeFrequency: 'monthly' as const,
		priority: 0.8,
	}));

	const tools = getAllToolSlugs().map((slug) => ({
		url: `${BASE_URL}/learn/${slug}`,
		lastModified: new Date(),
		changeFrequency: 'monthly' as const,
		priority: 0.7,
	}));

	return [
		{
			url: BASE_URL,
			lastModified: new Date(),
			changeFrequency: 'weekly' as const,
			priority: 1.0,
		},
		{
			url: `${BASE_URL}/blog`,
			lastModified: new Date(),
			changeFrequency: 'weekly' as const,
			priority: 0.9,
		},
		{
			url: `${BASE_URL}/learn`,
			lastModified: new Date(),
			changeFrequency: 'weekly' as const,
			priority: 0.8,
		},
		...posts,
		...competitors,
		...tools,
	];
}

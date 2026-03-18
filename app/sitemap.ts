import type { MetadataRoute } from 'next';
import { getAllPostSlugs } from './lib/content/posts';
import { getAllCompetitorSlugs } from './lib/content/competitors';

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
		...posts,
		...competitors,
	];
}

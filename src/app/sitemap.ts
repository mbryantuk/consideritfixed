import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://consideritfixed.uk';
  const lastModified = new Date();

  // Static routes
  const staticRoutes = [
    '',
    '/pricing',
    '/remote-support',
    '/about',
    '/faq',
    '/contact',
    '/login',
    '/terms',
    '/privacy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic Blog routes
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true }
  });

  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Add the main blog list
  const blogList = {
    url: `${baseUrl}/blog`,
    lastModified,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  };

  return [...staticRoutes, blogList, ...blogRoutes];
}
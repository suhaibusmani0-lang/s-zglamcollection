import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://szglamcollection.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/admin/', '/admin'],
      },
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Applebot',
          'GPTBot',
          'ChatGPT-User',
          'Claude-Web',
          'anthropic-ai',
          'PerplexityBot',
        ],
        allow: ['/', '/live', '/shop'],
        disallow: ['/api/admin/', '/admin'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

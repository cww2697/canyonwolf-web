import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'ai-train',
        disallow: '/',
      },
      {
        userAgent: 'ai-input',
        allow: ['/projects/spark-launcher', '/projects/terravista'],
        disallow: '/',
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'CCBot', 'Anthropic-ai', 'Claude-Web', 'ClaudeBot', 'PerplexityBot', 'Amazonbot', 'ImagesiftBot'],
        disallow: '/',
      },
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://www.canyonwolf.net/sitemap.xml',
  }
}

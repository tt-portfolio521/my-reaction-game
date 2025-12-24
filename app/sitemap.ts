import { MetadataRoute } from 'next'
import { posts } from './blog/posts' // 記事データを読み込む

export default function sitemap(): MetadataRoute.Sitemap {
  // あなたのサイトのURL（最後にスラッシュなし）
  const baseUrl = 'https://calc-tools-box.vercel.app' 

  // 1. ブログ記事のURLを自動生成
  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // 2. 固定ページのURL
  const routes = [
    '',             // トップページ
    '/investment',  // 資産運用
    '/loan',        // ローン
    '/depreciation',// 減価償却
    '/cvp',         // 損益分岐点
    '/reaction',    // 反射神経
    '/blog',        // ブログ一覧
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8, // トップページは優先度Max
  }))

  // 1と2を合体させて返す
  return [...routes, ...blogUrls]
}
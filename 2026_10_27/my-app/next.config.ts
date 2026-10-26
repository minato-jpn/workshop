import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  // ランディングページ(/)を商品一覧にする
  async redirects() {
    return [{ source: '/', destination: '/products', permanent: false }]
  }
}

export default nextConfig

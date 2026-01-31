import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // Static export for GitHub Pages
  output: 'export',
  
  // Base path for GitHub Pages (repo name)
  basePath: isProd ? '/wpm-website' : '',
  
  // Asset prefix for GitHub Pages
  assetPrefix: isProd ? '/wpm-website/' : '',
  
  // Disable image optimization (not supported in static export)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

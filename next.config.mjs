/** @type {import('next').NextConfig} */

import nextMDX from '@next/mdx';

import { recmaPlugins } from './mdx/recma.mjs';
import { rehypePlugins } from './mdx/rehype.mjs';
import { remarkPlugins } from './mdx/remark.mjs';

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins,
    rehypePlugins,
    recmaPlugins
  }
});

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx'],
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        port: '',
        pathname: '/**'
      }
    ]
  }
};

export default withMDX(nextConfig);

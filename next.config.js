/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  // 如果你配置了 alias，也可以加在这里：
  webpack(config) {
    config.resolve.alias['@'] = require('path').resolve(__dirname, './');
    return config;
  },
};

module.exports = nextConfig;

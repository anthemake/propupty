const nextConfig = {
  images: {
    domains: ["localhost"],
  },
  experimental: {
    typedRoutes: true,
  },

};

module.exports = {
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig;
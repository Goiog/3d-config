/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    domains: [
      "source.unsplash.com",
      "outfitters.com.pk",
      "res.cloudinary.com",
      "images.unsplash.com",
      "lottie.host",
      "lottiefiles.com",
    ],
  },

  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
      canvas: "commonjs canvas",
    });

    return config;
  },

  reactStrictMode: false,

  async headers() {
    return [
      {
        source: "/(.*)", // all routes
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // allow your controller
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

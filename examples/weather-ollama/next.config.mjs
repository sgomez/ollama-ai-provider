/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'openweathermap.org'
      }
    ]
  }
};

export default nextConfig;


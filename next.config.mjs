/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: [
    '192.168.2.*',
    '192.168.1.*',
    'localhost',
    '127.0.0.1'
  ]
}

export default nextConfig
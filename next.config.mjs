/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "/PokeFlex2",
    output: "export",
    images: {
      unoptimized: true,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'raw.githubusercontent.com',
          port: '',
          pathname: '/PokeAPI/sprites/master/sprites/pokemon/*',
        },
      ],
    },
};

export default nextConfig;

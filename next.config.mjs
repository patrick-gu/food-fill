/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (
        config,
        { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
    ) => {
        return {
            ...config,
            resolve: {
                ...config.resolve,
                fallback: {
                    ...config.resolve.fallback,
                    fs: false,
                    path: false,
                    crypto: false,
                },
            },
        };
    },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"]
        });

        return config;
    },

    publicRuntimeConfig: {
        name: process.env.IS_DEV_MOD,
        description: "check if server is dev"
    }

}



module.exports = nextConfig

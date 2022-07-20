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
        IS_DEV_MOD: process.env.IS_DEV_MOD,
        description: process.env.DESCRIPTION,
    }

}



module.exports = nextConfig

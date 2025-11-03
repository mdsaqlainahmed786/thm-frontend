/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'randomuser.me',
            'the-hotel-media-bucket.s3.ap-south-1.amazonaws.com',
            'ec2-13-202-52-159.ap-south-1.compute.amazonaws.com',
            'localhost',
            '127.0.0.1',
            'thehotelmedia.com',
            'lh3.googleusercontent.com'
        ]
    },
    env: {
        HOST: process.env.HOST,
    },
    compiler: {
        // Enables the styled-components SWC transform
        styledComponents: true
    },
    eslint: {
        ignoreDuringBuilds: true
    },
};

export default nextConfig;

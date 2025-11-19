/** @type {import('next').NextConfig} */
const nextConfig = {
	typescript: { ignoreBuildErrors: true },
	eslint: { ignoreDuringBuilds: true },
	images: {
	  domains: [
		"randomuser.me",
		"the-hotel-media-bucket.s3.ap-south-1.amazonaws.com",
		"ec2-13-202-52-159.ap-south-1.compute.amazonaws.com",
		"localhost",
		"127.0.0.1",
		"thehotelmedia.com",
		"lh3.googleusercontent.com",
	  ],
	},
  };
  module.exports = nextConfig;
  
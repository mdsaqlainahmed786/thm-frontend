/** @type {import('next').NextConfig} */
const nextConfig = {
	typescript: { ignoreBuildErrors: true },
	eslint: { ignoreDuringBuilds: true },
	
	// Disable X-Powered-By header for security
	poweredByHeader: false,
	
	// Enable compression
	compress: true,
	
	images: {
		domains: [
			"randomuser.me",
			"the-hotel-media-bucket.s3.ap-south-1.amazonaws.com",
			"ec2-13-202-52-159.ap-south-1.compute.amazonaws.com",
			"localhost",
			"127.0.0.1",
			"thehotelmedia.com",
			"staging.thehotelmedia.com",
			"api.thehotelmedia.com",
			"admin.thehotelmedia.com",
			"lh3.googleusercontent.com",
		],
	},
	
	// Experimental features for stability
	experimental: {
		serverActions: {
			bodySizeLimit: '2mb',
		},
	},
	
	// Server external packages that should not be bundled
	serverExternalPackages: ['axios'],
};

module.exports = nextConfig;

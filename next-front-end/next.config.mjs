// @ts-check
import bundleAnalyser from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyser({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath: "/SDI_Walkthrough",
  output: "standalone",
  typedRoutes: true,
};

// export default nextConfig;

export default withBundleAnalyzer(nextConfig);

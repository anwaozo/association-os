import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output is for the Docker image (AWS / Mac Studio servers).
  // Netlify builds without it.
  output: process.env.NEXT_OUTPUT_STANDALONE === "true" ? "standalone" : undefined,
};

export default nextConfig;

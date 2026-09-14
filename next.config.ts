import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disabled: Turbopack's dev filesystem cache mmaps files under .next/, which
  // OneDrive's Files On-Demand sync corrupts (this project lives in a synced
  // OneDrive folder) — causes "Failed to restore task data" panics.
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "djjtsfaqzvoksytxzkbf.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;

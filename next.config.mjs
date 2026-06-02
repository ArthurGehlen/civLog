import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { version } = require("./package.json");

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: { NEXT_PUBLIC_APP_VERSION: version },
  reactCompiler: true,
  images: {
    remotePatterns: [
      new URL(
        "https://mwycbxoshhdnbpeqneoo.supabase.co/storage/v1/object/public/civ-icons/**",
      ),
      new URL(
        "https://mwycbxoshhdnbpeqneoo.supabase.co/storage/v1/object/public/users-avatar/**",
      ),
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/drjptqvzc/image/upload/**",
      },
    ],
  },
};

export default nextConfig;

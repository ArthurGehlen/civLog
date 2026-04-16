/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      new URL(
        "https://mwycbxoshhdnbpeqneoo.supabase.co/storage/v1/object/public/civ-icons/**",
      ),
      new URL(
        "https://mwycbxoshhdnbpeqneoo.supabase.co/storage/v1/object/public/users-avatar/**",
      ),
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://fhrnzwilzvedkfsywerr.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZocm56d2lsenZlZGtmc3l3ZXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMjkyNTIsImV4cCI6MjA5MTcwNTI1Mn0.kIcI7knJqHbwUq4p5EUoMtzFNFgHBj6NCLaZyquyJXY",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fhrnzwilzvedkfsywerr.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;

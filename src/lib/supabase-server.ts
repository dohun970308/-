import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const FALLBACK_URL = "https://fhrnzwilzvedkfsywerr.supabase.co";
const FALLBACK_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZocm56d2lsenZlZGtmc3l3ZXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMjkyNTIsImV4cCI6MjA5MTcwNTI1Mn0.kIcI7knJqHbwUq4p5EUoMtzFNFgHBj6NCLaZyquyJXY";

function getUrl(): string {
  const v = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (typeof v === "string" && v.startsWith("http")) return v;
  return FALLBACK_URL;
}

function getKey(): string {
  const v = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (typeof v === "string" && v.length > 20) return v;
  return FALLBACK_KEY;
}

export function createServerClient() {
  return createClient(getUrl(), getKey(), {
    global: {
      headers: {
        cookie: cookies().toString(),
      },
    },
  });
}

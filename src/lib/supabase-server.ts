import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://fhrnzwilzvedkfsywerr.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZocm56d2lsenZlZGtmc3l3ZXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMjkyNTIsImV4cCI6MjA5MTcwNTI1Mn0.kIcI7knJqHbwUq4p5EUoMtzFNFgHBj6NCLaZyquyJXY";

export function createServerClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        cookie: cookies().toString(),
      },
    },
  });
}

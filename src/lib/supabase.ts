import { createClient } from "@supabase/supabase-js";

// NEXT_PUBLIC_ 값은 빌드 시 인라인됨
// Vercel에서 환경변수 미설정 시에도 동작하도록 기본값 지정
// anon key는 공개용이므로 코드에 포함해도 안전
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://fhrnzwilzvedkfsywerr.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZocm56d2lsenZlZGtmc3l3ZXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMjkyNTIsImV4cCI6MjA5MTcwNTI1Mn0.kIcI7knJqHbwUq4p5EUoMtzFNFgHBj6NCLaZyquyJXY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

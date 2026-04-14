import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// 빌드 시 환경변수가 없으면 더미 클라이언트, 런타임에는 정상 생성
// force-dynamic 서버 컴포넌트는 런타임에만 호출되므로 안전
export const supabase: SupabaseClient =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : (new Proxy({} as SupabaseClient, {
        get() {
          throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
        },
      }) as SupabaseClient);

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // 빌드 시 환경변수 없음 → 실제 프로퍼티 접근 시 에러
    // force-dynamic 덕분에 빌드 중에는 절대 호출되지 않음
    return new Proxy({} as any, {
      get(_, prop) {
        if (prop === "then" || prop === Symbol.toPrimitive) return undefined;
        throw new Error(
          `Supabase not configured (accessed .${String(prop)})`
        );
      },
    });
  }

  _client = createClient(url, key);
  return _client;
}

// 모듈 로드 시점에 createClient를 호출하지 않음 (지연 평가)
// 기존 코드의 import { supabase } 그대로 호환
export const supabase = new Proxy({} as any, {
  get(_, prop) {
    return getClient()[prop as keyof SupabaseClient];
  },
}) as SupabaseClient;

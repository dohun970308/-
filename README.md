# 리레브 - 프리미엄 중고차 구독 서비스

중고차 구독/렌트 서비스 웹사이트입니다.

## 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase (DB + Storage + Auth)

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

http://localhost:3000 에서 확인

## 환경변수

`.env.local` 파일에 다음 변수를 설정하세요:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_KAKAO_CHANNEL_URL=http://pf.kakao.com/_mzxkxcn/chat
```

## 페이지 구성

| 경로 | 설명 |
|------|------|
| `/` | 메인 페이지 - 히어로 배너, 브랜드 필터, 차량 목록 |
| `/cars/[id]` | 차량 상세 - 이미지 갤러리, 차량 정보, 문의 버튼 |
| `/notices` | 공지사항 목록 |
| `/notices/[id]` | 공지 상세 |
| `/admin/login` | 관리자 로그인 |
| `/admin/cars` | 차량 관리 (CRUD) |
| `/admin/cars/new` | 차량 등록 |
| `/admin/cars/[id]/edit` | 차량 수정 |
| `/admin/notices` | 공지사항 관리 (CRUD) |

## 관리자 계정

Supabase Authentication에서 이메일/비밀번호 사용자를 생성한 후 `/admin/login`에서 로그인하세요.

## Supabase 설정

- DB 테이블: `cars`, `notices`
- Storage 버킷: `car-images` (public)
- RLS 정책 적용 완료

## 배포

Vercel에 배포 시 환경변수를 설정하면 바로 배포 가능합니다.

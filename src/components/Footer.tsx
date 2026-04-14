import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const kakaoUrl = process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL ?? "#";

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* Company info */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="text-base font-semibold text-foreground">리레브</p>
            <p>(주)리레브모빌리티</p>
            <p>사업자등록번호: 123-45-67890</p>
            <p>주소: 서울특별시 강남구 테헤란로 123</p>
            <p>대표: 홍길동 | 이메일: info@rerev.kr</p>
          </div>

          {/* Kakao button */}
          <div className="flex flex-col items-start gap-3 md:items-end">
            <Link href={kakaoUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="gap-2">
                <MessageCircle className="size-4" />
                카카오톡 문의
              </Button>
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border/40 pt-6 text-center text-xs text-muted-foreground">
          &copy; 2026 리레브. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Notice } from "@/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "공지사항 | 리레브",
  description: "리레브 프리미엄 중고차 구독 서비스 공지사항",
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

export default async function NoticesPage() {
  const { data: notices } = await supabase
    .from("notices")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .returns<Notice[]>();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          {/* Page heading */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              공지사항
            </h1>
            <p className="mt-3 text-muted-foreground">
              리레브의 새로운 소식과 안내사항을 확인하세요.
            </p>
          </div>

          {/* Notice list */}
          {!notices || notices.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border/40 bg-card/50 py-20 text-center">
              <p className="text-lg text-muted-foreground">
                등록된 공지사항이 없습니다.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {notices.map((notice) => (
                <Link key={notice.id} href={`/notices/${notice.id}`}>
                  <Card className="transition-colors hover:bg-secondary/60">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        {notice.is_pinned && (
                          <Badge variant="default" className="shrink-0">
                            <span className="mr-0.5">📌</span> 중요
                          </Badge>
                        )}
                        <CardTitle className="line-clamp-1 flex-1 text-foreground">
                          {notice.title}
                        </CardTitle>
                      </div>
                      <CardDescription>
                        {formatDate(notice.created_at)}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

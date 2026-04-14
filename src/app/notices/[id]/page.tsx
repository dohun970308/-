import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Notice } from "@/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: notice } = await supabase
    .from("notices")
    .select("title")
    .eq("id", id)
    .single<Pick<Notice, "title">>();

  return {
    title: notice ? `${notice.title} | 리레브` : "공지사항 | 리레브",
  };
}

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: notice } = await supabase
    .from("notices")
    .select("*")
    .eq("id", id)
    .single<Notice>();

  if (!notice) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          {/* Back button */}
          <div className="mb-6">
            <Link href="/notices" className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              &larr; 목록으로 돌아가기
            </Link>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                {notice.is_pinned && (
                  <Badge variant="default" className="shrink-0">
                    <span className="mr-0.5">📌</span> 중요
                  </Badge>
                )}
                <CardTitle className="text-xl font-bold text-foreground sm:text-2xl">
                  {notice.title}
                </CardTitle>
              </div>
              <CardDescription>{formatDate(notice.created_at)}</CardDescription>
            </CardHeader>

            <CardContent>
              <Separator className="mb-6" />
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/85 sm:text-base">
                {notice.content}
              </div>
            </CardContent>
          </Card>

          {/* Bottom back button */}
          <div className="mt-8 text-center">
            <Link href="/notices">
              <Button variant="outline">목록으로</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

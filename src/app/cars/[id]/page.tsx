import { notFound } from "next/navigation";

import Link from "next/link";
import { MessageCircle, Car as CarIcon, ChevronLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Car } from "@/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import ImageGallery from "./ImageGallery";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CarDetailPage({ params }: PageProps) {
  const { id } = await params;

  const { data: car, error } = await supabase
    .from("cars")
    .select("*")
    .eq("id", id)
    .eq("is_visible", true)
    .single();

  if (error || !car) {
    notFound();
  }

  const typedCar = car as Car;
  const priceInMan = Math.round(typedCar.monthly_price / 10000);
  const kakaoUrl = process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL ?? "#";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
          {/* Back link */}
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
            목록으로 돌아가기
          </Link>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left: Image Gallery */}
            <div>
              {typedCar.images && typedCar.images.length > 0 ? (
                <ImageGallery images={typedCar.images} alt={`${typedCar.brand} ${typedCar.model}`} />
              ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl border border-border bg-muted/30">
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <CarIcon className="size-16 stroke-1" />
                    <span className="text-lg font-medium">이미지 준비중</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Car Info */}
            <div className="flex flex-col gap-6">
              {/* Title + Badges */}
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {typedCar.service_type === "subscription" ? "구독" : "렌트"}
                  </Badge>
                  {typedCar.is_featured && (
                    <Badge className="bg-primary text-primary-foreground text-xs">
                      추천
                    </Badge>
                  )}
                  {typedCar.is_sale && (
                    <Badge className="bg-destructive text-white text-xs">
                      특가
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {typedCar.brand} {typedCar.model}
                </h1>
              </div>

              {/* Monthly Price */}
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="mb-1 text-sm text-muted-foreground">월 구독료</p>
                <p className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
                  월 {priceInMan.toLocaleString()}만원
                </p>
              </div>

              <Separator />

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "연식", value: `${typedCar.year}년` },
                  { label: "주행거리", value: `${typedCar.mileage.toLocaleString()}km` },
                  { label: "연료", value: typedCar.fuel },
                  { label: "변속기", value: typedCar.transmission },
                  { label: "색상", value: typedCar.color },
                  { label: "최소 구독기간", value: `${typedCar.min_months}개월` },
                ].map((item) => (
                  <Card key={item.label} className="border-border/60 bg-muted/20">
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="mt-1 text-sm font-semibold">{item.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator />

              {/* Includes */}
              {typedCar.includes && typedCar.includes.length > 0 && (
                <div>
                  <h2 className="mb-3 text-lg font-semibold">포함 항목</h2>
                  <div className="flex flex-wrap gap-2">
                    {typedCar.includes.map((item) => (
                      <Badge key={item} variant="outline" className="text-sm">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {typedCar.features && typedCar.features.length > 0 && (
                <div>
                  <h2 className="mb-3 text-lg font-semibold">차량 특징</h2>
                  <div className="flex flex-wrap gap-2">
                    {typedCar.features.map((item) => (
                      <Badge key={item} variant="secondary" className="text-sm">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Kakao CTA */}
              <Link href={kakaoUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="w-full gap-2 bg-[#FEE500] text-[#191919] hover:bg-[#FDD835] text-base font-bold"
                >
                  <MessageCircle className="size-5" />
                  카카오톡 문의하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

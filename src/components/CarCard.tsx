"use client";

import Link from "next/link";
import { Car as CarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Car } from "@/types";

function formatPrice(price: number): string {
  return `${Math.round(price / 10000)}만원`;
}

function formatMileage(km: number): string {
  return `${(km / 10000).toFixed(1)}만km`;
}

export default function CarCard({ car }: { car: Car }) {
  return (
    <Link href={`/cars/${car.id}`}>
      <Card className="group/car cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:ring-2 hover:ring-primary/40">
        {/* Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
          {car.images && car.images.length > 0 ? (
            <img
              src={car.images[0]}
              alt={`${car.brand} ${car.model}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover/car:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <CarIcon className="size-12 text-muted-foreground/40" />
            </div>
          )}

          {/* Badges top-left */}
          <div className="absolute left-2 top-2 flex gap-1.5">
            {car.is_featured && (
              <Badge className="bg-blue-600 text-white">추천</Badge>
            )}
            {car.is_sale && (
              <Badge className="bg-amber-500 text-black">특가</Badge>
            )}
          </div>

          {/* Service type badge top-right */}
          <div className="absolute right-2 top-2">
            <Badge variant="secondary" className="bg-background/70 backdrop-blur-sm">
              {car.service_type === "subscription" ? "구독" : "렌트"}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardContent className="space-y-2 px-4 pb-4 pt-3">
          <h3 className="truncate text-base font-semibold text-foreground">
            {car.brand} {car.model}
          </h3>

          <p className="text-xs text-muted-foreground">
            {car.year}년 &middot; {formatMileage(car.mileage)} &middot; {car.fuel}
          </p>

          <p className="text-lg font-bold text-primary">
            월 {formatPrice(car.monthly_price)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

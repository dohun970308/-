"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import CarCard from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Car } from "@/types";

const brands = [
  "전체",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Hyundai",
  "Kia",
  "Genesis",
  "Tesla",
  "MINI",
];

function SkeletonCard() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[16/10] w-full animate-pulse bg-secondary" />
      <div className="space-y-3 px-4 pb-4 pt-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-secondary" />
        <div className="h-5 w-1/3 animate-pulse rounded bg-secondary" />
      </div>
    </Card>
  );
}

export default function HomePage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState("전체");
  const [serviceFilter, setServiceFilter] = useState("전체");

  useEffect(() => {
    async function fetchCars() {
      setLoading(true);
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("is_visible", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setCars(data as Car[]);
      }
      setLoading(false);
    }
    fetchCars();
  }, []);

  const filteredCars = cars.filter((car) => {
    const brandMatch = selectedBrand === "전체" || car.brand === selectedBrand;
    const serviceMatch =
      serviceFilter === "전체" ||
      (serviceFilter === "구독" && car.service_type === "subscription") ||
      (serviceFilter === "렌트" && car.service_type === "rent");
    return brandMatch && serviceMatch;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <HeroBanner />

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          {/* Service type tabs */}
          <Tabs defaultValue="전체" onValueChange={setServiceFilter}>
            <TabsList>
              <TabsTrigger value="전체">전체</TabsTrigger>
              <TabsTrigger value="구독">구독</TabsTrigger>
              <TabsTrigger value="렌트">렌트</TabsTrigger>
            </TabsList>

            {/* Brand filter */}
            <div className="mt-4 flex flex-wrap gap-2">
              {brands.map((brand) => (
                <Button
                  key={brand}
                  variant={selectedBrand === brand ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedBrand(brand)}
                >
                  {brand}
                </Button>
              ))}
            </div>

            {/* Car grid - shared across all tabs */}
            {["전체", "구독", "렌트"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-6">
                {loading ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : filteredCars.length === 0 ? (
                  <div className="flex min-h-[200px] items-center justify-center">
                    <p className="text-muted-foreground">
                      조건에 맞는 차량이 없습니다.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredCars.map((car) => (
                      <CarCard key={car.id} car={car} />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </main>

      <Footer />
    </div>
  );
}

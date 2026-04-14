"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Car } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, PencilIcon, Trash2Icon } from "lucide-react";

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("cars")
      .select("*")
      .order("created_at", { ascending: false });
    setCars(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 차량을 삭제하시겠습니까?`)) return;
    await supabase.from("cars").delete().eq("id", id);
    fetchCars();
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ko-KR").format(price);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">차량 관리</h2>
        <Link href="/admin/cars/new">
          <Button>
            <PlusIcon className="size-4" />
            차량 등록
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>등록된 차량 ({cars.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              로딩 중...
            </p>
          ) : cars.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              등록된 차량이 없습니다.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="whitespace-nowrap px-3 py-2 font-medium">브랜드</th>
                    <th className="whitespace-nowrap px-3 py-2 font-medium">모델</th>
                    <th className="whitespace-nowrap px-3 py-2 font-medium">연식</th>
                    <th className="whitespace-nowrap px-3 py-2 font-medium">월 가격</th>
                    <th className="whitespace-nowrap px-3 py-2 font-medium">유형</th>
                    <th className="whitespace-nowrap px-3 py-2 font-medium">상태</th>
                    <th className="whitespace-nowrap px-3 py-2 font-medium">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car) => (
                    <tr key={car.id} className="border-b last:border-0">
                      <td className="whitespace-nowrap px-3 py-2.5">{car.brand}</td>
                      <td className="whitespace-nowrap px-3 py-2.5">{car.model}</td>
                      <td className="whitespace-nowrap px-3 py-2.5">{car.year}</td>
                      <td className="whitespace-nowrap px-3 py-2.5">
                        {formatPrice(car.monthly_price)}원
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5">
                        <Badge variant="secondary">
                          {car.service_type === "subscription" ? "구독" : "렌트"}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {car.is_visible ? (
                            <Badge variant="default">공개</Badge>
                          ) : (
                            <Badge variant="outline">비공개</Badge>
                          )}
                          {car.is_featured && (
                            <Badge variant="secondary">추천</Badge>
                          )}
                          {car.is_sale && (
                            <Badge variant="destructive">할인</Badge>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5">
                        <div className="flex items-center gap-1">
                          <Link href={`/admin/cars/${car.id}/edit`}>
                            <Button variant="ghost" size="icon-sm">
                              <PencilIcon className="size-3.5" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() =>
                              handleDelete(car.id, `${car.brand} ${car.model}`)
                            }
                          >
                            <Trash2Icon className="size-3.5 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

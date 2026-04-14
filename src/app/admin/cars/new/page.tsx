"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { XIcon, UploadIcon, ImageIcon } from "lucide-react";

const BRANDS = [
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Hyundai",
  "Kia",
  "Genesis",
  "Tesla",
  "MINI",
  "Porsche",
  "Volvo",
  "기타",
];
const FUELS = ["가솔린", "디젤", "전기", "하이브리드"];
const TRANSMISSIONS = ["자동", "수동"];
const SERVICE_TYPES = [
  { value: "subscription", label: "구독" },
  { value: "rent", label: "렌트" },
];

export default function AdminCarNewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [brand, setBrand] = useState("BMW");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(2024);
  const [mileage, setMileage] = useState(0);
  const [monthlyPrice, setMonthlyPrice] = useState(0);
  const [minMonths, setMinMonths] = useState(3);
  const [fuel, setFuel] = useState("가솔린");
  const [transmission, setTransmission] = useState("자동");
  const [color, setColor] = useState("");
  const [serviceType, setServiceType] = useState<"subscription" | "rent">(
    "subscription"
  );
  const [includes, setIncludes] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSale, setIsSale] = useState(false);

  const [includeInput, setIncludeInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleTagKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    input: string,
    setInput: (v: string) => void,
    tags: string[],
    setTags: (v: string[]) => void
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = input.trim();
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
      }
      setInput("");
    }
  };

  const removeTag = (
    tag: string,
    tags: string[],
    setTags: (v: string[]) => void
  ) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      try {
        const ext = file.name.split(".").pop() || "jpg";
        const filePath = `cars/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        console.log(`업로드 시작: ${file.name} (${file.size} bytes) -> ${filePath}`);

        const { data, error } = await supabase.storage
          .from("car-images")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error("업로드 실패:", { message: error.message, name: error.name, cause: error });
          alert(`이미지 업로드 실패: ${error.message}`);
          continue;
        }

        console.log("업로드 성공:", data.path);
        const { data: urlData } = supabase.storage
          .from("car-images")
          .getPublicUrl(filePath);
        console.log("Public URL:", urlData.publicUrl);
        newUrls.push(urlData.publicUrl);
      } catch (err) {
        console.error("업로드 예외:", err);
        alert(`업로드 중 오류: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    setImages((prev) => [...prev, ...newUrls]);
    setUploading(false);
    e.target.value = "";
  };

  const removeImage = (url: string) => {
    setImages(images.filter((img) => img !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("cars").insert({
      brand,
      model,
      year,
      mileage,
      monthly_price: monthlyPrice,
      min_months: minMonths,
      fuel,
      transmission,
      color,
      service_type: serviceType,
      includes,
      features,
      images,
      is_visible: isVisible,
      is_featured: isFeatured,
      is_sale: isSale,
    });

    if (!error) {
      router.push("/admin/cars");
    } else {
      alert("차량 등록에 실패했습니다: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">차량 등록</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label>브랜드</Label>
                <Select value={brand} onValueChange={(v) => setBrand(v as string)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANDS.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="model">모델</Label>
                <Input
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="예: 520i"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="year">연식</Label>
                <Input
                  id="year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="mileage">주행거리 (km)</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(Number(e.target.value))}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="price">월 가격 (원)</Label>
                <Input
                  id="price"
                  type="number"
                  value={monthlyPrice}
                  onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="minMonths">최소 개월</Label>
                <Input
                  id="minMonths"
                  type="number"
                  value={minMonths}
                  onChange={(e) => setMinMonths(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <Label>연료</Label>
                <Select value={fuel} onValueChange={(v) => setFuel(v as string)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FUELS.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>변속기</Label>
                <Select
                  value={transmission}
                  onValueChange={(v) => setTransmission(v as string)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSMISSIONS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="color">색상</Label>
                <Input
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="예: 화이트"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>서비스 유형</Label>
              <Select
                value={serviceType}
                onValueChange={(v) =>
                  setServiceType(v as "subscription" | "rent")
                }
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>포함 항목 / 특징</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>포함 항목 (Enter로 추가)</Label>
              <Input
                value={includeInput}
                onChange={(e) => setIncludeInput(e.target.value)}
                onKeyDown={(e) =>
                  handleTagKeyDown(e, includeInput, setIncludeInput, includes, setIncludes)
                }
                placeholder="예: 보험, 정비, 세금"
              />
              {includes.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {includes.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer gap-1"
                      onClick={() => removeTag(tag, includes, setIncludes)}
                    >
                      {tag}
                      <XIcon className="size-3" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            <div className="flex flex-col gap-1.5">
              <Label>차량 특징 (Enter로 추가)</Label>
              <Input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) =>
                  handleTagKeyDown(e, featureInput, setFeatureInput, features, setFeatures)
                }
                placeholder="예: 네비게이션, 후방카메라, 열선시트"
              />
              {features.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {features.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer gap-1"
                      onClick={() => removeTag(tag, features, setFeatures)}
                    >
                      {tag}
                      <XIcon className="size-3" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>이미지</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 py-6 text-sm text-muted-foreground transition-colors hover:border-muted-foreground/50">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading ? (
                "업로드 중..."
              ) : (
                <>
                  <UploadIcon className="size-4" />
                  이미지 업로드 (여러 장 선택 가능)
                </>
              )}
            </label>
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {images.map((url, idx) => (
                  <div key={idx} className="group relative aspect-video overflow-hidden rounded-lg border">
                    <img
                      src={url}
                      alt={`차량 이미지 ${idx + 1}`}
                      className="size-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <XIcon className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {images.length === 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ImageIcon className="size-4" />
                아직 업로드된 이미지가 없습니다.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visibility */}
        <Card>
          <CardHeader>
            <CardTitle>노출 설정</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Label>공개 여부</Label>
              <Switch checked={isVisible} onCheckedChange={setIsVisible} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label>추천 차량</Label>
              <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label>할인 중</Label>
              <Switch checked={isSale} onCheckedChange={setIsSale} />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-2 pb-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/cars")}
          >
            취소
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "등록 중..." : "차량 등록"}
          </Button>
        </div>
      </form>
    </div>
  );
}

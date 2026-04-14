"use client";

import { useEffect, useState, useCallback } from "react";

const slides = [
  {
    title: "프리미엄 중고차, 구독으로 시작하세요",
    subtitle: "보험, 세금, 정비 모두 포함 올인원 서비스",
  },
  {
    title: "4월 특가 프로모션",
    subtitle: "첫 달 구독료 30% 할인",
  },
  {
    title: "번거로운 차량 관리는 이제 그만",
    subtitle: "리레브가 모든 것을 책임집니다",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-background via-secondary to-background">
      <div className="mx-auto flex min-h-[340px] max-w-7xl items-center justify-center px-4 py-20 sm:min-h-[420px] sm:px-6">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex flex-col items-center justify-center px-6 text-center transition-opacity duration-700 ${
              index === current ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {slide.title}
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg lg:text-xl">
              {slide.subtitle}
            </p>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`슬라이드 ${index + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              index === current
                ? "w-7 bg-primary"
                : "w-2.5 bg-muted-foreground/40 hover:bg-muted-foreground/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

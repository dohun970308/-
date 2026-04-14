"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted/30">
        <Image
          src={images[selected]}
          alt={`${alt} - ${selected + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setSelected(idx)}
              className={cn(
                "relative size-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:size-20",
                idx === selected
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border/60 opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={src}
                alt={`${alt} 썸네일 ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

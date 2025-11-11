"use client"

import * as React from "react"
import Image from "next/image"

import type { ImagePlaceholder } from "@/lib/placeholder-images"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  gallery: ImagePlaceholder[];
}

export function ImageGallery({ gallery }: ImageGalleryProps) {
  const [mainImage, setMainImage] = React.useState(gallery[0]);

  if (!mainImage) return null

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="relative h-[300px] md:h-[550px] w-full overflow-hidden rounded-2xl shadow-2xl shadow-black/20">
            <Image
                src={mainImage.imageUrl}
                alt={mainImage.description}
                fill
                className="object-cover transition-all duration-500 ease-in-out"
                data-ai-hint={mainImage.imageHint}
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {gallery.map((image) => (
            <button
                key={image.id}
                className={cn(
                    "relative aspect-video w-full overflow-hidden rounded-lg transition-all duration-200 hover:ring-2 hover:ring-accent hover:ring-offset-2 hover:ring-offset-background",
                    mainImage.id === image.id && "ring-2 ring-accent ring-offset-2 ring-offset-background"
                )}
                onClick={() => setMainImage(image)}
            >
                <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
                data-ai-hint={image.imageHint}
                />
            </button>
            ))}
      </div>
    </section>
  )
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductImage {
  id: string;
  url: string;
  order: number;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Sort images by order
  const sortedImages = [...images].sort((a, b) => a.order - b.order);
  const selectedImage = sortedImages[selectedIndex];

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? sortedImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === sortedImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <Gallery>
      <div className="space-y-4">
        {/* Main Image Display Area - All images wrapped in Item */}
        <div className="relative group">
          {sortedImages.map((image, index) => (
            <Item
              key={image.id}
              original={image.url}
              thumbnail={image.url}
              width="1200"
              height="1200"
              alt={`${productName} - Image ${index + 1}`}
            >
              {({ ref, open }) => (
                <div
                  ref={ref}
                  onClick={open}
                  className={`relative aspect-square rounded-lg border border-border bg-muted overflow-hidden cursor-pointer ${
                    index === selectedIndex ? 'block' : 'hidden'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`${productName} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                    quality={85}
                  />

                  {/* Navigation Arrows - Only on selected image */}
                  {index === selectedIndex && sortedImages.length > 1 && (
                    <>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevious();
                        }}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext();
                        }}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                </div>
              )}
            </Item>
          ))}
        </div>

        {/* Thumbnail Grid */}
        {sortedImages.length > 1 && (
          <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {sortedImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedIndex(index)}
                className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                  index === selectedIndex
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Image
                  src={image.url}
                  alt={`${productName} - Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </Gallery>
  );
}

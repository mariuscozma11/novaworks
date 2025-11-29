'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { ZoomIn } from 'lucide-react';
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
  const [zoomOpen, setZoomOpen] = useState(false);
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbApi, setThumbApi] = useState<CarouselApi>();

  // Sort images by order
  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  // Sync thumbnail carousel with main carousel
  const handleThumbClick = (index: number) => {
    setSelectedIndex(index);
    mainApi?.scrollTo(index);
  };

  // Listen to carousel changes
  useEffect(() => {
    if (!mainApi) return;

    const onSelect = () => {
      const index = mainApi.selectedScrollSnap();
      setSelectedIndex(index);
      thumbApi?.scrollTo(index);
    };

    mainApi.on('select', onSelect);
    return () => {
      mainApi.off('select', onSelect);
    };
  }, [mainApi, thumbApi]);

  return (
    <div className="space-y-4">
      {/* Main Image Carousel */}
      <div className="relative">
        <Carousel
          setApi={setMainApi}
          className="w-full"
          opts={{ loop: true }}
        >
          <CarouselContent>
            {sortedImages.map((image, index) => (
              <CarouselItem key={image.id}>
                <div className="relative aspect-square rounded-lg border border-border bg-muted overflow-hidden">
                  <Image
                    src={image.url}
                    alt={`${productName} - Image ${index + 1}`}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                  />

                  {/* Zoom Button */}
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 hover:bg-white"
                    onClick={() => setZoomOpen(true)}
                  >
                    <ZoomIn className="h-5 w-5" />
                  </Button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {sortedImages.length > 1 && (
            <>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </>
          )}
        </Carousel>
      </div>

      {/* Thumbnail Navigation */}
      {sortedImages.length > 1 && (
        <Carousel
          setApi={setThumbApi}
          opts={{ dragFree: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {sortedImages.map((image, index) => (
              <CarouselItem key={image.id} className="basis-1/4 md:basis-1/6 pl-2">
                <button
                  onClick={() => handleThumbClick(index)}
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
                    className="object-contain p-2"
                    sizes="100px"
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}

      {/* Zoom Dialog */}
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
          <VisuallyHidden>
            <DialogTitle>Product Image Gallery</DialogTitle>
          </VisuallyHidden>
          <Carousel
            className="w-full h-full"
            opts={{ loop: true, startIndex: selectedIndex }}
          >
            <CarouselContent className="h-full">
              {sortedImages.map((image, index) => (
                <CarouselItem key={image.id} className="h-full">
                  <div className="relative w-full h-full flex items-center justify-center p-8">
                    <Image
                      src={image.url}
                      alt={`${productName} - Image ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="100vw"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {sortedImages.length > 1 && (
              <>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </>
            )}
          </Carousel>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  // CarouselApi,
} from "@/components/ui/carousel";

// --- DEFINE GENERIC PROPS ---
// T is item's type (VD: Product, Image string, Review object...)
interface CarouselTemplateProps<T> {
  data: T[];

  // Hàm render giao diện cho từng item
  renderItem: (item: T, index: number) => React.ReactNode;

  // Cấu hình Responsive (VD: "basis-1/2 lg:basis-1/4")
  itemClassName?: string;

  // Class tùy chỉnh cho container
  className?: string;

  // Cấu hình Autoplay
  autoplay?: boolean;
  autoplayDelay?: number;

  // Có hiển thị nút điều hướng không?
  showNavigation?: boolean;

  // Lấy API của carousel ra ngoài nếu cần điều khiển từ cha
  // setApi?: (api: CarouselApi) => void;
}

function CarouselTemplate<T>({
  data,
  renderItem,
  itemClassName = "basis-full", // Mặc định 1 item 1 hàng
  className,
  autoplay = false,
  autoplayDelay = 3000,
  showNavigation = true,
}: // setApi,
CarouselTemplateProps<T>) {
  // Config Plugin Autoplay
  const plugins = React.useMemo(() => {
    return autoplay
      ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: true })]
      : [];
  }, [autoplay, autoplayDelay]);

  return (
    <Carousel
      // setApi={setApi}
      plugins={plugins}
      opts={{
        align: "start",
        loop: true,
      }}
      className={cn("w-full relative group", className)}
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {data.map((item, index) => (
          <CarouselItem
            key={index}
            className={cn("pl-2 md:pl-4", itemClassName)}
          >
            {/* RENDER */}
            {renderItem(item, index)}
          </CarouselItem>
        ))}
      </CarouselContent>

      {showNavigation && (
        <>
          <CarouselPrevious className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 z-10 translate-x-[-30%] opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 cursor-pointer" />
          <CarouselNext className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 z-10 translate-x-[30%] opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 cursor-pointer" />
        </>
      )}
    </Carousel>
  );
}

export default CarouselTemplate;

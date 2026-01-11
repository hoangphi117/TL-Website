import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface CarouselTemplateProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemClassName?: string;
  className?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  showNavigation?: boolean;
  showDots?: boolean;
}

function CarouselTemplate<T>({
  data,
  renderItem,
  itemClassName = "basis-full",
  className,
  autoplay = false,
  autoplayDelay = 7000,
  showNavigation = true,
  showDots = false,
}: CarouselTemplateProps<T>) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({ delay: autoplayDelay, stopOnInteraction: false })
  );

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className={cn("w-full relative group rounded-xl", className)}>
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        opts={{
          align: "start",
          loop: true,
        }}
        onMouseEnter={autoplay ? () => plugin.current.stop() : undefined}
        onMouseLeave={autoplay ? () => plugin.current.play() : undefined}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {data.map((item, index) => (
            <CarouselItem
              key={index}
              className={cn("pl-2 md:pl-4", itemClassName)}
            >
              {renderItem(item, index)}
            </CarouselItem>
          ))}
        </CarouselContent>

        {showNavigation && (
          <>
            <CarouselPrevious className="hidden bg-white/20 hover:bg-white/40 border-none md:flex absolute -left-9 top-1/2 -translate-y-1/2 h-10 w-10 z-10 cursor-pointer text-white backdrop-blur-sm" />
            <CarouselNext className="hidden bg-white/20 hover:bg-white/40 border-none md:flex absolute -right-9 top-1/2 -translate-y-1/2 h-10 w-10 z-10 cursor-pointer text-white backdrop-blur-sm" />
          </>
        )}
      </Carousel>

      {/* HIỂN THỊ DOTS BÊN TRONG CAROUSEL */}
      {showDots && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm">
          {data.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-1.5 transition-all duration-300 rounded-full",
                current === index ? "bg-red-600 w-6" : "bg-white/50 w-6"
              )}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CarouselTemplate;

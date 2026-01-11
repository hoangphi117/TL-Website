import CarouselTemplate from "@/components/product/carousel/carousel";

const mainBanners = [
  {
    id: 1,
    image:
      "https://cdn.hstatic.net/files/200000722513/file/gearvn-build-pc-sub-banner-t1-26.png",
  },
  {
    id: 2,
    image:
      "https://cdn.hstatic.net/files/200000722513/file/gearvn-ban-phim-sub-banner-t1-26.png",
  },
  {
    id: 3,
    image:
      "https://cdn.hstatic.net/files/200000722513/file/gearvn-laptop-gaming-sub-banner-t1-26.png",
  },
  {
    id: 4,
    image:
      "https://cdn.hstatic.net/files/200000722513/file/gearvn-laptop-van-phong-sub-banner-t1-26.png",
  },
  {
    id: 5,
    image:
      "https://cdn.hstatic.net/files/200000722513/file/gearvn-pc-i5-sub-banner-t1-26.png",
  },
  {
    id: 6,
    image:
      "https://cdn.hstatic.net/files/200000722513/file/gearvn-man-hinh-sub-banner-t1-26.png",
  },
];

function Banner() {
  return (
    <section className="w-full max-w-7xl mx-auto p-2 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2 overflow-hidden rounded-lg shadow-sm">
          <CarouselTemplate
            data={mainBanners}
            autoplay
            autoplayDelay={4000}
            itemClassName="basis-full"
            showDots
            className="h-full"
            renderItem={(item) => (
              <div className="h-[200px] sm:h-[300px] md:h-[400px] w-full">
                <img
                  src={item.image}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  alt="Hero Banner"
                />
              </div>
            )}
          />
        </div>

        <div className="flex flex-row md:flex-col gap-3 overflow-x-auto snap-x snap-mandatory md:overflow-visible no-scrollbar pb-2 md:pb-0">
          {mainBanners.slice(1, 3).map((item) => (
            <div
              key={item.id}
              className="relative min-w-[85%] md:min-w-0 flex-1 overflow-hidden rounded-lg shadow-sm snap-center"
            >
              <img
                src={item.image}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                alt="Sub Banner"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex sm:grid sm:grid-cols-3 gap-3 overflow-x-auto snap-x snap-mandatory sm:overflow-visible no-scrollbar pb-2 sm:pb-0">
        {mainBanners.slice(3, 6).map((item) => (
          <div
            key={item.id}
            className="h-[120px] sm:h-[160px] md:h-[180px] min-w-[70%] sm:min-w-0 overflow-hidden rounded-lg shadow-sm snap-center"
          >
            <img
              src={item.image}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              alt="Bottom Banner"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Banner;

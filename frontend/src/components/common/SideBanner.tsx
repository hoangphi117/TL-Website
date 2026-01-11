import { useEffect, useState } from "react";

interface SideBannerProps {
  position: "left" | "right";
  imgSrc: string;
  alt?: string;
}

const SideBanner: React.FC<SideBannerProps> = ({
  position,
  imgSrc,
  alt = "Side banner",
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const isLeft = position === "left";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`
        hidden xl:flex
        fixed top-1/2
        ${isLeft ? "left-4" : "right-4"}
        z-20
        transition-transform duration-300 ease-out
        ${isScrolled ? "-translate-y-[calc(50%+90px)]" : "-translate-y-1/2"}
      `}
    >
      <div className="w-[100px] h-[360px] rounded shadow-lg overflow-hidden bg-white">
        <img src={imgSrc} alt={alt} className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default SideBanner;

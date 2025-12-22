import { cn } from "@/lib/utils";

export default function Zalo() {
  return (
    <a
      href="https://zalo.me/g/wxvskd604"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed right-3 sm:right-2 z-49 flex flex-col items-end transition-all duration-300",
        "bottom-18 md:bottom-6"
      )}
    >
      <img
        width="60"
        height="60"
        src="https://img.icons8.com/color/96/zalo.png"
        alt="zalo"
      />
    </a>
  );
}

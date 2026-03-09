import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Surface from "./Surface";
import certificates from "../data/certificates.json";

export default function CertificatesSlider({ onSelect }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelectSlide = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelectSlide);
    onSelectSlide();
  }, [emblaApi]);

  // Auto scroll
  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 3500);

    return () => clearInterval(autoplay);
  }, [emblaApi]);

  return (
    <div className="mt-8 w-full relative">
      {/* Slider */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="flex-[0_0_100%] md:flex-[0_0_25%] px-3"
            >
              <Surface
                noPadding
                className="gold-glow cursor-pointer hover:scale-105 transition"
                onClick={() => onSelect(cert)}
              >
                <img
                  src={cert.image}
                  alt={`Certificate ${cert.id}`}
                  className="w-full h-auto object-contain"
                />
              </Surface>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-5 mt-5">
        {/* Prev */}
        <button
          onClick={() => emblaApi && emblaApi.scrollPrev()}
          className="text-xl text-white/70 hover:text-yellow-400 transition"
        >
          ◀
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {certificates.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi && emblaApi.scrollTo(index)}
              className={`w-2.5 h-2.5 rounded-full transition ${
                index === selectedIndex
                  ? "bg-yellow-400 shadow-[0_0_6px_rgba(255,215,0,0.8)]"
                  : "bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => emblaApi && emblaApi.scrollNext()}
          className="text-xl text-white/70 hover:text-yellow-400 transition"
        >
          ▶
        </button>
      </div>
    </div>
  );
}

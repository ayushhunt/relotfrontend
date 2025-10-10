"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Button } from "../ui/Button";
import Image from "next/image";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HeroSlider({ data }) {
  return (
    <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[800px]">
      {/* Background Slideshow */}
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        className="absolute inset-0 w-full h-full z-2000"
      >
        {data.images.map((url, index) => (
          <SwiperSlide key={index} className="relative w-full h-full">
            <div className="absolute inset-0">
              <Image
                src={url}
                alt={`Slide ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100vw"
                quality={90}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/40 px-4 md:px-6 py-8 md:py-0 text-center pointer-events-none">
        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold max-w-3xl leading-tight text-white pointer-events-auto">
          {data.title}
        </h2>
        <p className="text-sm sm:text-base md:text-xl mt-3 md:mt-4 max-w-2xl px-4 text-white/90 pointer-events-auto">
          {data.subtitle}
        </p>
        <Button
          href={data.ctaLink}
          size="lg"
          variant="primary"
          rounded="full"
          className="mt-6 md:mt-8 bg-white text-black hover:bg-gray-100 
                     px-4 sm:px-6 py-2 sm:py-3 md:px-8 md:py-4 
                     text-sm sm:text-base md:text-lg font-medium
                     w-auto mx-4 transition-all duration-300 
                     hover:scale-105 pointer-events-auto"
        >
          {data.ctaText}
        </Button>
      </div>
    </div>
  );
}

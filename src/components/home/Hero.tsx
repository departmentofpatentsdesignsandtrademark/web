import React from 'react';
import { motion } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { useSettings } from '../../context/SettingsContext';

const Hero: React.FC = () => {
  const { settings } = useSettings();
  
  const slides = [
    {
      id: 1,
      title: settings.bannerTitle || "DEFINING MODERN GRACE",
      subtitle: settings.bannerSubtitle || "Experience luxury craftsmanship and traditional aesthetics.",
      image: settings.bannerImageUrl || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2070",
      tag: "Summer Exclusive '24"
    },
    {
      id: 2,
      title: "LUXURY REDEFINED",
      subtitle: "Discover our exclusive artisan collection.",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=2071",
      tag: "Limited Edition"
    }
  ];

  return (
    <section className="relative h-[85vh] overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full flex items-center px-10 md:px-20">
              <div className="absolute inset-0 z-0">
                <img 
                   src={slide.image} 
                   alt={slide.title} 
                   className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>
              </div>
              
              <div className="relative z-20 text-white max-w-2xl">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-4 mb-6"
                >
                  <span className="h-[1px] w-12 bg-emerald-500"></span>
                  <span className="text-emerald-400 text-xs font-bold uppercase tracking-[0.3em]">{slide.tag}</span>
                </motion.div>
                
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8 italic uppercase"
                >
                  {slide.title.split(' ').map((word, i) => (
                    <React.Fragment key={i}>{word}<br/></React.Fragment>
                  ))}
                </motion.h1>
                
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-gray-300 text-base md:text-lg mb-10 max-w-md leading-relaxed"
                >
                  {slide.subtitle}
                </motion.p>
                
                <motion.button 
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-5 font-bold text-sm uppercase tracking-[0.2em] transition-all"
                >
                  Shop the Edit
                </motion.button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;

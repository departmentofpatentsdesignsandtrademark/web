import React, { useEffect, useState } from 'react';
import Hero from '../components/home/Hero';
import ProductCard from '../components/product/ProductCard';
import { motion } from 'motion/react';
import { Product } from '../types';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '../firebase-config/firebase';
import { useSettings } from '../context/SettingsContext';

const Home: React.FC = () => {
  const { settings } = useSettings();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const qFeatured = query(collection(db, 'products'), where('isFeatured', '==', true), limit(4));
        const qTrending = query(collection(db, 'products'), where('isTrending', '==', true), limit(4));
        
        const [snapFeatured, snapTrending] = await Promise.all([
          getDocs(qFeatured),
          getDocs(qTrending)
        ]);
        
        setFeaturedProducts(snapFeatured.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
        setTrendingProducts(snapTrending.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      } catch (error) {
        console.error("Error fetching homepage products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="pb-20">
      <Hero />
      
      {/* Brand Ticker */}
      <div className="bg-zinc-900 overflow-hidden py-6 border-y border-white/5">
        <div className="flex whitespace-nowrap animate-infinite-scroll">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-white/40 mx-8 flex items-center gap-4">
              <span className="w-2 h-2 bg-emerald-500/50 rounded-full"></span>
              SHOUKHIN LUXURY TRADITION
            </span>
          ))}
        </div>
      </div>
      
      {/* Categories Grid */}
      <section className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-md">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-500 mb-4 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-emerald-500"></span>
              The Collection
            </h2>
            <h3 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Curated for<br/>Premium Lifestyles</h3>
          </div>
          <button className="text-[11px] font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-emerald-600 hover:border-emerald-600 transition-all">
            Explore All Categories
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Luxury Cosmetics", img: "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=800", count: "124 Products" },
            { name: "Premium Panjabi", img: "https://images.unsplash.com/photo-1627581561168-e4b2dcd88950?auto=format&fit=crop&q=80&w=800", count: "86 Products" },
            { name: "Designer Accessories", img: "https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=800", count: "42 Products" }
          ].map((cat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group relative h-96 overflow-hidden cursor-pointer"
            >
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-[10px] uppercase tracking-widest mb-1 font-bold text-emerald-400">{cat.count}</p>
                <h4 className="text-2xl font-black uppercase italic tracking-tighter">{cat.name}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Brand Philosophy */}
      <section id="about" className="py-32 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               className="relative z-10 rounded-[40px] overflow-hidden"
            >
              <img 
                src="https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=2000" 
                alt="Craftmanship" 
                className="w-full h-[600px] object-cover"
              />
            </motion.div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-50 rounded-full -z-0"></div>
          </div>
          
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-emerald-600 mb-6 flex items-center gap-3">
                <span className="w-12 h-[1px] bg-emerald-600"></span>
                Since 2024
              </h2>
              <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.8] mb-10">
                Heritage<br/>Meets Modern<br/><span className="text-emerald-600">Elegance</span>
              </h3>
              <p className="text-zinc-500 text-lg leading-relaxed max-w-lg mb-8">
                Shoukhin is more than just a brand; it's a testament to refined taste and artisanal excellence. We curate experiences that celebrate heritage while embracing the sophistication of modern aesthetics.
              </p>
              <ul className="space-y-4">
                {[
                  "Handpicked Premium Fabrics",
                  "Ethically Sourced Luxury Cosmetics",
                  "Bespoke Designer Accessories",
                  "Nationwide Express Delivery"
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-zinc-800"
                  >
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-32 px-6 md:px-10 bg-zinc-900 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.5em] text-emerald-500 mb-8">Join the Inner Circle</h2>
          <h3 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.9] mb-12">
            Stay ahead of<br/>the <span className="text-emerald-500">Luxury</span> curve
          </h3>
          <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="YOUR SECURE EMAIL" 
              className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white text-xs font-bold tracking-widest focus:border-emerald-500 outline-none transition-all"
            />
            <button className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-[0.3em] italic hover:bg-emerald-600 hover:text-white transition-all">
              Initialize
            </button>
          </form>
          <p className="mt-8 text-white/30 text-[10px] font-bold uppercase tracking-widest">
            Privacy Guaranteed | Zero Spam Protocol
          </p>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-gray-400 mb-4">Trending Collections</h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">Best of Shoukhin Selection</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse bg-white p-4 h-[450px] shadow-sm rounded-lg" />
              ))
            ) : (
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Animated Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="glass rounded-[40px] p-12 md:p-24 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="relative z-10 max-w-lg">
              <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-600 mb-6">Promoted Collection</h4>
              <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-8 leading-none">
                {settings.bannerTitle}
              </h2>
              <p className="text-gray-600 text-lg mb-10 leading-relaxed font-medium">
                {settings.bannerSubtitle}
              </p>
              <button className="premium-button bg-emerald-600 hover:bg-emerald-500">Shop Collection</button>
            </div>
            <div className="relative z-10 w-full md:w-1/2 flex justify-center">
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-72 h-96 relative"
              >
                 <img src={settings.bannerImageUrl} className="w-full h-full object-cover shadow-2xl rounded-2xl" alt="Luxe" />
                 <div className="absolute -bottom-6 -right-6 w-32 h-32 glass rounded-2xl p-4 flex flex-col justify-center items-center">
                    <p className="text-emerald-600 font-black text-2xl">৳8,500</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Fixed Price</p>
                 </div>
              </motion.div>
            </div>
            
            {/* Shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px]"></div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-gray-400 mb-4">Customer Selections</h2>
            <h3 className="text-4xl font-black tracking-tighter uppercase italic">Trending in Beauty</h3>
          </div>
          <div className="flex gap-4">
            <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all">&larr;</button>
            <button className="w-12 h-12 rounded-full border border-black flex items-center justify-center bg-black text-white hover:bg-emerald-600 transition-all">&rarr;</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {trendingProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

import React from 'react';
import { motion } from 'motion/react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/product/ProductCard';
import { Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Wishlist() {
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  return (
    <div className="pt-32 pb-24 px-6 md:px-10 max-w-7xl mx-auto">
      <header className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-4">My Wishlist</h1>
          <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Your curated lux collection.</p>
        </motion.div>
      </header>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center bg-gray-50 rounded-[40px]">
          <Heart className="w-16 h-16 text-gray-200 mx-auto mb-8" />
          <h2 className="text-2xl font-black uppercase italic mb-4">Your wishlist is empty</h2>
          <p className="text-gray-400 text-sm mb-10 max-w-xs mx-auto">Discover our collection and save the pieces you love for later.</p>
          <button 
            onClick={() => navigate('/')}
            className="premium-button bg-black hover:bg-emerald-600"
          >
            Start Discovering
          </button>
        </div>
      )}
      
      <div className="mt-20 flex justify-center">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </button>
      </div>
    </div>
  );
}

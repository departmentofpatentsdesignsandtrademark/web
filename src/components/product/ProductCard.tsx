import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const isFavorite = isInWishlist(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeFromWishlist(product.id);
      toast('Removed from wishlist', { icon: '💔' });
    } else {
      addToWishlist(product);
      toast('Added to wishlist!', { icon: '❤️' });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.isFlashSale && product.flashSalePrice ? product.flashSalePrice : product.price,
      quantity: 1,
    });
    toast.success('Added to cart!');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group luxury-card p-4 relative overflow-hidden"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-zinc-50 rounded-2xl">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className={`w-full h-full object-cover transition-all duration-700 ${product.images.length > 1 ? 'group-hover:opacity-0' : 'group-hover:scale-110'}`}
          />
          {product.images.length > 1 && (
            <img 
              src={product.images[1]} 
              alt={`${product.name} alternate`} 
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105"
            />
          )}
          
          {product.discountBadge && (
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-emerald-600 text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest italic">
                {product.discountBadge}
              </span>
            </div>
          )}

          <button 
            onClick={toggleWishlist}
            className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-md rounded-full text-zinc-900 transition-all hover:bg-zinc-900 hover:text-white hover:scale-110 active:scale-95 shadow-sm"
          >
            <Heart size={16} className={isFavorite ? "fill-current" : ""} />
          </button>

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4 backdrop-blur-[2px]">
             <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-black hover:bg-emerald-600 hover:text-white transition-all transform translate-y-8 group-hover:translate-y-0 duration-500 shadow-xl">
                <Eye size={20} />
             </button>
             <button 
                onClick={handleAddToCart}
                className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-black hover:bg-emerald-600 hover:text-white transition-all transform translate-y-8 group-hover:translate-y-0 duration-500 delay-100 shadow-xl"
              >
                <ShoppingCart size={20} />
             </button>
          </div>
        </div>

        <div className="text-center px-2 pb-2">
          <p className="text-[10px] text-emerald-600 uppercase tracking-[0.2em] mb-2 font-black italic">{product.category}</p>
          <h3 className="text-base font-bold tracking-tight mb-3 group-hover:text-emerald-700 transition-colors line-clamp-1 uppercase italic">{product.name}</h3>
          
          <div className="flex justify-center items-center gap-3">
            <span className="text-lg font-black tracking-tighter">
              ৳{(product.isFlashSale && product.flashSalePrice ? product.flashSalePrice : product.price).toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-zinc-400 line-through text-xs font-bold opacity-60">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
      
      <button 
        onClick={handleAddToCart}
        className="w-full mt-6 bg-zinc-900 text-white text-[10px] py-4 uppercase tracking-[0.2em] font-black italic transition-all hover:bg-emerald-600 active:scale-95 rounded-xl shadow-lg shadow-zinc-200"
      >
        Secue Asset (COD)
      </button>
    </motion.div>
  );
};

export default ProductCard;

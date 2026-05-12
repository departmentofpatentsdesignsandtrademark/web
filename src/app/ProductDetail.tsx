import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ChevronLeft, ChevronRight, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config/firebase';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/product/ProductCard';
import { toast } from 'react-hot-toast';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (!id) return;
        const snap = await getDoc(doc(db, 'products', id));
        if (snap.exists()) {
          const pData = { id: snap.id, ...snap.data() } as Product;
          setProduct(pData);
          if (pData.variants.sizes?.length) setSelectedSize(pData.variants.sizes[0]);
          if (pData.variants.colors?.length) setSelectedColor(pData.variants.colors[0].name);

          const q = query(collection(db, 'products'), where('category', '==', pData.category), limit(4));
          const rSnap = await getDocs(q);
          setRelatedProducts(rSnap.docs.filter(doc => doc.id !== id).map(doc => ({ id: doc.id, ...doc.data() } as Product)));
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold tracking-widest text-emerald-600 animate-pulse uppercase">LUMINA LUXURY...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Product Not Found</div>;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.isFlashSale && product.flashSalePrice ? product.flashSalePrice : product.price,
      quantity,
      selectedSize: selectedSize || undefined,
      selectedColor: selectedColor || undefined
    });
    toast.success('Added to cart!');
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-12">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <span className="text-black">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 mb-32">
          <div className="flex flex-col gap-6">
            <div 
              className="relative aspect-[4/5] bg-gray-100 overflow-hidden group cursor-crosshair"
              onMouseMove={(e) => {
                const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                const x = ((e.pageX - left) / width) * 100;
                const y = ((e.pageY - top) / height) * 100;
                const target = e.currentTarget.querySelector('img');
                if (target) {
                  target.style.transformOrigin = `${x}% ${y}%`;
                  target.style.transform = 'scale(2)';
                }
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget.querySelector('img');
                if (target) {
                  target.style.transform = 'scale(1)';
                }
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  src={product.images[activeImage]} 
                  className="w-full h-full object-cover transition-transform duration-200 pointer-events-none" 
                />
              </AnimatePresence>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`w-24 h-24 shrink-0 border-2 transition-all p-1 ${activeImage === i ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

            <div className="flex flex-col">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 leading-none">{product.name}</h1>
              <div className="flex items-center gap-6 mb-8">
                 <span className="text-3xl font-black text-emerald-700">৳{(product.isFlashSale && product.flashSalePrice ? product.flashSalePrice : product.price).toLocaleString()}</span>
              </div>
              <p className="text-gray-500 leading-relaxed max-w-lg mb-8">{product.description}</p>
            </div>

            {/* Colors Selection */}
            {product.variants.colors && product.variants.colors.length > 0 && (
              <div className="mb-8">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Select Color: <span className="text-black">{selectedColor}</span></h3>
                <div className="flex gap-3">
                  {product.variants.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor === color.name ? 'border-black scale-110' : 'border-transparent'}`}
                      title={color.name}
                    >
                      <span 
                        className="w-7 h-7 rounded-full border border-gray-100" 
                        style={{ backgroundColor: color.hex }}
                      ></span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes Selection */}
            {product.variants.sizes && product.variants.sizes.length > 0 && (
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Select Size: <span className="text-black">{selectedSize}</span></h3>
                  <button className="text-[10px] font-bold uppercase tracking-widest border-b border-gray-300 pb-0.5 hover:border-black transition-colors">Size Guide</button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.variants.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-12 border text-xs font-bold uppercase tracking-widest transition-all ${selectedSize === size ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-8 mb-12">
               <div className="flex items-center border border-gray-200 h-14 w-fit rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-14 h-full hover:bg-gray-50 transition-colors font-bold text-xl"
                  >
                    -
                  </button>
                  <span className="w-14 flex items-center justify-center font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-14 h-full hover:bg-gray-50 transition-colors font-bold text-xl"
                  >
                    +
                  </button>
               </div>

                <button onClick={handleAddToCart} className="flex-grow h-14 bg-emerald-600 text-white font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-emerald-500 shadow-xl shadow-emerald-600/20 active:scale-[0.98] transition-transform">
                  <ShoppingBag size={20} /> Add to Cart
                </button>
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-emerald-600">
                        <Truck size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest">Free Shipping</p>
                        <p className="text-xs text-gray-500">On all orders over ৳5000</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-emerald-600">
                        <ShieldCheck size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest">Quality Guaranteed</p>
                        <p className="text-xs text-gray-500">Hand-inspected premium items</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

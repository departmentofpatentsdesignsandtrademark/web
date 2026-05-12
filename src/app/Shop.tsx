import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/product/ProductCard';
import { Filter, X, ChevronDown, SlidersHorizontal, Search } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config/firebase';
import { Product } from '../types';

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter States
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      } catch (err) {
        console.error("Shop fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Derived Filter Options
  const brands = useMemo(() => Array.from(new Set(products.map(p => p.brand || 'Lumina').filter(Boolean))), [products]);
  const colors = useMemo(() => {
     const allColors = products.flatMap(p => p.variants?.colors || []);
     return Array.from(new Set(allColors));
  }, [products]);
  const sizes = useMemo(() => {
     const allSizes = products.flatMap(p => p.variants?.sizes || []);
     return Array.from(new Set(allSizes));
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand || 'Lumina');
      const matchesColor = selectedColors.length === 0 || (p.variants?.colors?.some(c => selectedColors.includes(c)));
      const matchesSize = selectedSizes.length === 0 || (p.variants?.sizes?.some(s => selectedSizes.includes(s)));
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];

      return matchesSearch && matchesBrand && matchesColor && matchesSize && matchesPrice;
    });

    // Sorting
    switch (sortBy) {
      case 'newest':
        // Already sorted by createdAt descending from Firestore, but just in case
        break;
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'featured':
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [products, searchTerm, selectedBrands, selectedColors, selectedSizes, priceRange, sortBy]);

  const toggleFilter = (set: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    set(prev => prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]);
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setPriceRange([0, 50000]);
    setSearchTerm('');
  };

  return (
    <div className="pt-24 min-h-screen bg-white">
      {/* Search & Header */}
      <div className="border-b border-gray-100 py-12 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex-1 w-full md:max-w-xl relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                    type="text" 
                    placeholder="Search for luxury items, brands, collections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-full py-5 px-14 focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all"
                >
                  <SlidersHorizontal size={16} />
                  Filters {selectedBrands.length + selectedColors.length + selectedSizes.length > 0 && `(${selectedBrands.length + selectedColors.length + selectedSizes.length})`}
                </button>
                <div className="relative group min-w-[200px]">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none w-full bg-gray-50 border-none rounded-full py-4 px-10 text-xs font-bold uppercase tracking-widest cursor-pointer focus:ring-2 focus:ring-emerald-500"
                    >
                      {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-32 space-y-12">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">Price Range</h3>
              <div className="space-y-4">
                <input 
                    type="range" 
                    min="0" 
                    max="50000" 
                    step="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-emerald-500"
                />
                <div className="flex justify-between text-xs font-bold font-mono">
                    <span>৳0</span>
                    <span>৳{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 font-bold">Brands</h3>
              <div className="flex flex-wrap gap-2">
                {brands.map(brand => (
                    <button 
                        key={brand}
                        onClick={() => toggleFilter(setSelectedBrands, brand)}
                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${selectedBrands.includes(brand) ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        {brand}
                    </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 font-bold">Sizes</h3>
              <div className="grid grid-cols-2 gap-2">
                {sizes.map(size => (
                    <button 
                        key={size}
                        onClick={() => toggleFilter(setSelectedSizes, size)}
                        className={`py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${selectedSizes.includes(size) ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        {size}
                    </button>
                ))}
              </div>
            </div>

            {selectedBrands.length + selectedColors.length + selectedSizes.length > 0 && (
              <button 
                onClick={clearAllFilters}
                className="w-full py-4 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600 flex items-center justify-center gap-2"
              >
                <X size={14} /> Clear All
              </button>
            )}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array(6).fill(0).map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-50 h-[450px] rounded-[40px]" />
                ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-8">{filteredProducts.length} Results Found</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
                </div>
            </>
          ) : (
            <div className="py-32 text-center">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">No results found</h3>
              <p className="text-gray-400 text-sm mb-8">Try adjusting your filters or search terms.</p>
              <button onClick={clearAllFilters} className="premium-button bg-black">Reset Filters</button>
            </div>
          )}
        </div>
      </div>

       {/* Mobile Filters Modal */}
       <AnimatePresence>
        {showFilters && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            ></motion.div>
            <motion.div 
               initial={{ y: '100%' }}
               animate={{ y: 0 }}
               exit={{ y: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="absolute bottom-0 left-0 right-0 h-[80vh] bg-white rounded-t-[40px] p-10 overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">Filters</h2>
                    <button onClick={() => setShowFilters(false)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <X size={20} />
                    </button>
                </div>
                
                {/* Mobile Filter Content */}
                <div className="space-y-12">
                   {/* Reuse sections from desktop above but adapted */}
                   <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">Price Range</h3>
                        <input 
                            type="range" 
                            min="0" 
                            max="100000" 
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                            className="w-full accent-emerald-500 mb-4"
                        />
                        <div className="flex justify-between text-lg font-black italic">
                            <span>৳0</span>
                            <span className="text-emerald-600">৳{priceRange[1].toLocaleString()}</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">Popular Brands</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {brands.map(brand => (
                                <button 
                                    key={brand}
                                    onClick={() => toggleFilter(setSelectedBrands, brand)}
                                    className={`py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${selectedBrands.includes(brand) ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}
                                >
                                    {brand}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={() => setShowFilters(false)}
                        className="w-full py-6 bg-emerald-600 text-white rounded-2xl font-black uppercase italic tracking-tighter text-xl mt-8"
                    >
                        Apply Filters
                    </button>
                </div>
            </motion.div>
          </div>
        )}
       </AnimatePresence>
    </div>
  );
}

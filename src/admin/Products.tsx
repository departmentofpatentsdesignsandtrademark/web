import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase-config/firebase';
import { Product } from '../types';
import { Package, Search, Plus, Trash2, Edit3, Eye, Layers } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AddProductModal from './AddProductModal';

const ProductsList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setProducts(snap.docs.map(p => ({ id: p.id, ...p.data() } as Product)));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Erase this product from the mainframe?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product eliminated');
    } catch (error) {
      toast.error('Deletion failed');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Vault Inventory</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-600">Product asset management system</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 font-black text-xs uppercase tracking-[0.2em] rounded-2xl flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-emerald-900/20"
        >
          <Plus size={20} />
          Create New Asset
        </button>
      </header>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
        <input 
          type="text" 
          placeholder="Search inventory by title, SKU, or category..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-16 pl-16 pr-8 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-emerald-500 transition-all font-medium"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading ? (
          Array(8).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-white/5 h-[400px] rounded-[32px] border border-white/5" />
          ))
        ) : filteredProducts.length > 0 ? filteredProducts.map((product) => (
          <div key={product.id} className="group bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden hover:border-emerald-500/50 transition-all">
             <div className="relative aspect-[4/5]">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                   <button 
                    onClick={() => openEditModal(product)}
                    className="w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-emerald-600 transition-all"
                   >
                      <Edit3 size={18} />
                   </button>
                   <button 
                    onClick={() => handleDelete(product.id)}
                    className="w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-red-600 transition-all"
                   >
                      <Trash2 size={18} />
                   </button>
                </div>

                <div className="absolute bottom-6 left-6">
                   <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-widest">
                      {product.sku}
                   </span>
                </div>
             </div>
             
             <div className="p-8">
                <div className="flex justify-between items-start mb-4 gap-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-500">{product.category}</p>
                  <p className="text-xl font-black text-white italic tracking-tighter">৳{product.price.toLocaleString()}</p>
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-6 line-clamp-1 group-hover:text-emerald-500 transition-colors uppercase italic">{product.name}</h3>
                
                <div className="flex items-center justify-between border-t border-white/5 pt-6">
                   <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                      <Layers size={14} className="text-emerald-500" />
                      <span>Stock: {product.stock}</span>
                   </div>
                   <div className="flex gap-1">
                      {product.isFeatured && <div className="w-2 h-2 rounded-full bg-emerald-500" title="Featured" />}
                      {product.isTrending && <div className="w-2 h-2 rounded-full bg-blue-500" title="Trending" />}
                      {product.isFlashSale && <div className="w-2 h-2 rounded-full bg-amber-500" title="Flash Sale" />}
                   </div>
                </div>
             </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center text-gray-600 uppercase tracking-widest font-bold">
            Empty Vault. Create assets to secure the future.
          </div>
        )}
      </div>

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchProducts} 
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductsList;

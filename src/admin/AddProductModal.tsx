import React, { useState } from 'react';
import { X, Save, Box, Tag, DollarSign, Image as ImageIcon, Ruler, Palette, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase-config/firebase';
import { toast } from 'react-hot-toast';
import { Product } from '../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product | null;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSuccess, product }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    oldPrice: 0,
    category: '',
    description: '',
    image: '',
    stock: 10,
    isFeatured: false,
    isTrending: false,
  });

  // Effect to populate form if it's an edit
  React.useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        oldPrice: product.originalPrice || 0,
        category: product.category,
        description: product.description || '',
        image: product.images?.[0] || '',
        stock: product.stock || 10,
        isFeatured: !!product.isFeatured,
        isTrending: !!product.isTrending,
      });
    } else {
      setFormData({
        name: '',
        price: 0,
        oldPrice: 0,
        category: '',
        description: '',
        image: '',
        stock: 10,
        isFeatured: false,
        isTrending: false,
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (product) {
        // Update existing
        await updateDoc(doc(db, 'products', product.id), {
          ...formData,
          images: [formData.image],
          originalPrice: formData.oldPrice,
          updatedAt: serverTimestamp()
        });
        toast.success('Asset Securely Updated in Vault');
      } else {
        // Create new
        await addDoc(collection(db, 'products'), { 
          ...formData,
          images: [formData.image],
          originalPrice: formData.oldPrice,
          sku: 'LX-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
          variants: { sizes: ['S', 'M', 'L', 'XL'], colors: [] },
          createdAt: serverTimestamp(), 
          updatedAt: serverTimestamp() 
        });
        toast.success('Asset Securely Added to Vault');
      }
      onSuccess();
      onClose();
    } catch (err) { 
      console.error(err);
      toast.error('System Failure: Encryption Error'); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
       <motion.div 
         initial={{ scale: 0.9, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         className="bg-[#0f1116] border border-zinc-800 rounded-[40px] p-10 w-full max-w-2xl shadow-3xl overflow-y-auto max-h-[90vh] custom-scrollbar"
        >
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-zinc-800">
             <div>
               <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">
                 {product ? 'Edit Asset' : 'Initialize Asset'}
               </h2>
               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em] mt-2">TRICK A4IF INVENTORY VECTOR GENERATOR</p>
             </div>
             <button onClick={onClose} className="p-3 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
               <X className="text-zinc-500" />
             </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                        <Tag size={12} className="text-[#ffcc00]" /> Product Identity
                      </label>
                      <input 
                        className="w-full h-14 bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 text-white text-sm outline-none focus:border-[#ffcc00]" 
                        placeholder="e.g. Premium Silk Panjabi" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        required 
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                        <Box size={12} className="text-[#ffcc00]" /> Category Vector
                      </label>
                      <select 
                        className="w-full h-14 bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 text-white text-sm outline-none focus:border-[#ffcc00]"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                      >
                        <option value="">Select Category</option>
                        <option value="Panjabi">Premium Panjabi</option>
                        <option value="Cosmetics">Luxury Cosmetics</option>
                        <option value="Accessories">Designer Accessories</option>
                      </select>
                   </div>
                </div>

                {/* Pricing & Stock */}
                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                           <DollarSign size={12} className="text-[#ffcc00]" /> Price
                         </label>
                         <input 
                           className="w-full h-14 bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 text-white text-sm outline-none focus:border-[#ffcc00]" 
                           type="number" 
                           value={formData.price} 
                           onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
                           required 
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                           <Percent size={12} className="text-zinc-500" /> Old Price
                         </label>
                         <input 
                           className="w-full h-14 bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 text-white text-sm outline-none focus:border-zinc-700" 
                           type="number" 
                           value={formData.oldPrice} 
                           onChange={e => setFormData({...formData, oldPrice: Number(e.target.value)})} 
                         />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                        <ImageIcon size={12} className="text-[#ffcc00]" /> Primary Image URL
                      </label>
                      <input 
                        className="w-full h-14 bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 text-white text-sm outline-none focus:border-[#ffcc00]" 
                        placeholder="https://images.unsplash.com/..." 
                        value={formData.image} 
                        onChange={e => setFormData({...formData, image: e.target.value})} 
                        required 
                      />
                   </div>
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Asset Specifications (Description)</label>
                <textarea 
                  className="w-full h-32 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-white text-sm outline-none focus:border-[#ffcc00] resize-none" 
                  placeholder="Detail the craftsmanship..." 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
             </div>

             <div className="flex gap-8 p-6 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
                <label className="flex items-center gap-3 cursor-pointer group">
                   <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border border-zinc-700 bg-zinc-800 checked:bg-[#ffcc00] transition-all"
                    checked={formData.isFeatured}
                    onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                   />
                   <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Featured Asset</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                   <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border border-zinc-700 bg-zinc-800 checked:bg-blue-500 transition-all"
                    checked={formData.isTrending}
                    onChange={e => setFormData({...formData, isTrending: e.target.checked})}
                   />
                   <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Trending Vector</span>
                </label>
             </div>

             <button 
               className="w-full h-20 bg-[#ffcc00] hover:bg-[#ffe066] text-black font-black uppercase tracking-[0.3em] rounded-3xl flex items-center justify-center gap-4 transition-all shadow-[0_0_30px_rgba(255,204,0,0.15)] active:scale-[0.98]"
               disabled={loading}
              >
                <Save size={24} /> {loading ? 'SYNCHRONIZING...' : product ? 'COMMIT UPDATES' : 'COMMIT TO DATABASE'}
             </button>
          </form>
       </motion.div>
    </div>
  );
};

export default AddProductModal;

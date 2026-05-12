import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase-config/firebase';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, CreditCard, Truck, CheckCircle2 } from 'lucide-react';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  if (cart.length === 0 && !isSuccess) {
    return (
      <div className="pt-32 pb-24 px-6 text-center">
        <h1 className="text-3xl font-black uppercase italic mb-8">Your cart is empty</h1>
        <button onClick={() => navigate('/shop')} className="premium-button bg-black">Go to Shop</button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.email) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Save to Firestore
      const orderData = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          notes: formData.notes,
        },
        items: cart,
        totalAmount: totalPrice,
        status: 'pending',
        paymentMethod: 'COD',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);

      // 2. Trigger Email Notification (New Feature)
      try {
        await fetch('/api/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              address: formData.address
            },
            items: cart,
            totalAmount: totalPrice
          })
        });
      } catch (emailErr) {
        console.error("Email trigger failed:", emailErr);
      }

      setIsSuccess(true);
      clearCart();
      toast.success("Order placed successfully!");
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="pt-40 pb-32 px-6 flex flex-col items-center text-center max-w-2xl mx-auto">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-10">
            <CheckCircle2 size={48} />
        </div>
        <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-6">Order Received</h1>
        <p className="text-gray-500 mb-12 text-lg">Thank you, {formData.name}! Your order has been placed. We've sent a confirmation to our team and you will receive a call shortly to verify your delivery.</p>
        <button 
          onClick={() => navigate('/')}
          className="premium-button bg-emerald-600 w-full"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-12">Checkout</h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3">Full Name *</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-emerald-500 font-medium" 
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3">Email Address *</label>
                    <input 
                      required
                      type="email"
                      className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-emerald-500 font-medium" 
                      placeholder="yourname@example.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3">Phone Number *</label>
                    <input 
                      required
                      type="tel"
                      className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-emerald-500 font-medium" 
                      placeholder="01XXXXXXXXX"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3">Delivery Address *</label>
                    <textarea 
                      required
                      rows={4}
                      className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-emerald-500 font-medium resize-none" 
                      placeholder="Full delivery address"
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3">Order Notes (Optional)</label>
                    <input 
                      type="text"
                      className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-emerald-500 font-medium" 
                      placeholder="E.g. Apartment number, floor, etc."
                      value={formData.notes}
                      onChange={e => setFormData({...formData, notes: e.target.value})}
                    />
                </div>
            </div>

            <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
                <div className="flex items-center gap-4 text-emerald-700 font-bold mb-2">
                    <Truck size={20} />
                    <span className="uppercase text-xs tracking-widest">Delivery Info</span>
                </div>
                <p className="text-xs text-emerald-600/80 leading-relaxed font-medium">Standard delivery (48-72 hours) across Bangladesh. You pay ৳200 for delivery at the time of receiving the package.</p>
            </div>

            <button 
                disabled={isSubmitting}
                type="submit"
                className="w-full py-6 bg-black text-white rounded-[40px] font-black uppercase italic tracking-tighter text-xl hover:bg-emerald-600 transition-all shadow-xl disabled:bg-gray-400"
            >
                {isSubmitting ? 'Processing...' : `Confirm Order - ৳${totalPrice.toLocaleString()}`}
            </button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:pl-10"
      >
        <div className="sticky top-32">
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Order Summary</h3>
                <span className="text-xs font-bold px-3 py-1 bg-gray-100 rounded-full">{cart.length} Items</span>
            </div>

            <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-4 scrollbar-hide">
                {cart.map((item, idx) => (
                    <div key={`${item.productId}-${idx}`} className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <h4 className="text-sm font-bold tracking-tight mb-1">{item.name}</h4>
                            <div className="flex gap-2">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                                {item.selectedSize && (
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">• Size: {item.selectedSize}</p>
                                )}
                                {item.selectedColor && (
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">• Color: {item.selectedColor}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center">
                            <p className="text-sm font-black italic">৳{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-4">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-widest">Subtotal</span>
                    <span className="font-bold">৳{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-widest">Shipping</span>
                    <span className="text-emerald-600 font-bold uppercase">Pay on Delivery</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Total Due Now</span>
                    <span className="text-4xl font-black uppercase italic tracking-tighter">৳{totalPrice.toLocaleString()}</span>
                </div>
            </div>

            <div className="mt-12 flex items-center gap-4 p-6 bg-gray-50 rounded-2xl">
                <CreditCard className="text-gray-400" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">We exclusively use Cash on Delivery for secure, hassle-free luxury shopping.</p>
            </div>
        </div>
      </motion.div>
    </div>
  );
}

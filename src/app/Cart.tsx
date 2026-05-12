import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart: React.FC = () => {
  const { cart, removeFromCart, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) return <div className="py-20 text-center"><h2 className="text-2xl font-bold">Cart is Empty</h2><Link to="/" className="premium-button mt-8">Shop Now</Link></div>;

  return (
    <div className="bg-white min-h-screen py-12 px-6 md:px-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-black uppercase italic mb-12">My Cart ({totalItems})</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 flex flex-col gap-8">
          {cart.map((item, index) => (
            <div key={`${item.productId}-${item.selectedSize || ''}-${item.selectedColor || ''}-${index}`} className="flex gap-6 p-6 border border-gray-100 items-center">
               <img src={item.image} className="w-24 h-32 object-cover bg-gray-100 rounded-lg" alt={item.name} />
               <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-black italic tracking-tight">{item.name}</h3>
                      <div className="flex gap-4 mt-2">
                        {item.selectedColor && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded">
                            Color: <span className="text-black">{item.selectedColor}</span>
                          </span>
                        )}
                        {item.selectedSize && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded">
                            Size: <span className="text-black">{item.selectedSize}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-lg font-black text-emerald-700">৳{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Quantity: {item.quantity}</span>
                  </div>
               </div>
               <button 
                 onClick={() => removeFromCart(item.productId, item.selectedSize, item.selectedColor)}
                 className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
                >
                  <Trash2 size={18} />
                </button>
            </div>
          ))}
        </div>
        <div className="glass p-8 rounded-[40px] h-fit">
           <h2 className="text-xl font-black mb-8">Summary</h2>
           <div className="flex justify-between font-black text-2xl border-t pt-8"><span>Total</span><span>৳{totalPrice.toLocaleString()}</span></div>
           <button onClick={() => navigate('/checkout')} className="w-full premium-button bg-emerald-600 mt-8">Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

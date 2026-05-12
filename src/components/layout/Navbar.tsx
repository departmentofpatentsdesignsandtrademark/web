import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { cn } from '../../lib/utils';
import { useSettings } from '../../context/SettingsContext';

export default function Navbar() {
  const { settings } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-zinc-900 text-white py-2.5 px-6 flex justify-center items-center overflow-hidden fixed top-0 left-0 w-full z-[60]">
        <div className="flex whitespace-nowrap animate-infinite-scroll">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-[9px] font-black uppercase tracking-[0.4em] italic flex items-center gap-6 mx-10">
              <span className="text-emerald-500">âœ§</span>
              EID-UL-ADHA SPECIAL: FREE SHIPPING ALL OVER BANGLADESH
              <span className="opacity-30">|</span>
              LIMITED COLLECTIONS NOW LIVE
            </span>
          ))}
        </div>
      </div>

      <header
        className={cn(
          'fixed top-10 left-0 w-full z-50 transition-all duration-300',
          isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-zinc-100 py-4 shadow-sm' : 'bg-transparent py-6'
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <button 
            className="md:hidden p-2 -ml-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <nav className="hidden md:flex items-center space-x-10">
            <Link to="/shop" className="text-xs font-semibold uppercase tracking-[0.2em] hover:text-zinc-500 transition-colors">Shop</Link>
            <Link to="/#collections" className="text-xs font-semibold uppercase tracking-[0.2em] hover:text-zinc-500 transition-colors">Collections</Link>
            <Link to="/#about" className="text-xs font-semibold uppercase tracking-[0.2em] hover:text-zinc-500 transition-colors">About</Link>
          </nav>

          <Link to="/" className="absolute left-1/2 -translate-x-1/2 group">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.siteTitle} className="h-8 md:h-12 w-auto object-contain" />
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-serif font-black tracking-[0.2em] text-zinc-900 uppercase leading-none">
                   {settings.siteTitle?.split(' - ')[0] || 'Shoukhin'}
                </span>
                <span className="text-[10px] md:text-[12px] font-medium tracking-[0.4em] text-emerald-600 uppercase mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  {settings.siteTitle?.split(' - ')[1] || 'শৌখিন'}
                </span>
              </div>
            )}
          </Link>

          <div className="flex items-center space-x-3 md:space-x-6">
            <button className="p-2 hover:bg-zinc-100 rounded-full transition-colors hidden sm:block">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/admin" className="p-2 hover:bg-zinc-100 rounded-full transition-colors hidden sm:block">
              <User className="w-5 h-5" />
            </Link>
            <Link to="/wishlist" className="p-2 hover:bg-zinc-100 rounded-full transition-colors relative">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-3 h-3 bg-zinc-900 border-2 border-white rounded-full"></span>
              )}
            </Link>
            <button 
              onClick={() => navigate('/cart')}
              className="p-2 hover:bg-zinc-100 rounded-full transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-zinc-900 text-white text-[10px] flex items-center justify-center rounded-full leading-none">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[60]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-12">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt={settings.siteTitle} className="h-8 w-auto object-contain" />
                ) : (
                  <div className="flex flex-col">
                    <span className="text-xl font-serif font-black tracking-widest uppercase leading-none">
                      {settings.siteTitle?.split(' - ')[0]}
                    </span>
                    <span className="text-[10px] tracking-[0.2em] text-emerald-600 font-bold uppercase mt-1">
                       {settings.siteTitle?.split(' - ')[1]}
                    </span>
                  </div>
                )}
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col space-y-8">
                <Link to="/" className="text-lg font-medium tracking-tight">Home</Link>
                <Link to="/shop" className="text-lg font-medium tracking-tight">Shop All</Link>
                <Link to="/shop?category=new" className="text-lg font-medium tracking-tight">New Arrivals</Link>
                <Link to="/shop?category=best" className="text-lg font-medium tracking-tight">Best Sellers</Link>
                <Link to="/wishlist" className="text-lg font-medium tracking-tight">My Wishlist</Link>
                <Link to="/admin" className="text-lg font-medium tracking-tight">Admin Login</Link>
              </div>

              <div className="mt-12 pt-8 border-t border-zinc-100">
                <p className="text-sm text-zinc-500 mb-4">Contact us</p>
                <p className="text-lg">support@lumina.luxury</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

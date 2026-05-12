import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../product/ProductCard';
import { Product } from '../../types';
import { cn } from '../../lib/utils';

// Mock data if no products provided
const mockProducts: any[] = [
  {
    id: '1',
    name: 'Silk Evening Gown',
    price: 45000,
    images: ['https://images.unsplash.com/photo-1539109132314-d4a8c62e4042?q=80&w=1974'],
    categoryId: 'clothing',
    stock: 5,
    status: 'active'
  },
  {
    id: '2',
    name: 'Eclat Rose Perfume',
    price: 12500,
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2004'],
    categoryId: 'beauty',
    stock: 12,
    status: 'active'
  },
  {
    id: '3',
    name: 'Velvet Clutch Bag',
    price: 8900,
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935'],
    categoryId: 'accessories',
    stock: 8,
    status: 'active'
  },
  {
    id: '4',
    name: 'Gold Embellished Heels',
    price: 18000,
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c35dd2?q=80&w=2080'],
    categoryId: 'fashion',
    stock: 3,
    status: 'active'
  }
];

export default function FeaturedProducts({ products, title, bg = 'bg-white' }: { products: Product[], title: string, bg?: string }) {
  const displayProducts = products.length > 0 ? products : mockProducts;

  return (
    <section className={cn('section-padding', bg)}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">Our Selection</span>
            <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight">{title}</h2>
          </div>
          <Link to="/shop" className="hidden md:flex items-center text-xs font-bold uppercase tracking-widest group border-b border-zinc-200 pb-2 hover:border-zinc-900 transition-all">
            See All products 
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12 md:gap-y-16">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-16 text-center md:hidden">
          <Link to="/shop" className="luxury-button-outline w-full">View All</Link>
        </div>
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import { Category } from '../../types';

const defaultCategories: Category[] = [
  { id: '1', name: 'Apparel', image: 'https://images.unsplash.com/photo-1445205170230-053b830c6050?q=80&w=2071' },
  { id: '2', name: 'Cosmetics', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2070' },
  { id: '3', name: 'Accessories', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935' },
  { id: '4', name: 'Signature', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2004' },
];

export default function Categories({ categories }: { categories: Category[] }) {
  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="section-padding bg-zinc-50" id="collections">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-400 mb-4">Curated Curations</h2>
          <p className="text-3xl md:text-5xl font-serif font-light">The Collections</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayCategories.map((category) => (
            <Link 
              key={category.id} 
              to={`/shop?category=${category.name.toLowerCase()}`}
              className="group relative h-[450px] overflow-hidden"
            >
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.3]"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500" />
              <div className="absolute inset-x-8 bottom-8 text-white space-y-2">
                <h3 className="text-2xl font-serif italic tracking-wide">{category.name}</h3>
                <div className="h-[1px] w-0 bg-white group-hover:w-full transition-all duration-700" />
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-700">Explore Collection</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

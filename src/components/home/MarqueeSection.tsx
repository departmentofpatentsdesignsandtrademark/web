export default function MarqueeSection() {
  const words = ['Timeless Elegance', 'Modern Sophistication', 'Crafted Luxury', 'Premium Lifestyle', 'Signature Style'];
  
  return (
    <div className="bg-zinc-900 py-6 border-y border-white/5 overflow-hidden whitespace-nowrap">
      <div className="flex animate-marquee">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex">
            {words.map((word) => (
              <span 
                key={word} 
                className="text-white/20 text-xs font-bold uppercase tracking-[0.5em] px-12 italic"
              >
                {word}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BannerSection({ title, subtitle, image }: { title: string, subtitle: string, image: string }) {
  return (
    <section className="section-padding overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative h-[600px] md:h-[500px] bg-zinc-950 flex flex-col md:flex-row items-stretch overflow-hidden group">
          <div className="flex-1 p-12 md:p-24 flex flex-col justify-center space-y-8 z-10">
            <span className="text-white/60 text-xs font-bold uppercase tracking-[0.4em]">{subtitle}</span>
            <h2 className="text-4xl md:text-6xl font-serif italic text-white leading-tight tracking-wide">{title}</h2>
            <div>
              <button className="luxury-button bg-white text-zinc-900 border-none hover:bg-zinc-200">
                Discover More
              </button>
            </div>
          </div>
          <div className="flex-1 relative overflow-hidden">
            <img 
              src={image} 
              alt={title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 grayscale-[0.2]"
            />
          </div>
          
          {/* Decorative detail */}
          <div className="absolute top-0 right-0 p-8 hidden lg:block opacity-20">
            <span className="text-[100px] font-serif italic text-white leading-none">L</span>
          </div>
        </div>
      </div>
    </section>
  );
}

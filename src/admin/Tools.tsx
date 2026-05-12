import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wrench, 
  Copy, 
  Download, 
  RotateCcw, 
  FileText, 
  Ticket, 
  Globe, 
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ToolCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-10 flex flex-col gap-8 h-full">
    <div className="flex items-center gap-4 text-emerald-500 mb-2">
       <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
          {icon}
       </div>
       <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">{title}</h3>
    </div>
    {children}
  </div>
);

const Tools: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success('Copied to system memory');
    setTimeout(() => setCopied(null), 2000);
  };

  // Tool 1: TM Generator
  const [tmName, setTmName] = useState('');
  const [tmResult, setTmResult] = useState('');
  const generateTM = () => {
    if (!tmName) return;
    setTmResult(`${tmName.toUpperCase()}™`);
    toast.success('Trademarks protection generated');
  };

  // Tool 2: Coupon Generator
  const [couponPrefix, setCouponPrefix] = useState('LX');
  const [couponAmount, setCouponAmount] = useState('20');
  const [couponResult, setCouponResult] = useState('');
  const generateCoupon = () => {
    const code = `${couponPrefix}${Math.random().toString(36).substring(2, 6).toUpperCase()}${couponAmount}`;
    setCouponResult(code);
    toast.success('Discount vector synthesized');
  };

  // Tool 3: SEO Generator
  const [seoTitle, setSeoTitle] = useState('');
  const [seoResult, setSeoResult] = useState('');
  const generateSEO = () => {
    if (!seoTitle) return;
    setSeoResult(`<title>${seoTitle} | Lumina Luxury Premium E-commerce</title>\n<meta name="description" content="Discover exclusive ${seoTitle} at Lumina Luxury. Premium quality fashion and beauty items in Bangladesh.">`);
    toast.success('Metadata optimization complete');
  };

  return (
    <div className="flex flex-col gap-10 pb-20">
      <header>
        <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Advanced Systems Forge</h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-600">Premium tactical utility modules</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* TM Generator */}
        <ToolCard title="TM Generator" icon={<Check size={24} />}>
           <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Brand Name</label>
                 <div className="flex gap-4">
                    <input 
                      type="text" 
                      value={tmName}
                      onChange={e => setTmName(e.target.value)}
                      placeholder="Lumina Luxury"
                      className="h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-emerald-500 transition-all font-bold flex-grow"
                    />
                    <button onClick={generateTM} className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white hover:bg-emerald-500 transition-all shrink-0">
                       <RotateCcw size={20} />
                    </button>
                 </div>
              </div>
              {tmResult && (
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                   <p className="text-white font-black text-lg">{tmResult}</p>
                   <button onClick={() => handleCopy(tmResult, 'tm')} className="text-emerald-500 hover:text-emerald-400">
                      {copied === 'tm' ? <Check size={20} /> : <Copy size={20} />}
                   </button>
                </div>
              )}
           </div>
        </ToolCard>

        {/* Coupon Generator */}
        <ToolCard title="Coupon Synthesis" icon={<Ticket size={24} />}>
          <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Prefix</label>
                  <input 
                    type="text" 
                    value={couponPrefix}
                    onChange={e => setCouponPrefix(e.target.value)}
                    className="h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-emerald-500 transition-all font-bold"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Amount</label>
                  <input 
                    type="text" 
                    value={couponAmount}
                    onChange={e => setCouponAmount(e.target.value)}
                    className="h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-emerald-500 transition-all font-bold"
                  />
                </div>
              </div>
              <button 
                onClick={generateCoupon}
                className="h-14 bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-emerald-500 transition-all"
              >
                Generate Vector Code
              </button>
              {couponResult && (
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                   <p className="text-white font-mono font-black text-xl tracking-widest">{couponResult}</p>
                   <button onClick={() => handleCopy(couponResult, 'coupon')} className="text-emerald-500 hover:text-emerald-400">
                      {copied === 'coupon' ? <Check size={20} /> : <Copy size={20} />}
                   </button>
                </div>
              )}
           </div>
        </ToolCard>

        {/* SEO Meta Generator */}
        <ToolCard title="SEO Metaforge" icon={<Globe size={24} />}>
           <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Target Keywords</label>
                 <div className="flex gap-4">
                    <input 
                      type="text" 
                      value={seoTitle}
                      onChange={e => setSeoTitle(e.target.value)}
                      placeholder="Summer Silk Collection"
                      className="h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-emerald-500 transition-all font-bold flex-grow"
                    />
                    <button onClick={generateSEO} className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white hover:bg-emerald-500 transition-all shrink-0">
                       <RotateCcw size={20} />
                    </button>
                 </div>
              </div>
              {seoResult && (
                <div className="relative group">
                   <textarea 
                     readOnly
                     value={seoResult}
                     className="w-full h-40 p-6 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-mono text-gray-400 outline-none resize-none"
                   />
                   <button 
                    onClick={() => handleCopy(seoResult, 'seo')}
                    className="absolute top-4 right-4 text-emerald-500 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all"
                   >
                     {copied === 'seo' ? <Check size={20} /> : <Copy size={20} />}
                   </button>
                </div>
              )}
           </div>
        </ToolCard>

        {/* Invoice Helper (Mock) */}
        <ToolCard title="Invoice Engine" icon={<FileText size={24} />}>
           <div className="flex flex-col gap-6">
              <p className="text-xs text-gray-500 leading-relaxed italic">
                 Automatically generate premium PDF invoices for all successful deliveries. Linked to global order IDs.
              </p>
              <div className="grid grid-cols-2 gap-4">
                 <button className="h-24 bg-white/5 border border-white/10 rounded-[28px] flex flex-col items-center justify-center gap-2 hover:bg-emerald-600/10 hover:border-emerald-500/50 transition-all">
                    <Download size={20} className="text-emerald-500" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Bulk Export</span>
                 </button>
                 <button className="h-24 bg-white/5 border border-white/10 rounded-[28px] flex flex-col items-center justify-center gap-2 hover:bg-emerald-600/10 hover:border-emerald-500/50 transition-all">
                    <RotateCcw size={20} className="text-blue-500" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Reset Counters</span>
                 </button>
              </div>
           </div>
        </ToolCard>
      </div>
    </div>
  );
};

export default Tools;

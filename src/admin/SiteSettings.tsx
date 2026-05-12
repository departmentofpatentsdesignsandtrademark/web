import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Save, Globe, Image as ImageIcon, Type, Phone, MapPin, Palette, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

export default function SiteSettings() {
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings(localSettings);
      toast.success('Site Configuration Updated');
    } catch (err) {
      toast.error('Update Failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setLocalSettings(settings);
  };

  return (
    <div className="space-y-8 bg-[#0a0c10] min-h-screen p-8 text-white font-mono">
      {/* Header Panel */}
      <div className="flex justify-between items-center bg-[#11141b] p-6 border border-zinc-800 rounded-xl shadow-2xl">
        <div>
          <h1 className="text-2xl font-black text-[#ffcc00] tracking-tighter uppercase italic flex items-center gap-3">
            <Globe className="animate-pulse" /> Advanced Control Panel
          </h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] mt-1">TRICK A4IF TRADEMARK CONTROL WORKSPACE</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleReset}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded flex items-center gap-2 transition-all"
          >
            <RefreshCw size={14} /> RESET
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-[#ffcc00] hover:bg-[#ffe066] text-black text-xs font-black rounded flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,204,0,0.3)]"
          >
            <Save size={14} /> {isSaving ? 'SYNCING...' : 'LIVE SYNC PANEL'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Core Identity Panel */}
        <div className="bg-[#11141b] border border-zinc-800 rounded-xl overflow-hidden">
          <div className="bg-zinc-900 px-6 py-3 border-b border-zinc-800 flex items-center gap-3">
            <Type size={16} className="text-[#ffcc00]" />
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-300">TRADEMARK INFO (LIVE SYNC)</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-[#ffcc00]">SITE TITLE</label>
                 <input 
                   type="text"
                   value={localSettings.siteTitle}
                   onChange={e => setLocalSettings({...localSettings, siteTitle: e.target.value})}
                   className="w-full bg-[#1a1f29] border border-zinc-700 rounded p-3 text-sm focus:border-[#ffcc00] outline-none transition-all"
                   placeholder="Enter Brand Name"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-[#ffcc00]">ACCENT COLOR</label>
                 <div className="flex gap-2">
                    <input 
                      type="color"
                      value={localSettings.accentColor}
                      onChange={e => setLocalSettings({...localSettings, accentColor: e.target.value})}
                      className="w-12 h-10 bg-transparent border-none cursor-pointer"
                    />
                    <input 
                      type="text"
                      value={localSettings.accentColor}
                      onChange={e => setLocalSettings({...localSettings, accentColor: e.target.value})}
                      className="flex-grow bg-[#1a1f29] border border-zinc-700 rounded p-2 text-xs uppercase"
                    />
                 </div>
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-[#ffcc00]">LOGO IMAGE URL</label>
              <div className="flex gap-4">
                <input 
                   type="text"
                   value={localSettings.logoUrl}
                   onChange={e => setLocalSettings({...localSettings, logoUrl: e.target.value})}
                   className="flex-grow bg-[#1a1f29] border border-zinc-700 rounded p-3 text-sm focus:border-[#ffcc00] outline-none"
                   placeholder="https://..."
                />
                {localSettings.logoUrl && (
                  <div className="w-12 h-12 bg-white rounded border border-zinc-700 p-1">
                    <img src={localSettings.logoUrl} className="w-full h-full object-contain" alt="preview" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Global Banner Control */}
        <div className="bg-[#11141b] border border-zinc-800 rounded-xl overflow-hidden">
          <div className="bg-zinc-900 px-6 py-3 border-b border-zinc-800 flex items-center gap-3">
            <ImageIcon size={16} className="text-[#ffcc00]" />
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-300">MAIN HERO BANNER CONTROL</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-[#ffcc00]">BANNER IMAGE URL</label>
              <input 
                type="text"
                value={localSettings.bannerImageUrl}
                onChange={e => setLocalSettings({...localSettings, bannerImageUrl: e.target.value})}
                className="w-full bg-[#1a1f29] border border-zinc-700 rounded p-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-[#ffcc00]">BANNER HEADING</label>
              <input 
                type="text"
                value={localSettings.bannerTitle}
                onChange={e => setLocalSettings({...localSettings, bannerTitle: e.target.value})}
                className="w-full bg-[#1a1f29] border border-zinc-700 rounded p-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-[#ffcc00]">BANNER SUBTITLE</label>
              <textarea 
                value={localSettings.bannerSubtitle}
                onChange={e => setLocalSettings({...localSettings, bannerSubtitle: e.target.value})}
                className="w-full bg-[#1a1f29] border border-zinc-700 rounded p-3 text-sm h-20 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Contact & Legal Panel */}
        <div className="bg-[#11141b] border border-zinc-800 rounded-xl overflow-hidden lg:col-span-2">
          <div className="bg-zinc-900 px-6 py-3 border-b border-zinc-800 flex items-center gap-3">
            <MapPin size={16} className="text-[#ffcc00]" />
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-300">SITE FOOTER & CONTACT INFO</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#ffcc00]">SUPPORT PHONE</label>
                <div className="flex items-center gap-3 bg-[#1a1f29] border border-zinc-700 p-3 rounded">
                  <Phone size={14} className="text-zinc-500" />
                  <input 
                    type="text"
                    value={localSettings.contactPhone}
                    onChange={e => setLocalSettings({...localSettings, contactPhone: e.target.value})}
                    className="bg-transparent outline-none text-sm w-full"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#ffcc00]">BUSINESS ADDRESS</label>
                <div className="flex items-start gap-3 bg-[#1a1f29] border border-zinc-700 p-3 rounded">
                  <MapPin size={14} className="text-zinc-500 mt-1" />
                  <textarea 
                    value={localSettings.contactAddress}
                    onChange={e => setLocalSettings({...localSettings, contactAddress: e.target.value})}
                    className="bg-transparent outline-none text-sm w-full h-24 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
               <div className="p-6 bg-[#1a1f29] rounded-xl border border-zinc-800">
                  <h3 className="text-[#ffcc00] font-black text-xs uppercase mb-4 tracking-tighter">PREVIEW STAMP</h3>
                  <div className="space-y-4 opacity-50 pointer-events-none">
                     <p className="text-[10px] font-bold">Contact: {localSettings.contactPhone}</p>
                     <p className="text-[10px] font-bold">Address: {localSettings.contactAddress}</p>
                     <div className="pt-4 border-t border-zinc-700">
                        <p className="text-[10px] font-black italic">Created by TRICK A4IF</p>
                     </div>
                  </div>
               </div>
               <div className="p-4 border-l-4 border-[#ffcc00] bg-[#1a1f29]">
                  <p className="text-[10px] text-zinc-400 leading-relaxed font-black uppercase italic">
                    SYSTEM AUTHORIZED UNDER TRADEMARK REGISTRY SEC 4IF. ANY UNAUTHORIZED CHANGE IN CORE VECTORS MAY TRIGGER SYNC LAPSES.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

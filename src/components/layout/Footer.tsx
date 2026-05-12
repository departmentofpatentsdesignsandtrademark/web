import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const Footer: React.FC = () => {
  const { settings } = useSettings();
  
  return (
    <footer className="bg-white pt-16 pb-8 px-6 md:px-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div>
          <h3 className="text-2xl font-black tracking-tighter uppercase italic mb-6">
            {settings.siteTitle ? `${settings.siteTitle}.CO`.toUpperCase() : 'SHOUKHIN.CO'}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Defining modern grace through handcrafted excellence and traditional aesthetics. 
            The premier luxury fashion destination in Bangladesh.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all">
              <Twitter size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6">Quick Links</h4>
          <ul className="flex flex-col gap-4 text-sm text-gray-500 font-medium">
            <li><a href="#" className="hover:text-emerald-500 transition-colors">New Arrivals</a></li>
            <li><a href="#" className="hover:text-emerald-500 transition-colors">Collections</a></li>
            <li><a href="#" className="hover:text-emerald-500 transition-colors">Beauty Shop</a></li>
            <li><a href="#" className="hover:text-emerald-500 transition-colors">Special Offers</a></li>
            <li><a href="#" className="hover:text-emerald-500 transition-colors">Check Order</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6">Customer Care</h4>
          <ul className="flex flex-col gap-4 text-sm text-gray-500 font-medium">
            <li><a href="#" className="hover:text-emerald-500 transition-colors">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-emerald-500 transition-colors">Return & Exchange</a></li>
            <li><a href="#" className="hover:text-emerald-500 transition-colors">FAQs</a></li>
            <li><a href="#" className="hover:text-emerald-500 transition-colors">Size Guide</a></li>
            <li><a href="#" className="hover:text-emerald-500 transition-colors">Terms & Conditions</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6">Contact Us</h4>
          <ul className="flex flex-col gap-4 text-sm text-gray-500 font-medium">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-emerald-600 mt-0.5 shrink-0" />
              <span>{settings.contactAddress}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-emerald-600 shrink-0" />
              <span>{settings.contactPhone}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-emerald-600 shrink-0" />
              <span>shoukhin@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-medium tracking-[0.2em] uppercase text-gray-400">
        <div className="flex flex-wrap justify-center gap-8">
          <span>Free Shipping over ৳5000</span>
          <span>7-Day Return Policy</span>
          <span className="text-emerald-500 font-bold">Cash on Delivery (All Over BD)</span>
        </div>
        <div className="text-center md:text-right">
          <p className="opacity-70 italic mb-1">
            Handcrafted Excellence &copy; 2024 {settings.siteTitle || 'SHOUKHIN'}. ALL RIGHTS RESERVED.
          </p>
          <p className="text-emerald-600 font-black tracking-widest text-[8px]">
            CREATED BY TRICK A4IF
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

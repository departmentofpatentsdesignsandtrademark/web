import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, LogOut, Wrench, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const links = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Orders', icon: <ShoppingBag size={20} />, path: '/admin/orders' },
    { name: 'Products', icon: <Package size={20} />, path: '/admin/products' },
    { name: 'Tools', icon: <Wrench size={20} />, path: '/admin/tools' },
    { name: 'Control Panel', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  return (
    <aside className="w-64 h-screen bg-[#0a0a0a] border-r border-white/5 flex flex-col p-8 sticky top-0">
      <div className="mb-16">
        <h1 className="text-xl font-black text-[#ffcc00] italic leading-tight">TRICK A4IF<br/><span className="text-[10px] tracking-[0.3em] uppercase text-white/50 not-italic">Dashboard</span></h1>
      </div>
      <nav className="flex flex-col gap-2 flex-grow">
        {links.map(link => (
          <NavLink key={link.path} to={link.path} className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase ${isActive ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
            {link.icon} {link.name}
          </NavLink>
        ))}
      </nav>
      <button onClick={logout} className="text-red-500 text-xs font-bold uppercase p-4 border border-red-500/20 rounded-xl">Sign Out</button>
    </aside>
  );
};

export default Sidebar;

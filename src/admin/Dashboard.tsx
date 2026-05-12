import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ShieldCheck, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase-config/firebase';
import { toast } from 'react-hot-toast';
import Sidebar from './Sidebar';
import Overview from './Overview';
import Orders from './Orders';
import Products from './Products';
import Tools from './Tools';
import SiteSettings from './SiteSettings';

const Dashboard: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const [registering, setRegistering] = useState(false);
  const navigate = useNavigate();

  const bootstrapAdmin = async () => {
    if (!user) return;
    setRegistering(true);
    try {
      await setDoc(doc(db, 'admins', user.uid), {
        email: user.email,
        assignedAt: serverTimestamp(),
        role: 'SUPER_ADMIN'
      });
      toast.success('Mainframe Registry Updated. Please refresh.');
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error('Bootstrap Sync Failure');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!isAdmin) {
    const isBootstrapEmail = user?.email === 'ali.islam.officials@gmail.com';

    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
         <ShieldCheck size={80} className="text-red-500 mb-8 animate-pulse" />
         <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">ACCESS DENIED</h1>
         <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] max-w-sm leading-relaxed mb-10 text-center">Your identity is verified, but your UID is absent from the administration registry.</p>
         
         <div className="flex flex-col gap-4">
           {isBootstrapEmail && (
             <button 
               onClick={bootstrapAdmin}
               disabled={registering}
               className="px-10 py-5 bg-[#ffcc00] text-black font-black uppercase tracking-[0.3em] rounded-3xl hover:bg-white transition-all italic flex items-center gap-3 shadow-[0_0_30px_rgba(255,204,0,0.2)]"
             >
               <UserPlus size={18} />
               {registering ? 'SYNCHRONIZING...' : 'REGISTER UID IN MAINFRAME'}
             </button>
           )}
           <button 
             onClick={() => navigate('/admin/login')}
             className="px-10 py-5 bg-white text-black font-black uppercase tracking-[0.3em] rounded-3xl hover:bg-emerald-600 hover:text-white transition-all italic"
           >
             Re-authenticate
           </button>
         </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#050505] min-h-screen text-gray-400">
      <Sidebar />
      <main className="flex-grow p-8 md:p-12 overflow-y-auto flex flex-col">
        <div className="flex-grow">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<Products />} />
            <Route path="tools" element={<Tools />} />
            <Route path="settings" element={<SiteSettings />} />
            <Route path="*" element={<Overview />} />
          </Routes>
        </div>
        
        <footer className="mt-20 pt-8 border-t border-white/5 flex justify-between items-center opacity-30">
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">TRADEMARK CONTROL v.1.0.4 </p>
          <p className="text-[10px] font-black italic text-[#ffcc00] tracking-widest uppercase">CREATED BY TRICK A4IF</p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;

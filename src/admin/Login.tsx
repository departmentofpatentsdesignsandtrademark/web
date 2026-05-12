import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ShieldCheck, ArrowLeft, LogIn } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../firebase-config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Verification: Check if user exists in 'admins' collection
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      const isBootstrap = user.email === 'ali.islam.officials@gmail.com';
      
      if (adminDoc.exists() || isBootstrap) {
        toast.success(adminDoc.exists() ? 'Mainframe Access Granted' : 'Initial Admin Access Triggered');
        navigate('/admin');
      } else {
        // Log out unauthorized users immediately
        await auth.signOut();
        toast.error('Access Denied: UID not found in secure registry');
      }
    } catch (err) {
      console.error(err);
      toast.error('System Failure: Authentication Handshake Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-sans">
       <button 
        onClick={() => navigate('/')}
        className="absolute top-10 left-10 flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-zinc-600 hover:text-white transition-all group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Exit to Terminal
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-16">
            <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl relative group overflow-hidden">
                <div className="absolute inset-0 bg-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <ShieldCheck className="w-12 h-12 text-[#ffcc00] relative z-10" />
            </div>
            <h1 className="text-5xl font-black uppercase italic tracking-tighter text-white leading-none">SHOUKHIN<br/><span className="text-emerald-600">CONTROL</span></h1>
            <p className="text-zinc-600 uppercase tracking-[0.6em] text-[8px] font-black mt-6 border-y border-zinc-900 py-3">Biometric & Identity Verification Required</p>
        </div>

        <div className="space-y-8 bg-zinc-900/30 p-10 rounded-[40px] border border-zinc-800 backdrop-blur-xl">
            <div className="text-center">
              <p className="text-zinc-400 text-xs font-bold leading-relaxed">
                Connect your authorized Google identity to synchronize with the administration mainframe.
              </p>
            </div>

            <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full h-20 bg-white text-black rounded-3xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-[#ffcc00] transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] active:scale-[0.98] disabled:opacity-50"
            >
                {loading ? (
                   <span className="flex items-center gap-3">
                     <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                     SYNCHRONIZING...
                   </span>
                ) : (
                  <>
                    <LogIn size={20} />
                    INITIALIZE AUTH
                  </>
                )}
            </button>
            
            <p className="text-[8px] font-black text-center text-zinc-700 uppercase tracking-widest">
              Security Level: ORACLE-7-PROT
            </p>
        </div>

        <p className="text-center text-zinc-800 text-[9px] font-black uppercase tracking-[0.5em] mt-16 animate-pulse">Waiting for authorization packet...</p>
      </div>
    </div>
  );
}

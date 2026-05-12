import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase-config/firebase';

interface SiteSettings {
  siteTitle: string;
  logoUrl: string;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerImageUrl: string;
  contactPhone: string;
  contactAddress: string;
  accentColor: string;
}

const defaultSettings: SiteSettings = {
  siteTitle: 'Shoukhin - শৌখিন',
  logoUrl: '',
  bannerTitle: 'ELEGANCE REIMAGINED',
  bannerSubtitle: 'Discover the pinnacle of luxury craftsmanship and traditional aesthetics.',
  bannerImageUrl: 'https://images.unsplash.com/photo-1490333313164-30ec0d74382c?auto=format&fit=crop&q=80&w=2070',
  contactPhone: '+880 1609 705949',
  contactAddress: 'Shop 06, Mohammad Ali Prodhan Plaza, Boberchor, Gazaria, Munshiganj',
  accentColor: '#059669',
};

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to global settings in Firestore
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings({ ...defaultSettings, ...docSnap.data() } as SiteSettings);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore Settings Permission Error:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      await setDoc(doc(db, 'settings', 'global'), { ...settings, ...newSettings }, { merge: true });
    } catch (error) {
      console.error("Failed to update settings", error);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};

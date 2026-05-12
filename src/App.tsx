/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './app/Home';
import Shop from './app/Shop';
import ProductDetail from './app/ProductDetail';
import Cart from './app/Cart';
import Checkout from './app/Checkout';
import Wishlist from './app/Wishlist';
import Dashboard from './admin/Dashboard';
import Login from './admin/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { SettingsProvider } from './context/SettingsContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/admin/login" />;
  
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/shop" element={<Layout><Shop /></Layout>} />
                <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
                <Route path="/cart" element={<Layout><Cart /></Layout>} />
                <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
                <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />
                
                <Route path="/new" element={<Layout><Home /></Layout>} />
                <Route path="/collections" element={<Layout><Home /></Layout>} />
                <Route path="/beauty" element={<Layout><Home /></Layout>} />
                <Route path="/exclusive" element={<Layout><Home /></Layout>} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<Login />} />
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

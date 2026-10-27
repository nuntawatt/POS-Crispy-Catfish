import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useCartStore, CartDrawer } from '../../features/cart';
import { useAuthStore, LoginModal } from '../../features/auth';
import {
  Utensils,
  ShoppingBag,
  Store,
  ChefHat,
  ShieldCheck,
  Clock,
  Sparkles,
  User,
} from 'lucide-react';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { getItemCount } = useCartStore();
  const { user } = useAuthStore();
  const cartCount = getItemCount();

  const navLinks = [
    { to: '/', label: 'สั่งอาหาร', icon: <Utensils className="w-4 h-4" /> },
    { to: '/history', label: 'ประวัติออเดอร์', icon: <Clock className="w-4 h-4" /> },
    { to: '/pos', label: 'แคชเชียร์ POS', icon: <Store className="w-4 h-4" /> },
    { to: '/kitchen', label: 'คิวห้องครัว KDS', icon: <ChefHat className="w-4 h-4" /> },
    { to: '/admin', label: 'จัดการหลังร้าน', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="font-black text-stone-900 text-base md:text-lg tracking-tight block leading-tight">
                ยำปลาดุกฟู & ข้าวแกง
              </span>
              <span className="text-[10px] text-amber-600 font-bold tracking-wider uppercase block">
                POS-Crispy-Catfish
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* User Role Switcher */}
            <button
              onClick={() => setIsLoginOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-100 flex items-center gap-1.5 transition"
            >
              <User className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline capitalize">{user?.role || 'Guest'}</span>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white shadow-md shadow-amber-500/20 transition flex items-center justify-center"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-stone-900 text-white rounded-full text-[11px] font-black flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden border-t border-stone-100 px-4 py-2 flex items-center gap-1 overflow-x-auto scrollbar-none">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-500 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 text-center text-xs text-stone-500">
        <p className="font-semibold text-stone-700">
          ร้าน ยำปลาดุกฟู & ข้าวแกงรสเด็ด (POS-Crispy-Catfish Platform)
        </p>
        <p className="text-[11px] text-stone-400 mt-1">
          ระบบสั่งอาหารหน้าร้านและออนไลน์ สถาปัตยกรรม React + Go + PostgreSQL
        </p>
      </footer>

      {/* Slide-out Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Switch Role Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
};

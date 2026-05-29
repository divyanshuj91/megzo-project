import React from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { ShoppingCart, User, LogOut, Search, Sun, Moon } from 'lucide-react';

export default function Header({ onOpenProfile }) {
  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('q') || '';
  const isProductPage = location.pathname === '/products';

  const handleSearchChange = (e) => {
    const val = e.target.value;
    if (isProductPage) {
      if (val) {
        setSearchParams({ q: val });
      } else {
        setSearchParams({});
      }
    } else {
      // If not on product page, type to search redirects to product page
      navigate(`/products?q=${encodeURIComponent(val)}`);
    }
  };

  return (
    <header className="glass-header fixed w-full top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-4 shrink-0">
          <span 
            onClick={() => navigate('/')} 
            className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight cursor-pointer hover:opacity-80 transition"
          >
            MEGZO
          </span>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xl mx-2 md:mx-8 bg-[var(--bg-color)] border border-[var(--border-color)] px-4 py-2 focus-within:border-[var(--accent-color)] transition-all flex items-center shadow-inner">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="bg-transparent outline-none w-full placeholder-[var(--text-muted)] text-[var(--text-primary)] text-sm md:text-base border-none"
          />
          <Search className="w-5 h-5 text-[var(--text-muted)] ml-2" />
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-4 shrink-0">
          <nav className="flex items-center gap-6">
            {/* Products link */}
            <span 
              onClick={() => navigate('/products')} 
              className="text-[var(--text-primary)] hover:text-[var(--accent-color)] font-semibold cursor-pointer transition text-sm md:text-base hidden sm:inline"
            >
              Shop
            </span>

            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition p-1 cursor-pointer"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-5.5 h-5.5" /> : <Sun className="w-5.5 h-5.5 text-yellow-500" />}
            </button>

            {/* Cart Icon & Badge */}
            <div 
              onClick={() => navigate('/cart')} 
              className="relative cursor-pointer hover:scale-105 transition p-1"
            >

              <ShoppingCart className="w-6 h-6 text-[var(--text-primary)]" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                  {cart.length}
                </span>
              )}
            </div>

            {/* Auth section */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 font-semibold text-[var(--text-primary)] hover:text-[var(--accent-color)] transition text-sm md:text-base"
                >
                  {user && user.profile_picture ? (
                    <img 
                      src={user.profile_picture} 
                      alt={user.name} 
                      className="w-6 h-6 object-cover border border-[var(--border-color)]"
                      style={{ borderRadius: '50%' }}
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  <span className="hidden md:inline">Profile</span>
                </button>
                <button 
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="text-gray-600 hover:text-red-500 transition p-1"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="btn-custom py-2 px-4 text-xs font-bold tracking-wider uppercase"
              >
                Login
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

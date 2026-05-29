import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag, User, MapPin, Phone, Home } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Shipping Form States
  const [recipientName, setRecipientName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [location, setLocation] = useState('');
  const [orderForSelf, setOrderForSelf] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const tax = subtotal * 0.05; // 5% Tax
  const total = subtotal + tax;

  // Sync autofill when checkbox is toggled or user changes
  useEffect(() => {
    if (orderForSelf && user) {
      setRecipientName(user.name || '');
      setShippingAddress(user.address || '');
      setContactNumber(user.contact_number || '');
      setLocation(user.location || '');
    } else if (!orderForSelf) {
      setRecipientName('');
      setShippingAddress('');
      setContactNumber('');
      setLocation('');
    }
  }, [orderForSelf, user]);

  const handleCheckout = (e) => {
    if (e) e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!recipientName.trim() || !shippingAddress.trim() || !contactNumber.trim() || !location.trim()) {
      alert("Please fill in all shipping details.");
      return;
    }
    
    alert("Order Placed Successfully! Redirecting to home...");
    clearCart();
    navigate('/');
  };

  return (
    <main className="container mx-auto px-6 pt-28 pb-12 flex flex-col lg:flex-row gap-8 min-h-screen fade-in">
      
      {/* Left Column: Cart Items & Shipping Details */}
      <div className="flex-1">
        <h1 className="text-3xl font-serif font-medium mb-6">
          Shopping Cart
        </h1>
        
        {cart.length === 0 ? (
          <div className="glass-card p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto mt-6">
            <ShoppingBag className="w-12 h-12 text-[var(--text-muted)] mb-4" />
            <h3 className="text-xl font-serif font-medium mb-2">Your cart is empty</h3>
            <p className="text-sm text-[var(--text-muted)] mb-6">Looks like you haven't added anything yet.</p>
            <button 
              onClick={() => navigate('/products')}
              className="btn-custom"
            >
              Start Shopping &rarr;
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="flex flex-col border border-[var(--border-color)] bg-[var(--surface-color)] mb-8">
              {cart.map((item, index) => (
                <div 
                  key={item.id || index}
                  className="p-5 flex items-center gap-5 border-b border-[var(--border-color)] last:border-b-0"
                >
                  {/* Image */}
                  <div className="h-20 w-20 flex-shrink-0 bg-[var(--bg-color)] border border-[var(--border-color)] flex items-center justify-center">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-contain p-1"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150';
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between text-sm font-semibold gap-2">
                        <h3 className="leading-tight text-[var(--text-primary)]">{item.name}</h3>
                        <p className="text-base font-bold whitespace-nowrap">₹{item.price.toLocaleString()}</p>
                      </div>
                      <p className="mt-1 text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-wider">{item.category}</p>
                    </div>
                    
                    <div className="flex items-end justify-between text-xs mt-4">
                      <p className="text-[var(--text-secondary)] font-medium">Qty: {item.quantity || 1}</p>
                      <button 
                        type="button" 
                        onClick={() => removeFromCart(item.id, index)} 
                        className="flex items-center gap-1.5 font-semibold text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Form Card */}
            <div className="glass-card p-8 border border-[var(--border-color)]">
              <h2 className="text-xl font-serif font-medium mb-6">Shipping Details</h2>
              
              {isAuthenticated && (
                <label className="flex items-center gap-2 mb-6 cursor-pointer text-xs">
                  <input 
                    type="checkbox" 
                    checked={orderForSelf}
                    onChange={(e) => setOrderForSelf(e.target.checked)}
                    className="border-[var(--border-color)] text-[var(--accent-color)] focus:ring-[var(--accent-color)] h-4 w-4 transition cursor-pointer"
                    style={{ borderRadius: '0px' }}
                  />
                  <span className="font-bold uppercase tracking-wider text-[var(--text-secondary)]">Order for Myself (Autofill profile details)</span>
                </label>
              )}

              <form onSubmit={handleCheckout} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                    <User className="w-3.5 h-3.5" />
                    Recipient Name
                  </label>
                  <input 
                    type="text" 
                    value={recipientName}
                    onChange={(e) => {
                      setRecipientName(e.target.value);
                      if (orderForSelf) setOrderForSelf(false);
                    }}
                    required
                    placeholder="Enter name"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    Location (City / State)
                  </label>
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      if (orderForSelf) setOrderForSelf(false);
                    }}
                    required
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="form-input"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                    <Home className="w-3.5 h-3.5" />
                    Delivery Address
                  </label>
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => {
                      setShippingAddress(e.target.value);
                      if (orderForSelf) setOrderForSelf(false);
                    }}
                    required
                    placeholder="Full shipping address"
                    className="form-input resize-none"
                    rows="2"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                    <Phone className="w-3.5 h-3.5" />
                    Contact Number
                  </label>
                  <input 
                    type="tel" 
                    value={contactNumber}
                    onChange={(e) => {
                      setContactNumber(e.target.value);
                      if (orderForSelf) setOrderForSelf(false);
                    }}
                    required
                    placeholder="Enter 10-digit number"
                    className="form-input"
                  />
                </div>
              </form>
            </div>
          </>
        )}
      </div>

      {/* Right Column: Order Summary */}
      {cart.length > 0 && (
        <div className="lg:w-96">
          <div className="glass-card p-6 sticky top-28">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-4 border-b border-[var(--border-color)] pb-3">
              Order Summary
            </h2>
            
            <div className="flex justify-between mb-3 text-xs font-semibold">
              <span className="text-[var(--text-muted)]">Subtotal</span>
              <span>₹{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            
            <div className="flex justify-between mb-5 text-xs font-semibold">
              <span className="text-[var(--text-muted)]">Tax (5%)</span>
              <span>₹{tax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>

            <div className="border-t border-[var(--border-color)] pt-4 flex justify-between items-center mb-6">
              <span className="text-sm font-bold">Total</span>
              <span className="text-xl font-bold text-[var(--accent-color)]">
                ₹{total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </span>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full btn-custom py-3.5 text-xs font-bold tracking-wider uppercase"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

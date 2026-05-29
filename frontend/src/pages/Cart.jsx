import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const tax = subtotal * 0.05; // 5% Tax
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    // The specific alert message requested
    alert("Order Placed Successfully! Redirecting to home...");
    
    // Clear the cart
    clearCart();
    
    // Redirect to home
    navigate('/');
  };

  return (
    <main className="container mx-auto px-4 pt-28 pb-12 flex flex-col lg:flex-row gap-8 min-h-screen fade-in">
      
      {/* Left Column: Cart Items */}
      <div className="flex-1">
        <h1 className="text-3xl font-extrabold text-white mb-6 drop-shadow-md">
          Shopping Cart
        </h1>
        
        {cart.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl text-center flex flex-col items-center justify-center max-w-xl mx-auto mt-6">
            <ShoppingBag className="w-16 h-16 text-gray-700/60 mb-4 animate-bounce" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6 font-medium">Looks like you haven't added anything yet.</p>
            <button 
              onClick={() => navigate('/products')}
              className="btn-custom bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition"
            >
              Start Shopping &rarr;
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {cart.map((item, index) => (
              <div 
                key={item.id || index}
                className="glass-card p-4 rounded-2xl flex items-center gap-5 bg-white/60 shadow-sm"
              >
                {/* Image */}
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200/50 bg-white flex items-center justify-center">
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
                    <div className="flex justify-between text-base font-bold text-gray-900 gap-2">
                      <h3 className="leading-tight">{item.name}</h3>
                      <p className="text-lg whitespace-nowrap">₹{item.price.toLocaleString()}</p>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 uppercase font-bold tracking-wider">{item.category}</p>
                  </div>
                  
                  <div className="flex items-end justify-between text-sm mt-4">
                    <p className="text-gray-600 font-medium">Qty: {item.quantity || 1}</p>
                    <button 
                      type="button" 
                      onClick={() => removeFromCart(item.id, index)} 
                      className="flex items-center gap-1.5 font-bold text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Order Summary */}
      {cart.length > 0 && (
        <div className="lg:w-96">
          <div className="glass-card p-6 rounded-2xl sticky top-28 text-gray-900 shadow-md">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-300/50 pb-3 text-gray-800 uppercase tracking-wider text-sm">
              Order Summary
            </h2>
            
            <div className="flex justify-between mb-3 text-sm font-medium">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold text-gray-900">₹{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            
            <div className="flex justify-between mb-5 text-sm font-medium">
              <span className="text-gray-600">Tax (5%)</span>
              <span className="font-bold text-gray-900">₹{tax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>

            <div className="border-t border-gray-300/50 pt-4 flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-gray-800">Total</span>
              <span className="text-2xl font-black text-blue-600">
                ₹{total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </span>
            </div>

            <button 
              onClick={handleCheckout} 
              className="w-full btn-custom bg-yellow-400 hover:bg-yellow-500 text-black py-4 rounded-xl shadow-lg font-bold text-sm tracking-wider"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

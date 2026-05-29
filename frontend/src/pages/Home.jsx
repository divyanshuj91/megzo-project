import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductsApi } from '../services/api';

const LOCAL_FALLBACK_PRODUCTS = [
  { id: 1, title: "Headphones", price: 2999, image_url: "images/wheadphones.png" },
  { id: 2, title: "Smart Watch", price: 4500, image_url: "images/smartwatch.png" },
  { id: 7, title: "Laptop", price: 55000, image_url: "images/laptop.png" },
  { id: 11, title: "Gaming Console", price: 35000, image_url: "images/gamingconsole.png" }
];

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(LOCAL_FALLBACK_PRODUCTS);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const dbProducts = await getProductsApi();
        if (dbProducts && dbProducts.length > 0) {
          // Take first 4 items as featured
          setProducts(dbProducts.slice(0, 4));
        }
      } catch (err) {
        console.warn('API down, using fallback mock data for homepage:', err);
      }
    }
    loadFeatured();
  }, []);

  return (
    <main className="pt-24 pb-12 px-4 container mx-auto fade-in">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="glass-card rounded-[2.5rem] p-12 text-center max-w-4xl mx-auto relative overflow-hidden flex flex-col items-center justify-center">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Big Savings on <span className="text-blue-600 drop-shadow-sm">Electronics</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              Get the best deals on the latest smartphones, laptops, and accessories with our premium collection.
            </p>
            <button 
              className="btn-custom text-lg px-10 py-4" 
              onClick={() => navigate('/products')}
            >
              Shop Now
            </button>
          </div>

          {/* Decorative Circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-red-400/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-8 px-2">
          <h2 className="text-3xl font-extrabold text-white drop-shadow-md">Best of Electronics</h2>
          <button 
            onClick={() => navigate('/products')}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-6 py-2.5 rounded-xl font-bold transition border border-white/20 hover:scale-105"
          >
            View All
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((p, index) => (
            <div
              key={p.id || index}
              onClick={() => navigate('/products')}
              className="glass-card rounded-2xl p-5 flex flex-col h-full bg-white/40 cursor-pointer group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Frame */}
              <div className="aspect-square w-full overflow-hidden rounded-xl bg-white/50 mb-5 relative">
                <img
                  src={p.image || p.image_url}
                  alt={p.name || p.title}
                  className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="flex-grow flex flex-col justify-between">
                <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition">
                  {p.name || p.title}
                </h3>
                <p className="mt-3 text-2xl font-black text-gray-900">
                  ₹{parseFloat(p.price).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

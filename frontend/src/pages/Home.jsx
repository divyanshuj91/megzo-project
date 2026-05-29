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
    <main className="pt-24 pb-12 px-6 container mx-auto fade-in">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="glass-card p-12 text-center max-w-4xl mx-auto relative overflow-hidden flex flex-col items-center justify-center border-t-2 border-t-[var(--accent-color)]">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium mb-6 leading-tight">
              Big Savings on <span className="text-[var(--accent-color)] italic">Electronics</span>
            </h2>
            <p className="text-base md:text-lg opacity-80 mb-8 leading-relaxed">
              Get the best deals on the latest smartphones, laptops, and accessories with our premium collection.
            </p>
            <button 
              className="btn-custom text-base px-8 py-3.5" 
              onClick={() => navigate('/products')}
            >
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-8 px-2">
          <h2 className="text-3xl font-serif font-medium">Best of Electronics</h2>
          <button 
            onClick={() => navigate('/products')}
            className="border border-[var(--border-color)] hover:bg-[var(--accent-bg-light)] hover:border-[var(--accent-color)] text-[var(--text-primary)] px-6 py-2 font-medium transition duration-200"
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
              className="glass-card p-5 flex flex-col h-full cursor-pointer group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Frame */}
              <div className="aspect-square w-full overflow-hidden bg-[var(--bg-color)] mb-5 relative border border-[var(--border-color)] flex items-center justify-center">
                <img
                  src={p.image || p.image_url}
                  alt={p.name || p.title}
                  className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="flex-grow flex flex-col justify-between">
                <h3 className="text-base font-semibold leading-tight group-hover:text-[var(--accent-color)] transition">
                  {p.name || p.title}
                </h3>
                <p className="mt-3 text-xl font-bold">
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

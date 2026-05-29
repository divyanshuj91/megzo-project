import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProductsApi } from '../services/api';
import { SlidersHorizontal, X } from 'lucide-react';

const FALLBACK_PRODUCTS = [
  { id: 1, name: "Headphones", category: "Electronics", price: 2999, image: "images/wheadphones.png" },
  { id: 2, name: "Smart Watch", category: "Accessories", price: 4500, image: "images/smartwatch.png" },
  { id: 3, name: "Modern Camera", category: "Electronics", price: 50000, image: "images/camera.jpg" },
  { id: 4, name: "VR Headset", category: "Electronics", price: 27000, image: "images/vr.jpg" },
  { id: 5, name: "PC Cabinet", category: "Electronics", price: 10000, image: "images/pc cabinet.jpg" },
  { id: 6, name: "Smart Speaker", category: "Electronics", price: 5000, image: "images/speaker.png" },
  { id: 7, name: "Laptop", category: "Electronics", price: 55000, image: "images/laptop.png" },
  { id: 8, name: "Ps5 Controller", category: "Gaming", price: 4500, image: "images/gamecontroller.jpg" },
  { id: 9, name: "Mechanical Keyboard", category: "Electronics", price: 8000, image: "images/keyboard.jpg" },
  { id: 10, name: "Leather Bag", category: "Accessories", price: 3500, image: "images/bag.jpg" },
  { id: 11, name: "Gaming Console", category: "Gaming", price: 35000, image: "images/gamingconsole.png" }
];

export default function ProductListing() {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  // Data State
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [categories, setCategories] = useState(['Electronics', 'Accessories', 'Gaming']);
  
  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortBy, setSortBy] = useState('default');
  
  // UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load from API
  useEffect(() => {
    async function loadData() {
      try {
        const dbProducts = await getProductsApi();
        if (dbProducts && dbProducts.length > 0) {
          // Normalize API fields
          const normalized = dbProducts.map(p => ({
            id: p.id,
            name: p.title || p.name,
            category: p.category_name || 'Electronics',
            price: parseFloat(p.price),
            image: p.image_url || p.image
          }));
          setProducts(normalized);
          
          // Generate unique categories dynamically from API data
          const uniqueCats = [...new Set(normalized.map(p => p.category))];
          setCategories(uniqueCats);
        }
      } catch (err) {
        console.warn('API connection failed, falling back to mock data:', err);
        const uniqueCats = [...new Set(FALLBACK_PRODUCTS.map(p => p.category))];
        setCategories(uniqueCats);
      }
    }
    loadData();
  }, []);

  // Filter & Sort Logic
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesPrice = product.price <= maxPrice;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesCategory && matchesPrice && matchesSearch;
  });

  // Sort
  const sortedProducts = [...filteredProducts];
  if (sortBy === 'price-low') {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  const handleCategoryChange = (catName) => {
    if (selectedCategories.includes(catName)) {
      setSelectedCategories(selectedCategories.filter(c => c !== catName));
    } else {
      setSelectedCategories([...selectedCategories, catName]);
    }
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setMaxPrice(100000);
    setSortBy('default');
  };

  const handleBuyNow = (product) => {
    addToCart(product);
    alert(`Proceeding to checkout for: ${product.name}`);
  };

  return (
    <div className="flex pt-24 min-h-screen container mx-auto px-6 relative">
      
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-[var(--text-primary)] text-[var(--bg-color)] p-4 flex items-center justify-center border border-[var(--border-color)]"
        style={{ borderRadius: '0px' }}
      >
        <SlidersHorizontal className="w-6 h-6" />
      </button>

      {/* Sidebar / Filter Panel */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:block transition-transform duration-300 ease-in-out glass-sidebar h-full overflow-y-auto lg:h-auto lg:overflow-visible lg:bg-transparent lg:border-none lg:shadow-none p-6 lg:p-0 lg:mr-8`}
      >
        {/* Mobile Header for Sidebar */}
        <div className="flex justify-between items-center lg:hidden mb-6">
          <h2 className="text-xl font-serif font-medium">Filters</h2>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="text-[var(--text-muted)] hover:text-red-500 transition p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Sort Option */}
        <div className="mb-8">
          <h3 className="font-semibold text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-3 border-b border-[var(--border-color)] pb-2">
            Sort By
          </h3>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] p-3 focus:outline-none focus:border-[var(--accent-color)] text-sm font-medium transition"
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="font-semibold text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-3 border-b border-[var(--border-color)] pb-2">
            Categories
          </h3>
          <div className="flex flex-col gap-2.5">
            {categories.map((cat, idx) => (
              <label key={idx} className="flex items-center space-x-2.5 cursor-pointer group text-sm">
                <input 
                  type="checkbox" 
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                  className="border-[var(--border-color)] text-[var(--accent-color)] focus:ring-[var(--accent-color)] h-4 w-4 transition cursor-pointer"
                  style={{ borderRadius: '0px' }}
                />
                <span className="text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition">
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <h3 className="font-semibold text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-3 border-b border-[var(--border-color)] pb-2">
            Price Range
          </h3>
          <input 
            type="range" 
            min="0" 
            max="100000" 
            step="500" 
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
            className="w-full h-1 bg-[var(--border-color)] appearance-none cursor-pointer accent-[var(--accent-color)]"
          />
          <div className="flex justify-between text-xs font-semibold mt-3">
            <span>₹0</span>
            <span className="bg-[var(--accent-bg-light)] text-[var(--accent-text-light)] px-2 py-0.5 font-bold">
              ₹{maxPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Reset Button */}
        <button 
          onClick={handleReset} 
          className="w-full py-3 border border-[var(--border-color)] bg-transparent hover:bg-[var(--accent-bg-light)] hover:border-[var(--accent-color)] text-xs font-semibold tracking-wider uppercase transition duration-200"
        >
          Reset Filters
        </button>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        ></div>
      )}

      {/* Main Product Grid */}
      <main className="flex-1 pb-10 fade-in">
        <div className="flex justify-between items-center mb-6 px-1">
          <h1 className="text-2xl md:text-3xl font-serif font-medium">
            Our Products
          </h1>
          <span className="text-xs border border-[var(--border-color)] px-3 py-1.5 text-[var(--text-muted)] font-medium tracking-wider uppercase">
            {searchQuery ? `Search for "${searchQuery}": ` : ''}Showing {sortedProducts.length} items
          </span>
        </div>
        
        {sortedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 glass-card p-12 text-center max-w-lg mx-auto mt-6">
            <p className="text-xl font-serif font-medium mb-2">No products found</p>
            <p className="opacity-80 text-sm">Try adjusting your filter options or search keyword.</p>
            <button 
              onClick={handleReset}
              className="btn-custom mt-6"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product, idx) => (
              <div 
                key={product.id || idx}
                className="glass-card p-4 flex flex-col h-full group"
              >
                {/* Image & Tag */}
                <div className="aspect-square w-full overflow-hidden bg-[var(--bg-color)] mb-4 relative flex items-center justify-center border border-[var(--border-color)]">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-[var(--surface-color)] border border-[var(--border-color)] px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-[var(--text-secondary)]">
                    {product.category}
                  </div>
                </div>
                
                {/* Details */}
                <div className="flex-grow flex flex-col justify-between mb-4">
                  <h3 className="text-sm font-semibold leading-tight group-hover:text-[var(--accent-color)] transition">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-lg font-bold">
                    ₹{product.price.toLocaleString()}
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="pt-3 border-t border-[var(--border-color)] flex flex-col gap-2">
                  <button 
                    onClick={() => {
                      addToCart(product);
                      alert(`${product.name} added to cart!`);
                    }}
                    className="btn-custom w-full py-2.5 text-xs tracking-wider uppercase font-semibold"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => handleBuyNow(product)}
                    className="btn-custom w-full py-2.5 text-xs tracking-wider uppercase font-semibold btn-custom-blue"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

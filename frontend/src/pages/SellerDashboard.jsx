import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  getSellerProductsApi, 
  createProductApi, 
  updateProductApi, 
  deleteProductApi,
  getCategoriesApi 
} from '../services/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Star, 
  X, 
  Sparkles, 
  Check, 
  Tag, 
  Image as ImageIcon 
} from 'lucide-react';

const FALLBACK_SELLER_PRODUCTS = [
  {
    id: 1,
    title: "Premium Smartphone",
    description: "High-performance smartphone with advanced camera system.",
    price: 69999,
    original_price: 79999,
    discount_percentage: 12,
    image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&auto=format&fit=crop",
    category_id: 1,
    rating: 4.8,
    review_count: 120
  },
  {
    id: 3,
    title: "Wireless Headphones",
    description: "Noise-canceling over-ear headphones with immersive sound.",
    price: 14999,
    original_price: 19999,
    discount_percentage: 25,
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop",
    category_id: 1,
    rating: 4.6,
    review_count: 200
  }
];

export default function SellerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated or not a seller
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role !== 'seller') {
      navigate('/profile'); // Redirect customers to their profile
    }
  }, [isAuthenticated, user, navigate]);

  // State Variables
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Accessories' },
    { id: 3, name: 'Gaming' }
  ]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null); // If editing, holds the product object

  // Form Fields
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [categoryId, setCategoryId] = useState('1');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // UI Feedback
  const [feedback, setFeedback] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  // Load seller products & categories
  const loadData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getSellerProductsApi(user.id);
      
      // If PostgreSQL returned records, use them. Otherwise load fallback.
      if (data && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(FALLBACK_SELLER_PRODUCTS.map(p => ({ ...p, seller_id: user.id })));
      }

      const cats = await getCategoriesApi();
      if (cats && cats.length > 0) {
        setCategories(cats);
      }
    } catch (err) {
      console.warn('API error in seller hub. Initializing local mock records.', err);
      setProducts(FALLBACK_SELLER_PRODUCTS.map(p => ({ ...p, seller_id: user.id })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Open Form for Adding New Product
  const handleOpenAdd = () => {
    setEditProduct(null);
    setTitle('');
    setPrice('');
    setOriginalPrice('');
    setDiscountPercentage('');
    setCategoryId(categories[0]?.id || '1');
    setDescription('');
    setImageUrl('');
    setFeedback({ text: '', type: '' });
    setFormOpen(true);
  };

  // Open Form for Editing Existing Product
  const handleOpenEdit = (product) => {
    setEditProduct(product);
    setTitle(product.title || '');
    setPrice(product.price || '');
    setOriginalPrice(product.original_price || '');
    setDiscountPercentage(product.discount_percentage || '');
    setCategoryId(product.category_id || '1');
    setDescription(product.description || '');
    setImageUrl(product.image_url || '');
    setFeedback({ text: '', type: '' });
    setFormOpen(true);
  };

  // Handle Form Submission (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !price || !categoryId) {
      setFeedback({ text: 'Please fill in all required fields.', type: 'error' });
      return;
    }

    setSubmitting(true);
    setFeedback({ text: '', type: '' });

    const payload = {
      title,
      price: parseFloat(price),
      original_price: originalPrice ? parseFloat(originalPrice) : null,
      discount_percentage: discountPercentage ? parseInt(discountPercentage) : null,
      category_id: parseInt(categoryId),
      description,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop',
      seller_id: user.id
    };

    try {
      if (editProduct) {
        // Edit Mode
        await updateProductApi(editProduct.id, payload);
        setFeedback({ text: 'Product updated successfully!', type: 'success' });
      } else {
        // Add Mode
        await createProductApi(payload);
        setFeedback({ text: 'Product added successfully!', type: 'success' });
      }

      // Reload products list & close modal after 1.5s
      setTimeout(() => {
        setFormOpen(false);
        loadData();
      }, 1500);
    } catch (err) {
      setFeedback({ text: err.message || 'Error processing request.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Product Deletion
  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product listing?')) return;
    try {
      await deleteProductApi(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      alert('Failed to delete product: ' + err.message);
    }
  };

  // Calculate discount percentage helper
  const calculateDiscount = (pr, orig) => {
    if (!pr || !orig) return;
    const priceVal = parseFloat(pr);
    const origVal = parseFloat(orig);
    if (origVal > priceVal) {
      const percentage = Math.round(((origVal - priceVal) / origVal) * 100);
      setDiscountPercentage(percentage);
    } else {
      setDiscountPercentage('');
    }
  };

  if (!user || user.role !== 'seller') return null;

  return (
    <main className="container mx-auto px-6 pt-28 pb-16 min-h-screen space-y-10 fade-in">
      
      {/* 1. Header & Overview */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--border-color)] pb-6">
        <div>
          <h1 className="text-3xl font-serif font-semibold tracking-tight">Seller Hub</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Manage your listings, review product inventory, and monitor shop analytics.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn-custom py-3 px-6 text-sm font-bold flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </button>
      </div>

      {/* 2. Analytical Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Listings', value: products.length, icon: ShoppingBag, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
          { title: 'Earnings (Mock)', value: '₹1,54,997', icon: DollarSign, color: 'text-green-600 bg-green-50 dark:bg-green-950/20' },
          { title: 'Average Rating', value: '4.7 ★', icon: Star, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/20' },
          { title: 'Units Sold (Mock)', value: '87 items', icon: TrendingUp, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20' }
        ].map((card, idx) => (
          <div key={idx} className="glass-card p-6 flex items-center justify-between border border-[var(--border-color)]">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">{card.title}</span>
              <h3 className="text-2xl font-bold">{card.value}</h3>
            </div>
            <div className={`p-3.5 ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Product Listings Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-serif font-semibold">Your Live Products</h2>
        
        {loading ? (
          <div className="text-center py-12 text-[var(--text-muted)]">Loading listings...</div>
        ) : products.length === 0 ? (
          <div className="glass-card p-12 text-center border border-[var(--border-color)] text-[var(--text-muted)]">
            You haven't listed any products yet. Click "Add New Product" to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="glass-card border border-[var(--border-color)] overflow-hidden flex flex-col justify-between group hover:border-[var(--accent-color)] transition-all duration-300"
              >
                {/* Product Image Panel */}
                <div className="aspect-video bg-[var(--bg-color)] border-b border-[var(--border-color)] flex items-center justify-center relative p-3">
                  <img
                    src={product.image_url || product.image || 'https://via.placeholder.com/300?text=No+Image'}
                    alt={product.title}
                    className="object-cover h-full w-full grayscale-[20%] group-hover:grayscale-0 transition duration-300"
                  />
                  {product.discount_percentage && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white font-black text-[9px] uppercase tracking-widest px-2 py-0.5">
                      {product.discount_percentage}% Off
                    </span>
                  )}
                </div>

                {/* Details Container */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                      <span>{categories.find(c => c.id == product.category_id)?.name || 'Catalog'}</span>
                      <span className="flex items-center gap-0.5 text-yellow-500 font-extrabold">
                        <Star className="w-3 h-3 fill-yellow-500" />
                        {product.rating || '4.0'}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base text-[var(--text-primary)] leading-snug">
                      {product.title}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                      {product.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-[var(--border-color)]">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-[var(--text-primary)]">
                        ₹{parseFloat(product.price).toLocaleString()}
                      </span>
                      {product.original_price && (
                        <span className="text-xs text-[var(--text-muted)] line-through">
                          ₹{parseFloat(product.original_price).toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="p-2 border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] bg-[var(--surface-color)] transition"
                        title="Edit Listing"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 border border-[var(--border-color)] text-[var(--text-muted)] hover:text-red-500 hover:border-red-500 bg-[var(--surface-color)] transition"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. MODAL / DIALOG FORM (ADD & EDIT) */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center glass-overlay px-4">
          <div className="glass-card bg-[var(--surface-color)] border border-[var(--border-color)] w-full max-w-lg overflow-hidden flex flex-col animate-[scaleIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-color)]">
              <h3 className="font-serif font-semibold text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--accent-color)]" />
                {editProduct ? 'Edit Product Listing' : 'Create New Listing'}
              </h3>
              <button 
                onClick={() => setFormOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Scroll Area */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[70vh] flex flex-col gap-5 text-left">
              
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Aura Smartphone 2"
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      calculateDiscount(e.target.value, originalPrice);
                    }}
                    required
                    min="1"
                    placeholder="e.g. 4999"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => {
                      setOriginalPrice(e.target.value);
                      calculateDiscount(price, e.target.value);
                    }}
                    min="1"
                    placeholder="e.g. 9999"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5 mb-1 text-red-500">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(e.target.value)}
                    min="0"
                    max="100"
                    placeholder="Calculated automatically"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="form-input"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                  Product Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="form-input"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                  Product Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product specifications, highlights, warranty, etc."
                  className="form-input resize-none"
                  rows="3"
                />
              </div>

              {/* Status Message feedback */}
              {feedback.text && (
                <div className={`text-xs font-semibold p-3 border ${
                  feedback.type === 'success' 
                    ? 'bg-green-50 dark:bg-green-950/20 text-green-600 border-green-600/25' 
                    : 'bg-red-50 dark:bg-red-950/20 text-[var(--error-color)] border-[var(--error-color)]/25'
                }`}>
                  {feedback.type === 'success' ? <Check className="w-4 h-4 inline mr-2" /> : null}
                  {feedback.text}
                </div>
              )}

              {/* Submission CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-custom py-3.5 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 mt-4"
              >
                {submitting ? 'Processing Request...' : editProduct ? 'Update Listing' : 'Publish Listing'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

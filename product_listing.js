// MOCK DATA
const products = [
    { id: 1, name: "Aesthetic Headphones", category: "Electronics", price: 1500, image: "https://via.placeholder.com/300?text=Headphones" },
    { id: 2, name: "Minimalist Watch", category: "Accessories", price: 2000, image: "https://via.placeholder.com/300?text=Watch" },
    { id: 3, name: "Modern Camera", category: "Electronics", price: 50000, image: "https://via.placeholder.com/300?text=Camera" },
    { id: 4, name: "VR Headset", category: "Electronics", price: 27000, image: "https://via.placeholder.com/300?text=VR" },
    { id: 5, name: "PC Cabinet", category: "Electronics", price: 10000, image: "https://via.placeholder.com/300?text=PC+Case" },
    { id: 6, name: "Smart Speaker", category: "Electronics", price: 5000, image: "https://via.placeholder.com/300?text=Speaker" },
    { id: 7, name: "Laptop", category: "Electronics", price: 65000, image: "https://via.placeholder.com/300?text=Laptop" },
    { id: 8, name: "Ps5 Controller", category: "Gaming", price: 4500, image: "https://via.placeholder.com/300?text=Controller" },
    { id: 9, name: "Mechanical Keyboard", category: "Electronics", price: 8000, image: "https://via.placeholder.com/300?text=Keyboard" },
    { id: 10, name: "Leather Bag", category: "Accessories", price: 3500, image: "https://via.placeholder.com/300?text=Bag" },
];

// STATE
let activeCategories = [];
let maxPrice = 100000;
let sortMode = 'default';

// DOM ELEMENTS
const productGrid = document.getElementById('products-container');
const categoryContainer = document.getElementById('category-filters');
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');
const sortSelect = document.getElementById('sortSelect');
const resultCount = document.getElementById('result-count');
const resetBtn = document.getElementById('resetFilters');

// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    renderProducts(products);
    updateCartCount();
    checkLoginStatus();
    setupMobileSidebar();
});

// --- FILTER & SORT LOGIC ---

function initializeFilters() {
    // 1. Generate Category Checkboxes dynamically
    const categories = [...new Set(products.map(p => p.category))];
    
    categoryContainer.innerHTML = categories.map(cat => `
        <label class="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" value="${cat}" class="category-checkbox form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500">
            <span class="text-gray-800 text-sm font-medium hover:text-blue-600 transition">${cat}</span>
        </label>
    `).join('');

    // 2. Add Event Listeners for Categories
    document.querySelectorAll('.category-checkbox').forEach(cb => {
        cb.addEventListener('change', () => {
            activeCategories = Array.from(document.querySelectorAll('.category-checkbox:checked')).map(cb => cb.value);
            applyFilters();
        });
    });

    // 3. Price Range Listener
    priceRange.addEventListener('input', (e) => {
        maxPrice = parseInt(e.target.value);
        priceValue.textContent = `₹${maxPrice}`;
        applyFilters();
    });

    // 4. Sort Listener
    sortSelect.addEventListener('change', (e) => {
        sortMode = e.target.value;
        applyFilters();
    });

    // 5. Reset Listener
    resetBtn.addEventListener('click', () => {
        // Reset inputs
        document.querySelectorAll('.category-checkbox').forEach(cb => cb.checked = false);
        priceRange.value = 100000;
        priceValue.textContent = '₹100000';
        sortSelect.value = 'default';
        
        // Reset State
        activeCategories = [];
        maxPrice = 100000;
        sortMode = 'default';
        
        applyFilters();
    });
}

function applyFilters() {
    let filtered = products.filter(product => {
        const matchesCategory = activeCategories.length === 0 || activeCategories.includes(product.category);
        const matchesPrice = product.price <= maxPrice;
        return matchesCategory && matchesPrice;
    });

    // Apply Sorting
    if (sortMode === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortMode === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
    }

    // Update UI
    resultCount.textContent = `Showing ${filtered.length} items`;
    renderProducts(filtered);
}

// --- RENDER FUNCTIONS ---

function renderProducts(items) {
    productGrid.innerHTML = ''; 

    if (items.length === 0) {
        productGrid.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center text-white py-12">
                <p class="text-xl font-bold mb-2">No products found</p>
                <p class="opacity-80">Try adjusting your price range or categories.</p>
            </div>`;
        return;
    }

    items.forEach(product => {
        const card = document.createElement('div');
        // Added animation class 'fade-in'
        card.className = 'glass-card rounded-2xl p-4 flex flex-col h-full bg-white/40 fade-in';

        card.innerHTML = `
        <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 mb-4 relative group">
            <img src="${product.image}" 
                 alt="${product.name}" 
                 class="h-48 w-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                 onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
                
            <div class="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-bold shadow-sm text-gray-800">
                    ${product.category}
            </div>
        </div>
        
        <div class="flex-grow">
             <h3 class="text-lg font-semibold text-gray-900 leading-tight">${product.name}</h3>
             <p class="mt-2 text-xl font-bold text-gray-900">₹${product.price.toLocaleString()}</p>
        </div>
        
        <div class="mt-4 pt-4 border-t border-gray-200/50 flex flex-col gap-2">
            <button class="btn-custom w-full" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
            <button class="btn-custom w-full bg-blue-600 !text-white hover:bg-blue-700" style="background: #2563eb; color: white;" onclick="buyNow(${product.id})">
                Buy Now
            </button>
       </div>
       `;
       productGrid.appendChild(card);
    });
}

// --- SIDEBAR UI LOGIC ---

function setupMobileSidebar() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const closeBtn = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('filterSidebar');
    const overlay = document.getElementById('sidebarOverlay');

    function toggleSidebar() {
        // Toggle translate class
        if (sidebar.classList.contains('-translate-x-full')) {
            sidebar.classList.remove('-translate-x-full');
            overlay.classList.remove('hidden');
        } else {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
        }
    }

    if(toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
    if(closeBtn) closeBtn.addEventListener('click', toggleSidebar);
    if(overlay) overlay.addEventListener('click', toggleSidebar);
}

// --- CART & PROFILE UTILS (Preserved from previous version) ---

function getCart() {
    const cart = localStorage.getItem('kelna_cart');
    return cart ? JSON.parse(cart) : [];
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        const cart = getCart();
        cart.push(product);
        localStorage.setItem('kelna_cart', JSON.stringify(cart));
        updateCartCount();
        
        // Optional: Toast notification instead of alert could go here
        alert(`${product.name} added to cart!`);
    }
}

function updateCartCount() {
    const cart = getCart();
    const countBadge = document.getElementById('cart-count');
    if (countBadge) { 
        countBadge.textContent = cart.length;
        if (cart.length > 0) countBadge.classList.remove('hidden');
        else countBadge.classList.add('hidden');
    }
}

function buyNow(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        alert(`Proceeding to checkout for: ${product.name}`);
    }
}

function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem('user'));
    const loginBtn = document.getElementById('loginBtn');
    if (user && loginBtn) {
        loginBtn.textContent = 'My Profile';
        loginBtn.classList.add('bg-white', 'text-gray-800');
        loginBtn.onclick = (e) => {
            e.preventDefault();
            document.getElementById('profileModal').style.display = 'flex';
        };
    }
}
// Modal close logic
document.querySelector('.profile-close')?.addEventListener('click', () => {
    document.getElementById('profileModal').style.display = 'none';
});
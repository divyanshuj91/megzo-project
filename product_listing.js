// MOCK DATA
const products = [
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
    { id: 11, name: "Gaming Console", category:"Gaming", price: 35000, image: "images/gamingconsole.png" }
];

// STATE
let activeCategories = [];
let maxPrice = 100000;
let sortMode = 'default';
let searchQuery = ''; // <--- NEW STATE FOR SEARCH

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

    // 5. Search Listener (NEW LOGIC)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            applyFilters();
        });
    }

    // 6. Reset Listener
    resetBtn.addEventListener('click', () => {
        // Reset inputs
        document.querySelectorAll('.category-checkbox').forEach(cb => cb.checked = false);
        priceRange.value = 100000;
        priceValue.textContent = '₹100000';
        sortSelect.value = 'default';
        if(searchInput) searchInput.value = ''; // Reset search box
        
        // Reset State
        activeCategories = [];
        maxPrice = 100000;
        sortMode = 'default';
        searchQuery = ''; // Reset search state
        
        applyFilters();
    });
}

function applyFilters() {
    let filtered = products.filter(product => {
        const matchesCategory = activeCategories.length === 0 || activeCategories.includes(product.category);
        const matchesPrice = product.price <= maxPrice;
        // NEW: Check if name matches search query
        const matchesSearch = product.name.toLowerCase().includes(searchQuery);
        
        return matchesCategory && matchesPrice && matchesSearch;
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
                <p class="opacity-80">Try adjusting your filters or search.</p>
            </div>`;
        return;
    }

    items.forEach(product => {
        const card = document.createElement('div');
        card.className = 'glass-card rounded-2xl p-4 flex flex-col h-full bg-white/40 fade-in';

        // NOTE: Updated Image Container to use aspect-square for better responsiveness
        card.innerHTML = `
        <div class="aspect-square w-full overflow-hidden rounded-lg bg-gray-200 mb-4 relative group">
            <img src="${product.image}" 
                 alt="${product.name}" 
                 class="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
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

// --- CART & PROFILE UTILS ---

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
document.querySelector('.profile-close')?.addEventListener('click', () => {
    document.getElementById('profileModal').style.display = 'none';
});
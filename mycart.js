// DOM Elements
const cartContainer = document.getElementById('cart-items-container');
const subtotalEl = document.getElementById('subtotal-price');
const taxEl = document.getElementById('tax-price');
const totalEl = document.getElementById('total-price');

// Load Cart on Startup
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

// Helper: Get Cart from Storage
function getCart() {
    const cart = localStorage.getItem('kelna_cart');
    return cart ? JSON.parse(cart) : [];
}

// Helper: Save Cart to Storage
function saveCart(cart) {
    localStorage.setItem('kelna_cart', JSON.stringify(cart));
}

// 1. RENDER FUNCTION
function renderCart() {
    const cart = getCart();
    cartContainer.innerHTML = ''; // Clear current list

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="glass-card p-8 rounded-2xl text-center">
                <h3 class="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
                <p class="text-gray-600 mb-6">Looks like you haven't added anything yet.</p>
                <a href="product_listing.html" class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">Start Shopping &rarr;</a>
            </div>
        `;
        updateSummary(0);
        return;
    }

    // Loop through items and create HTML rows
    cart.forEach((product, index) => {
        const itemHTML = `
            <div class="glass-card p-4 rounded-xl flex items-center gap-4 animate-fade-in bg-white/60">
                <!-- Image -->
                <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <img src="${product.image}" alt="${product.name}" class="h-full w-full object-contain object-center" onerror="this.src='https://via.placeholder.com/150'">
                </div>

                <!-- Details -->
                <div class="flex flex-1 flex-col justify-between">
                    <div>
                        <div class="flex justify-between text-base font-bold text-gray-900">
                            <h3>${product.name}</h3>
                            <p class="text-lg">₹${product.price.toLocaleString()}</p>
                        </div>
                        <p class="mt-1 text-sm text-gray-500">${product.category}</p>
                    </div>
                    
                    <div class="flex items-end justify-between text-sm mt-4">
                        <p class="text-gray-600">Qty: 1</p>
                        <button type="button" onclick="removeItem(${index})" class="font-medium text-red-500 hover:text-red-700 hover:underline transition">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
        cartContainer.innerHTML += itemHTML;
    });

    calculateTotals(cart);
}

// 2. REMOVE FUNCTION
function removeItem(index) {
    const cart = getCart();
    
    // Remove 1 item at the specific index
    cart.splice(index, 1);
    
    saveCart(cart);
    renderCart(); // Re-render to show changes
}

// 3. CALCULATE TOTALS & UPDATE SUMMARY
function calculateTotals(cart) {
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const tax = subtotal * 0.05; // 5% Tax
    const total = subtotal + tax;
    
    updateSummary(subtotal, tax, total);
}

function updateSummary(subtotal, tax = 0, total = 0) {
    subtotalEl.textContent = `₹${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    taxEl.textContent = `₹${tax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    totalEl.textContent = `₹${total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

// 4. CHECKOUT FUNCTION
function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    // The specific alert message you requested
    alert("Order Placed Successfully! Redirecting to home...");
    
    // Clear the cart
    localStorage.removeItem('kelna_cart'); 
    
    // Redirect
    window.location.href = 'homepage.html';
}
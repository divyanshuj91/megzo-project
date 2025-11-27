document.addEventListener('DOMContentLoaded', () => {
    // 1. Check Login Status
    checkLoginStatus();

    // 2. Load Dummy Products
    loadProducts();

    // --- Modal Logic ---
    const closeBtn = document.querySelector('.profile-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.getElementById('profileModal').style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        const modal = document.getElementById('profileModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
});

function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem('user'));
    const loginBtn = document.getElementById('loginBtn');

    if (user && loginBtn) {
        // Change button to look like a profile link (matching product_listing logic)
        loginBtn.innerHTML = `
            <div class="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Profile</span>
            </div>
        `;
        // Remove standard button styling, make it transparent
        loginBtn.className = "flex items-center gap-2 text-gray-800 font-medium hover:text-blue-600 transition";
        loginBtn.removeAttribute('style'); // Clear inline styles if any
        
        loginBtn.onclick = (e) => {
            e.preventDefault();
            openProfileModal();
        };
    }
}

// Updated Load Products to match Glassmorphism Design
function loadProducts() {
    const grid = document.getElementById('productGrid');
    if(!grid) return;

    const products = [
        { title: "Wireless Headphones", price: 2999, img: "https://via.placeholder.com/300?text=Headphones" },
        { title: "Smart Watch Series 5", price: 4500, img: "https://via.placeholder.com/300?text=Watch" },
        { title: "Gaming Laptop", price: 55000, img: "https://via.placeholder.com/300?text=Laptop" },
        { title: "4K Monitor", price: 12000, img: "https://via.placeholder.com/300?text=Monitor" }
    ];

    grid.innerHTML = products.map((p, index) => `
        <div class="glass-card rounded-2xl p-4 flex flex-col h-full bg-white/40 fade-in" style="animation-delay: ${index * 100}ms">
            <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 mb-4 relative group">
                <img src="${p.img}" 
                     alt="${p.title}" 
                     class="h-48 w-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                     onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
            </div>
            
            <div class="flex-grow">
                 <h3 class="text-lg font-semibold text-gray-900 leading-tight">${p.title}</h3>
                 <p class="mt-2 text-xl font-bold text-gray-900">₹${p.price.toLocaleString()}</p>
            </div>
            
            <div class="mt-4 pt-4 border-t border-gray-200/50 flex flex-col gap-2">
                <button class="btn-custom w-full">Add to Cart</button>
                <button class="btn-custom w-full bg-blue-600 !text-white hover:bg-blue-700" style="background: #2563eb; color: white;">Buy Now</button>
           </div>
        </div>
    `).join('');
}

function openProfileModal() {
    const modal = document.getElementById('profileModal');
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('profileAddress').value = user.address || '';
        document.getElementById('profileContact').value = user.contact_number || '';
    }
    modal.style.display = 'flex';
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const address = document.getElementById('profileAddress').value.trim();
    const contact_number = document.getElementById('profileContact').value.trim();
    const messageDiv = document.getElementById('profileMessage');

    if (!address && !contact_number) {
        messageDiv.textContent = 'Please fill at least one field';
        messageDiv.className = 'text-red-600 font-medium text-center';
        return;
    }

    try {
        // Mock success for UI demo
        const updatedUser = { ...user, address, contact_number };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        messageDiv.textContent = 'Profile updated successfully!';
        messageDiv.className = 'text-green-600 font-medium text-center';

        setTimeout(() => {
            document.getElementById('profileModal').style.display = 'none';
            messageDiv.textContent = '';
        }, 1500);

    } catch (error) {
        messageDiv.textContent = 'Error updating profile';
        messageDiv.className = 'text-red-600 font-medium text-center';
    }
}
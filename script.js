// Initialize Lucide Icons
lucide.createIcons();

/* ===== SHOW MENU ===== */
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

/* Menu show */
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

/* Menu hidden */
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

/* Remove menu on mobile link click */
const navLink = document.querySelectorAll('.nav-link');
const linkAction = () => {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('show-menu');
}
navLink.forEach(n => n.addEventListener('click', linkAction));

/* ===== CHANGE BACKGROUND HEADER ===== */
const scrollHeader = () => {
    const header = document.getElementById('header');
    if (window.scrollY >= 50) header.classList.add('scroll-header');
    else header.classList.remove('scroll-header');
}
window.addEventListener('scroll', scrollHeader);

/* ===== SHOW SCROLL UP ===== */
const scrollUp = () => {
    const scrollUpButton = document.getElementById('scroll-up');
    if (window.scrollY >= 350) scrollUpButton.classList.add('show-scroll');
    else scrollUpButton.classList.remove('show-scroll');
}
window.addEventListener('scroll', scrollUp);

/* ===== SCROLL SECTIONS ACTIVE LINK ===== */
const sections = document.querySelectorAll('section[id]');
const scrollActive = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 58;
        const sectionId = current.getAttribute('id');
        const sectionsClass = document.querySelector('.nav-menu a[href*=' + sectionId + ']');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            if (sectionsClass) sectionsClass.classList.add('active-link');
        } else {
            if (sectionsClass) sectionsClass.classList.remove('active-link');
        }
    });
};
window.addEventListener('scroll', scrollActive);


/* ===== CUSTOM CURSOR ===== */
let cursor = document.querySelector('.cursor');
let cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // slight delay for follower
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 50);
});

// Interactive hover effects for cursor
const interactiveElements = document.querySelectorAll('a, button, .nav-logo, input');

interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
    });
    
    el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
    });
});


/* ===== SCROLL REVEAL ANIMATION ===== */
const revealElements = document.querySelectorAll('.category-card, .product-card, .about-data, .about-images');

// Add reveal class to elements
revealElements.forEach(el => el.classList.add('reveal'));

const revealFunction = () => {
    for (let i = 0; i < revealElements.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = revealElements[i].getBoundingClientRect().top;
        const elementVisible = 100;

        if (elementTop < windowHeight - elementVisible) {
            revealElements[i].classList.add("active");
        }
    }
}
window.addEventListener('scroll', revealFunction);
revealFunction(); // trigger once on load
/* ===== SHOPPING CART LOGIC ===== */
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const updateCartBadge = () => {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        badge.textContent = totalItems;
        badge.classList.add('animate');
        setTimeout(() => badge.classList.remove('animate'), 400);
    }
}

const renderCart = () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('cart-total-price');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-msg" style="text-align: center; margin-top: 3rem; color: var(--text-color);">
                Your cart is empty
            </div>`;
        if (totalPriceElement) totalPriceElement.textContent = '₹0';
        return;
    }
    
    let total = 0;
    cartItemsContainer.innerHTML = cart.map((item, index) => {
        const priceValue = parseInt(item.price.replace(/[^0-9]/g, ''));
        total += priceValue * item.quantity;
        
        return `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <span class="cart-item-price">${item.price} x ${item.quantity}</span>
                </div>
                <div class="cart-item-remove" onclick="removeFromCart(${index})">
                    <i data-lucide="trash-2"></i>
                </div>
            </div>
        `;
    }).join('');
    
    if (totalPriceElement) totalPriceElement.textContent = `₹${total}`;
    lucide.createIcons();
}

const removeFromCart = (index) => {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
}

const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i data-lucide="check-circle"></i><span>${message}</span>`;
    document.body.appendChild(toast);
    lucide.createIcons();
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

const addToCart = (product) => {
    const existingEntry = cart.find(item => item.id === product.id);
    
    if (existingEntry) {
        existingEntry.quantity += product.quantity;
    } else {
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    renderCart(); // Update visual cart
    showToast(`${product.name} added to cart`);
}

// Sidepanel Logic
const cartSidebar = document.getElementById('cart-sidebar');
const cartClose = document.getElementById('cart-close');
const cartBtn = document.querySelector('.action-btn[aria-label="Cart"]');
const overlay = document.getElementById('overlay');

if (cartBtn) {
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('open');
        overlay.classList.add('active');
        renderCart();
    });
}

if (cartClose) {
    cartClose.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        overlay.classList.remove('active');
    });
}

if (overlay) {
    overlay.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        overlay.classList.remove('active');
    });
}

// Global click handler for dynamic elements
document.addEventListener('click', (e) => {
    // Add to cart
    if (e.target.closest('.btn-add-cart')) {
        const card = e.target.closest('.product-card');
        const product = {
            id: card.querySelector('.product-title').textContent + '-' + card.querySelector('.product-price').textContent,
            name: card.querySelector('.product-title').textContent,
            price: card.querySelector('.product-price').textContent,
            img: card.querySelector('.product-img').src,
            quantity: parseInt(card.querySelector('.qty-input').value)
        };
        addToCart(product);
    }
    
    // Buy Now
    if (e.target.closest('.btn-buy-now')) {
        const card = e.target.closest('.product-card');
        const productName = card.querySelector('.product-title').textContent;
        showToast(`Redirecting to checkout for ${productName}...`);
        
        // Simulate redirect
        setTimeout(() => {
            alert(`Proceeding to buy ${productName}! This would normally take you to a checkout page.`);
        }, 1000);
    }
    
    // Quantity controls
    if (e.target.closest('.qty-btn')) {
        const btn = e.target.closest('.qty-btn');
        const input = btn.closest('.quantity').querySelector('.qty-input');
        if (btn.classList.contains('plus')) {
            input.value = parseInt(input.value) + 1;
        } else if (btn.classList.contains('minus')) {
            const val = parseInt(input.value);
            if (val > 1) input.value = val - 1;
        }
    }
});

// Initial load
updateCartBadge();
renderCart();

// Ensure icons and cursor hover works
const initInteractivity = () => {
    lucide.createIcons();
    const interactiveElements = document.querySelectorAll('a, button, .nav-logo, input, .qty-btn, .cart-item-remove, .cart-close');
    interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}
initInteractivity();



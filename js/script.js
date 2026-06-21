window.addEventListener('scroll', function() {
    const cards = document.querySelectorAll('.character-card');
    cards.forEach(card => {
        if (isInViewport(card)) {
            card.classList.add('in-view');
        } else {
            card.classList.remove('in-view');
        }
    });
});

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function openModal(characterId) {
    var modal = document.getElementById(characterId);
    if (modal) modal.style.display = "block";
}

function closeModal(characterId) {
    var modal = document.getElementById(characterId);
    if (modal) modal.style.display = "none";
}

window.onclick = function(event) {
    var modals = document.getElementsByClassName('modal');
    for (var i = 0; i < modals.length; i++) {
        if (event.target == modals[i]) {
            modals[i].style.display = "none";
        }
    }
}

function closeAuthModal() {
    const authModal = document.getElementById("authModal");
    if (authModal) authModal.style.display = "none";
}

function openShopModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "block";
}

function closeShopModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
}

const galleries = {
    figura1: ["fig1.jpg", "fig2.jpg", "fig3.jpg"],
    figura2: ["asd1.jpg", "asd2.jpg", "asd3.jpg"],
    figura3: ["vinc1.jpg", "vinc2.jpg", "vinc3.jpg"]
};

const galleryIndex = {
    figura1: 0,
    figura2: 0,
    figura3: 0
};

function nextImage(id) {
    galleryIndex[id] = (galleryIndex[id] + 1) % galleries[id].length;
    const imgEl = document.getElementById(id + "-img");
    if (imgEl) imgEl.src = "images/shop/" + galleries[id][galleryIndex[id]];
}

function prevImage(id) {
    galleryIndex[id] = (galleryIndex[id] - 1 + galleries[id].length) % galleries[id].length;
    const imgEl = document.getElementById(id + "-img");
    if (imgEl) imgEl.src = "images/shop/" + galleries[id][galleryIndex[id]];
}

function getCart() {
    return JSON.parse(localStorage.getItem("ff_cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("ff_cart", JSON.stringify(cart));
}

function addToCart(name, price) {
    const user = localStorage.getItem("ff_user");
    if (!user) {
        openAuthModal();
        showCartToast("Войдите или зарегистрируйтесь");
        return;
    }
    const cart = getCart();
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    saveCart(cart);
    updateCartCount();
    showCartToast("Товар добавлен в корзину");
    animateCartButton();
}

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
    updateCartCount();
}

function clearCart() {
    localStorage.removeItem("ff_cart");
    renderCart();
    updateCartCount();
}

function renderCart() {
    const cartContainer = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    if (!cartContainer) return;
    const cart = getCart();
    cartContainer.innerHTML = "";
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <div class="cart-info">
                <h3>${item.name}</h3>
                <p>${item.price} rub</p>
            </div>
            <div class="cart-qty">
                <button onclick="decreaseQuantity(${index})">−</button>
                <span>${item.quantity}</span>
                <button onclick="increaseQuantity(${index})">+</button>
            </div>
        `;
        cartContainer.appendChild(div);
    });
    if (totalEl) totalEl.textContent = total + " rub";
    updateCartCount();
}

function animateCartButton() {
    const cartLink = document.getElementById("cart-link");
    if (!cartLink) return;
    cartLink.classList.add("cart-bounce");
    setTimeout(() => cartLink.classList.remove("cart-bounce"), 500);
}

function showCartToast(text) {
    const toast = document.createElement("div");
    toast.className = "cart-toast";
    toast.textContent = text;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

function logout() {
    localStorage.removeItem("ff_user");
    updateAuthUI();
    openAuthModal();
}

function updateAuthUI() {
    const user = localStorage.getItem("ff_user");
    const authBlock = document.getElementById("auth-block");
    if (!authBlock) return;
    if (user) {
        authBlock.innerHTML = `
            <span class="user-name">👤 ${user}</span>
            <button class="logout-btn" onclick="logout()">Выйти</button>
        `;
    } else {
        authBlock.innerHTML = `
            <button class="login-btn" onclick="openAuthModal()">Вход / Регистрация</button>
        `;
    }
}

function openAuthModal() {
    const authModal = document.getElementById("authModal");
    if (authModal) authModal.style.display = "block";
}

function generateOrderNumber() {
    return "FF-" + Math.floor(100000 + Math.random() * 900000);
}

function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        alert("Корзина пуста");
        return;
    }
    const orderNumber = "FF7-" + Math.floor(Math.random() * 900000 + 100000);
    const orderNumberEl = document.getElementById("order-number");
    if (orderNumberEl) orderNumberEl.innerHTML = `<strong>Номер заказа:</strong> ${orderNumber}`;
    let total = 0;
    cart.forEach(item => { total += item.price * item.quantity; });
    const checkoutTotalEl = document.getElementById("checkout-total-price");
    if (checkoutTotalEl) checkoutTotalEl.textContent = total + " rub";
    saveOrder({ id: orderNumber, total: total, date: new Date().toLocaleString() });
    const checkoutModal = document.getElementById("checkoutModal");
    if (checkoutModal) checkoutModal.style.display = "block";
}

function closeCheckout() {
    const checkoutModal = document.getElementById("checkoutModal");
    if (checkoutModal) checkoutModal.style.display = "none";
}

function finishOrder() {
    alert("Заказ успешно оформлен!");
    localStorage.removeItem("ff_cart");
    closeCheckout();
    renderCart();
    updateCartCount();
}

function openGameplay(src) {
    const modal = document.getElementById("gameplayModal");
    const image = document.getElementById("gameplayFull");
    if (image) image.src = src;
    if (modal) modal.style.display = "flex";
}

function closeGameplay() {
    const modal = document.getElementById("gameplayModal");
    if (modal) modal.style.display = "none";
}

window.addEventListener("click", function (e) {
    const modal = document.getElementById("gameplayModal");
    if (e.target === modal) {
        closeGameplay();
    }
});

function updateCartCount() {
    const countEl = document.getElementById("cart-count");
    if (!countEl) return;
    const cart = getCart();
    countEl.textContent = cart.length;
}

function increaseQuantity(index) {
    const cart = getCart();
    cart[index].quantity++;
    saveCart(cart);
    renderCart();
}

function decreaseQuantity(index) {
    const cart = getCart();
    cart[index].quantity--;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart(cart);
    renderCart();
}

function saveOrder(orderData) {
    const orders = JSON.parse(localStorage.getItem("ff_orders")) || [];
    orders.push(orderData);
    localStorage.setItem("ff_orders", JSON.stringify(orders));
}

function renderOrders() {
    const container = document.getElementById("orders-list");
    if (!container) return;
    const orders = JSON.parse(localStorage.getItem("ff_orders")) || [];
    if (orders.length === 0) {
        container.innerHTML = "<p>Заказов пока нет</p>";
        return;
    }
    container.innerHTML = "";
    orders.reverse().forEach(order => {
        const div = document.createElement("div");
        div.className = "order-item";
        div.innerHTML = `
            <h3>Заказ #${order.id}</h3>
            <p>Сумма: ${order.total} rub</p>
            <p>Дата: ${order.date}</p>
        `;
        container.appendChild(div);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const banner = document.getElementById('cookieConsentBanner');
    const settingsPanel = document.getElementById('cookieSettingsPanel');
    const acceptAllBtn = document.getElementById('cookieAcceptAll');
    const rejectAllBtn = document.getElementById('cookieRejectAll');
    const settingsBtn = document.getElementById('cookieSettings');
    const saveSettingsBtn = document.getElementById('saveCookieSettings');
    const closeSettingsBtn = document.getElementById('closeCookieSettings');

    const consentGiven = localStorage.getItem('cookieConsent');
    if (!consentGiven) {
        setTimeout(() => {
            if (banner) banner.style.display = 'block';
        }, 500);
    }

    if (acceptAllBtn) {
        acceptAllBtn.addEventListener('click', function() {
            const consentData = {
                necessary: true,
                analytics: true,
                marketing: true,
                personalData: true,
                timestamp: new Date().toISOString(),
                accepted: true
            };
            localStorage.setItem('cookieConsent', JSON.stringify(consentData));
            if (banner) banner.style.display = 'none';
        });
    }

    if (rejectAllBtn) {
        rejectAllBtn.addEventListener('click', function() {
            const consentData = {
                necessary: true,
                analytics: false,
                marketing: false,
                personalData: false,
                timestamp: new Date().toISOString(),
                accepted: false
            };
            localStorage.setItem('cookieConsent', JSON.stringify(consentData));
            if (banner) banner.style.display = 'none';
        });
    }

    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            if (banner) banner.style.display = 'none';
            if (settingsPanel) settingsPanel.style.display = 'block';
            const savedConsent = localStorage.getItem('cookieConsent');
            if (savedConsent) {
                const consent = JSON.parse(savedConsent);
                const analyticsCheck = document.getElementById('analyticsCookies');
                const marketingCheck = document.getElementById('marketingCookies');
                const personalCheck = document.getElementById('personalDataProcessing');
                if (analyticsCheck) analyticsCheck.checked = consent.analytics;
                if (marketingCheck) marketingCheck.checked = consent.marketing;
                if (personalCheck) personalCheck.checked = consent.personalData;
            }
        });
    }

    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', function() {
            const analyticsCheck = document.getElementById('analyticsCookies');
            const marketingCheck = document.getElementById('marketingCookies');
            const personalCheck = document.getElementById('personalDataProcessing');
            const consentData = {
                necessary: true,
                analytics: analyticsCheck ? analyticsCheck.checked : false,
                marketing: marketingCheck ? marketingCheck.checked : false,
                personalData: personalCheck ? personalCheck.checked : false,
                timestamp: new Date().toISOString(),
                accepted: true
            };
            localStorage.setItem('cookieConsent', JSON.stringify(consentData));
            if (settingsPanel) settingsPanel.style.display = 'none';
        });
    }

    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', function() {
            if (settingsPanel) settingsPanel.style.display = 'none';
            if (!localStorage.getItem('cookieConsent')) {
                if (banner) banner.style.display = 'block';
            }
        });
    }

    renderCart();
    updateAuthUI();
    updateCartCount();

    const authForm = document.querySelector(".auth-form");
    if (authForm) {
        authForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const username = authForm.querySelector("input[type='text']").value.trim();
            if (!username) return;
            localStorage.setItem("ff_user", username);
            closeAuthModal();
            updateAuthUI();
        });
    }

    const slides = document.querySelectorAll(".slide");
    if (slides.length > 0) {
        let current = 0;
        setInterval(() => {
            slides[current].classList.remove("active");
            current++;
            if (current >= slides.length) {
                current = 0;
            }
            slides[current].classList.add("active");
        }, 3500);
    }

    const profileName = document.getElementById("profile-name");
    if (profileName) {
        const user = localStorage.getItem("ff_user");
        if (!user) {
            window.location.href = "index.html";
            return;
        }
        const email = localStorage.getItem("ff_email") || "Не указан";
        const regDate = localStorage.getItem("ff_reg_date") || new Date().toLocaleDateString();
        document.getElementById("profile-name").textContent = user;
        const profileEmailEl = document.getElementById("profile-email");
        const profileDateEl = document.getElementById("profile-date");
        if (profileEmailEl) profileEmailEl.textContent = "Email: " + email;
        if (profileDateEl) profileDateEl.textContent = "Дата регистрации: " + regDate;
        renderOrders();
    }
});

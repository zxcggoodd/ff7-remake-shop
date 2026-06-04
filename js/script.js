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
// Открыть модальное окно
function openModal(characterId) {
    var modal = document.getElementById(characterId);
    modal.style.display = "block";
}

// Закрыть модальное окно
function closeModal(characterId) {
    var modal = document.getElementById(characterId);
    modal.style.display = "none";
}

// Закрытие модальных окон по клику вне окна
window.onclick = function(event) {
    var modals = document.getElementsByClassName('modal');
    for (var i = 0; i < modals.length; i++) {
        if (event.target == modals[i]) {
            modals[i].style.display = "none";
        }
    }
}


function closeAuthModal() {
    document.getElementById("authModal").style.display = "none";
}

function openShopModal(id) {
    document.getElementById(id).style.display = "block";
}

function closeShopModal(id) {
    document.getElementById(id).style.display = "none";
}
document.addEventListener("DOMContentLoaded", function () {
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


});
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
    document.getElementById(id + "-img").src =
        "images/shop/" + galleries[id][galleryIndex[id]];
}

function prevImage(id) {
    galleryIndex[id] =
        (galleryIndex[id] - 1 + galleries[id].length) % galleries[id].length;
    document.getElementById(id + "-img").src =
        "images/shop/" + galleries[id][galleryIndex[id]];
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

        cart.push({
            name,
            price,
            quantity: 1
        });
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

    totalEl.textContent = total + " rub";

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
    document.getElementById("authModal").style.display = "block";
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

    const orderNumber =
        "FF7-" + Math.floor(Math.random() * 900000 + 100000);

    document.getElementById("order-number").innerHTML =
        `<strong>Номер заказа:</strong> ${orderNumber}`;

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    document.getElementById("checkout-total-price").textContent =
        total + " rub";
    saveOrder({
        id: orderNumber,
        total: total,
        date: new Date().toLocaleString()
    });

    document.getElementById("checkoutModal").style.display = "block";
}
function closeCheckout() {

    document.getElementById("checkoutModal").style.display = "none";
}

function finishOrder() {

    alert("Заказ успешно оформлен!");

    localStorage.removeItem("ff_cart");

    closeCheckout();

    renderCart();

    updateCartCount();
}
function generateOrderNumber() {
    const date = new Date().toISOString().slice(2,10).replace(/-/g,"");
    const rand = Math.floor(Math.random() * 9999);
    return `FF-${date}-${rand}`;
}

let gameplayIndex = 0;

function showGameplaySlide(index) {

    const slides = document.querySelectorAll(".gameplay-slide");

    slides.forEach(slide => {
        slide.classList.remove("active");
    });

    slides[index].classList.add("active");
}

function nextGameplay() {

    const slides = document.querySelectorAll(".gameplay-slide");

    gameplayIndex++;

    if (gameplayIndex >= slides.length) {
        gameplayIndex = 0;
    }

    showGameplaySlide(gameplayIndex);
}

function prevGameplay() {

    const slides = document.querySelectorAll(".gameplay-slide");

    gameplayIndex--;

    if (gameplayIndex < 0) {
        gameplayIndex = slides.length - 1;
    }

    showGameplaySlide(gameplayIndex);
}
function openGameplay(src) {

    const modal = document.getElementById("gameplayModal");
    const image = document.getElementById("gameplayFull");

    image.src = src;

    modal.style.display = "flex";
}

function closeGameplay() {

    document.getElementById("gameplayModal").style.display = "none";
}

window.addEventListener("click", function (e) {

    const modal = document.getElementById("gameplayModal");

    if (e.target === modal) {
        closeGameplay();
    }
});
/* ======================
   CART COUNTER
====================== */

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
/* ======================
   ЛИЧНЫЙ КАБИНЕТ
====================== */

document.addEventListener("DOMContentLoaded", function () {

    const profileName = document.getElementById("profile-name");

    if (!profileName) return;

    const user = localStorage.getItem("ff_user");

    if (!user) {

        window.location.href = "index.html";
        return;
    }

    const email = localStorage.getItem("ff_email") || "Не указан";

    const regDate =
        localStorage.getItem("ff_reg_date") ||
        new Date().toLocaleDateString();

    document.getElementById("profile-name").textContent =
        user;

    document.getElementById("profile-email").textContent =
        "Email: " + email;

    document.getElementById("profile-date").textContent =
        "Дата регистрации: " + regDate;

    renderOrders();
});

/* ======================
   СОХРАНЕНИЕ АВТОРИЗАЦИИ
====================== */

document.addEventListener("DOMContentLoaded", function () {

    const authForm = document.querySelector(".auth-form");

    if (!authForm) return;

    authForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const username =
            authForm.querySelector("input[type='text']").value;

        const email =
            authForm.querySelector("input[type='email']").value;

        localStorage.setItem("ff_user", username);

        localStorage.setItem("ff_email", email);

        if (!localStorage.getItem("ff_reg_date")) {

            localStorage.setItem(
                "ff_reg_date",
                new Date().toLocaleDateString()
            );
        }

        closeAuthModal();

        updateAuthUI();
    });
});

/* ======================
   ИСТОРИЯ ЗАКАЗОВ
====================== */

function saveOrder(orderData) {

    const orders =
        JSON.parse(localStorage.getItem("ff_orders")) || [];

    orders.push(orderData);

    localStorage.setItem(
        "ff_orders",
        JSON.stringify(orders)
    );
}

function renderOrders() {

    const container =
        document.getElementById("orders-list");

    if (!container) return;

    const orders =
        JSON.parse(localStorage.getItem("ff_orders")) || [];

    if (orders.length === 0) {

        container.innerHTML =
            "<p>Заказов пока нет</p>";

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

    const slides = document.querySelectorAll(".slide");

    if (slides.length === 0) return;

    let current = 0;

    setInterval(() => {

        slides[current].classList.remove("active");

        current++;

        if (current >= slides.length) {
            current = 0;
        }

        slides[current].classList.add("active");

    }, 3500);
});
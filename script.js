// База данных (5 брендов)
const PRODUCTS = [
    { id: 1, brand: "Bauna", name: "Premium Chicken", one: 12500, sub: 10625, info: "Натуральный состав для активных собак.", img: "images/bauna.jpg" },
    { id: 2, brand: "Pro Plan", name: "Sensitive Skin", one: 9800, sub: 8330, info: "Защита кожи и шерсти питомца.", img: "images/corm1.jpg" },
    { id: 3, brand: "Nulo", name: "Kitten Health", one: 7200, sub: 6120, info: "Для здорового роста вашего котенка.", img: "images/nulo.jpg" },
    { id: 4, brand: "One Love", name: "Science Plan Senior", one: 11000, sub: 9350, info: "Поддержка суставов пожилых собак.", img: "images/onelove.jpg" },
    { id: 5, brand: "PetitRico", name: "Wild Six Fish", one: 15500, sub: 13175, info: "Богатый протеином рыбный рацион.", img: "images/petitrico.jpg" }
];

// Состояние (память)
let cart = JSON.parse(localStorage.getItem('petCart')) || [];
let user = JSON.parse(localStorage.getItem('petUser')) || { name: "Катя", email: "arkadi@mail.kz", pet: "Грейси (Шотладнская)" };

document.addEventListener('DOMContentLoaded', () => {
    renderBaseUI(); // Рисуем шапку и Дашборд на всех страницах
    if (document.getElementById('store-grid')) renderShop(); // Только для магазина
});

// ГЛОБАЛЬНЫЙ ИНТЕРФЕЙС (Корзина и Профиль теперь работают везде!)
function renderBaseUI() {
    const head = document.querySelector('.main-header');
    if (head) {
        head.innerHTML = `
        <div class="container header-flex">
            <a href="index.html" class="logo">🐾 PetShop<span>KZ</span></a>
            <nav class="nav-links">
                <a href="index.html">Главная</a>
                <a href="shop.html">Магазин</a>
                <a href="pet.html">Мой питомец</a>
                <a href="office.html">Панель</a>
            </nav>
            <div class="header-actions">
                <span onclick="openModal('cart-m')" style="cursor:pointer">🛒 <b id="c-count">${cart.length}</b></span>
                <span onclick="openModal('prof-m')" style="cursor:pointer; margin-left:15px">👤</span>
            </div>
        </div>`;
    }

    const dash = document.querySelector('.global-dash');
    if (dash) {
        dash.innerHTML = `
        <div class="container dash-flex" style="display:flex; justify-content:space-around; font-weight:600">
            <span>Питомец: <strong>${user.pet}</strong></span>
            <span>Вес: <strong>16 кг</strong></span>
            <span>Доставка: <strong>15 Марта</strong></span>
        </div>`;
    }

    // Вставляем модалки в конец body, если их нет
    if (!document.getElementById('cart-m')) {
        const modals = `
        <div id="cart-m" class="modal-overlay" onclick="closeModal('cart-m')">
            <div class="modal-side" onclick="event.stopPropagation()">
                <span class="close" onclick="closeModal('cart-m')">&times;</span>
                <h2>Ваша корзина</h2>
                <div id="cart-list-view"></div>
                <hr><div id="cart-total-val" style="font-size:20px; font-weight:800; margin-bottom:20px">0 ₸</div>
                <a href="checkout.html" class="btn-main" style="width:100%; display:block; text-align:center">Оформить заказ</a>
            </div>
        </div>
        <div id="prof-m" class="modal-overlay" onclick="closeModal('prof-m')">
            <div class="modal-side" onclick="event.stopPropagation()">
                <span class="close" onclick="closeModal('prof-m')">&times;</span>
                <h2>Профиль</h2>
                <p>Имя: <strong>${user.name}</strong></p>
                <p>Email: <strong>${user.email}</strong></p>
                <button class="btn-main" style="width:100%" onclick="alert('Редактор в разработке')">Редактировать</button>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modals);
    }
}

// МАГАЗИН (Восстановлен калькулятор и инфо)
function renderShop() {
    const grid = document.getElementById('store-grid');
    if (!grid) return;
    grid.innerHTML = PRODUCTS.map(p => `
    <div class="card">
        <img src="${p.img}">
        <h3>${p.brand}</h3>
        <p style="font-size:12px; color:#666; height:40px">${p.info}</p>
        <div class="price-toggle">
            <button class="t-btn active" id="sub-${p.id}" onclick="setPrice(${p.id}, 'sub')">Подписка</button>
            <button class="t-btn" id="one-${p.id}" onclick="setPrice(${p.id}, 'one')">Разово</button>
        </div>
        <div id="pr-${p.id}" style="font-size:22px; font-weight:800; color:var(--primary)">${p.sub} ₸</div>
        <div class="calc-mini" style="background:#f1f5f9; padding:10px; border-radius:10px; margin:10px 0; font-size:12px">
            Вес питомца: <input type="number" id="w-${p.id}" value="10" oninput="calcF(${p.id})" style="width:40px"> кг
            <div id="res-${p.id}" style="font-weight:700; margin-top:5px; color:var(--primary)">Хватит на: 18 дней</div>
        </div>
        <button class="btn-main" style="width:100%" onclick="addToCart(${p.id})">Заказать</button>
    </div>`).join('');
}

function setPrice(id, m) {
    const p = PRODUCTS.find(x => x.id === id);
    const pr = document.getElementById(`pr-${id}`);
    const sB = document.getElementById(`sub-${id}`);
    const oB = document.getElementById(`one-${id}`);
    if (m === 'sub') {
        pr.innerText = p.sub + " ₸";
        sB.classList.add('active'); oB.classList.remove('active');
    } else {
        pr.innerText = p.one + " ₸";
        oB.classList.add('active'); sB.classList.remove('active');
    }
}

function calcF(id) {
    const w = document.getElementById(`w-${id}`).value;
    const res = document.getElementById(`res-${id}`);
    if (w > 0) res.innerText = `Хватит на: ${Math.floor(2000 / (w * 15))} дней`;
}

// ФУНКЦИИ МОДАЛОК (Теперь работают чётко)
function openModal(id) {
    const m = document.getElementById(id);
    if (m) {
        m.style.display = 'block';
        if (id === 'cart-m') renderCartList();
    }
}

function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.style.display = 'none';
}

function addToCart(id) {
    const p = PRODUCTS.find(x => x.id === id);
    const isSub = document.getElementById(`sub-${id}`).classList.contains('active');
    cart.push({ name: p.name, price: isSub ? p.sub : p.one });
    localStorage.setItem('petCart', JSON.stringify(cart));
    document.getElementById('c-count').innerText = cart.length;
    openModal('cart-m');
}

function renderCartList() {
    const list = document.getElementById('cart-list-view');
    list.innerHTML = cart.map((item, i) => `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px">
            <span>${item.name}</span>
            <strong>${item.price} ₸</strong>
        </div>`).join('');
    const total = cart.reduce((s, i) => s + i.price, 0);
    document.getElementById('cart-total-val').innerText = total + " ₸";

}

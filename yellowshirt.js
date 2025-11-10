document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", function () {
    // scrollY = jarak scroll dari atas
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
});

(function(){
  const menu   = document.getElementById('accMini');
  const nameEl = document.getElementById('accMiniName');
  const btn    = document.getElementById('accMiniBtn');
  if (!menu || !nameEl || !btn) return;

  function getTrigger(){
    return document.getElementById('accountTrigger')
        || document.querySelector('.navbar img[alt="User"]');
  }
  const trigger = getTrigger();
  if (!trigger) return;

  function isLoggedIn(){ return localStorage.getItem('adminLoggedIn') === 'true'; }

  function syncUI(){
    if (isLoggedIn()){
      nameEl.textContent = 'Admin';
      nameEl.removeAttribute('href'); // hilangkan link kalau sudah login
      btn.textContent = 'Log out';
      btn.setAttribute('href', '#');
      btn.onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem('adminLoggedIn');
        closeMenu();
        window.location.href = 'landing.html';
      };
    } else {
      nameEl.textContent = 'Guest';
      nameEl.setAttribute('href', 'akungues.html'); // arahkan ke akungues
      btn.textContent = 'Log in';
      btn.setAttribute('href', 'login.html');
      btn.onclick = null;
    }
  }
function openMenu() {
  syncUI();
  menu.classList.add('show');

  // Dapatkan posisi ikon user
  const trigger = document.querySelector('.navbar img[alt="User"]');
  if (trigger) {
    const rect = trigger.getBoundingClientRect();
    // atur posisi fixed di bawah ikon user
    menu.style.top = rect.bottom + 10 + 'px'; // jarak 10px di bawah ikon
    menu.style.left = rect.left - (220 - rect.width) + 'px'; // agar sejajar kanan
  }

  // listener tutup menu
  document.addEventListener('click', onDocClick, true);
  document.addEventListener('keydown', onKey);
}

function closeMenu(){
  menu.classList.remove('show');

  // lepas listener yang memang dipasang di openMenu()
  document.removeEventListener('click', onDocClick, true);
  document.removeEventListener('keydown', onKey);

  // ⛔ tidak perlu lagi:
  // window.removeEventListener('resize', position);
  // window.removeEventListener('scroll', position);
}

  function onDocClick(e){ if (menu.contains(e.target) || trigger.contains(e.target)) return; closeMenu(); }
  function onKey(e){ if (e.key === 'Escape') closeMenu(); }

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    menu.classList.contains('show') ? closeMenu() : openMenu();
  });
})();

// Data produk (samakan dengan list di halaman listing)
const products = [
  {name:'Yellow shirt',       price:175000, img:'asset/minari produk/b55242d7b39e4e49879586038823de2e.jpg'},
  {name:'Creamy white top',   price:275000, img:'asset/minari produk/34894dd74ef94caf971ad4d03e7f7b49.jpg'},
  {name:'Chicca ecru',        price:199000, img:'asset/minari produk/96ac782077fb4891bb81984994b9fc50.jpg'},
  {name:'Grey pleats',        price:215000, img:'asset/minari produk/880fc5f655f94f1e80884bec5930ffc2.jpg'},
  {name:'White blouse',       price:239000, img:'asset/minari produk/f26e90ad0a67484881c0aeb2d2fac45d.jpg'},
  {name:'Blue satin crop',    price:189000, img:'asset/minari produk/586fd2b5621c47e0af5b45cd2efb6a2d.jpg'},
  {name:'Beige draped',       price:259000, img:'asset/minari produk/b4261c54560b49b9b76652ba18179c9d.jpg'},
  {name:'Soft brown long',    price:299000, img:'asset/minari produk/0d2375eac35a4b7ba9f447998131484d.jpg'},
  {name:'Yellow soft crop',   price:179000, img:'asset/minari produk/3b203e428ded4fbdb88fa67c0c6ca455.jpg'},
  {name:'Pink classic',       price:189000, img:'asset/minari produk/64bc960079954e97a0c70dae1fd84ec4.jpg'},
  {name:'Olive denim crop',   price:225000, img:'asset/minari produk/1c2dab862f3b4a1987cf93363e58a7af.jpg'},
  {name:'Pink long sleeve',   price:245000, img:'asset/minari produk/e4885b186d8e400282ddb42d6613aa28.jpg'},
];

const fmtIDR = v => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR'})
  .format(v).replace('IDR','Rp.');

// --- Ambil product dari query
const params = new URLSearchParams(location.search);
const name = params.get('product');

const product = products.find(p => p.name === name) || products[0];

// --- Inject ke UI
const elTitle = document.getElementById('pdTitle');
const elImg   = document.getElementById('pdImg');
const elPrice = document.getElementById('pdPrice');

elTitle.textContent = product.name;
elImg.src = product.img;
elImg.alt = product.name;
elPrice.textContent = fmtIDR(product.price);

// --- Stepper qty
let qty = 0;
const qtyInput = document.getElementById('qtyInput');
const btnMinus = document.getElementById('btnMinus');
const btnPlus  = document.getElementById('btnPlus');

function setQty(v){
  qty = Math.max(0, v|0);
  qtyInput.value = qty;
}
btnMinus.addEventListener('click', () => setQty(qty - 1));
btnPlus .addEventListener('click', () => setQty(qty + 1));
setQty(0);

// --- Add to cart (toast)
const addBtn  = document.getElementById('addBtn');
const toastEl = document.getElementById('miniToast');
const toast   = new bootstrap.Toast(toastEl);

addBtn.addEventListener('click', () => {
  if (qty <= 0){
    setQty(1);
  }
  // di sini kamu bisa push ke cart (localStorage / API)
  toastEl.querySelector('.toast-body').textContent =
    `“${product.name}” (${qty}) has been added to your cart.`;
  toast.show();
});

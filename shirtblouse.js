function isGuestRole() {
  try {
    const r = window.NavbarRole?.getRole?.() || localStorage.getItem('role') || 'guest';
    return r === 'guest';
  } catch {
    return (localStorage.getItem('role') || 'guest') === 'guest';
  }
}

const products = [
  {name:'Yellow shirt',       price:175000, img:'asset/minari produk/photo_1_2025-11-10_22-46-57.jpg'},
  {name:'Creamy white long sleeve shirt',   price:275000, img:'asset/minari produk/photo_4_2025-11-10_22-46-57.jpg'},
  {name:'Choco blouse',        price:199000, img:'asset/minari produk/photo_9_2025-11-10_22-46-57.jpg'},
  {name:'Blue shirt',        price:215000, img:'asset/minari produk/photo_10_2025-11-10_22-46-57.jpg'},
  {name:'White blouse',       price:239000, img:'asset/minari produk/photo_2_2025-11-10_22-46-57.jpg'},
  {name:'Blue linen roll-up sleeve shirt',    price:189000, img:'asset/minari produk/photo_5_2025-11-10_22-46-57.jpg'},
  {name:'Stripped cream long sleeve shirt',       price:259000, img:'asset/minari produk/photo_8_2025-11-10_22-46-57.jpg'},
  {name:'Soft brown long sleeve blouse',    price:299000, img:'asset/minari produk/photo_11_2025-11-10_22-46-57.jpg'},
  {name:'Yellow with blue ribbon blouse',   price:179000, img:'asset/minari produk/photo_3_2025-11-10_22-46-57.jpg'},
  {name:'Pink baloon shirt',       price:189000, img:'asset/minari produk/photo_6_2025-11-10_22-46-57.jpg'},
  {name:'Green jeans crop blouse',   price:225000, img:'asset/minari produk/photo_7_2025-11-10_22-46-57.jpg'},
  {name:'Pink long sleeve blouse',   price:245000, img:'asset/minari produk/photo_12_2025-11-10_22-46-57.jpg'},
];

const fmtIDR = v => new Intl.NumberFormat('id-ID',{style:'currency', currency:'IDR'})
  .format(v).replace('IDR','Rp.');

document.addEventListener('DOMContentLoaded', ()=>{
  const grid = document.getElementById('productGrid');
      if (!grid) return;

  // Render semua kartu
  const frag = document.createDocumentFragment();
  products.forEach(p=>{
    const col = document.createElement('div');
    col.className = 'col-6 col-md-4 col-lg-3';
col.innerHTML = `
 <a href="order.html?product=${encodeURIComponent(p.name)}" class="p-card-link">
  <article class="p-card">
    <div class="p-thumb">
      <img src="${p.img}" alt="${p.name}" loading="lazy">
    </div>

    <div class="p-info">
      <div class="p-info-row">
        <div class="p-text">
          <h6 class="p-name">${p.name}</h6>
          <div class="p-price">${fmtIDR(p.price)}</div>
        </div>

        <div class="p-mini-actions">
          <button class="p-wish" aria-label="Wishlist">
            <img src="asset/whislist.png" alt="wishlist">
          </button>
          <button class="p-cart" aria-label="Add to cart">
            <img src="asset/chart.png" alt="cart">
          </button>
        </div>
      </div>
    </div>
  </article>
  </a>`;


    frag.appendChild(col);
  });
  grid.appendChild(frag);

  // Toast instance
 const toastEl  = document.getElementById('miniToast');
  const toast    = new bootstrap.Toast(toastEl);
  const loginMdl = new bootstrap.Modal(document.getElementById('loginModal'));
  // Delegasi klik di grid
    grid.addEventListener('click', (e) => {
    const wishBtn     = e.target.closest('.p-wish');
    const cartIconBtn = e.target.closest('.p-cart');
    const addBtn      = e.target.closest('.p-add'); // kalau ada tombol Add

    // Helper ambil nama produk
    const getName = (btn) =>
      btn?.closest('.p-card')?.querySelector('.p-name')?.textContent || 'Item';

    // 1) Wishlist
    if (wishBtn) {
      e.preventDefault();
      e.stopPropagation();

      if (isGuestRole()) {
        // Guest → minta login
        loginMdl.show();
      } else {
        // User/Admin → sukses tambah wishlist
        wishBtn.classList.toggle('active');
        toastEl.querySelector('.toast-body').textContent =
          `“${getName(wishBtn)}” has been added to your wishlist.`;
        toast.show();
      }
      return;
    }

    // 2) Add to cart (ikon kecil atau tombol Add)
    if (cartIconBtn || addBtn) {
      e.preventDefault();
      e.stopPropagation();

      toastEl.querySelector('.toast-body').textContent =
        `“${getName(cartIconBtn || addBtn)}” has been added to your cart.`;
      toast.show();
      return;
    }
  });

});


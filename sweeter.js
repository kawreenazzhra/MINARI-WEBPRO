function isGuestRole() {
  try {
    const r = window.NavbarRole?.getRole?.() || localStorage.getItem('role') || 'guest';
    return r === 'guest';
  } catch {
    return (localStorage.getItem('role') || 'guest') === 'guest';
  }
}

const products = [
  {name:'Blue sweater',       price:175000, img:'asset/minari produk/photo_13_2025-11-10_22-46-57.jpg'},
  {name:'White crop fleece jacket',   price:250000, img:'asset/minari produk/photo_18_2025-11-10_22-46-57.jpg'},
  {name:'Offwhite oversized cardigan',        price:250000, img:'asset/minari produk/photo_19_2025-11-10_22-46-57.jpg'},
  {name:'Stripped cream sweater',        price:200000, img:'asset/minari produk/photo_24_2025-11-10_22-46-57.jpg'},
  {name:'Dark blue cardigan',       price:300000, img:'asset/minari produk/photo_14_2025-11-10_22-46-57.jpg'},
  {name:'Soft green cardigan',    price:250000, img:'asset/minari produk/photo_17_2025-11-10_22-46-57.jpg'},
  {name:'Dark green fuzzy knit cardigan',       price:300000, img:'asset/minari produk/photo_20_2025-11-10_22-46-57.jpg'},
  {name:'Tiger lily fleece jacket',    price:260000, img:'asset/minari produk/photo_23_2025-11-10_22-46-57.jpg'},
  {name:'Cherry white fleece jacket',   price:250000, img:'asset/minari produk/photo_15_2025-11-10_22-46-57.jpg'},
  {name:'Baby pinl bow oversized sweater',       price:220000, img:'asset/minari produk/photo_16_2025-11-10_22-46-57.jpg'},
  {name:'Maroon bow sweater',   price:200000, img:'asset/minari produk/photo_21_2025-11-10_22-46-57.jpg'},
  {name:'Heart rabit fleece jacket',   price:300000, img:'asset/minari produk/photo_22_2025-11-10_22-46-57.jpg'},
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

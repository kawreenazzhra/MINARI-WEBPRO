function isGuestRole() {
  try {
    const r = window.NavbarRole?.getRole?.() || localStorage.getItem('role') || 'guest';
    return r === 'guest';
  } catch {
    return (localStorage.getItem('role') || 'guest') === 'guest';
  }
}

const products = [
  {name:'Asymmetrical ruffle midi denim skirt',       price:275000, img:'asset/minari produk/photo_49_2025-11-10_22-46-57.jpg'},
  {name:'Polka brown midi dress',   price:220000, img:'asset/minari produk/photo_54_2025-11-10_22-46-57.jpg'},
  {name:'Ivory tweed flare maxi skirt',        price:300000, img:'asset/minari produk/photo_55_2025-11-10_22-46-57.jpg'},
  {name:'White Woven Pleated Midaxi Skirt',        price:200000, img:'asset/minari produk/photo_60_2025-11-10_22-46-57.jpg'},
  {name:'Black mid-length dress',       price:250000, img:'asset/minari produk/photo_50_2025-11-10_22-46-57.jpg'},
  {name:'Tartan maxi skirt',    price:200000, img:'asset/minari produk/photo_53_2025-11-10_22-46-57.jpg'},
  {name:'Floral white maxi skirt',       price:200000, img:'asset/minari produk/photo_56_2025-11-10_22-46-57.jpg'},
  {name:'Puff sleeve floral dress',    price:250000, img:'asset/minari produk/photo_59_2025-11-10_22-46-57.jpg'},
  {name:'A-line denim maxi skirt',   price:250000, img:'asset/minari produk/photo_51_2025-11-10_22-46-57.jpg'},
  {name:'Pinafore cream dress',       price:275000, img:'asset/minari produk/photo_52_2025-11-10_22-46-57.jpg'},
  {name:'Rose linen dress',   price:275000, img:'asset/minari produk/photo_57_2025-11-10_22-46-57.jpg'},
  {name:'Yellow floral dress',   price:250000, img:'asset/minari produk/photo_58_2025-11-10_22-46-57.jpg'},
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

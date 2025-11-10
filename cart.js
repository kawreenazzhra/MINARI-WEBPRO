// cart.js — drop-in buat HTML kamu sekarang (tanpa ubah markup)

// UBAH kalau file payment kamu beda path/namanya
const PAYMENT_PAGE = 'paymentcust.html';

document.addEventListener('DOMContentLoaded', () => {
  const selectAll   = document.getElementById('selectAll');
  const cartList    = document.getElementById('cartList');
  const totalPrice  = document.getElementById('totalPrice');
  const checkoutBtn = document.getElementById('checkoutBtn');

  const toNum = (v) => Number(String(v).replace(/[^\d]/g, '')) || 0;
  const fmtIDR = (n) => 'Rp. ' + (Number(n) || 0).toLocaleString('id-ID');

  function getRows(){
    return [...cartList.querySelectorAll('.cart-item')];
  }

  function computeTotal(){
    let total = 0;
    getRows().forEach(row => {
      const checked = row.querySelector('.item-check')?.checked;
      const price   = Number(row.dataset.price || 0);
      const qtyInp  = row.querySelector('.item-qty');
      const qty     = Math.max(1, Number(qtyInp?.value || 1));
      if (checked) total += price * qty;
    });
    totalPrice.textContent = fmtIDR(total);
    checkoutBtn.disabled = total === 0;
    return total;
  }

  function syncSelectAll(){
    const checks = [...cartList.querySelectorAll('.item-check')];
    const checkedCount = checks.filter(c => c.checked).length;
    selectAll.checked = checkedCount > 0 && checkedCount === checks.length;
    selectAll.indeterminate = checkedCount > 0 && checkedCount < checks.length;
  }

  // === Event: Select All
  selectAll.addEventListener('change', () => {
    cartList.querySelectorAll('.item-check').forEach(c => c.checked = selectAll.checked);
    computeTotal();
  });

  // === Delegasi tombol +/-
  cartList.addEventListener('click', (e) => {
    const row = e.target.closest('.cart-item');
    if (!row) return;

    if (e.target.classList.contains('btnPlus')) {
      const inp = row.querySelector('.item-qty');
      inp.value = Math.max(1, Number(inp.value || 1) + 1);
      computeTotal();
    }
    if (e.target.classList.contains('btnMinus')) {
      const inp = row.querySelector('.item-qty');
      inp.value = Math.max(1, Number(inp.value || 1) - 1);
      computeTotal();
    }
  });

  // === Perubahan qty / centang item
  cartList.addEventListener('change', (e) => {
    const el = e.target;
    if (el.classList.contains('item-qty')) {
      el.value = Math.max(1, Number(el.value || 1));
      computeTotal();
    }
    if (el.classList.contains('item-check')) {
      syncSelectAll();
      computeTotal();
    }
  });

  // === Checkout: simpan data yang dibutuhkan paymentcust.js
  checkoutBtn.addEventListener('click', () => {
    const rows = getRows();
    const selected = [];

    rows.forEach(row => {
      const checked = row.querySelector('.item-check')?.checked;
      if (!checked) return;

      // Ambil data dari DOM yg sudah ada (tanpa ubah HTML):
      const id     = row.dataset.id || '';
      const price  = Number(row.dataset.price || 0);
      const qty    = Math.max(1, Number(row.querySelector('.item-qty')?.value || 1));
      const imgEl  = row.querySelector('img');
      const nameEl = row.querySelector('.fw-semibold'); // judul kamu pakai class ini
      const image  = imgEl ? imgEl.getAttribute('src') : '';
      const name   = nameEl ? nameEl.textContent.trim() : 'Item';

      selected.push({ id, name, image, price, quantity: qty });
    });

    if (!selected.length) {
      alert('Please select at least one item to checkout');
      return;
    }

    const total = toNum(totalPrice.textContent);

    // Simpan persis seperti yang dibaca paymentcust.js
    localStorage.setItem('selectedCartItems', JSON.stringify(selected));
    localStorage.setItem('cartTotal', String(total));
    localStorage.setItem('currentOrderNumber', 'ORD' + Date.now().toString().slice(-6));

    // Lanjut ke payment
    window.location.href = PAYMENT_PAGE;
  });

  // init
  computeTotal();
});

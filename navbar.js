// ====== Role utils ======
const Role = { GUEST: 'guest', USER: 'user', ADMIN: 'admin' };

function getRole() { return localStorage.getItem('role') || Role.GUEST; }
function setRole(r) { localStorage.setItem('role', r); }
function clearRole() { localStorage.removeItem('role'); }

// ====== Templates ======
function tplGuest() {
  return `
  <nav class="navbar navbar-expand-lg fixed-top py-3">
    <div class="container">
      <a class="navbar-brand" href="landing.html">
        <img src="asset/logofix.png" alt="MINARI Logo" width="100" height="auto" class="me-2">
      </a>

      <div class="d-flex align-items-center ms-auto gap-3">
        <button id="accBtn" class="btn p-0 border-0 bg-transparent" aria-label="Account">
          <img src="asset/akun.png" alt="User" width="24" height="24">
        </button>
        <a href="whislist.html"><img src="asset/whislist.png" alt="Favorite" width="24" height="24"></a>
        <a href="menu.html"><img src="asset/searchnav.png" alt="Search"   width="24" height="24"></a>
        <a href="cart.html"><img  src="asset/chart.png"    alt="Cart"     width="24" height="24"></a>
        <a href="menu.html"><img  src="asset/menu.png"     alt="Menu"     width="24" height="24"></a>
      </div>
    </div>
  </nav>

  <!-- accMini -->
  <div id="accMini" class="accmini" aria-hidden="true" role="dialog">
    <div class="accmini__row">
      <img src="asset/akun.png" width="16" height="16" class="accmini__icon" alt="">
      <a id="accMiniName" href="akungues.html" class="accmini__name">Guest</a>
    </div>
<a id="accMiniBtn" class="accmini__btn" href="login.html">Log in</a>
  </div>`;
}

function tplUser() {
  return `
  <nav class="navbar navbar-expand-lg sticky-top py-3">
    <div class="container">
      <a class="navbar-brand" href="landing.html">
        <img src="asset/logofix.png" alt="MINARI Logo" width="100" height="auto" class="me-2">
      </a>

      <div class="d-flex align-items-center ms-auto gap-3">
        <button id="accBtn" class="btn p-0 border-0 bg-transparent" aria-label="Account">
          <img src="asset/akun.png" alt="User" width="24" height="24">
        </button>
        <a href="whislist.html"><img src="asset/whislist.png" alt="Favorite" width="24" height="24"></a>
        <a href="menu.html"><img src="asset/searchnav.png" alt="Search"   width="24" height="24"></a>
        <a href="cart.html"><img  src="asset/chart.png"    alt="Cart"     width="24" height="24"></a>
        <a href="menu.html"><img  src="asset/menu.png"     alt="Menu"     width="24" height="24"></a>
      </div>
    </div>
  </nav>

  <div id="accMini" class="accmini" aria-hidden="true" role="dialog">
    <div class="accmini__row">
      <img src="asset/akun.png" width="16" height="16" class="accmini__icon" alt="">
      <a class="accmini__link" href="akungues.html" style="text-decoration: none; color: black;">Account</a>
    </div>
    
    <div class="accmini__row">
      <img src="asset/order history.png" width="16" height="16" class="accmini__icon" alt="">
       <a class="accmini__link" href="orderhistorycustomers.html" style="text-decoration: none; color: black;">Order history</a>
    </div>
   
    <a id="accMiniBtn" class="accmini__btn" href="login.html">Log out</a>
  </div>`;
}

function tplAdmin() {
  return `
  <nav class="navbar navbar-expand-lg sticky-top py-3">
    <div class="container">
      <a class="navbar-brand" href="landing.html">
        <img src="asset/logofix.png" alt="MINARI Logo" width="100" height="auto" class="me-2">
      </a>

      <div class="d-flex align-items-center ms-auto gap-3">
        <button id="accBtn" class="btn p-0 border-0 bg-transparent" aria-label="Admin">
          <img src="asset/akun.png" alt="Admin" width="24" height="24">
        </button>
        <a href="menu.html"><img src="asset/searchnav.png" alt="Search"   width="24" height="24"></a>
        <a href="dashboardadmin.html"><img  src="asset/add.png"    alt="dashboard"     width="24" height="24"></a>
        <a href="menu.html"><img  src="asset/menu.png"     alt="Menu"     width="24" height="24"></a>
      </div>
    </div>
  </nav>

  <div id="accMini" class="accmini" aria-hidden="true" role="dialog">
    <div class="accmini__row">
      <img src="asset/akun.png" width="16" height="16" class="accmini__icon" alt="">
      <a class="accmini__link" href="akungues.html" style="text-decoration: none; color: black;">Account</a>
    </div>
    
    <div class="accmini__row">
      <img src="asset/add.png" width="16" height="16" class="accmini__icon" alt="">
       <a class="accmini__link" href="dashboardadmin.html" style="text-decoration: none; color: black;">Dashboard</a>
    </div>
   
 <a id="accMiniBtn" class="accmini__btn" href="login.html">Log out</a>
  </div>`;
}

// ====== Render + Interaksi ======
function renderNavbar() {
  const mount = document.getElementById('navMount');
  if (!mount) return;

  const role = getRole();
  mount.innerHTML =
    role === Role.ADMIN ? tplAdmin()
  : role === Role.USER  ? tplUser()
  : tplGuest();

  // 1) Efek scroll (add/remove .scrolled)
  const navbar = mount.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 50) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // 2) accMini (dropdown kecil)
  const accMini = document.getElementById('accMini');
  const accBtn  = document.getElementById('accBtn');
  const nameEl  = document.getElementById('accMiniName');
  const btn     = document.getElementById('accMiniBtn');

function syncUI(){
  if (!nameEl || !btn) return;

  const doLogout = () => {
    // Bersihkan semua jejak login yang dipakai di project
    localStorage.removeItem('role');
    localStorage.removeItem('adminLoggedIn'); // << penting!
    // tutup menu & redirect
    closeMenu();
    location.href = 'landing.html'; // lebih tegas daripada reload()
  };

  if (role === Role.USER) {
    nameEl.textContent = 'Account';
    btn.textContent = 'Log out';
    btn.onclick = doLogout;
  } else if (role === Role.ADMIN) {
    nameEl.textContent = 'Admin';
    btn.textContent = 'Log out';
    btn.onclick = doLogout;
  } else {
    nameEl.textContent = 'Guest';
    btn.textContent = 'Log in';
    // biar login jalan pasti
    btn.onclick = () => { location.href = 'login.html'; };
  }
}

if (btn) {
  btn.addEventListener('click', (e) => {
    const r = getRole();
    // Kalau bukan guest, anggap tombol = logout
    if (r === Role.USER || r === Role.ADMIN) {
      e.preventDefault();
      localStorage.removeItem('role');
      localStorage.removeItem('adminLoggedIn');
      closeMenu();
      location.href = 'landing.html';
    }
    // kalau guest, biarkan menuju login.html (handler di syncUI)
  });
}

  function positionMenu(){
  if (!accMini || !accBtn) return;
  const r = accBtn.getBoundingClientRect(); // posisi relatif viewport
  // tempatkan tepat di bawah tombol account
  accMini.style.top  = `${r.bottom + 10}px`;
  // sejajarkan sisi kanan panel dengan tombol (220 = lebar panel)
  accMini.style.left = `${r.left - (220 - r.width)}px`;
}

  function openMenu(){
  if (!accMini || !accBtn) return;
  syncUI();
  positionMenu();
  accMini.classList.add('show');

  document.addEventListener('click', onDocClick, true);
  document.addEventListener('keydown', onKey);
  window.addEventListener('resize', positionMenu);
  // Jika navbar kamu fixed, scroll sebenarnya tidak mengubah posisi ikon,
  // tapi tidak masalah kalau mau tetap update:
  window.addEventListener('scroll', positionMenu, { passive: true });
}

function closeMenu(){
  if (!accMini) return;
  accMini.classList.remove('show');
  document.removeEventListener('click', onDocClick, true);
  document.removeEventListener('keydown', onKey);
  window.removeEventListener('resize', positionMenu);
  window.removeEventListener('scroll', positionMenu);
}
  function onDocClick(e){
    if (accMini.contains(e.target) || accBtn.contains(e.target)) return;
    closeMenu();
  }
  function onKey(e){ if (e.key === 'Escape') closeMenu(); }

  if (accBtn && accMini) {
    accBtn.addEventListener('click', (e) => {
      e.preventDefault();
      accMini.classList.contains('show') ? closeMenu() : openMenu();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('#navMount .navbar');
  if (!nav) return;
  const h = nav.offsetHeight;
  document.documentElement.style.setProperty('--nav-h', h + 'px');
    });
}

// Auto-render setelah DOM siap
document.addEventListener('DOMContentLoaded', renderNavbar);

// Expose untuk dipakai di halaman login
window.NavbarRole = { setRole, getRole, clearRole, Role };



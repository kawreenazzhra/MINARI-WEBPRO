document.addEventListener('DOMContentLoaded', function () {
  const fieldName     = document.getElementById('fieldName');
  const fieldPhone    = document.getElementById('fieldPhone');
  const fieldEmail    = document.getElementById('fieldEmail');
  const fieldBirth    = document.getElementById('fieldBirth');
  const fieldAddress  = document.getElementById('fieldAddress');
  const addAddressLink= document.getElementById('addAddressLink');
  const primaryAction = document.getElementById('primaryAction');
  const manageAddrBtn = document.getElementById('manageAddressBtn');
  const roleBadge     = document.getElementById('roleBadge');
  const userEmoji     = document.getElementById('userEmoji');

  const role     = localStorage.getItem('role') || 'guest';
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  function fillData(data = {}) {
    fieldName.textContent    = data.name    || '-';
    fieldPhone.textContent   = data.phone   || '-';
    fieldEmail.textContent   = data.email   || '-';
    fieldBirth.textContent   = data.birth   || '-';
    fieldAddress.textContent = data.address || '-';
    if (data.emoji && userEmoji) userEmoji.textContent = data.emoji;
  }

  function asGuest() {
    roleBadge.textContent = 'Status: Guest';
    fillData({});
    primaryAction.textContent = 'LOG IN';
    primaryAction.href = 'login.html';
    addAddressLink.style.display = 'none';
    manageAddrBtn.style.display = 'none';
  }

  function asUser() {
    roleBadge.textContent = 'Status: User';
    fillData(userData);
    primaryAction.textContent = 'LOG OUT';
    primaryAction.href = '#';
    primaryAction.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Log out from your account?')) {
        localStorage.removeItem('role');
        localStorage.removeItem('userData');
        window.location.reload();
      }
    });
    addAddressLink.style.display = '';
    manageAddrBtn.style.display = '';
  }

  function asAdmin() {
    roleBadge.textContent = 'Status: Admin';
    fillData({
      name: 'Admin MINARI',
      phone: '0800-ADMIN',
      email: 'admin@minari.com',
      birth: '—',
      address: 'MINARI HQ Office',
      emoji: '🛠️'
    });
    primaryAction.textContent = 'LOG OUT';
    primaryAction.href = '#';
    primaryAction.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Log out from your account?')) {
        localStorage.removeItem('role');
        localStorage.removeItem('userData');
        window.location.reload();
      }
    });
    addAddressLink.style.display = '';
    manageAddrBtn.style.display = '';
  }

  // Routing peran
  if (role === 'user') asUser();
  else if (role === 'admin') asAdmin();
  else asGuest();

  // “ADD NEW SHIPPING ADDRESS” → arahkan ke halaman address (bisa kamu ganti)
  addAddressLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (localStorage.getItem('role') === 'user') {
      window.location.href = 'shippingaddcust.html';
    } else {
      // guest diminta login
      window.location.href = 'login.html';
    }
  });
});

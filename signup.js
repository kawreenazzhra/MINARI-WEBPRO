// login.js (robust redirect)
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const errorsEl = document.getElementById('formErrors');
  const googleBtn = document.getElementById('SignLogin');
  const eyeBtn = document.querySelector('.toggle-pass');
  const passInput = document.getElementById('password');

  // ====== CONFIG: ubah sesuai letak file tujuan ======
  const TARGET_AFTER_SIGNUP = '/landing.html'; // bisa './landing.html' kalau semua file di root yg sama
  // ===================================================

  // Toggle show/hide password
  if (eyeBtn && passInput) {
    eyeBtn.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      const isPass = passInput.type === 'password';
      passInput.type = isPass ? 'text' : 'password';
      eyeBtn.textContent = isPass ? '🙈' : '👁️';
    });
  }

  // Helpers
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const isUsername = (v) => /^[a-zA-Z0-9_.]{3,20}$/.test(v);
  const isPhone = (v) => /^[+0-9][0-9\s\-]{7,16}$/.test(v);
  const getAge = (s) => {
    const b = new Date(s);
    if (isNaN(b)) return 0;
    const diff = Date.now() - b.getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };
  const showErrors = (list) => {
    errorsEl.innerHTML = list.length
      ? '<ul class="mb-0 ps-3">' + list.map(e => `<li>${e}</li>`).join('') + '</ul>'
      : '';
  };

  // Submit (Sign up)
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const fullName = document.getElementById('fullName').value.trim();
    const username = document.getElementById('username').value.trim();
    const phone    = document.getElementById('phone').value.trim();
    const email    = document.getElementById('email').value.trim();
    const birth    = document.getElementById('birthdate').value;
    const password = passInput.value;

    const errs = [];
    if (fullName.length < 2) errs.push('Name must be at least 2 characters.');
    if (!isUsername(username)) errs.push('Username must be 3–20 chars (letters, numbers, underscore, dot).');
    if (!isPhone(phone)) errs.push('Phone number format is invalid.');
    if (!isEmail(email)) errs.push('Email is invalid.');
    if (!birth) errs.push('Birthday is required.');
    else if (getAge(birth) < 13) errs.push('You must be at least 13 years old.');
    if (password.length < 6) errs.push('Password must be at least 6 characters.');

    const users = JSON.parse(localStorage.getItem('minari_users') || '[]');
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) errs.push('Email is already registered.');
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) errs.push('Username is already taken.');

    showErrors(errs);
    if (errs.length) return;

    const newUser = { id: crypto.randomUUID(), fullName, username, phone, email, birth, passwordHash: btoa(password) };
    users.push(newUser);
    localStorage.setItem('minari_users', JSON.stringify(users));

    localStorage.setItem('customerLoggedIn', 'true');
    localStorage.setItem('customerName', fullName);
    localStorage.removeItem('adminLoggedIn');

    console.log('[signup] redirect ->', TARGET_AFTER_SIGNUP);

    // paksa redirect yang bersih
    try {
      window.location.replace(TARGET_AFTER_SIGNUP);
    } catch {
      window.location.href = TARGET_AFTER_SIGNUP;
    }
    return false;
  });

  // Google sign-in (simulasi)
  googleBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    localStorage.setItem('customerLoggedIn', 'true');
    localStorage.setItem('customerName', 'Google User');
    localStorage.removeItem('adminLoggedIn');

    console.log('[google] redirect ->', TARGET_AFTER_SIGNUP);

    try {
      window.location.replace(TARGET_AFTER_SIGNUP);
    } catch {
      window.location.href = TARGET_AFTER_SIGNUP;
    }
    return false;
  });

  // Mencegah bubbling ke navbar/link lain
  document.querySelector('.login-box')?.addEventListener('click', (ev) => ev.stopPropagation());
});
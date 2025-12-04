// navigation.js - Mengatur navigasi antara halaman

// Fungsi untuk redirect ke halaman login
function redirectToLogin() {
    window.location.href = 'login.html';
}

// Fungsi untuk redirect ke dashboard
function redirectToDashboard() {
    window.location.href = 'dashboardadmin.html';
}

// Fungsi untuk redirect ke landing page
function redirectToLanding() {
    window.location.href = 'landingpage.html';
}

// Fungsi untuk menangani login
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Validasi sederhana
    if (username === 'admin' && password === 'admin') {
        // Simulasi login berhasil
        localStorage.setItem('adminLoggedIn', 'true');
        redirectToDashboard();
    } else {
        alert('Invalid username or password. Try: admin/admin');
    }
}

// Fungsi untuk logout
function handleLogout() {
    localStorage.removeItem('adminLoggedIn');
    redirectToLogin();
}

// FUNGSI BARU: Tambahkan tombol logout di navbar
function addLogoutButton() {
    const navbarIcons = document.querySelector('.navbar-icons');
    if (navbarIcons && !document.querySelector('.fa-sign-out-alt')) {
        const logoutIcon = document.createElement('i');
        logoutIcon.className = 'fas fa-sign-out-alt';
        logoutIcon.title = 'Logout';
        logoutIcon.style.cursor = 'pointer';
        logoutIcon.style.marginLeft = '25px';
        logoutIcon.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('adminLoggedIn');
                window.location.href = 'login.html';
            }
        });
        navbarIcons.appendChild(logoutIcon);
    }
}

// FUNGSI BARU: Mengatur tinggi sidebar agar tidak bertabrakan dengan footer
function adjustSidebarHeight() {
    const sidebar = document.querySelector('.sidebar');
    const footer = document.querySelector('footer');
    
    if (sidebar && footer) {
        const footerHeight = footer.offsetHeight;
        const windowHeight = window.innerHeight;
        const sidebarTop = sidebar.getBoundingClientRect().top + window.pageYOffset;
        
        // Hitung tinggi maksimal sidebar dengan buffer 20px
        const maxSidebarHeight = windowHeight - sidebarTop - footerHeight - 20;
        
        // Terapkan tinggi yang aman
        if (maxSidebarHeight > 0) {
            sidebar.style.height = maxSidebarHeight + 'px';
            sidebar.style.overflowY = 'auto';
        }
    }
}

// FUNGSI BARU: Memastikan konten utama tidak tertutup sidebar
function adjustMainContentMargin() {
    const mainContent = document.querySelector('.main-content');
    const sidebar = document.querySelector('.sidebar');
    
    if (mainContent && sidebar) {
        const sidebarWidth = sidebar.offsetWidth;
        mainContent.style.marginLeft = (sidebarWidth + 30) + 'px';
    }
}

// Fungsi untuk inisialisasi sidebar di semua halaman admin
function initializeSidebar() {
    // Dapatkan path halaman saat ini
    const currentPage = window.location.pathname.split('/').pop();
    
    // Hapus class active dari semua item sidebar
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Tambahkan class active ke item sidebar yang sesuai
    const pageMap = {
        'dashboardadmin.html': 'dashboardadmin.html',
        'productadmin.html': 'productadmin.html',
        'categoriesadmin.html': 'categoriesadmin.html',
        'ordersadmin.html': 'ordersadmin.html',
        'customersadmin.html': 'customersadmin.html',
        'reviewadmin.html': 'reviewadmin.html',
        'promotionsadmin.html': 'promotionsadmin.html'
    };
    
    if (pageMap[currentPage]) {
        const activeItem = document.querySelector(`.sidebar-item[href="${pageMap[currentPage]}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }
    
    // FUNGSI BARU: Tambahkan event listener untuk item sidebar
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', function(e) {
            // Hapus class active dari semua item
            document.querySelectorAll('.sidebar-item').forEach(i => {
                i.classList.remove('active');
            });
            // Tambahkan class active ke item yang diklik
            this.classList.add('active');
        });
    });
}

// PERBAIKAN: Cek status login - Biarkan akses login page meski sudah login
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    // Jika di halaman admin tapi belum login, redirect ke login
    const adminPages = [
        'dashboardadmin.html', 'productadmin.html', 'categoriesadmin.html',
        'ordersadmin.html', 'customersadmin.html', 'reviewadmin.html', 'promotionsadmin.html'
    ];
    
    if (adminPages.includes(currentPage) && !isLoggedIn) {
        redirectToLogin();
        return false;
    }
    
    // PERBAIKAN: Jika di halaman login tapi sudah login, TIDAK redirect
    // Biarkan user tetap bisa melihat login page
    if (currentPage === 'login.html' && isLoggedIn) {
        // Tidak melakukan redirect, biarkan user melihat login page
        console.log('User sudah login, tapi biarkan akses login page');
        return true;
    }
    
    return true;
}

// FUNGSI BARU: Handle window resize untuk responsive design
function handleResize() {
    adjustSidebarHeight();
    adjustMainContentMargin();
    
    // Untuk mobile, atur ulang sidebar
    if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.style.height = 'auto';
            sidebar.style.position = 'relative';
            sidebar.style.top = '0';
        }
        
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.marginLeft = '20px';
        }
    } else {
        // Untuk desktop, kembalikan ke fixed position
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.style.position = 'fixed';
            sidebar.style.top = '90px';
            adjustSidebarHeight();
        }
    }
}

// FUNGSI BARU: Initialize semua komponen UI
function initializeUI() {
    // Inisialisasi sidebar
    initializeSidebar();
    
    // Atur tinggi sidebar dan margin konten
    adjustSidebarHeight();
    adjustMainContentMargin();
    
    // Tambahkan tombol logout di halaman admin
    const adminPages = [
        'dashboardadmin.html', 'productadmin.html', 'categoriesadmin.html',
        'ordersadmin.html', 'customersadmin.html', 'reviewadmin.html', 'promotionsadmin.html'
    ];
    
    const currentPage = window.location.pathname.split('/').pop();
    if (adminPages.includes(currentPage)) {
        addLogoutButton();
    }
    
    // Tambahkan loading state
    document.body.classList.add('fade-in');
    
    // Set timeout untuk menghapus loading state
    setTimeout(() => {
        document.body.classList.remove('fade-in');
    }, 500);
}


// Event listeners untuk navigasi
document.addEventListener('DOMContentLoaded', function() {
    // Cek status login
    if (!checkLoginStatus()) return;
    
    // Inisialisasi UI
    initializeUI();
    
    // TAMBAHKAN: Aktifkan navbar scroll effect
    handleNavbarScroll();
    
    // Jika di landing page, tambahkan event listener ke ikon user
    if (window.location.pathname.includes('landingpage.html') || 
        window.location.pathname.endsWith('/') ||
        window.location.pathname.includes('index.html')) {
        const userIcon = document.querySelector('.fa-user');
        if (userIcon) {
            userIcon.addEventListener('click', function(e) {
                e.preventDefault();
                redirectToLogin();
            });
        }
    }
    
    // Jika di halaman login, tambahkan event listener ke form
    if (window.location.pathname.includes('login.html')) {
        const loginForm = document.querySelector('form');
        if (loginForm) {
            // Hapus event listener lama dan tambahkan yang baru
            loginForm.onsubmit = null;
            loginForm.addEventListener('submit', handleLogin);
        }
        
        // Event listener untuk tombol back
        const backLink = document.querySelector('.back-link a');
        if (backLink) {
            backLink.addEventListener('click', function(e) {
                e.preventDefault();
                redirectToLanding();
            });
        }
        
        // PERBAIKAN: Tampilkan status login jika sudah login
        const isLoggedIn = localStorage.getItem('adminLoggedIn');
        if (isLoggedIn) {
            const loginRight = document.querySelector('.login-right');
            if (loginRight) {
                const statusDiv = document.createElement('div');
                statusDiv.style.background = '#e9f7ef';
                statusDiv.style.padding = '15px';
                statusDiv.style.borderRadius = '10px';
                statusDiv.style.marginTop = '20px';
                statusDiv.style.textAlign = 'center';
                statusDiv.style.border = '1px solid #d4edda';
                statusDiv.innerHTML = `
                    <p style="margin: 0; color: #155724; font-weight: 500;">
                        <i class="fas fa-check-circle"></i> You are already logged in
                    </p>
                    <button onclick="localStorage.removeItem('adminLoggedIn'); location.reload();" 
                            style="background: #6c757d; border: none; padding: 8px 15px; border-radius: 5px; color: white; margin-top: 10px; cursor: pointer;">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                `;
                loginRight.appendChild(statusDiv);
            }
        }
    }
    
    // Inisialisasi sidebar dan komponen UI di semua halaman admin
    const adminPages = [
        'dashboardadmin.html', 'productadmin.html', 'categoriesadmin.html',
        'ordersadmin.html', 'customersadmin.html', 'reviewadmin.html', 'promotionsadmin.html'
    ];
    
    const currentPage = window.location.pathname.split('/').pop();
    if (adminPages.includes(currentPage)) {
        // Tambahkan event listener untuk ikon bell (notifikasi)
        const bellIcon = document.querySelector('.fa-bell');
        if (bellIcon) {
            bellIcon.addEventListener('click', function() {
                alert('No new notifications');
            });
        }
        
        // Tambahkan event listener untuk ikon search
        const searchIcon = document.querySelector('.fa-search');
        if (searchIcon) {
            searchIcon.addEventListener('click', function() {
                const searchBox = document.querySelector('.search-box');
                if (searchBox) {
                    searchBox.focus();
                }
            });
        }
        
        // Tambahkan event listener untuk ikon envelope (pesan)
        const envelopeIcon = document.querySelector('.fa-envelope');
        if (envelopeIcon) {
            envelopeIcon.addEventListener('click', function() {
                alert('No new messages');
            });
        }
    }
    
    // Tambahkan event listener untuk window resize
    window.addEventListener('resize', handleResize);
    
    // Tambahkan smooth scrolling untuk anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // FUNGSI BARU: Prevent form submission yang tidak diinginkan
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            // Hanya biarkan form login yang di-handle khusus
            if (!this.classList.contains('login-form')) {
                e.preventDefault();
                // Tambahkan logika form handling di sini
                console.log('Form submitted:', this.id || this.className);
            }
        });
    });
});

// FUNGSI BARU: Export functions untuk penggunaan di file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        redirectToLogin,
        redirectToDashboard,
        redirectToLanding,
        handleLogin,
        handleLogout,
        adjustSidebarHeight,
        initializeSidebar,
        checkLoginStatus,
        handleNavbarScroll
    };
}

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


document.querySelectorAll('.style-scroll, .category-scroll').forEach(scrollArea => {
  let scrollInterval;

  scrollArea.addEventListener('mousemove', (e) => {
    const rect = scrollArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const center = rect.width / 2;

    clearInterval(scrollInterval);
    scrollInterval = setInterval(() => {
      const speed = 15;
      if (x > center + 50) {
        scrollArea.scrollLeft += speed;
      } else if (x < center - 50) {
        scrollArea.scrollLeft -= speed;
      }
    }, 20);
  });

  scrollArea.addEventListener('mouseleave', () => {
    clearInterval(scrollInterval);
  });
});

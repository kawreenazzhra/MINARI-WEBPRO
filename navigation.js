function redirectToLogin() {
    window.location.href = 'login.html';
}

function redirectToDashboard() {
    window.location.href = 'dashboardadmin.html';
}

function redirectToLanding() {
    window.location.href = 'landing.html';
}

function redirectToLandingAdmin() {
    window.location.href = 'landing.html';
}

function handleLogoClick() {
    const role = localStorage.getItem('role');
    if (role === 'admin') {
        redirectToDashboard();
    } else {
        redirectToLanding();
    }
}

function isAdmin() {
    return getRole() === 'admin';
}

function isUser() {
    return getRole() === 'user';
}

function handlePlusIconClick() {
    const role = localStorage.getItem('role');

    if (role === 'admin') {
        redirectToDashboard();
    } else {
        redirectToLogin();
    }
}


function initializeSeparateNavigation() {
    const logos = document.querySelectorAll('.logo, .logo img');
    logos.forEach(logo => {
        logo.style.cursor = 'pointer';
        logo.onclick = null;
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogoClick();
        });
    });
    
    const plusIcons = document.querySelectorAll('.fa-plus, .fa-add');
    plusIcons.forEach(icon => {
        icon.style.cursor = 'pointer';
        icon.onclick = null;
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            handlePlusIconClick();
        });
    });
}

function handleLogin(event) {
    event.preventDefault();

    const usernameEl = document.getElementById('username');
    const passwordEl = document.getElementById('password');

    if (!usernameEl || !passwordEl) {
        alert('Form login tidak lengkap (username/password tidak ditemukan).');
        return;
    }

    const username = usernameEl.value.trim();
    const password = passwordEl.value.trim();

    // Kredensial contoh
    if (username === 'admin' && password === 'admin') {
        localStorage.setItem('role', 'admin');
        window.location.href = ADMIN_DASHBOARD;
        return;
    }

    if (username === 'user' && password === 'user') {
        localStorage.setItem('role', 'user');
        window.location.href = LANDING_PAGE;
        return;
    }
}


function handleLogout() {
    localStorage.removeItem('role');     // hapus role admin/user
    window.location.href = 'landing.html'; // kembali ke landing guest
}


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
                handleLogout();
            }
        });
        navbarIcons.appendChild(logoutIcon);
    }
}

function adjustSidebarHeight() {
    const sidebar = document.querySelector('.sidebar');
    const footer = document.querySelector('footer');
    if (sidebar && footer) {
        const footerHeight = footer.offsetHeight;
        const windowHeight = window.innerHeight;
        const sidebarTop = sidebar.getBoundingClientRect().top + window.pageYOffset;
        const maxSidebarHeight = windowHeight - sidebarTop - footerHeight - 20;
        if (maxSidebarHeight > 0) {
            sidebar.style.height = maxSidebarHeight + 'px';
            sidebar.style.overflowY = 'auto';
        }
    }
}

function adjustMainContentMargin() {
    const mainContent = document.querySelector('.main-content');
    const sidebar = document.querySelector('.sidebar');
    if (mainContent && sidebar) {
        const sidebarWidth = sidebar.offsetWidth;
        mainContent.style.marginLeft = (sidebarWidth + 30) + 'px';
    }
}

function initializeSidebar() {
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const pageMap = {
        'dashboardadmin.html': 'dashboardadmin.html',
        'productadmin.html': 'productadmin.html',
        'categoriesadmin.html': 'categoriesadmin.html',
        'ordersadmin.html': 'ordersadmin.html',
        'customersadmin.html': 'customersadmin.html',
        'reviewadmin.html': 'reviewadmin.html',
        'promotionsadmin.html': 'promotionsadmin.html',
        'addpromotionadmin.html': 'promotionsadmin.html'
    };
    
    if (pageMap[currentPage]) {
        const activeItem = document.querySelector(`.sidebar-item[href="${pageMap[currentPage]}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }
    
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', function(e) {
            document.querySelectorAll('.sidebar-item').forEach(i => {
                i.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
}

function checkLoginStatus() {
    const role = localStorage.getItem('role');
    const currentPage = window.location.pathname.split('/').pop();

    const adminPages = [
        'dashboardadmin.html', 'productadmin.html', 'categoriesadmin.html',
        'ordersadmin.html', 'customersadmin.html', 'reviewadmin.html',
        'promotionsadmin.html', 'addpromotionadmin.html'
    ];

    if (adminPages.includes(currentPage) && role !== 'admin') {
        window.location.href = 'login.html'; // login kamu yg asli
        return false;
    }

    return true;
}


function handleResize() {
    adjustSidebarHeight();
    adjustMainContentMargin();
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
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.style.position = 'fixed';
            sidebar.style.top = '90px';
            adjustSidebarHeight();
        }
    }
}

function initializeUI() {
    initializeSidebar();
    adjustSidebarHeight();
    adjustMainContentMargin();
    const adminPages = [
        'dashboardadmin.html', 'productadmin.html', 'categoriesadmin.html',
        'ordersadmin.html', 'customersadmin.html', 'reviewadmin.html', 'promotionsadmin.html',
        'addpromotionadmin.html'
    ];
    const currentPage = window.location.pathname.split('/').pop();
    if (adminPages.includes(currentPage)) {
        addLogoutButton();
    }
    document.body.classList.add('fade-in');
    setTimeout(() => {
        document.body.classList.remove('fade-in');
    }, 500);
}

function handleNavbarScroll() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar-custom');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('transparent');
            } else {
                navbar.classList.remove('transparent');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    if (!checkLoginStatus()) return;


    initializeUI();
    initializeSeparateNavigation();
    handleNavbarScroll();
    
    const addPromotionBtn = document.querySelector('.btn-add');
    if (addPromotionBtn && window.location.pathname.includes('promotionsadmin.html')) {
        addPromotionBtn.addEventListener('click', function() {
            window.location.href = 'addpromotionadmin.html';
        });
    }
    
    if (window.location.pathname.includes('landing.html') || 
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
    
    if (window.location.pathname.includes('landing.html')) {
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.style.cursor = 'pointer';
            logo.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'landing.html';
            });
        }
        const plusIcon = document.querySelector('.fa-plus, .fa-add');
        if (plusIcon) {
            plusIcon.style.cursor = 'pointer';
            plusIcon.addEventListener('click', function(e) {
                e.preventDefault();
                redirectToDashboard();
            });
        }
    }
    
    if (window.location.pathname.includes('loginadmin.html')) {
        const loginForm = document.querySelector('form');
        if (loginForm) {
            loginForm.onsubmit = null;
            loginForm.addEventListener('submit', handleLogin);
        }
        const backLink = document.querySelector('.back-link a');
        if (backLink) {
            backLink.addEventListener('click', function(e) {
                e.preventDefault();
                redirectToLanding();
            });
        }
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
                    <div style="margin-top: 10px;">
                        <button onclick="window.location.href = 'landing.html'" 
                                style="background: #28a745; border: none; padding: 8px 15px; border-radius: 5px; color: white; margin-right: 10px; cursor: pointer;">
                            <i class="fas fa-arrow-right"></i> Go to Landing Page
                        </button>
                        <button onclick="localStorage.removeItem('adminLoggedIn'); location.reload();" 
                                style="background: #6c757d; border: none; padding: 8px 15px; border-radius: 5px; color: white; cursor: pointer;">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                `;
                loginRight.appendChild(statusDiv);
            }
        }
    }
    
    const adminPages = [
        'dashboardadmin.html', 'productadmin.html', 'categoriesadmin.html',
        'ordersadmin.html', 'customersadmin.html', 'reviewadmin.html', 'promotionsadmin.html',
        'addpromotionadmin.html'
    ];
    const currentPage = window.location.pathname.split('/').pop();
    if (adminPages.includes(currentPage)) {
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.style.cursor = 'pointer';
            logo.addEventListener('click', function(e) {
                e.preventDefault();
                redirectToLandingAdmin();
            });
        }
        const bellIcon = document.querySelector('.fa-bell');
        if (bellIcon) {
            bellIcon.addEventListener('click', function() {
                alert('No new notifications');
            });
        }
        const searchIcon = document.querySelector('.fa-search');
        if (searchIcon) {
            searchIcon.addEventListener('click', function() {
                const searchBox = document.querySelector('.search-box');
                if (searchBox) {
                    searchBox.focus();
                }
            });
        }
        const envelopeIcon = document.querySelector('.fa-envelope');
        if (envelopeIcon) {
            envelopeIcon.addEventListener('click', function() {
                alert('No new messages');
            });
        }
    }
    
    window.addEventListener('resize', handleResize);
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
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!this.classList.contains('login-form')) {
                e.preventDefault();
            }
        });
    });
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        redirectToLogin,
        redirectToDashboard,
        redirectToLanding,
        redirectToLandingAdmin,
        handleLogin,
        handleLogout,
        adjustSidebarHeight,
        initializeSidebar,
        checkLoginStatus,
        handleNavbarScroll,
        handleLogoClick,
        handlePlusIconClick,
        initializeSeparateNavigation
    };
}
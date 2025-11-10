document.addEventListener('DOMContentLoaded', function() {
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    const reviewBtn = document.getElementById('reviewBtn');
    const navbar = document.querySelector('.navbar-custom');

    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 30) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }

    backToHomeBtn.addEventListener('click', function() {
        clearCartData();
        window.location.href = 'landing.html';
    });

   reviewBtn.addEventListener('click', function() {
        // Ambil data pesanan terakhir dari localStorage
        const lastOrder = {
            orderNumber: localStorage.getItem('currentOrderNumber') || 'N/A',
            total: localStorage.getItem('cartTotal') || '0',
            items: JSON.parse(localStorage.getItem('selectedCartItems') || '[]')
        };

        // Simpan ke localStorage untuk diakses di halaman rating.html
        localStorage.setItem('reviewOrder', JSON.stringify(lastOrder));

        // Bersihkan data keranjang (biar gak bentrok)
        clearCartData();

        // Redirect ke halaman review
        window.location.href = 'rating.html';
    });
    displayOrderDetails();

    function clearCartData() {
        localStorage.removeItem('selectedCartItems');
        localStorage.removeItem('cartTotal');
        localStorage.removeItem('currentOrderNumber');
        localStorage.removeItem('selectedAddress');
        localStorage.removeItem('selectedPaymentMethod');
    }

    function displayOrderDetails() {
        const orderNumber = localStorage.getItem('currentOrderNumber');
        const orderTotal = localStorage.getItem('cartTotal');
        
        if (orderNumber) {
            console.log(`Order Number: ${orderNumber}`);
            console.log(`Order Total: Rp. ${orderTotal}`);
        }
    }

    function formatRupiah(amount) {
        if (!amount) return '0';
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    const confirmationIcon = document.querySelector('.confirmation-icon');
    if (confirmationIcon) {
        confirmationIcon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        confirmationIcon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const shippingSection = document.getElementById('shippingSection');
    const paymentSection = document.getElementById('paymentSection');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const selectedAddress = document.getElementById('selectedAddress');
    const selectedPayment = document.getElementById('selectedPayment');
    const productSection = document.getElementById('productSection');
    const orderTitle = document.getElementById('orderTitle');
    const productCount = document.getElementById('productCount');
    const subtotalAmount = document.getElementById('subtotalAmount');
    const totalAmount = document.getElementById('totalAmount');
    const footerTotalAmount = document.getElementById('footerTotalAmount');

    loadCartData();
    loadSavedPreferences();

    shippingSection.addEventListener('click', function() {
        window.location.href = 'shippingaddcust.html';
    });

    paymentSection.addEventListener('click', function() {
        window.location.href = 'paymentmethcust.html';
    });

    checkoutBtn.addEventListener('click', function() {
        processPayment();
    });

    function loadCartData() {
        const selectedItems = JSON.parse(localStorage.getItem('selectedCartItems') || '[]');
        const cartTotal = parseInt(localStorage.getItem('cartTotal') || '0');
        const orderNumber = localStorage.getItem('currentOrderNumber') || 'ORD' + Date.now().toString().slice(-6);

        orderTitle.textContent = `Order #${orderNumber}`;

        if (selectedItems.length === 0) {
            alert('No items selected. Redirecting to cart.');
            window.location.href = 'cart.html';
            return;
        }

        displayProductItems(selectedItems);
        updateOrderSummary(selectedItems, cartTotal);
    }

    function displayProductItems(items) {
        productSection.innerHTML = '';

        items.forEach(item => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.innerHTML = `
                <div class="product-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${item.name}</h3>
                    <p class="product-price">Rp. ${formatRupiah(item.price)}</p>
                    <p class="product-quantity">Quantity: ${item.quantity}</p>
                </div>
            `;
            productSection.appendChild(productItem);
        });
    }

    function updateOrderSummary(items, total) {
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = total;
        const shippingFee = 0;
        const finalTotal = subtotal + shippingFee;

        productCount.textContent = `${itemCount} ${itemCount > 1 ? 'Products' : 'Product'}`;
        subtotalAmount.textContent = `Rp. ${formatRupiah(subtotal)}`;
        totalAmount.textContent = `Rp. ${formatRupiah(finalTotal)}`;
        footerTotalAmount.textContent = `Rp. ${formatRupiah(finalTotal)}`;
    }

    function formatRupiah(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    function loadSavedPreferences() {
        const savedAddress = localStorage.getItem('selectedAddress');
        const savedPayment = localStorage.getItem('selectedPaymentMethod');

        if (savedAddress) {
            selectedAddress.textContent = getAddressDisplayName(savedAddress);
        }

        if (savedPayment) {
            selectedPayment.textContent = getPaymentDisplayName(savedPayment);
        }
    }

    function getAddressDisplayName(addressType) {
        const addressMap = {
            'house': 'House',
            'office': 'Office',
            'apartment': 'Apartment'
        };
        return addressMap[addressType] || 'House';
    }

    function getPaymentDisplayName(paymentType) {
        const paymentMap = {
            'cod': 'Cash on Delivery',
            'virtual': 'Virtual Account Transfer',
            'ewallet': 'E-wallet'
        };
        return paymentMap[paymentType] || 'Cash on Delivery';
    }

    function processPayment() {
  const selectedItems = JSON.parse(localStorage.getItem('selectedCartItems') || '[]');
  if (selectedItems.length === 0) {
    alert('No items to checkout');
    return;
  }

  checkoutBtn.textContent = 'Processing...';
  checkoutBtn.disabled = true;

  setTimeout(function() {
    try {
      localStorage.removeItem('selectedCartItems');
      localStorage.removeItem('cartTotal');
      // ⬇️ arahkan ke file yang benar
      window.location.href = 'orderconfirmcust.html';
    } catch (e) {
      // fallback kalau gagal
      console.error(e);
      checkoutBtn.textContent = 'Check Out';
      checkoutBtn.disabled = false;
      alert('Failed to proceed. Please try again.');
    }
  }, 600); // 0.6s biar terasa responsif
}

});

function safeSetText(el, text){
  if (el) el.textContent = text;
}





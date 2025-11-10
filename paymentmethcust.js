document.addEventListener('DOMContentLoaded', function() {
    const codMethod = document.getElementById('codMethod');
    const virtualMethod = document.getElementById('virtualMethod');
    const ewalletMethod = document.getElementById('ewalletMethod');

    loadSelectedPaymentMethod();

    codMethod.addEventListener('click', function() {
        selectPaymentMethod('cod');
    });

    virtualMethod.addEventListener('click', function() {
        selectPaymentMethod('virtual');
    });

    ewalletMethod.addEventListener('click', function() {
        selectPaymentMethod('ewallet');
    });

    function loadSelectedPaymentMethod() {
        const selectedMethod = localStorage.getItem('selectedPaymentMethod') || 'cod';
        
        document.querySelectorAll('.payment-method-item').forEach(item => {
            item.classList.remove('selected');
        });

        if (selectedMethod === 'cod') {
            codMethod.classList.add('selected');
        } else if (selectedMethod === 'virtual') {
            virtualMethod.classList.add('selected');
        } else if (selectedMethod === 'ewallet') {
            ewalletMethod.classList.add('selected');
        }
    }

    function selectPaymentMethod(method) {
        localStorage.setItem('selectedPaymentMethod', method);
        
        loadSelectedPaymentMethod();
        
        setTimeout(() => {
            window.location.href = 'paymentcust.html';
        }, 500);
    }

    const paymentItems = document.querySelectorAll('.payment-method-item');
    paymentItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
});
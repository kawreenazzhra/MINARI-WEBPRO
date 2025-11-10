document.addEventListener('DOMContentLoaded', function() {
    const houseAddress = document.getElementById('houseAddress');
    const officeAddress = document.getElementById('officeAddress');
    const addNewAddress = document.getElementById('addNewAddress');

    loadSelectedAddress();

    houseAddress.addEventListener('click', function() {
        selectAddress('house');
    });

    officeAddress.addEventListener('click', function() {
        selectAddress('office');
    });

    addNewAddress.addEventListener('click', function() {
        addNewAddressHandler();
    });

    function loadSelectedAddress() {
        const selectedAddress = localStorage.getItem('selectedAddress') || 'house';
        
        document.querySelectorAll('.address-item').forEach(item => {
            item.classList.remove('selected');
        });

        if (selectedAddress === 'house') {
            houseAddress.classList.add('selected');
        } else if (selectedAddress === 'office') {
            officeAddress.classList.add('selected');
        }
    }

    function selectAddress(addressType) {
        localStorage.setItem('selectedAddress', addressType);
        
        loadSelectedAddress();
        
        setTimeout(() => {
            window.location.href = 'paymentcust.html';
        }, 500);
    }

    function addNewAddressHandler() {
        alert('Fitur tambah alamat baru akan segera tersedia!');
    }

    const addressItems = document.querySelectorAll('.address-item');
    addressItems.forEach(item => {
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
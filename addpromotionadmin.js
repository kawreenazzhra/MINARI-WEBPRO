document.addEventListener('DOMContentLoaded', function() {
    const promotionForm = document.getElementById('promotionForm');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    const today = new Date().toISOString().split('T')[0];
    startDateInput.min = today;
    endDateInput.min = today;

    startDateInput.addEventListener('change', function() {
        endDateInput.min = this.value;
        validateDates();
    });

    endDateInput.addEventListener('change', validateDates);

    promotionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            createPromotion();
        }
    });

    function validateForm() {
        let isValid = true;
        const promoCode = document.getElementById('promoCode').value.trim();
        const discountType = document.getElementById('discountType').value;
        const discountValue = document.getElementById('discountValue').value;
        const description = document.getElementById('description').value.trim();
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        clearErrors();

        if (!promoCode) {
            showError('promoCodeError', 'Promo code is required');
            isValid = false;
        }

        if (!discountType) {
            showError('discountTypeError', 'Discount type is required');
            isValid = false;
        }

        if (!discountValue || discountValue <= 0) {
            showError('discountValueError', 'Valid discount value is required');
            isValid = false;
        }

        if (discountType === 'percentage' && discountValue > 100) {
            showError('discountValueError', 'Percentage discount cannot exceed 100%');
            isValid = false;
        }

        if (!description) {
            showError('descriptionError', 'Description is required');
            isValid = false;
        }

        if (!startDate) {
            showError('startDateError', 'Start date is required');
            isValid = false;
        }

        if (!endDate) {
            showError('endDateError', 'End date is required');
            isValid = false;
        }

        if (startDate && endDate && startDate > endDate) {
            showError('endDateError', 'End date must be after start date');
            isValid = false;
        }

        return isValid;
    }

    function validateDates() {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        
        if (startDate && endDate && startDate > endDate) {
            showError('endDateError', 'End date must be after start date');
            return false;
        } else {
            clearError('endDateError');
            return true;
        }
    }

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    function clearErrors() {
        const errorElements = document.querySelectorAll('.validation-message.error');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
    }

    function createPromotion() {
        const promotionData = {
            promoCode: document.getElementById('promoCode').value.trim().toUpperCase(),
            description: document.getElementById('description').value.trim(),
            discountType: document.getElementById('discountType').value,
            discountValue: document.getElementById('discountValue').value,
            minPurchase: document.getElementById('minPurchase').value || 0,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            usageLimit: document.getElementById('usageLimit').value || null,
            status: document.getElementById('status').value,
            applicableProducts: Array.from(document.getElementById('applicableProducts').selectedOptions).map(option => option.value),
            createdAt: new Date().toISOString()
        };

        const submitBtn = promotionForm.querySelector('.btn-submit');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
        submitBtn.disabled = true;

        setTimeout(() => {
            let promotions = JSON.parse(localStorage.getItem('promotions')) || [];
            promotions.push(promotionData);
            localStorage.setItem('promotions', JSON.stringify(promotions));

            showNotification('Promotion created successfully!', 'success');
            
            setTimeout(() => {
                window.location.href = 'promotionsadmin.html';
            }, 1500);
        }, 1000);
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} custom-notification`;
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    document.getElementById('promoCode').addEventListener('input', function() {
        this.value = this.value.toUpperCase();
    });

    document.getElementById('discountType').addEventListener('change', function() {
        const discountValueInput = document.getElementById('discountValue');
        if (this.value === 'percentage') {
            discountValueInput.placeholder = 'Enter percentage (0-100)';
            discountValueInput.max = 100;
        } else {
            discountValueInput.placeholder = 'Enter fixed amount';
            discountValueInput.max = null;
        }
    });
});
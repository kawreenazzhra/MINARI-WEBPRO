const categoryManager = {
    init: function() {
        this.initializeEventListeners();
        this.initializeSidebar();
        this.setupFormValidation();
    },

    initializeEventListeners: function() {
        const categoryImageInput = document.getElementById('categoryImage');
        if (categoryImageInput) {
            categoryImageInput.addEventListener('change', (e) => {
                this.handleImageUpload(e);
            });
        }

        const addCategoryForm = document.getElementById('addCategoryForm');
        if (addCategoryForm) {
            addCategoryForm.addEventListener('submit', (e) => {
                this.handleFormSubmission(e);
            });
        }

        this.setupRealTimeValidation();

        const cancelBtn = document.querySelector('.btn-cancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                this.cancelForm();
            });
        }
    },

    handleImageUpload: function(e) {
        const file = e.target.files[0];
        const errorDiv = document.getElementById('imageError');
        
        if (!file) {
            this.showValidationMessage('imageError', 'Please upload a category image', 'error');
            return;
        }

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            this.showValidationMessage('imageError', 'Please upload a valid image file (JPG, PNG, or GIF)', 'error');
            e.target.value = '';
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            this.showValidationMessage('imageError', 'Image size must be less than 2MB', 'error');
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('imagePreview');
            preview.src = e.target.result;
            preview.style.display = 'block';
            
            this.hideValidationMessage('imageError');
            
            this.showValidationMessage('imageError', 'Image uploaded successfully!', 'success');
        };
        reader.readAsDataURL(file);
    },

    handleFormSubmission: function(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            this.showNotification('Please fill in all required fields correctly', 'error');
            return;
        }

        this.submitForm();
    },

    validateForm: function() {
        let isValid = true;

        const categoryName = document.getElementById('categoryName').value.trim();
        if (!categoryName) {
            this.showValidationMessage('nameError', 'Category name is required', 'error');
            this.highlightField('categoryName', false);
            isValid = false;
        } else if (categoryName.length > 100) {
            this.showValidationMessage('nameError', 'Category name must be less than 100 characters', 'error');
            this.highlightField('categoryName', false);
            isValid = false;
        } else {
            this.hideValidationMessage('nameError');
            this.highlightField('categoryName', true);
        }

        const categoryImage = document.getElementById('categoryImage').files[0];
        if (!categoryImage) {
            this.showValidationMessage('imageError', 'Category image is required', 'error');
            isValid = false;
        } else {
            this.hideValidationMessage('imageError');
        }

        const description = document.getElementById('categoryDescription').value.trim();
        if (description.length > 500) {
            this.showValidationMessage('descriptionError', 'Description must be less than 500 characters', 'warning');
        } else {
            this.hideValidationMessage('descriptionError');
        }

        return isValid;
    },

    highlightField: function(fieldId, isValid) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
        }
    },

    showValidationMessage: function(elementId, message, type) {
        const element = document.getElementById(elementId);
        if (!element) return;

        element.textContent = message;
        element.className = `validation-message ${type}`;
        element.style.display = 'block';
    },

    hideValidationMessage: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
        }
    },

    setupRealTimeValidation: function() {
        const categoryName = document.getElementById('categoryName');
        if (categoryName) {
            categoryName.addEventListener('input', () => {
                this.validateField('categoryName');
            });
            
            categoryName.addEventListener('blur', () => {
                this.validateField('categoryName');
            });
        }

        const categoryDescription = document.getElementById('categoryDescription');
        if (categoryDescription) {
            categoryDescription.addEventListener('input', () => {
                this.validateField('categoryDescription');
            });
        }
    },

    validateField: function(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        const value = field.value.trim();
        let isValid = true;
        let message = '';
        let messageType = 'error';

        switch (fieldId) {
            case 'categoryName':
                if (!value) {
                    isValid = false;
                    message = 'Category name is required';
                } else if (value.length > 100) {
                    isValid = false;
                    message = 'Category name must be less than 100 characters';
                } else {
                    isValid = true;
                    message = 'Category name looks good!';
                    messageType = 'success';
                }
                this.showValidationMessage('nameError', message, messageType);
                break;

            case 'categoryDescription':
                if (value.length > 500) {
                    message = 'Description must be less than 500 characters';
                    messageType = 'warning';
                    this.showValidationMessage('descriptionError', message, messageType);
                } else {
                    this.hideValidationMessage('descriptionError');
                }
                return;

            default:
                isValid = true;
        }

        this.highlightField(fieldId, isValid);
    },

    setupFormValidation: function() {
        console.log('Add category form validation initialized');
    },

    submitForm: function() {
        const submitBtn = document.querySelector('.btn-add');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
        submitBtn.disabled = true;

        const formData = this.collectFormData();

        setTimeout(() => {
            try {
                console.log('Form data to be submitted:', formData);
                
                this.showNotification('Category added successfully!', 'success');
                
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                setTimeout(() => {
                    window.location.href = 'categoriesadmin.html';
                }, 1000);
            } catch (error) {
                this.showNotification('Failed to add category: ' + error.message, 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }, 1500);
    },

    collectFormData: function() {
        return {
            name: document.getElementById('categoryName').value.trim(),
            description: document.getElementById('categoryDescription').value.trim(),
            status: document.querySelector('input[name="status"]:checked').value,
            image: document.getElementById('categoryImage').files[0]
        };
    },

    cancelForm: function() {
        if (this.isFormDirty()) {
            if (!confirm('You have unsaved changes. Are you sure you want to cancel?')) {
                return;
            }
        }
        window.location.href = 'categoriesadmin.html';
    },

    isFormDirty: function() {
        const categoryName = document.getElementById('categoryName').value.trim();
        const categoryDescription = document.getElementById('categoryDescription').value.trim();
        const categoryImage = document.getElementById('categoryImage').files[0];

        return categoryName !== '' || categoryDescription !== '' || categoryImage !== undefined;
    },

    resetForm: function() {
        document.getElementById('addCategoryForm').reset();
        document.getElementById('imagePreview').style.display = 'none';
        
        document.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
            el.classList.remove('is-valid', 'is-invalid');
        });
        
        document.querySelectorAll('.validation-message').forEach(msg => {
            msg.style.display = 'none';
        });
    },

    showNotification: function(message, type) {
        const existingNotifications = document.querySelectorAll('.custom-notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `custom-notification alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle'
        };
        
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas ${icons[type] || 'fa-info-circle'} me-2"></i>
                <span>${message}</span>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    },

    initializeSidebar: function() {
        const currentPage = window.location.pathname.split('/').pop();
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        
        sidebarItems.forEach(item => {
            item.classList.remove('active');
        });
        
        const categoriesItem = document.querySelector('.sidebar-item[href="categoriesadmin.html"]');
        if (categoriesItem) {
            categoriesItem.classList.add('active');
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    categoryManager.init();
});

window.addEventListener('beforeunload', function(e) {
    if (categoryManager.isFormDirty()) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = categoryManager;
}
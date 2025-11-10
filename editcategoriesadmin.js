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

        const editCategoryForm = document.getElementById('editCategoryForm');
        if (editCategoryForm) {
            editCategoryForm.addEventListener('submit', (e) => {
                this.handleFormSubmission(e);
            });
        }

        this.setupRealTimeValidation();
    },

    handleImageUpload: function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            this.showNotification('Please upload a valid image file (JPG, PNG, or GIF)', 'error');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            this.showNotification('Image size must be less than 2MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('imagePreview');
            const currentImage = document.getElementById('currentCategoryImage');
            
            preview.src = e.target.result;
            preview.style.display = 'block';
            
            if (currentImage) {
                currentImage.style.display = 'none';
            }
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
        const categoryName = document.getElementById('categoryName').value.trim();
        
        if (!categoryName) {
            this.highlightField('categoryName', false);
            return false;
        }

        this.highlightField('categoryName', true);
        return true;
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

    setupRealTimeValidation: function() {
        const categoryName = document.getElementById('categoryName');
        if (categoryName) {
            categoryName.addEventListener('input', () => {
                this.validateField('categoryName');
            });
        }
    },

    validateField: function(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        const value = field.value.trim();
        let isValid = false;

        switch (fieldId) {
            case 'categoryName':
                isValid = value.length > 0 && value.length <= 100;
                break;
            default:
                isValid = true;
        }

        this.highlightField(fieldId, isValid);
    },

    setupFormValidation: function() {
    },

    submitForm: function() {
        const submitBtn = document.querySelector('.btn-update');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
        submitBtn.disabled = true;

        setTimeout(() => {
            this.showNotification('Category updated successfully!', 'success');
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            setTimeout(() => {
                window.location.href = 'categoriesadmin.html';
            }, 1000);
        }, 1500);
    },

    confirmDelete: function() {
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        deleteModal.show();
    },

    deleteCategory: function() {
        const deleteBtn = document.querySelector('#deleteModal .btn-delete');
        const originalText = deleteBtn.innerHTML;

        deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
        deleteBtn.disabled = true;

        setTimeout(() => {
            this.showNotification('Category deleted successfully!', 'success');
            
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            deleteModal.hide();

            deleteBtn.innerHTML = originalText;
            deleteBtn.disabled = false;

            setTimeout(() => {
                window.location.href = 'categoriesadmin.html';
            }, 1000);
        }, 1500);
    },

    showNotification: function(message, type) {
        const existingNotifications = document.querySelectorAll('.custom-notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `custom-notification alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            border-radius: 10px;
            border: none;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        `;
        
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2"></i>
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
    },

    loadCategoryData: function() {
        console.log('Loading category data...');
    },

    populateForm: function(categoryData) {
    }
};

document.addEventListener('DOMContentLoaded', function() {
    categoryManager.init();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = categoryManager;
}
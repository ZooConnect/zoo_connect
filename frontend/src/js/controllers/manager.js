import userService from '../services/user.service.js';
import * as authService from '../services/auth.service.js';

class ManagerController {
    constructor() {
        this.users = [];
        this.filteredUsers = [];
        this.currentEditingUserId = null;
        this.userToDelete = null;
        
        this.initElements();
        this.attachEventListeners();
        this.init();
    }

    /**
     * Initialise les références aux éléments du DOM
     */
    initElements() {
        // Buttons
        this.addUserBtn = document.getElementById('addUserBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        this.cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        this.logoutBtn = document.getElementById('logoutBtn');

        // Modals
        this.userModal = document.getElementById('userModal');
        this.deleteConfirmModal = document.getElementById('deleteConfirmModal');

        // Form elements
        this.userForm = document.getElementById('userForm');
        this.modalTitle = document.getElementById('modalTitle');
        this.userName = document.getElementById('userName');
        this.userEmail = document.getElementById('userEmail');
        this.userRole = document.getElementById('userRole');
        this.userPassword = document.getElementById('userPassword');
        this.userPasswordConfirm = document.getElementById('userPasswordConfirm');
        this.closeBtn = document.querySelector('.close');

        // Table and filters
        this.usersTableBody = document.getElementById('usersTableBody');
        this.searchInput = document.getElementById('searchInput');
        this.roleFilter = document.getElementById('roleFilter');

        // States
        this.emptyState = document.getElementById('emptyState');
        this.loadingState = document.getElementById('loadingState');

        // Notification
        this.notification = document.getElementById('notification');

        // User greeting
        this.userGreeting = document.getElementById('user-greeting');

        // Delete modal elements
        this.deleteUserName = document.getElementById('deleteUserName');
    }

    /**
     * Attache les écouteurs d'événements
     */
    attachEventListeners() {
        this.addUserBtn.addEventListener('click', () => this.openAddUserModal());
        this.cancelBtn.addEventListener('click', () => this.closeUserModal());
        this.closeBtn.addEventListener('click', () => this.closeUserModal());
        this.userForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.logoutBtn.addEventListener('click', () => this.logout());
        
        // Modal fermeture au clic en dehors
        window.addEventListener('click', (event) => {
            if (event.target === this.userModal) {
                this.closeUserModal();
            }
            if (event.target === this.deleteConfirmModal) {
                this.closeDeleteConfirmModal();
            }
        });

        // Suppression
        this.confirmDeleteBtn.addEventListener('click', () => this.confirmDelete());
        this.cancelDeleteBtn.addEventListener('click', () => this.closeDeleteConfirmModal());

        // Filtres
        this.searchInput.addEventListener('input', () => this.applyFilters());
        this.roleFilter.addEventListener('change', () => this.applyFilters());
    }

    /**
     * Initialise le contrôleur
     */
    async init() {
        try {
            // Vérifier l'authentification
            const [response, data] = await authService.isLogged();
            
            if (!response.ok) {
                window.location.href = 'login.html';
                return;
            }

            // data contient directement les informations de l'utilisateur
            const user = data.data || data;

            if (!user || !user.name) {
                window.location.href = 'login.html';
                return;
            }

            // Check admin role
            if (user.role !== 'admin') {
                this.showNotification('Access denied. You must be an administrator.', 'error');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
                return;
            }

            this.userGreeting.textContent = `Welcome, ${user.name}`;
            await this.loadUsers();
        } catch (error) {
            console.error('Error during initialization:', error);
            this.showNotification('Error loading page.', 'error');
        }
    }

    /**
     * Charge la liste des utilisateurs
     */
    async loadUsers() {
        try {
            this.loadingState.classList.add('show');
            const response = await userService.getAllUsers();
            // response is normalized: { ok, status, data: [...] }
            this.users = Array.isArray(response.data) ? response.data : [];
            this.filteredUsers = Array.isArray(this.users) ? [...this.users] : [];
            this.renderUsers();
        } catch (error) {
            console.error('Error loading users:', error);
            const msg = error && error.message ? error.message : 'Error loading users.';
            this.showNotification(msg, 'error');
        } finally {
            this.loadingState.classList.remove('show');
        }
    }

    /**
     * Affiche la liste des utilisateurs dans le tableau
     */
    renderUsers() {
        this.usersTableBody.innerHTML = '';

        if (this.filteredUsers.length === 0) {
            this.emptyState.classList.add('show');
            return;
        }

        this.emptyState.classList.remove('show');

        this.filteredUsers.forEach(user => {
            const row = document.createElement('tr');
            const createdDate = new Date(user.created_at).toLocaleDateString('en-US');
            const roleText = this.getRoleText(user.role);

            row.innerHTML = `
                <td>${this.escapeHtml(user.name)}</td>
                <td>${this.escapeHtml(user.email)}</td>
                <td>
                    <span class="role-badge ${user.role}">
                        ${roleText}
                    </span>
                </td>
                <td>${createdDate}</td>
                <td>
                    <div class="actions-cell">
                        <button class="btn-edit btn-small" data-id="${user._id}" data-action="edit">
                            Edit
                        </button>
                        <button class="btn-delete btn-small" data-id="${user._id}" data-action="delete">
                            Delete
                        </button>
                    </div>
                </td>
            `;

            // Ajouter les écouteurs d'événements aux boutons
            row.querySelector('[data-action="edit"]').addEventListener('click', (e) => {
                this.openEditUserModal(e.target.dataset.id);
            });

            row.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
                this.openDeleteConfirmModal(e.target.dataset.id);
            });

            this.usersTableBody.appendChild(row);
        });
    }

    /**
     * Applique les filtres de recherche et de rôle
     */
    applyFilters() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const roleFilter = this.roleFilter.value;

        this.filteredUsers = this.users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm) ||
                                user.email.toLowerCase().includes(searchTerm);
            const matchesRole = !roleFilter || user.role === roleFilter;
            return matchesSearch && matchesRole;
        });

        this.renderUsers();
    }

    /**
     * Ouvre le modal pour ajouter un utilisateur
     */
    openAddUserModal() {
        this.currentEditingUserId = null;
        this.modalTitle.textContent = 'Add User';
        this.userForm.reset();
        this.clearFormErrors();
        this.userModal.classList.add('show');
    }

    /**
     * Ouvre le modal pour éditer un utilisateur
     */
    openEditUserModal(userId) {
        const user = this.users.find(u => u._id === userId);
        if (!user) return;

        this.currentEditingUserId = userId;
        this.modalTitle.textContent = 'Edit User';
        
        this.userName.value = user.name;
        this.userEmail.value = user.email;
        this.userRole.value = user.role;
        this.userPassword.value = '';
        this.userPasswordConfirm.value = '';

        // Password is optional in edit mode
        this.userPassword.required = false;
        this.userPasswordConfirm.required = false;

        this.clearFormErrors();
        this.userModal.classList.add('show');
    }

    /**
     * Ferme le modal d'ajout/édition d'utilisateur
     */
    closeUserModal() {
        this.userModal.classList.remove('show');
        this.userForm.reset();
        this.clearFormErrors();
        this.userPassword.required = true;
        this.userPasswordConfirm.required = true;
    }

    /**
     * Gère la soumission du formulaire
     */
    async handleFormSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        try {
            this.addUserBtn.disabled = true;

            const userData = {
                name: this.userName.value.trim(),
                email: this.userEmail.value.trim(),
                role: this.userRole.value,
                password: this.userPassword.value,
                passwordConfirmation: this.userPasswordConfirm.value
            };

            if (this.currentEditingUserId) {
                // Edit user
                if (!userData.password) {
                    delete userData.password;
                    delete userData.passwordConfirmation;
                }
                await userService.deleteUser(this.currentEditingUserId);
                await userService.createUser(userData);
                this.showNotification('User updated successfully.', 'success');
            } else {
                // Create new user
                await userService.createUser(userData);
                this.showNotification('User added successfully.', 'success');
            }

            this.closeUserModal();
            await this.loadUsers();
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = error.message || 'An error occurred.';
            this.showNotification(errorMessage, 'error');
        } finally {
            this.addUserBtn.disabled = false;
        }
    }

    /**
     * Valide le formulaire
     */
    validateForm() {
        this.clearFormErrors();
        let isValid = true;

        // Validate name
        if (!this.userName.value.trim()) {
            this.showFieldError('nameError', 'Name is required.');
            isValid = false;
        }

        // Validate email
        if (!this.userEmail.value.trim()) {
            this.showFieldError('emailError', 'Email is required.');
            isValid = false;
        } else if (!this.isValidEmail(this.userEmail.value)) {
            this.showFieldError('emailError', 'Please enter a valid email address.');
            isValid = false;
        }

        // Validate role
        if (!this.userRole.value) {
            this.showFieldError('roleError', 'Please select a role.');
            isValid = false;
        }

        // Validate password (only on creation)
        if (!this.currentEditingUserId) {
            if (!this.userPassword.value) {
                this.showFieldError('passwordError', 'Password is required.');
                isValid = false;
            } else if (!this.isValidPassword(this.userPassword.value)) {
                this.showFieldError('passwordError', 'Password must contain at least 8 characters, 1 uppercase, 1 digit and 1 special character.');
                isValid = false;
            }

            if (this.userPassword.value !== this.userPasswordConfirm.value) {
                this.showFieldError('passwordConfirmError', 'Passwords do not match.');
                isValid = false;
            }
        } else if (this.userPassword.value || this.userPasswordConfirm.value) {
            // If editing and providing new password
            if (this.userPassword.value !== this.userPasswordConfirm.value) {
                this.showFieldError('passwordConfirmError', 'Passwords do not match.');
                isValid = false;
            }
            if (this.userPassword.value && !this.isValidPassword(this.userPassword.value)) {
                this.showFieldError('passwordError', 'Password must contain at least 8 characters, 1 uppercase, 1 digit and 1 special character.');
                isValid = false;
            }
        }

        return isValid;
    }

    /**
     * Affiche une erreur pour un champ
     */
    showFieldError(errorElementId, message) {
        const errorElement = document.getElementById(errorElementId);
        if (errorElement) {
            errorElement.textContent = message;
            const input = errorElement.previousElementSibling;
            if (input) {
                input.classList.add('error');
            }
        }
    }

    /**
     * Efface les erreurs du formulaire
     */
    clearFormErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        document.querySelectorAll('input.error, select.error').forEach(el => {
            el.classList.remove('error');
        });
    }

    /**
     * Valide le format d'email
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Valide le mot de passe
     * Doit contenir au moins 8 caractères, 1 majuscule, 1 chiffre et 1 caractère spécial
     */
    isValidPassword(password) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    /**
     * Ouvre le modal de confirmation de suppression
     */
    openDeleteConfirmModal(userId) {
        const user = this.users.find(u => u._id === userId);
        if (!user) return;

        this.userToDelete = userId;
        this.deleteUserName.textContent = user.name;
        this.deleteConfirmModal.classList.add('show');
    }

    /**
     * Ferme le modal de confirmation de suppression
     */
    closeDeleteConfirmModal() {
        this.deleteConfirmModal.classList.remove('show');
        this.userToDelete = null;
    }

    /**
     * Confirme la suppression d'un utilisateur
     */
    async confirmDelete() {
        if (!this.userToDelete) return;

        try {
            this.confirmDeleteBtn.disabled = true;

            await userService.deleteUser(this.userToDelete);
            this.showNotification('User deleted successfully.', 'success');

            this.closeDeleteConfirmModal();
            await this.loadUsers();
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            const errorMessage = error.message || 'Erreur lors de la suppression de l\'utilisateur.';
            this.showNotification(errorMessage, 'error');
        } finally {
            this.confirmDeleteBtn.disabled = false;
        }
    }

    /**
     * Affiche une notification
     */
    showNotification(message, type = 'info') {
        this.notification.textContent = message;
        this.notification.className = `notification ${type} show`;

        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 4000);
    }

    /**
     * Get role text
     */
    getRoleText(role) {
        const roleMap = {
            'visitor': 'Visitor',
            'staff': 'Staff',
            'admin': 'Administrator'
        };
        return roleMap[role] || role;
    }

    /**
     * Échappe les caractères HTML
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * Déconnexion
     */
    async logout() {
        try {
            await authService.logout();
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    }
}

// Initialise le contrôleur au chargement du DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ManagerController();
    });
} else {
    new ManagerController();
}

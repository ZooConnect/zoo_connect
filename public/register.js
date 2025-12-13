document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const submitButton = document.getElementById('submitButton');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('password_confirmation');
    const errorDisplay = document.getElementById('errorMessage');

    // --- Fonctions de Validation ---
    const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validatePassword = password => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasDigit = /[0-9]/.test(password);
        return password.length >= minLength && hasUpperCase && hasDigit;
    };

    const checkFormValidity = () => {
        const passwordMatch = passwordInput.value === confirmInput.value;
        const passwordValid = validatePassword(passwordInput.value);
        const emailValid = validateEmail(emailInput.value);
        const nameNotEmpty = nameInput.value.trim() !== '';

        const isValid = nameNotEmpty && emailValid && passwordValid && passwordMatch;
        submitButton.disabled = !isValid;

        // Masquer le message d'erreur tant que le formulaire n'est pas soumis
        if (submitButton.disabled) {
            errorDisplay.style.display = 'none';
        }
    };

    // --- Écouteurs d'événements ---
    form.addEventListener('input', checkFormValidity);

    form.addEventListener('submit', async e => {
        e.preventDefault();

        errorDisplay.style.display = 'block';
        errorDisplay.style.color = '#D32F2F'; // rouge par défaut

        if (submitButton.disabled) {
            errorDisplay.textContent = "Please correct the form validation errors.";
            return;
        }

        const userData = {
            name: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
            password_confirmation: confirmInput.value,
        };

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            if (response.ok) {
                errorDisplay.style.color = 'green';
                errorDisplay.textContent = result.message || "Registration successful! Redirecting...";
                setTimeout(() => window.location.href = '/login', 2000);
            } else {
                errorDisplay.style.color = '#D32F2F';
                errorDisplay.textContent = result.message || "An error occurred during registration.";
            }
        } catch (err) {
            console.error(err);
            errorDisplay.style.color = '#D32F2F';
            errorDisplay.textContent = "Failed to connect to the server.";
        }
    });

    // Initial check (au cas où le navigateur auto-remplit)
    checkFormValidity();
});
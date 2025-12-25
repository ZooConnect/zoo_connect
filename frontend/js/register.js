import Utils from "../utils/Utils.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const submitButton = document.getElementById('submitButton');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('password_confirmation');
    const errorDisplay = document.getElementById('errorMessage');

    // --- Écouteurs d'événements ---
    form.addEventListener('input', Utils.checkFormValidity);

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
            const response = await fetch('/api/users/signup', {
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
    Utils.checkFormValidity();
});
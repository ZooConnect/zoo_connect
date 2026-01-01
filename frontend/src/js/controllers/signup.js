import Utils from "../utils/Utils.js";

import { signup } from "../services/auth.service.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const submitButton = document.getElementById('submitButton');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('password_confirmation');
    const errorDisplay = document.getElementById('errorMessage');

    // --- Écouteurs d'événements ---
    form.addEventListener('input', () => {
        if (isFormValid(nameInput, emailInput, passwordInput, confirmInput)) {
            submitButton.disabled = false;
            // Masquer le message d'erreur tant que le formulaire n'est pas soumis
            if (submitButton.disabled) {
                errorDisplay.style.display = 'none';
            }
        } else {
            submitButton.disabled = true;
        }
    });

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
            passwordConfirmation: confirmInput.value,
        };

        try {
            const [response, data] = await signup(userData);

            if (response.ok) {
                errorDisplay.style.color = 'green';
                errorDisplay.textContent = data.message || "Registration successful! Redirecting...";
                setTimeout(() => window.location.href = 'login', 2000);
            } else {
                errorDisplay.style.color = '#D32F2F';
                errorDisplay.textContent = data.message || "An error occurred during registration.";
            }
        } catch (err) {
            console.error(err);
            errorDisplay.style.color = '#D32F2F';
            errorDisplay.textContent = "Failed to connect to the server.";
        }
    });

    // Initial check (au cas où le navigateur auto-remplit)
    if (isFormValid(nameInput, emailInput, passwordInput, confirmInput)) {
        submitButton.disabled = false;
        // Masquer le message d'erreur tant que le formulaire n'est pas soumis
        if (submitButton.disabled) {
            errorDisplay.style.display = 'none';
        }
    }
});

function isFormValid(nameInput, emailInput, passwordInput, confirmInput) {
    const passwordMatch = passwordInput.value === confirmInput.value;
    const passwordValid = Utils.validatePassword(passwordInput.value);
    const emailValid = Utils.validateEmail(emailInput.value);
    const nameNotEmpty = nameInput.value.trim() !== '';
    return nameNotEmpty && emailValid && passwordValid && passwordMatch;
}
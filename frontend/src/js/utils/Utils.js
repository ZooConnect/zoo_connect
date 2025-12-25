export default class Utils {

    static validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    static validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasDigit = /[0-9]/.test(password);
        return password.length >= minLength && hasUpperCase && hasDigit;
    };

    static checkFormValidity(nameInput, emailInput, passwordInput) {
        const passwordMatch = passwordInput.value === confirmInput.value;
        const passwordValid = Utils.validatePassword(passwordInput.value);
        const emailValid = Utils.validateEmail(emailInput.value);
        const nameNotEmpty = nameInput.value.trim() !== '';

        const isValid = nameNotEmpty && emailValid && passwordValid && passwordMatch;
        submitButton.disabled = !isValid;

        // Masquer le message d'erreur tant que le formulaire n'est pas soumis
        if (submitButton.disabled) {
            errorDisplay.style.display = 'none';
        }
    };
}
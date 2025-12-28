export default class Utils {

    static validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    static validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasDigit = /[0-9]/.test(password);
        return password.length >= minLength && hasUpperCase && hasDigit;
    };

}
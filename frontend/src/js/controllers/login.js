import { login } from "../services/auth.service.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const errorDisplay = document.getElementById('loginError');
    const validationDisplay = document.getElementById("loginValidation");

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const userData = { email, password };
                const [response, data] = await login(userData);

                if (response.ok) {
                    // --- SAUVEGARDE DU TOKEN ---
                    // Indispensable pour que 'handleBooking' fonctionne
                    if (data.token) {
                        localStorage.setItem('token', data.token);
                    }

                    validationDisplay.style.display = 'block';
                    validationDisplay.textContent = data.message || "Connexion réussie !";

                    // Redirection vers l'accueil après 1.5s
                    setTimeout(() => {
                        window.location.href = './index.html';
                    }, 1500);
                } else {
                    errorDisplay.style.display = 'block';
                    errorDisplay.textContent = data.message || "Email ou mot de passe incorrect.";
                }
            } catch (err) {
                errorDisplay.style.display = 'block';
                console.error("Login error:", err);
                errorDisplay.textContent = "Impossible de se connecter au serveur.";
            }
        });
    }
});

/**
 * Fonction de déconnexion
 * Supprime le token et redirige vers la page de login
 */
export function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

// Rendre la fonction accessible globalement pour les boutons HTML (ex: onclick="logout()")
window.logout = logout;
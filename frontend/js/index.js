document.addEventListener("DOMContentLoaded", () => {
    const loginLink = document.getElementById("login-link");
    const signupLink = document.getElementById("signup-link");
    const logoutBtn = document.getElementById("logoutBtn");
    const welcomeMessage = document.getElementById("welcomeMessage");

    const token = localStorage.getItem("token");
    if (token) {
        // on affiche et cache les éléments
        if (loginLink) loginLink.style.display = "none";
        if (signupLink) signupLink.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-block";


        if (welcomeMessage) {
            welcomeMessage.textContent = "You are logged in !";
        }

        // gestion de la déconnexion
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                localStorage.removeItem("token");
                window.location.href = "index.html";
            })
        }
    }
})
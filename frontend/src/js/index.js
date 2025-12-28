import { userLogged, logout } from "./services/api.js";

document.addEventListener("DOMContentLoaded", async () => {
    const logoutBtn = document.getElementById("logoutBtn");

    logoutBtn.addEventListener("click", async () => {
        try {
            const [response, data] = await logout();
            if (response.ok) {
                logoutBtn.style.display = "none";
                document.getElementById("login-link").style.display = "inline-block";
                document.getElementById("signup-link").style.display = "inline-block";
                console.log("User logout");
            }
        } catch (err) {
            console.error(err);
        }
    });


    try {
        const [response, data] = await userLogged();
        // utilisateur authentifié
        if (response.ok) {
            const loginLink = document.getElementById("login-link");
            const signupLink = document.getElementById("signup-link");
            const welcomeMessage = document.getElementById("welcomeMessage");

            // on affiche et cache les éléments
            if (loginLink) loginLink.style.display = "none";
            if (signupLink) signupLink.style.display = "none";
            if (logoutBtn) logoutBtn.style.display = "inline-block";


            if (welcomeMessage) {
                welcomeMessage.textContent = `You are logged in ${data.name}!`;
            }
        }
    } catch (err) {
        console.error(err);
    }
})
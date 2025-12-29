import { userLogged, logout } from "./services/api.js";

document.addEventListener("DOMContentLoaded", async () => {
    const logoutBtn = document.getElementById("logoutBtn");

    const profileLink = document.getElementById("profile-link")
    const loginLink = document.getElementById("login-link");
    const signupLink = document.getElementById("signup-link");

    const welcomeMessage = document.getElementById("welcomeMessage");

    logoutBtn.addEventListener("click", async () => {
        try {
            const [response, data] = await logout();
            if (response.ok) {
                logoutBtn.style.display = "none";
                profileLink.style.display = "none";

                loginLink.style.display = "inline-block";
                signupLink.style.display = "inline-block";
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
            // on affiche et cache les éléments
            loginLink.style.display = "none";
            signupLink.style.display = "none";
            profileLink.style.display = "inline-block";

            logoutBtn.style.display = "inline-block";

            if (welcomeMessage) {
                welcomeMessage.textContent = `You are logged in ${data.name}!`;
            }
        }
    } catch (err) {
        console.error(err);
    }
})
import { isLogged, logout } from "../services/auth.service.js";

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
        const [response, data] = await isLogged();
        // utilisateur authentifié
        if (response.ok) {
            // hide auth buttons
            loginLink.style.display = "none";
            signupLink.style.display = "none";

            logoutBtn.style.display = "inline-block";

            // show profile always when logged
            profileLink.style.display = "inline-block";

            // role-based visibility
            const eventsCard = document.getElementById('events-card');
            const bookingsCard = document.getElementById('bookings-card');
            const feedingCard = document.getElementById('feeding-planning-link');
            const managerCard = document.getElementById('manager-link');

            if (data && data.role === 'admin') {
                // admin: show events, feeding planning and user management, hide bookings
                if (eventsCard) eventsCard.style.display = 'inline-block';
                if (bookingsCard) bookingsCard.style.display = 'none';
                if (feedingCard) feedingCard.style.display = 'inline-block';
                if (managerCard) managerCard.style.display = 'inline-block';
            } else if (data && data.role === 'staff') {
                // staff: show feeding planning, hide events and bookings
                if (eventsCard) eventsCard.style.display = 'none';
                if (bookingsCard) bookingsCard.style.display = 'none';
                if (feedingCard) feedingCard.style.display = 'inline-block';
                if (managerCard) managerCard.style.display = 'none';
            } else {
                // visitor: show events and bookings, hide feeding planning and user management
                if (eventsCard) eventsCard.style.display = 'inline-block';
                if (bookingsCard) bookingsCard.style.display = 'inline-block';
                if (feedingCard) feedingCard.style.display = 'none';
                if (managerCard) managerCard.style.display = 'none';
            }

            if (welcomeMessage) {
                welcomeMessage.textContent = `You are logged in ${data.name}!`;
            }
        }
    } catch (err) {
        console.error(err);
    }
})
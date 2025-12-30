import { isLogged, logout, update } from "../services/auth.service.js";

import { isOneMonthAway } from "../utils/date.helper.js";

document.addEventListener("DOMContentLoaded", async () => {
    const pName = document.getElementById("displayName");
    const pEmail = document.getElementById("displayEmail");
    const pMembershipType = document.getElementById("displayMembershipType");
    const pMembershipExpirationDate = document.getElementById("displayMembershipExpirationDate");
    const pMembershipStatus = document.getElementById("displayMembershipStatus");

    const logoutBtn = document.getElementById("logoutBtn");
    const reniewSubscriptionBtn = document.getElementById("reniewSubscriptionBtn");

    const form = document.getElementById('profileForm');
    const submitButton = document.getElementById('submitButton');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const newPasswordInput = document.getElementById('newPassword');
    const newPasswordConfirmInput = document.getElementById('newPasswordConfirmation');
    const errorDisplay = document.getElementById('errorMessage');


    let userId;
    try {
        const [response, data] = await isLogged();
        // utilisateur authentifié
        if (response.ok) {
            userId = data.id;

            pName.textContent = data.name;
            pEmail.textContent = data.email;
            pMembershipType.textContent = data.membershipType;
            pMembershipExpirationDate.textContent = data.membershipExpirationDate;
            pMembershipStatus.textContent = data.membershipStatus;

            if (data.membershipExpirationDate && isOneMonthAway(data.membershipExpirationDate)) {
                reniewSubscriptionBtn.style.display = "block";
            }
        }
    } catch (err) {
        console.error(err);
    }

    logoutBtn.addEventListener("click", async () => {
        try {
            const [response, data] = await logout();
            if (response.ok) {
                window.location.href = "index.html";
                console.log(`${data.name} logout`);
            }
        } catch (err) {
            console.error(err);
        }
    });


    form.addEventListener('input', () => {
        if (nameInput.value || emailInput.value || (newPasswordInput.value && newPasswordConfirmInput.value)) {
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

        const userData = {
            id: userId
        };

        if (nameInput.value) userData.name = nameInput.value;
        if (emailInput.value) userData.email = email.value;
        if (newPasswordInput.value && newPasswordConfirmInput.value) {
            userData.newPassword = newPasswordInput.value;
            userData.newPasswordConfirmation = newPasswordConfirmInput.value;
        }

        try {
            const [response, data] = await update(userData);

            if (response.ok) {
                errorDisplay.style.color = 'green';
                errorDisplay.textContent = data.message;
                setTimeout(() => window.location.href = 'profile.html', 2000);
            } else {
                errorDisplay.style.color = '#D32F2F';
                errorDisplay.textContent = data.message || "An error occurred during update.";
            }
        } catch (err) {
            console.error(err);
            errorDisplay.style.color = '#D32F2F';
            errorDisplay.textContent = "Failed to connect to the server.";
        }
    });
})
import { userLogged, logout, updateUser } from "./services/api.js";
import Utils from "./utils/Utils.js";

document.addEventListener("DOMContentLoaded", async () => {
    let userId;
    try {
        const [response, data] = await userLogged();
        // utilisateur authentifié
        if (response.ok) {
            const pName = document.getElementById("displayName");
            const pEmail = document.getElementById("displayEmail");

            pName.textContent = data.user.name;
            pEmail.textContent = data.user.email;

            userId = data.user.id;
        }
    } catch (err) {
        console.error(err);
    }

    const logoutBtn = document.getElementById("logoutBtn");

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


    const form = document.getElementById('registerForm');
    const submitButton = document.getElementById('profileForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const newPasswordInput = document.getElementById('new_password');
    const newPasswordConfirmInput = document.getElementById('new_password_confirmation');
    const errorDisplay = document.getElementById('errorMessage');

    form.addEventListener('submit', async e => {
        e.preventDefault();

        errorDisplay.style.display = 'block';
        errorDisplay.style.color = '#D32F2F'; // rouge par défaut

        if (submitButton.disabled) {
            errorDisplay.textContent = "Please correct the form validation errors.";
            return;
        }

        const userData = {
            id: userId,
            name: nameInput.value,
            email: emailInput.value
        };

        if (newPasswordInput.value === newPasswordConfirmInput.value && Utils.validatePassword(newPasswordInput.value)) {
            userData.new_password = newPasswordInput.value;
            userData.new_password_confirmation = newPasswordConfirmInput.value;
        }

        try {
            const [response, data] = await updateUser(userData);

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
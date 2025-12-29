import { login } from "../services/user.service.js";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorDisplay = document.getElementById('loginError');
  const validationDisplay = document.getElementById("loginValidation");

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      const userData = { email, password };
      const [response, data] = await login(userData);

      if (response.ok) {
        validationDisplay.style.display = 'block';
        validationDisplay.textContent = data.message;
        setTimeout(() => window.location.href = './index.html', 1500);
      } else {
        errorDisplay.style.display = 'block';
        errorDisplay.textContent = data.message;
      }
    } catch (err) {
      errorDisplay.style.display = 'block';
      console.error(err);
      errorDisplay.textContent = "Failed to connect to the server.";
    }
  });
});

import { login } from "./services/api.js";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorDisplay = document.getElementById('loginError');
  const validationDisplay = document.getElementById("loginValidation");

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      const [response, result] = await login(email, password);
      console.log(email, password);
      console.log(response, result);

      if (response.ok) {
        validationDisplay.style.display = 'block';
        validationDisplay.textContent = result.message;
        // Stocke le token dans localStorage et dans cookie si nécessaire
        localStorage.setItem('token', result.token);
        document.cookie = `token=${result.token}; Path=/; Max-Age=3600`;
        setTimeout(() => window.location.href = '../html/home.html', 1500);
      } else {
        errorDisplay.style.display = 'block';
        errorDisplay.textContent = result.message || "Email or password incorrect";
      }
    } catch (err) {
      errorDisplay.style.display = 'block';
      console.error(err);
      errorDisplay.textContent = "Failed to connect to the server.";
    }
  });
});

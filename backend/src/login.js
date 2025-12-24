document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorDisplay = document.getElementById('loginError');
  const validationDisplay = document.getElementById("loginValidation");

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        validationDisplay.style.display = 'block';
        validationDisplay.textContent = data.message;
        // Stocke le token dans localStorage et dans cookie si nécessaire
        localStorage.setItem('token', data.token);
        document.cookie = `token=${data.token}; Path=/; Max-Age=3600`;
        setTimeout(() => window.location.href = '/home.html', 1500);
      } else {
        errorDisplay.style.display = 'block';
        errorDisplay.textContent = '';

        errorDisplay.textContent = data.message || "Email or password incorrect";
      }
    } catch (err) {
      errorDisplay.style.display = 'block';
      errorDisplay.textContent = '';

      console.error(err);
      errorDisplay.textContent = "Failed to connect to the server.";
    }
  });
});

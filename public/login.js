document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorDisplay = document.getElementById('loginError');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDisplay.style.display = 'block';
    errorDisplay.textContent = '';

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
        errorDisplay.style.color = 'green';
        errorDisplay.textContent = data.message;
        // Stocke le token dans localStorage et dans cookie si nécessaire
        localStorage.setItem('token', data.token);
        document.cookie = `token=${data.token}; Path=/; Max-Age=3600`; 
        setTimeout(() => window.location.href = '/home.html', 1500);
      } else {
        errorDisplay.style.color = '#D32F2F';
        errorDisplay.textContent = data.message || "Email or password incorrect";
      }
    } catch (err) {
      console.error(err);
      errorDisplay.style.color = '#D32F2F';
      errorDisplay.textContent = "Failed to connect to the server.";
    }
  });
});

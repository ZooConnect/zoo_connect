const route = `/api`;

export const signup = async (userData) => {
    // ici on envoi une requête post au backend, on parse le JS en JSON
    const response = await fetch(`${route}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });

    // ici on capte la réponse du backend, on parse le JSON en JS
    const result = await response.json();
    return [response, result];
}

export const login = async (email, password) => {
    const response = await fetch(`${route}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    return [response, result];
}
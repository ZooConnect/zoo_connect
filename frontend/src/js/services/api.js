const route = "/api";

export const signup = async (userData) => {
    // ici on envoi une requête post au backend, on parse le JS en JSON
    const response = await fetch(`${route}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });

    // ici on capte la réponse du backend, on parse le JSON en JS
    const data = await response.json();
    return [response, data];
}

export const login = async (email, password) => {
    const response = await fetch(`${route}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: "include"
    });

    const data = await response.json();
    return [response, data];
}

export const userLogged = async () => {
    const response = await fetch(`${route}/users/me`,
        {
            method: 'GET',
            credentials: "include"
        });

    const data = await response.json();
    return [response, data];
}

export const logout = async () => {
    const response = await fetch(`${route}/users/logout`, {
        method: "POST",
        credentials: "include"
    });

    const data = await response.json();
    return [response, data];
}

export const updateUser = async (userData) => {
    const response = await fetch(`${route}/users/${userData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });

    // ici on capte la réponse du backend, on parse le JSON en JS
    const data = await response.json();
    return [response, data];
}
const route = "/api/auth";

export const signup = async (userData) => {
    // ici on envoi une requête post au backend, on parse le JS en JSON
    const response = await fetch(`${route}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });

    // ici on capte la réponse du backend, on parse le JSON en JS
    const data = await response.json();
    return [response, data];
}

export const login = async (userData) => {
    const response = await fetch(`${route}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: "include"
    });

    const data = await response.json();
    return [response, data];
}

export const isLogged = async () => {
    const response = await fetch(`${route}/me`,
        {
            method: 'GET',
            credentials: "include"
        });

    const data = await response.json();
    return [response, data];
}

export const logout = async () => {
    const response = await fetch(`${route}/logout`, {
        method: "POST",
        credentials: "include"
    });

    const data = await response.json();
    return [response, data];
}

export const update = async (userData) => {
    const response = await fetch(`${route}/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });

    // ici on capte la réponse du backend, on parse le JSON en JS
    const data = await response.json();
    return [response, data];
}
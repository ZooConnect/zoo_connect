// Service pour gérer les appels API des utilisateurs
const API_BASE_URL = '/api/admin';

export const userService = {
    /**
     * Récupère la liste de tous les utilisateurs
     */
    async getAllUsers(filter = {}) {
        try {
            const queryParams = new URLSearchParams(filter).toString();
            const url = queryParams ? `${API_BASE_URL}/users?${queryParams}` : `${API_BASE_URL}/users`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            let payload = null;
            try {
                payload = await response.json();
            } catch (err) {
                // non-json response
                payload = null;
            }

            if (!response.ok) {
                const serverMessage = payload && payload.message ? payload.message : `Error: ${response.status}`;
                throw new Error(serverMessage);
            }

            // Normalize different possible shapes from the backend
            // - payload can be an array
            // - payload can be an object with a `data` array
            // - payload can be an object with numeric keys (old respond spreading)
            const normalized = { ok: response.ok, status: response.status, data: [] , raw: payload };

            if (Array.isArray(payload)) {
                normalized.data = payload;
            } else if (payload && Array.isArray(payload.data)) {
                normalized.data = payload.data;
            } else if (payload) {
                // collect numeric keys if present
                const numericKeys = Object.keys(payload).filter(k => /^\d+$/.test(k)).sort((a,b)=>a-b);
                if (numericKeys.length) {
                    normalized.data = numericKeys.map(k => payload[k]);
                } else if (Array.isArray(payload.users)) {
                    normalized.data = payload.users;
                } else if (Array.isArray(payload.items)) {
                    normalized.data = payload.items;
                } else {
                    normalized.data = [];
                }
            }

            return normalized;
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            throw error;
        }
    },

    /**
     * Crée un nouvel utilisateur
     * @param {Object} userData - Les données de l'utilisateur
     */
    async createUser(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erreur: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur:', error);
            throw error;
        }
    },

    /**
     * Supprime un utilisateur
     * @param {string} userId - L'ID de l'utilisateur à supprimer
     */
    async deleteUser(userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erreur: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur:', error);
            throw error;
        }
    }
};

export default userService;

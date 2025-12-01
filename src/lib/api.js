const API_URL = 'http://localhost:5001/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

export const api = {
    get: async (endpoint) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'GET',
            headers: getHeaders(),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Something went wrong');
        }
        return response.json();
    },

    post: async (endpoint, body) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Something went wrong');
        }
        return response.json();
    },

    put: async (endpoint, body) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Something went wrong');
        }
        return response.json();
    },

    delete: async (endpoint) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Something went wrong');
        }
        return response.json();
    },
};

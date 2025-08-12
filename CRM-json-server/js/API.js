const API = "http://localhost:4000/clients";

// Create a new client
export const newClient = async (client) => {
    try {
        await fetch(API, {
            method: "POST",
            body: JSON.stringify(client),
            headers: {
                "Content-Type": "applicationj/json",
            },
        });
        location.href = "index.html";
    } catch (error) {
        console.log(error);
    }
};

export const getClients = async () => {
    try {
        const res = await fetch(API);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
};

export const deleteClient = async (client) => {
    try {
        await fetch(`${API}/${client}`, { method: "DELETE" });
    } catch (error) {
        console.log(error);
    }
};

export const getClientById = async (id) => {
    try {
        const res = await fetch(`${API}/${id}`);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
};

export const updateClient = async (client) => {
    try {
        await fetch(`${API}/${client.id}`, {
            method: "PUT",
            body: JSON.stringify(client),
            headers: {
                "Content-Type": "application/json",
            },
        });
        location.href = "index.html";
    } catch (error) {
        console.log(error);
    }
};

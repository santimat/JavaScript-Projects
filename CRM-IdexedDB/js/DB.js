import { objCustomer } from "./newClient.js";

let DB = null;

export async function getDB() {
    // If already exists an DB conecction, resolve the promise
    if (DB) {
        return DB;
    }
    return await openDB();
}

// Create the database of IndexDB
function openDB() {
    // return a Promise to can get the DB, from another files
    return new Promise((resolve, reject) => {
        // Open a connection
        const req = indexedDB.open("crm", 1);

        // If there is an error
        req.onerror = () => {
            reject(req.error);
        };

        // If everything is okay
        req.onsuccess = () => {
            DB = req.result;
            // newDB.result there will is the indexDB
            resolve(DB); // Return the DB connection as resolve of the promise
        };

        req.onupgradeneeded = (e) => {
            const db = e.target.result;

            const objectStore = db.createObjectStore("crm", {
                keyPath: "id",
                autoIncrement: false,
            });

            Object.keys(objCustomer).forEach((key) => {
                objectStore.createIndex(key, key, {
                    // If the current key is email or id it will assigned true to unique, else false
                    unique: key == "email" || key == "id",
                });
            });

            console.log("DB is ready and created");
        };
    });
}

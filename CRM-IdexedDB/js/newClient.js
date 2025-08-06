// Imports
import { getDB } from "./DB.js";
import { $, $$, generateId, showAlert } from "./functions.js";

// Vars
export const objCustomer = {
    firstName: "",
    email: "",
    phone: "",
    company: "",
    id: "",
};

// IIFE
(function () {
    let DB;
    const form = $("#form");

    onload = async () => {
        DB = await getDB();
        form.addEventListener("submit", validateClient);
    };

    function validateClient(e) {
        e.preventDefault();

        // Read the inputs
        const formInputs = $$(".form-input");

        // Array.from() is to create a new array from a nodelist for example
        // If some of the inputs is empty
        if (Array.from(formInputs).some((input) => input.value.trim() == "")) {
            showAlert({ txt: "All the fields must be filled", type: "error" });
            return;
        }

        // Fill the object with the information from the form
        formInputs.forEach((input) => {
            const { name, value } = input;
            objCustomer[name] = value;
            // Create the id with a random number between 0 and 1, converted a string with a radix of 36
            objCustomer.id = generateId();
        });

        // Add the client to DB
        createClient();
        clearObjCustomer();
        form.reset();
    }

    async function createClient() {
        const transaction = DB.transaction(["crm"], "readwrite");
        const objectStore = transaction.objectStore("crm");

        // Validate if already exists a client with the same email
        const req = objectStore.index("email").get(objCustomer.email);
        req.onsuccess = () => {
            if (req.result) {
                showAlert({
                    txt: "Already exists an client with that email",
                    type: "error",
                });
                return;
            }
        };

        objectStore.add(objCustomer);

        transaction.onerror = () => {
            showAlert({ txt: "There was an error", type: "error" });
            return;
        };

        transaction.oncomplete = () => {
            showAlert({ txt: "Client saved", type: "success" });

            setTimeout(() => {
                location.href = "index.html";
            }, 1000);
        };
    }

    function clearObjCustomer() {
        Object.keys(objCustomer).forEach((key) => (objCustomer[key] = ""));
    }
})();

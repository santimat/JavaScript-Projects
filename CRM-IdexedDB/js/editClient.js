import { getDB } from "./DB.js";
import { $, $$, showAlert } from "./functions.js";
import { objCustomer } from "./newClient.js";

(function () {
    // Variables
    let DB;
    let customerId;

    // Selectors
    const form = $("#form");
    const formInputs = $$(".form-input");

    onload = async () => {
        DB = await getDB();

        // Verificate the ID from URL
        const URLParams = new URLSearchParams(location.search);
        // get the id from the query string
        customerId = URLParams.get("id");

        if (customerId) {
            const customer = await getClient(customerId);
            if (customer) {
                fillForm(customer);
            } else {
                $(
                    ".alert"
                ).innerHTML = `<p class="text-center font-bold text-red-600">Customer not found</p>`;
            }
        }

        form.onsubmit = updateCustomer;
    };

    function getClient(id) {
        // How IndexedDB works with promises, to be able to return a result it must return a new promise
        return new Promise((resolve, reject) => {
            // Create the transaction and enable the objectStore
            const transaction = DB.transaction("crm", "readwrite");
            const objectStore = transaction.objectStore("crm");

            // get the customer in database
            const req = objectStore.get(id);

            // if the search is okay
            req.onsuccess = (e) => {
                // object with the customer information
                const customer = e.target.result;
                // resolve the promise with the customer information
                resolve(customer);
            };
            req.onerror = (e) => {
                // return the error
                reject(e.target.error);
            };
        });
    }

    function fillForm(customer) {
        // fill every input by their name with the customer information
        formInputs.forEach((input) => {
            const { name } = input;
            input.value = customer[name];
            objCustomer.id = customerId;
        });
    }

    function updateCustomer(e) {
        e.preventDefault();

        if (Array.from(formInputs).some((input) => input.value.trim() == "")) {
            showAlert({ txt: "All fields must be filled", type: "error" });
            return;
        }

        formInputs.forEach((input) => {
            const { name, value } = input;
            objCustomer[name] = value;
        });

        const transaction = DB.transaction("crm", "readwrite");
        const objectStore = transaction.objectStore("crm");
        objectStore.put(objCustomer);

        transaction.onerror = (e) => {
            console.log(e);

            showAlert({
                txt: "There was an error, retry later",
                type: "error",
            });
            return;
        };
        transaction.oncomplete = () => {
            showAlert({ txt: "Customer updated!", type: "success" });
            setTimeout(() => {
                location.href = "index.html";
            }, 1000);
        };
    }
})();

import { getClientById, updateClient } from "./API.js";
import { $$, validateFields, showAlert, fillObj } from "./functions.js";
(function () {
    // Get all inputs that have a non empty name attribute
    const inputs = Array.from($$("#form input")).filter(
        (input) => input.name != ""
    );

    addEventListener("DOMContentLoaded", async () => {
        const URLParams = new URLSearchParams(location.search);
        const id = URLParams.get("id");
        const client = await getClientById(id);
        inputs.forEach((input) => {
            input.value = client[input.name];
        });

        document
            .querySelector("#form")
            .addEventListener("submit", validateForm);
    });

    function validateForm(e) {
        e.preventDefault();
        if (validateFields(inputs)) {
            showAlert("All fields are required");
            return;
        }

        const clientObj = {};

        fillObj(clientObj, inputs);
        console.log(clientObj);
        updateClient(clientObj);
    }
})();

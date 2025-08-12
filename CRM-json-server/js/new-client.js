import { showAlert, $, $$, validateFields, fillObj } from "./functions.js";
import { newClient } from "./API.js";
(function () {
    let clientObj = {};

    const form = $("#form");
    const inputs = $$("#form div input");

    form.addEventListener("submit", validateClient);

    function validateClient(e) {
        e.preventDefault();

        if (validateFields(inputs)) {
            showAlert("All fields are required");
            return;
        }

        fillObj(clientObj, inputs);
        newClient(clientObj);
    }
})();

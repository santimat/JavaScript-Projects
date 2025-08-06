import { form } from "../selectors.js";

export class Notification {
    constructor({ txt, type }) {
        this.txt = txt;
        this.type = type;

        // Is executed the method when the object is intantiated
        this.show();
    }

    show() {
        // If yet exists an alert, will be removed
        form.parentElement.querySelector(".alert")?.remove();

        // Create the notification
        const alert = document.createElement("DIV");
        alert.className =
            "text-center w-full p-3 text-white my-5 alert uppercase font-bold text-sm";

        // If it's type error, add a class
        alert.classList.add(
            this.type == "error" ? "bg-red-500" : "bg-green-500"
        );

        // Add the message
        alert.textContent = this.txt;

        // Insert in the DOM
        // Is got the parent element of the form and insert the alert before the form
        form.parentElement.insertBefore(alert, form);

        // Remove alert after 3s
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
}

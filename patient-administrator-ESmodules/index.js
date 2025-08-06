import { formInputs, form } from "./selectors.js";
import { appointmentData, submitAppointment } from "./functions.js";

// Events
eventListeners();
function eventListeners() {
    formInputs.forEach((input) =>
        input.addEventListener("change", appointmentData)
    );
    form.addEventListener("submit", submitAppointment);
}

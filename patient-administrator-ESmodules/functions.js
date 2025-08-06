import { appointmentObj, editing } from "./variables.js";
import { Notification } from "./classes/Notification.js";
import { AdminAppointment } from "./classes/AdminAppointments.js";
import { form, submitBtn, formInputs } from "./selectors.js";

const adminAppointment = new AdminAppointment();

export const $ = (q) => document.querySelector(q);
export const $$ = (q) => document.querySelectorAll(q);

export function generateId() {
    // substring(n) is to substract n characters from a string
    return Math.random().toString(30).substring(2) + Date.now();
}

export function appointmentData(e) {
    // Is extracted value and id from e.target that will be the input that registered the event "change"
    const { value, name } = e.target;
    // How name will be the same that the properties from appointmentObj, is assigned the value in the correct property
    appointmentObj[name] = value.trim();
}

export function submitAppointment(e) {
    e.preventDefault();

    if (!editing.value) {
        if (Object.values(appointmentObj).includes("")) {
            new Notification({
                txt: "All fields must be filled",
                type: "error",
            });
            return;
        }

        const existing = adminAppointment.appointments.find(
            (appointment) => appointment.id == appointmentObj.id
        );
        // Verify if the appointment yet exists in the appointments array
        if (existing) {
            new Notification({
                txt: "The appointment already exists",
                type: "error",
            });
            resetAppointmentObj();
            return;
        }

        // Add a copy of the current appointmentObj, it's because if send the appointmentObj original this will be written for every new appointment
        adminAppointment.add({ ...appointmentObj });
        new Notification({ txt: "The appointment was saved", type: "success" });
        resetAppointmentObj();
    } else {
        adminAppointment.edit({ ...appointmentObj });

        new Notification({
            txt: "The appointment was updated",
            type: "success",
        });

        editing.value = false;
    }
    form.reset();
    resetAppointmentObj();
}

export function resetAppointmentObj() {
    // Reset the object
    Object.keys(appointmentObj).forEach((key) => (appointmentObj[key] = ""));
    appointmentObj.id = generateId();
    submitBtn.value = "Register Patient";
}

export function loadEditing(appointment) {
    // Copy the all properties from an object to other
    Object.assign(appointmentObj, appointment);

    Object.entries(appointment).forEach(([key, value]) => {
        const input = Array.from(formInputs).find((input) => input.name == key);
        if (input) {
            input.value = value;
        }
    });

    editing.value = true;
    submitBtn.value = "Save Changes";
}

export function deleteAppointment(id) {
    adminAppointment.delete(id);
}

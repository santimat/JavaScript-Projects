// Utils
const $ = (q) => document.querySelector(q);
const $$ = (q) => document.querySelectorAll(q);

// Variables
const formInputs = $$("#appointment-form .input-form");
const form = $("#appointment-form");
const appointmentsContainer = $("#appointments");
const submitBtn = $("#appointment-form input[type='submit']");

let editing = false;

// Appointment Object
const appointmentObj = {
    id: generateId(),
    patient: "",
    owner: "",
    email: "",
    date: "",
    symptoms: "",
};

// Events
eventListeners();
function eventListeners() {
    formInputs.forEach((input) =>
        input.addEventListener("change", appointmentData)
    );
    form.addEventListener("submit", submitAppointment);
}

// Classes
class Notification {
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

class AdminAppointment {
    constructor() {
        this.appointments = [];
    }
    // Method to add appointments to the array
    add(appointment) {
        this.appointments = [...this.appointments, appointment];

        // Show the appointments directly from the class
        this.show();
    }

    show() {
        // Clear the previous HTML, this way is better for the performance
        while (appointmentsContainer.firstChild) {
            appointmentsContainer.firstChild.remove();
        }

        if (!this.appointments.length) {
            appointmentsContainer.innerHTML = `<p class="text-xl mt-5 mb-10 text-center">No patients yet</p>`;
        }

        // Generate the appointments
        this.appointments.forEach((appointment) => {
            const { id } = appointment;

            const divAppointment = document.createElement("DIV");
            divAppointment.className =
                "mx-5 my-10 bg-white shadow-md px-5 py-10 rounded-xl p-3";

            // Add the appointment id on the container
            divAppointment.dataset.id = id;

            Object.entries(appointment).forEach(([key, value]) => {
                if (key != "id") {
                    const p = document.createElement("P");
                    p.className = "font-normal mb-3 text-gray-700 normal-case";
                    p.innerHTML = `<span class="font-bold uppercase" style="font-size:1.2rem;">${key}:</span> <span style="font-size:1.1rem;">${value}</span>`;
                    divAppointment.appendChild(p);
                }
            });

            const editBtn = document.createElement("BUTTON");
            editBtn.className =
                "py-2 px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase rounded-lg flex items-center gap-2";
            editBtn.onclick = () => loadEditing(appointment);

            editBtn.innerHTML = `Editar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>`;

            const deleteBtn = document.createElement("BUTTON");
            deleteBtn.className =
                "py-2 px-10 bg-red-600 hover:bg-red-700 text-white font-bold uppercase rounded-lg flex items-center gap-2";
            deleteBtn.innerHTML = `Eliminar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
            deleteBtn.onclick = () => deleteAppointment(id);

            const btnContainer = document.createElement("DIV");
            btnContainer.className = "flex justify-between mt-10";
            btnContainer.appendChild(editBtn);
            btnContainer.appendChild(deleteBtn);
            divAppointment.appendChild(btnContainer);

            appointmentsContainer.appendChild(divAppointment);
        });
    }

    edit(updatedAppointment) {
        this.appointments = this.appointments.map((appointment) =>
            appointment.id == updatedAppointment.id
                ? updatedAppointment
                : appointment
        );
        this.show();
    }

    delete(id) {
        this.appointments = this.appointments.filter(
            (appointment) => appointment.id != id
        );
        this.show();
    }
}

// Instances
const adminAppointment = new AdminAppointment();

// Functions
function appointmentData(e) {
    // Is extracted value and id from e.target that will be the input that registered the event "change"
    const { value, name } = e.target;
    // How name will be the same that the properties from appointmentObj, is assigned the value in the correct property
    appointmentObj[name] = value.trim();
}

function submitAppointment(e) {
    e.preventDefault();

    if (!editing) {
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

        editing = false;
    }
    form.reset();
    resetAppointmentObj();
}

function resetAppointmentObj() {
    // Reset the object
    Object.keys(appointmentObj).forEach((key) => (appointmentObj[key] = ""));
    appointmentObj.id = generateId();
    submitBtn.value = "Register Patient";
}

function generateId() {
    // substring(n) is to substract n characters from a string
    return Math.random().toString(30).substring(2) + Date.now();
}

function loadEditing(appointment) {
    // Copy the all properties from an object to other
    Object.assign(appointmentObj, appointment);

    Object.entries(appointment).forEach(([key, value]) => {
        const input = Array.from(formInputs).find((input) => input.name == key);
        if (input) {
            input.value = value;
        }
    });

    editing = true;
    submitBtn.value = "Save Changes";
}

function deleteAppointment(id) {
    adminAppointment.delete(id);
}

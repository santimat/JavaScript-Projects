import { appointmentsContainer } from "../selectors.js";
import { loadEditing, deleteAppointment } from "../functions.js";
export class AdminAppointment {
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

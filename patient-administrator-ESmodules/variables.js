import { generateId } from "./functions.js";

let editing = {
    value: false,
};

const appointmentObj = {
    id: generateId(),
    patient: "",
    owner: "",
    email: "",
    date: "",
    symptoms: "",
};

export { appointmentObj, editing };

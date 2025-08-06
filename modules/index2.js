// IIFE allow encapsulate the code to work with modules. It's prevent mixing the code.
// The IIFE function has a problem, It make imposible share variables between files
// (function () {
//     const clientName = "Santino";
// })();

// To export for example a varible, to allow this is required the use of type="module" in the script link
export const clientName = "santino";
export const saving = 400;

// Export a function
export function showInfo(firstName, saving) {
    return `Client: ${firstName} - Saving: ${saving}`;
}
export function hasBalance(saving) {
    console.log(saving > 0 ? "It has balance" : "It hasn't balance");
}

// Export and import a class
export class Client {
    constructor(firstName, saving) {
        this.firstName = firstName;
        this.saving = saving;
    }
    showInfo() {
        console.log(
            `The client ${this.firstName} has saving of ${this.saving}`
        );
    }
}

// Export default, It's imported by an alias
export default function newFunction() {
    console.log("Export default");
}

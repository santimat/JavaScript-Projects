import { Client } from "./index2.js";

// Export a extended class
export class Company extends Client {
    constructor(firstName, saving, category) {
        super(firstName, saving);
        this.category = category;
    }

    showInfo() {
        console.log(
            `The company ${this.firstName} is part of the category ${this.category} and has a saving of $${this.saving}`
        );
    }
}

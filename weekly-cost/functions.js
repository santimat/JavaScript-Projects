import { userInterface } from "./classes/UserInterface.js";
import { Budget } from "./classes/Budget.js";
import { form } from "./selectors.js";

export const $ = (q) => document.querySelector(q);
let budget;

export function askBudget() {
    // Number() to convert a valid string to a number
    let userBudget = Number(prompt("What is your budget?"));
    while (isNaN(userBudget) || userBudget == null || userBudget <= 0) {
        userBudget = Number(prompt("The budget must be a valid number"));
    }

    // Instatiate a Budget class with the valid budget
    budget = new Budget(userBudget);

    // Insert the information with the method of the userInterface object
    userInterface.insertBudget(budget);
}

export function addExpense(e) {
    e.preventDefault();

    // Read data from the form
    const name = $("#expense").value.trim();
    const amount = Number($("#amount").value.trim());

    // Validate
    if (name === "" || amount === "") {
        // console.log("Both fields must be filled and valid");
        userInterface.showAlert({
            msg: "Both fields must be filled",
            type: "error",
        });
        return;
    } else if (amount <= 0 || isNaN(amount)) {
        userInterface.showAlert({
            msg: "The amount must be valid",
            type: "error",
        });
        return;
    }

    // Expense object
    // name and expense will be a properties of the expense object and they will get the corresponding values.
    const expense = { name, amount, id: Date.now() };

    // Add a new expense
    budget.newExpense(expense);

    // After the new expense is correctly added, display an alert
    userInterface.showAlert({ msg: "Added", type: "success" });

    // Print expenses
    // destructuring to send only the expenses array to showExpenses() method
    const { expenses, remaining } = budget;

    userInterface.showExpenses(expenses);

    // Update the HTML remaining value
    userInterface.updateRemaining(remaining);

    userInterface.checkBudget(budget);

    // Reset the form
    form.reset();
}

export function deleteExpense(id) {
    budget.deleteExpense(id);
    const { expenses, remaining } = budget;
    userInterface.showExpenses(expenses);
    userInterface.updateRemaining(remaining);
    userInterface.checkBudget(budget);
}

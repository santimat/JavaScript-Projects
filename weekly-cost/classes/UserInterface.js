import { $ } from "../functions.js";
import { form, expenseList } from "../selectors.js";
import { deleteExpense } from "../functions.js";

// This class will work how HTML render
export class UserInterface {
    // Destructuring to the received object to get budget and remaining
    insertBudget({ budget, remaining }) {
        // Add to the HTML
        $("#total").textContent = budget;
        $("#remaining").textContent = remaining;
    }

    showAlert({ msg, type }) {
        // remove the previous alert if it already exists
        const prevAlert = form.parentElement.querySelector(".alert");
        prevAlert && prevAlert.remove();

        // Create the div
        const msgDiv = document.createElement("DIV");
        msgDiv.classList.add(
            "text-center",
            "alert",
            // Depending of the alert type
            type === "error" ? "alert-danger" : "alert-success"
        );

        // error msg
        msgDiv.textContent = msg;

        // Insert in the HTML
        $(".primary").insertBefore(msgDiv, form);

        // Remove the alert after 2.5s
        setTimeout(() => {
            msgDiv.remove();
        }, 2500);
    }

    showExpenses(expenses) {
        // Clear previous expenses
        while (expenseList.firstChild) {
            expenseList.firstChild.remove();
        }

        // Iterate
        expenses.length &&
            expenses.forEach((expense) => {
                // Destructuring from expense object
                const { amount, name, id } = expense;

                // Create a LI element
                const newExpense = document.createElement("LI");
                // some classes are of boostrap
                newExpense.className =
                    "list-group-item d-flex justify-content-between align-items-center";
                // add an attribute with the id
                newExpense.dataset.id = id;
                newExpense.textContent = name;

                // Add the HTML of the expense
                const amountSpan = document.createElement("SPAN");
                amountSpan.className = "badge badge-primary badge-pill";
                amountSpan.textContent = `$${amount}`;
                newExpense.appendChild(amountSpan);

                // Delete btn
                const deleteBtn = document.createElement("BUTTON");
                deleteBtn.className = "btn btn-danger delete-expense";
                deleteBtn.innerHTML = "Delete &times";
                deleteBtn.onclick = () => {
                    deleteExpense(id);
                };

                // add the delete btn to newExpense element
                newExpense.appendChild(deleteBtn);

                // Add to HTML
                expenseList.appendChild(newExpense);
            });
    }

    updateRemaining(remaining) {
        $("#remaining").textContent = remaining;
    }

    checkBudget(ObjBudget) {
        const { budget, remaining } = ObjBudget;
        const remainingDiv = $(".remaining");

        // Check if was spent the 75% of the budget
        if (budget / 4 > remaining) {
            remainingDiv.classList.remove("alert-succes", "alert-warning");
            remainingDiv.classList.add("alert-danger");
        }
        // Check for the 50%
        else if (budget / 2 > remaining) {
            remainingDiv.classList.remove("alert-succes");
            remainingDiv.classList.add("alert-warning");
        } else {
            remainingDiv.classList.remove("alert-danger", "alert-warning");
            remainingDiv.classList.add("alert-success");
        }

        // If the total <= 0
        if (remaining <= 0) {
            userInterface.showAlert("The budget was used up", "error");
            form.querySelector("button[type='submit']").disabled = "true";
        }
    }
}

export const userInterface = new UserInterface();

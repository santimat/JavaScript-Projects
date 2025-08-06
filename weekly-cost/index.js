import { form } from "./selectors.js";
import { addExpense, askBudget } from "./functions.js";
// Events
eventListeners();
function eventListeners() {
    document.addEventListener("DOMContentLoaded", askBudget);
    form.addEventListener("submit", addExpense);
}

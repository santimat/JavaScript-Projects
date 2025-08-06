export class Budget {
    constructor(budget) {
        this.budget = budget;
        this.remaining = budget;
        this.expenses = [];
    }

    newExpense(expense) {
        this.expenses = [...this.expenses, expense];
        this.calculateRemaining();
    }

    calculateRemaining() {
        // Start in the budget and substract every amount of every expense
        this.remaining = this.expenses.reduce(
            (budget, { amount }) => budget - amount,
            this.budget
        );
    }

    deleteExpense(id) {
        // select the expense element by his data attribute
        this.expenses = this.expenses.filter((expense) => expense.id != id);
        this.calculateRemaining();
    }
}

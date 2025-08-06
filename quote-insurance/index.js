// Utils
const $ = (query) => document.querySelector(query);

// Constructors
function Secure(brand, year, type) {
    this.brand = brand;
    this.year = year;
    this.type = type;
}

// perform the quote with the data
Secure.prototype.performQuote = function () {
    /* 
        1 = American 1.15x
        2 = Asian 1.05x
        3 = European 1.35x
    */

    let quantity;
    const base = 2000;

    // + to convert a string to a number
    switch (+this.brand) {
        case 1:
            quantity = base * 1.15;
            break;
        case 2:
            quantity = base * 1.05;

            break;
        case 3:
            quantity = base * 1.35;
            break;
        default:
            break;
    }

    // read the year
    const difference = new Date().getFullYear() - this.year;

    // Every year where the difference is greatest, the cost will be reduced by 3%
    quantity -= quantity * Math.min(difference * 0.03, 2);

    /* 
        If it's the basic secure is multiplies by 30% more 
        else it's the complete secure is multiplies by 50% more 
    */
    if (this.type == "basic") {
        quantity *= 1.3;
    } else {
        quantity *= 1.5;
    }

    return quantity;
};

function UI() {}

// Fill the options of the years

// Can be used arrow function because isn't use 'this'
UI.prototype.fillOptions = () => {
    const max = new Date().getFullYear(),
        min = max - 20; // min will be before 20 years than max date

    const selectYear = $("#year");

    // Use 'for' bucle from max to min to add years in ascending sort
    for (let i = max; i > min; i--) {
        let option = document.createElement("OPTION");
        option.value = i; // i == current year
        option.textContent = i;

        // Add new option to select element
        selectYear.appendChild(option);
    }
};

// Show alerts on the screen
UI.prototype.showAlerts = (msg, type) => {
    const form = $("#quote-form"),
        prevAlert = form.querySelector(".message");

    if (prevAlert) {
        prevAlert.remove();
    }
    const div = document.createElement("DIV");
    div.classList.add(
        "message",
        "mt-10",
        type == "error" ? "error" : "correct"
    );
    div.textContent = msg;

    // Insert in form
    // when is used insertBefore the first param is the new node and the second param is the HTML reference
    form.insertBefore(div, $("#result"));

    setTimeout(() => {
        div.remove();
    }, 2000);
};

UI.prototype.showResult = (secure, total) => {
    // Destructuring
    let { brand, year, type } = secure;

    // "+" in front of the brand to convert to a number
    // Use switch to assign the right brand name depending on the number selected
    switch (+brand) {
        case 1:
            brand = "American";
            break;
        case 2:
            brand = "Chinese";
            break;
        case 3:
            brand = "European";
            break;
        default:
            break;
    }

    // Create the result
    const resultDiv = $("#result");
    if (resultDiv.firstChild) {
        resultDiv.firstChild.remove();
    }

    const div = document.createElement("DIV");
    div.classList.add("mt-10");
    div.innerHTML = `
    <p class="header">Your resume</p> 
    <p class="font-bold">Brand: <span class='font-normal'>${brand}</span></p> 
    <p class="font-bold">Year: <span class='font-normal'>${year}</span></p> 
    <p class="font-bold">Type: <span class='font-normal'>${type}</span></p> 
    <p class="font-bold">Total: <span class='font-normal'>$${total}</span></p>
    `;
    // Show spinner
    const spinner = $("#loading");
    spinner.style.display = "block";
    setTimeout(() => {
        spinner.style.display = "none";
        resultDiv.appendChild(div);
    }, 2000);
};

// Instatiate UI
const ui = new UI();

// Listeners
document.addEventListener("DOMContentLoaded", () => {
    // Fill select with the years
    ui.fillOptions();

    // Load the listeners once the DOM is loaded
    eventListeners();
});

function eventListeners() {
    const form = $("#quote-form");
    form.addEventListener("submit", quoteInsurance);
}

// Functions
function quoteInsurance(e) {
    e.preventDefault();

    // Read the selected brand, the year and type
    const brand = $("#brand").value;

    const year = $("#year").value;

    const type = $("input[name='type']:checked").value;

    if (!brand || !year || !type) {
        ui.showAlerts("You must complete the all fields", "error");
        return;
    }

    ui.showAlerts("Cotizando...", "success");

    // Instatiate secure
    const secure = new Secure(brand, year, type);

    const total = secure.performQuote();

    // Use the prototype to perform
    ui.showResult(secure, total);

    // Hide the previous quotes
    const results = $("#result div");
    // ? is to ask if the element already exists in HTML
    results?.remove();
}

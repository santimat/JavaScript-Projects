// Util
const $ = (q) => document.querySelector(q);
const $$ = (q) => document.querySelectorAll(q);

// Vars
const customer = {
    table: "",
    hour: "",
    order: [],
};

const categories = {
    1: "Food",
    2: "Drinks",
    3: "Dessert",
};

// Selector
const btnSaveCustomer = $("#save-customer");
const formModal = $(".modal-body form");
const dishesContent = $("#dishes .content");
const resumeContent = $("#resume .content");
const inputs = $$("#form input");

// Events
btnSaveCustomer.addEventListener("click", saveCustomer);

function saveCustomer() {
    // Validates if some input is empty
    if (Array.from(inputs).some((input) => input.value === "")) {
        showAlert("Both fields are required");
        return;
    }

    // Fills object customer
    inputs.forEach((input) => {
        const { id, value } = input;
        customer[id] = value;
    });

    // Hides modal
    const modalForm = $("#form");
    const modalBootstrap = bootstrap.Modal.getInstance(modalForm);

    modalBootstrap.hide();

    // Shows sections
    showSections();

    // Gets dishes from json-server API
    getDishes();
}

function showSections() {
    const sectionsHidden = $$(".d-none");
    sectionsHidden.forEach((section) => section.classList.remove("d-none"));
}

async function getDishes() {
    showSpinner();
    try {
        const url = "http://localhost:4000/dishes";
        const res = await fetch(url);
        const dishes = await res.json();
        showDishes(dishes);
    } catch (error) {
        console.log(error);
    }
}

function showDishes(dishes) {
    // Clears the html to remove loader
    clearHTML(dishesContent);

    dishes.forEach((dish) => {
        const { name, category, id, price } = dish;

        const row = document.createElement("DIV");
        row.className = "row py-3 border-top";

        const nameDiv = document.createElement("DIV");
        nameDiv.className = "col-md-4";
        nameDiv.textContent = name;

        const priceDiv = document.createElement("DIV");
        priceDiv.className = "col-md-3 fw-bold";
        priceDiv.textContent = `$${price}`;

        const categoryDiv = document.createElement("DIV");
        categoryDiv.className = "col-md-3";
        // Adds the type of category by the categories dictionary
        categoryDiv.textContent = categories[category];

        const inputQuantity = document.createElement("INPUT");
        inputQuantity.type = "number";
        inputQuantity.min = 0;
        inputQuantity.value = 0;
        inputQuantity.id = `product-${id}`;
        inputQuantity.className = "form-control";
        inputQuantity.onchange = () => {
            const quantity = +inputQuantity.value;
            // The spread operator is used to create a new object that will include quantity as property
            addDish({ ...dish, quantity });
        };

        const inputDiv = document.createElement("DIV");
        inputDiv.className = "col-md-2";
        inputDiv.appendChild(inputQuantity);

        row.appendChild(nameDiv);
        row.appendChild(priceDiv);
        row.appendChild(categoryDiv);
        row.appendChild(inputDiv);

        dishesContent.appendChild(row);
    });
}

function addDish(product) {
    // Checks that quantity > 0
    if (product.quantity > 0) {
        // if already exists an product it will update quantity else it will return it as is
        if (customer.order.some((i) => i.id === product.id)) {
            customer.order = customer.order.map((item) =>
                item.id === product.id
                    ? { ...item, quantity: product.quantity }
                    : item
            );
        } else {
            // Adds a new customer.order to the array
            customer.order = [...customer.order, product];
        }
    } else {
        // Removes when quantity is <= 0
        customer.order = customer.order.filter((i) => i.id !== product.id);
    }

    updateResume();
}

function updateResume() {
    clearHTML(resumeContent);

    const resume = document.createElement("DIV");
    resume.className = "col-md-6 card py-2 px-3 shadow mh-600 o-auto";

    // Heading
    const heading = document.createElement("H3");
    heading.textContent = "Consumed dishes";
    heading.className = "my-4 text-center";

    // Table information
    const table = document.createElement("P");
    table.textContent = "Table: ";
    table.className = "fw-bold";

    const tableSpan = document.createElement("SPAN");
    tableSpan.textContent = customer.table;
    tableSpan.className = "fw-normal";
    table.appendChild(tableSpan);

    // Hour information
    const hour = document.createElement("P");
    hour.textContent = "Hour: ";
    hour.className = "fw-bold";

    const hourSpan = document.createElement("SPAN");
    hourSpan.textContent = customer.hour;
    hourSpan.className = "fw-normal";
    hour.appendChild(hourSpan);

    // Iterates order array
    const group = document.createElement("UL");
    group.className = "list-group";

    const { order } = customer;

    order.forEach((item) => {
        const { name, quantity, price, id } = item;

        const list = document.createElement("LI");
        list.className = "list-group-item";

        // Name
        const nameEl = document.createElement("H4");
        nameEl.className = "my-4";
        nameEl.textContent = name;

        // Quantity
        const quantityEl = document.createElement("P");
        quantityEl.className = "fw-bold";
        quantityEl.textContent = `Quantity: `;

        const quantityValue = document.createElement("SPAN");
        quantityValue.className = "fw-normal";
        quantityValue.textContent = quantity;

        // Price
        const priceEl = document.createElement("P");
        priceEl.className = "fw-bold";
        priceEl.textContent = "Price: ";

        const priceValue = document.createElement("SPAN");
        priceValue.className = "fw-normal";
        priceValue.textContent = `$${price}`;

        // Subtotal
        const subtotalEl = document.createElement("P");
        subtotalEl.className = "fw-bold";
        subtotalEl.textContent = "Subtotal: ";

        const subtotalValue = document.createElement("SPAN");
        subtotalValue.className = "fw-normal";
        subtotalValue.textContent = calculateSubtotal(price, quantity);

        // Delete btn
        const deleteBtn = document.createElement("BUTTON");
        deleteBtn.textContent = "Remove from order";
        deleteBtn.className = "btn btn-danger";
        deleteBtn.onclick = () => {
            deleteResume(id);
        };

        // Adds values to their containers
        quantityEl.appendChild(quantityValue);
        priceEl.appendChild(priceValue);
        subtotalEl.appendChild(subtotalValue);

        // Adds to LI
        list.appendChild(nameEl);
        list.appendChild(quantityEl);
        list.appendChild(priceEl);
        list.appendChild(subtotalEl);
        list.appendChild(deleteBtn);

        // Adds to group
        group.appendChild(list);
    });

    // Adds content to the HTML
    resume.appendChild(heading);
    resume.appendChild(table);
    resume.appendChild(hour);
    resume.appendChild(group);
    resumeContent.appendChild(resume);

    // Shows tips form
    formTips();
}

function deleteResume(id) {
    customer.order = customer.order.filter((i) => i.id !== id);

    // If there aren't orders
    if (!customer.order.length) {
        msgEmptyOrder();
    } else {
        updateResume();
    }
    const deletedInput = $(`#product-${id}`);
    deletedInput.value = 0;
}

function msgEmptyOrder() {
    const text = document.createElement("P");
    text.className = "text-center";
    text.textContent = "Add the elements to order";

    resumeContent.appendChild(text);
}

function formTips() {
    const form = document.createElement("DIV");
    form.className = "col-md-6 form";

    const divForm = document.createElement("DIV");
    divForm.className = "card shadow px-3";

    const heading = document.createElement("H3");
    heading.className = "my-4 text-center";
    heading.textContent = "Tips";

    // Add heading to form
    divForm.appendChild(heading);

    // Radio buttons
    const percentages = [10, 25, 50];
    percentages.forEach((percentage) => {
        const radio = document.createElement("INPUT");
        radio.type = "radio";
        radio.name = "tip";
        radio.value = percentage;
        radio.className = "form-check-input";
        radio.onclick = () => {
            calculateTip(radio.value);
        };

        const radioLabel = document.createElement("LABEL");
        radioLabel.textContent = `${percentage}%`;
        radioLabel.className = "form-check-label";

        const radioDiv = document.createElement("DIV");
        radioDiv.className = "form-check";
        radioDiv.appendChild(radio);
        radioDiv.appendChild(radioLabel);

        divForm.appendChild(radioDiv);
    });

    // Adds to form
    form.appendChild(divForm);

    // Adds to resume
    resumeContent.appendChild(form);
}

function calculateTip(tipValue) {
    const { order } = customer;
    let subtotal = 0;

    // Calculates subtotal
    order.forEach((item) => {
        subtotal += item.quantity * item.price;
    });

    // Calculates tip
    const tip = (subtotal * tipValue) / 100;

    // Adds tip to subtotal
    const total = subtotal + tip;

    showTotal(subtotal, total, tip);
}

function showTotal(subtotal, total, tip) {
    // If already exists a total
    $(".total-pay")?.remove();

    const divTotals = document.createElement("DIV");
    divTotals.className = "total-pay";

    // Subtotal
    const subtotalP = document.createElement("P");
    subtotalP.className = "fs-3 fw-bold mt-2";
    subtotalP.textContent = "Subtotal consumo: ";

    const subtotalSpan = document.createElement("SPAN");
    subtotalSpan.className = "fw-normal";
    subtotalSpan.textContent = `$${subtotal}`;

    subtotalP.appendChild(subtotalSpan);

    const tipP = document.createElement("P");
    tipP.className = "fs-3 fw-bold mt-2";
    tipP.textContent = "Tip: ";

    const tipSpan = document.createElement("SPAN");
    tipSpan.className = "fw-normal";
    tipSpan.textContent = `$${tip}`;

    tipP.appendChild(tipSpan);

    const totalP = document.createElement("P");
    totalP.className = "fs-3 fw-bold mt-2";
    totalP.textContent = "Total: ";

    const totalSpan = document.createElement("SPAN");
    totalSpan.className = "fw-normal";
    totalSpan.textContent = `$${total}`;

    totalP.appendChild(totalSpan);

    divTotals.appendChild(subtotalP);
    divTotals.appendChild(tipP);
    divTotals.appendChild(totalP);

    const form = document.querySelector(".form > div");
    form.appendChild(divTotals);
}

function calculateSubtotal(price, quantity) {
    return `$${price * quantity}`;
}

function clearHTML(element) {
    while (element.firstChild) {
        element.firstChild.remove();
    }
}

function showAlert(msg) {
    // Removes previous alert
    $(".invalid-feedback")?.remove();

    // Creates an alert and shows the msg parameter
    const alert = document.createElement("DIV");
    alert.className = "invalid-feedback d-block text-center";
    alert.textContent = msg;
    formModal.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 2000);
}

function showSpinner() {
    clearHTML(dishesContent);
    const spinner = document.createElement("DIV");
    spinner.classList.add("spinner");
    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    dishesContent.appendChild(spinner);
}

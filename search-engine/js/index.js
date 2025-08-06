// Imports
import cars from "./db.js";

// Utils
const $ = (q) => document.querySelector(q);
const $$ = (q) => document.querySelectorAll(q);

// Variables
// is selected all inputs to add event listeners by forEach method
const searchInputs = $$("#search-form select");

const year = $("#year");

// Container to results
const results = $("#results");
const maxYear = new Date().getFullYear();
const minYear = maxYear - 10;

// Object with the search
const searchData = {
    brand: "",
    year: "",
    maxPrice: "",
    minPrice: "",
    doors: "",
    color: "",
    transmission: "",
};

// Events
document.addEventListener("DOMContentLoaded", () => {
    showCars();

    // Fill year options
    fillSelect();
});

// Event listeners to search selects
searchInputs.forEach((input) => {
    input.addEventListener("change", (e) => {
        const { name, value } = e.target;
        searchData[name] = value;
        showCars();
    });
});

// Functions
function showCars() {
    // Clear the results container before show cars
    results.innerHTML = "";

    const hasFilters = Object.values(searchData).some((v) => v !== "");
    const carsToShow = hasFilters
        ? cars.filter((car) => {
              for (const [key, value] of Object.entries(searchData)) {
                  if (!value) continue;

                  if (key === "minPrice") {
                      if (car.price < parseFloat(value)) return false;
                      continue;
                  }

                  if (key === "maxPrice") {
                      if (car.price > parseFloat(value)) return false;
                      continue;
                  }

                  if (
                      car[key]?.toString().toLowerCase() !== value.toLowerCase()
                  ) {
                      return false;
                  }
              }
              return true;
          })
        : cars;

    // if the carsToShow array is empty show a message
    if (!carsToShow.length) {
        const alert = document.createElement("P");
        alert.textContent = "No se encontraron resultados";
        results.appendChild(alert);
        return;
    }
    carsToShow.forEach((car) => {
        // destructuring to the car object
        const { brand, model, year, price, doors, color, transmission } = car;

        const HTMLCar = document.createElement("P");
        HTMLCar.textContent = `${brand} ${model} - ${year} - Doors: ${doors} - Transmission: ${transmission} - Color: ${color} - Price: $${price}`;

        // insert in the html
        results.appendChild(HTMLCar);
    });
}

function fillSelect() {
    // is executed reverse to show the years from the most new
    for (let i = maxYear; i >= minYear; i--) {
        const option = document.createElement("OPTION");
        option.value = i;
        option.textContent = i;
        year.appendChild(option); // Adds the year options to div
    }
}

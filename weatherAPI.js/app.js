const container = document.querySelector(".container");
const result = document.querySelector("#result");
const form = document.querySelector("#form");

addEventListener("load", () => {
    form.addEventListener("submit", searchWeather);
});
function searchWeather(e) {
    e.preventDefault();

    // Validate the form
    const city = document.querySelector("#city").value.trim();
    const country = document.querySelector("#country").value.trim();

    if (city === "" || country === "") {
        // There was an error
        showAlert("Both fields are required");
        return;
    }

    // Request to the API
    fetchAPI(city, country);
}

function showAlert(msg) {
    // If already exists an alert then remove that
    document.querySelector(".bg-red-100")?.remove();
    // create an alert
    const alert = document.createElement("DIV");
    alert.className =
        "bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto mt-6 text-center";
    alert.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${msg}</span>
        `;
    container.appendChild(alert);

    // Remove the alert after 4s
    setTimeout(() => {
        alert.remove();
    }, 4000);
}
function fetchAPI(city, country) {
    const apiKey = "7345cc275e1ba3fd3ca090e36ad92722";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}`;

    // Show an loading spinner
    Spinner();
    fetch(url)
        .then((res) => res.json())
        .then((res) => {
            // Clear the previous HTML
            clearHTML();
            console.log(res);

            if (res.cod === "404") {
                showAlert("City not found");
                return;
            }

            // Print the res in the HTML
            showWeather(res);
        });
}

function showWeather(res) {
    // Destructuring an object that is inside of an object
    const {
        name,
        main: { temp, temp_max, temp_min },
    } = res;

    // Convert from kelvin to celcius
    const celcius = kelvinToCelcius(temp);
    const max = kelvinToCelcius(temp_max);
    const min = kelvinToCelcius(temp_min);

    const cityName = document.createElement("P");
    cityName.textContent = `Weather in ${name}`;
    cityName.className = "font-bold text-2xl";

    const current = document.createElement("P");
    current.innerHTML = `${celcius} &#8451;`;
    current.className = "font-bold text-xl";

    const tempMax = document.createElement("P");
    tempMax.innerHTML = `Max: ${max} &#8451;`;
    tempMax.className = "text-lg";

    const tempMin = document.createElement("P");
    tempMin.innerHTML = `Min: ${min} &#8451;`;
    tempMin.className = "text-lg";

    const divRes = document.createElement("DIV");
    divRes.className = "text-center text-white";
    divRes.appendChild(cityName);
    divRes.appendChild(current);
    divRes.appendChild(tempMax);
    divRes.appendChild(tempMin);

    result.appendChild(divRes);
}

const kelvinToCelcius = (degree) => Math.round(degree - 273.15);

function clearHTML() {
    while (result.firstChild) {
        result.firstChild.remove();
    }
}

function Spinner() {
    clearHTML();
    const divSpinner = document.createElement("DIV");
    divSpinner.className = "sk-folding-cube";
    divSpinner.innerHTML = `
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
    `;

    result.appendChild(divSpinner);
}

// Util
const $ = (q) => document.querySelector(q);

// Vars
const objSearch = {
    currency: "",
    cryptocurrency: "",
};

// Selector
const currencySelect = $("#currency");
const cryptosSelect = $("#cryptocurrency");
const result = $("#result");
const form = $("#form");

// Events
addEventListener("DOMContentLoaded", () => {
    fetchCryptos();
    form.addEventListener("submit", submitForm);
    currencySelect.addEventListener("change", readValue);
    cryptosSelect.addEventListener("change", readValue);
});

// Functions
async function fetchCryptos() {
    const url =
        "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD&api_key=66f102f74ea21d6cb67661473a75096d8d2537d2310950895895d13b97a086aa";
    try {
        const res = await fetch(url);
        // Data and Count are properties from the fetch response
        const {
            Data,
            // Gets Count property from MetaData Object
            // MetaData: { Count },
        } = await res.json();

        fillCryptosSelect(Data);
    } catch (e) {
        console.log(e);
    }
}

function fillCryptosSelect(cryptos) {
    cryptos.forEach((crypto) => {
        //it gets CoinInfo properties
        const { FullName, Name } = crypto.CoinInfo;

        // Creates the option and adds to cryptosSelect
        const option = document.createElement("OPTION");
        option.value = Name;
        option.textContent = FullName;
        cryptosSelect.appendChild(option);
    });
}

function readValue(e) {
    const { value, name } = e.target;

    // Fills global object
    objSearch[name] = value;
}

function submitForm(e) {
    e.preventDefault();

    // Validates form
    if (Object.values(objSearch).some((value) => value.trim() == "")) {
        showAlert("Both fields are required");
        return;
    }

    // Queries the API with results
    fetchAPI();
}

async function fetchAPI() {
    const { cryptocurrency, currency } = objSearch;

    showSpinner(result);

    try {
        // Creates url with crypto and currency
        const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrency}&tsyms=${currency}&api_key=66f102f74ea21d6cb67661473a75096d8d2537d2310950895895d13b97a086aa`;
        const res = await fetch(url);
        const { DISPLAY } = await res.json();

        // Dynamic access by cryptocurrency
        showQuotation(DISPLAY[cryptocurrency][currency]);
    } catch (e) {
        console.log(e);
    }
}

function showQuotation(quotation) {
    // Removes prev quoatation
    clearHTML(result);

    // Gets quotation properties
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = quotation;

    const price = document.createElement("P");
    price.className = "price";
    price.innerHTML = `
        The price is: <span>${PRICE}</span>
    `;

    const highPrice = document.createElement("P");
    highPrice.innerHTML = `<p>High day price: <span>${HIGHDAY}</span>`;

    const lowPrice = document.createElement("P");
    lowPrice.innerHTML = `<p>Low day price: <span>${LOWDAY}</span>`;

    const variation = document.createElement("P");
    variation.innerHTML = `<p>Last 24HS variation: <span>${CHANGEPCT24HOUR}%</span>`;

    const lastUpdate = document.createElement("P");
    lastUpdate.innerHTML = `<p>Last update: <span>${LASTUPDATE}%</span>`;

    result.appendChild(price);
    result.appendChild(highPrice);
    result.appendChild(lowPrice);
    result.appendChild(variation);
    result.appendChild(lastUpdate);
}

function clearHTML(element) {
    while (element.firstChild) {
        element.firstChild.remove();
    }
}

function showAlert(msg) {
    // Removes prev alert
    form.querySelector("div .error")?.remove();

    // Creates and adds alert
    const alert = document.createElement("DIV");
    alert.className = "error";
    alert.textContent = msg;
    form.prepend(alert);

    // Removes alert after 3s
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

function showSpinner(element) {
    clearHTML(result);
    const spinner = document.createElement("DIV");
    spinner.className = "spinner";
    spinner.innerHTML = `
      <div class="bounce1"></div>  
      <div class="bounce2"></div>  
      <div class="bounce3"></div>  
    `;
    element.appendChild(spinner);
}

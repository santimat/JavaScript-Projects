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
    }

    // Queries the API with results
    fetchAPI();
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

async function fetchAPI() {
    const { cryptocurrency, currency } = objSearch;

    // Creates url with crypto and currency
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrency}&tsyms=${currency}&api_key=66f102f74ea21d6cb67661473a75096d8d2537d2310950895895d13b97a086aa`;
    const res = await fetch(url);
    const { DISPLAY } = await res.json();

    // Dynamic access by cryptocurrency
    console.log(DISPLAY[cryptocurrency]);
}

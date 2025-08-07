// Utils
const $ = (q) => document.querySelector(q);

// Selectors
const results = $("#results");
const form = $("#form");
const paginationDiv = $("#pagination");

// Vars
const logsPerPage = 50;
let totalPages;
let iterator;
let currentPage = 1;

// Events
document.addEventListener("DOMContentLoaded", () => {
    form.addEventListener("submit", validateForm);
});

// Functions
function validateForm(e) {
    e.preventDefault();
    const searchTerm = $("#term").value.trim();

    if (searchTerm == "") {
        showAlert("Add a search term!!");
        return;
    }
    searchImages(searchTerm);
}

async function searchImages() {
    const searchTerm = $("#term").value.trim();

    // Show an spinner
    const spinner = showSpinner();

    // A try-catch statement is used while resolving the fetch to show a spinner and remove it on completetion
    try {
        const APIKEY = "39780935-9f468042ae7c1d5a646bc03b8";
        const url = `https://pixabay.com/api/?key=${APIKEY}&q=${searchTerm}&image_type=photo&pretty=true&per_page=${logsPerPage}&page=${currentPage}`;
        const res = await fetch(url);
        // the response is converted to JSON
        // Create an alias to hits. It's an array with the images
        const { hits: images, totalHits } = await res.json();

        // once the fetch is resolved, remove spinner
        spinner.remove();

        totalPages = calculatePages(totalHits);

        // show images
        showImages(images);
    } catch (error) {
        spinner.remove();
        showAlert("There was an error");
    }
}

function* createPagination(total) {
    for (let i = 1; i <= total; i++) {
        yield i;
    }
}

function showImages(images) {
    clearHTML(results);

    if (!images.length) {
        showAlert("No results");
        return;
    }

    images.forEach((image) => {
        const { id, likes, views, webformatURL, largeImageURL } = image;

        results.className =
            "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-10";
        results.innerHTML += `
            <div class="p-3 mb-4">
                <div class="bg-white rounded-lg shadow-lg flex flex-col h-full">
                    <img class="w-full h-full object-cover p-2" src="${webformatURL}"/>
                    <div class="p-4 flex-1">
                        <p class="font-bold">${likes} <span class="font-light">Likes</span></p>
                        <p class="font-bold">${views} <span class="font-light">Views</span></p>
                        <a class="w-full bg-blue-800 hover:bg-blue-500 text-white p-1 block text-center font-bold rounded-lg mt-4" href="${largeImageURL}" target="_blank">View high resolution image</a>
                    </div>
                </div>
            <div/>
        `;
    });

    clearHTML(paginationDiv);

    printIterator();
}

function printIterator() {
    iterator = createPagination(totalPages);
    while (true) {
        const { value, done } = iterator.next();

        // If "done" is true thats mean that is the final page
        if (done) return;

        const btn = document.createElement("A");
        btn.dataset.page = value;
        btn.textContent = value;
        btn.href = "#";
        btn.className =
            "next bg-blue-400 px-4 py-1 mr-2 font-bold mb-4 uppercase rounded";

        currentPage == value && btn.classList.add("bg-blue-900");
        btn.onclick = () => {
            currentPage = value;
            searchImages();
        };
        paginationDiv.appendChild(btn);
    }
}

function calculatePages(total) {
    // Math.ceil() round up
    return Math.ceil(total / logsPerPage);
}

function showAlert(msg) {
    $(".alert")?.remove();

    const alert = document.createElement("P");
    alert.className =
        "alert bg-red-100 border-red-400 text-red-700 py-2 rounded max-2-lg mx-auto mt-6 text-center";
    alert.innerHTML = `
            <span class="block sm:inline font-medium">${msg}</span>
        `;

    form.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 2000);
}

function showSpinner() {
    const spinner = document.createElement("SPAN");
    spinner.className = "spinner m-auto mt-10";
    form.appendChild(spinner);
    return spinner;
}

function clearHTML(selector) {
    while (selector.firstChild) {
        selector.firstChild.remove();
    }
}

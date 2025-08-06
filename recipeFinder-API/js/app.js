// Utils
const $ = (q) => document.querySelector(q);
const $$ = (q) => document.querySelectorAll(q);

// Event
document.addEventListener("DOMContentLoaded", startApp);

// Functions
function startApp() {
    // Selectors
    const selectCategories = $("#categories");
    const resultsContainer = $("#results");
    const modal = new bootstrap.Modal("#modal");
    const favoritesDiv = $(".favorites");

    selectCategories?.addEventListener("change", selectCategory);

    // If selectCategories exists
    selectCategories && getCategories();

    // If favoritesDiv exists execute the function
    favoritesDiv && getFavorites();

    function getCategories() {
        const url = "https://www.themealdb.com/api/json/v1/1/categories.php";
        fetch(url)
            .then((res) => res.json())
            // Destructuring from the response to get the array with the categories
            .then(({ categories }) => renderOptions(categories))
            .catch(() => {
                showToast("There was an error with the API");
                // Reload the page
                location.reload();
            });
    }

    function renderOptions(categories = []) {
        categories.forEach((category) => {
            const { strCategory } = category;

            const option = document.createElement("OPTION");
            option.value = strCategory;
            option.textContent = strCategory;

            selectCategories.appendChild(option);
        });
    }

    function selectCategory({ target }) {
        // Add an alias to the "value" extracted from the target object
        const { value: selectedCategory } = target;

        // Show the spinner
        const spinner = showSpinner(resultsContainer);

        // Fetch the API and get the meals
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`;
        fetch(url)
            .then((res) => res.json())
            .then(({ meals }) => {
                // Remove spinner when the fetch is resolve
                spinner.remove();
                renderMeals(meals);
            });
    }

    async function renderMeals(meals = []) {
        const heading = document.createElement("H2");
        heading.className = "text-center text-black my-5";
        heading.textContent = meals.length ? "Results" : "No results";
        resultsContainer.appendChild(heading);

        meals?.forEach((meal) => {
            // Properties for index.html
            const { idMeal, strMeal, strMealThumb } = meal;

            // Properties for favorites.html
            const { id, title, img } = meal;

            const mealContainer = document.createElement("DIV");
            mealContainer.className = "col-md-4 d-flex";

            const mealCard = document.createElement("DIV");
            mealCard.className = "card mb-4 h-100";

            const mealImg = document.createElement("IMG");
            mealImg.className = "card-img-top";
            mealImg.alt = `Recipe image for: ${strMeal ?? title}`;
            mealImg.src =
                strMealThumb ??
                img ??
                // If strMealThumb or img are null add an default image
                "https://preview-landing-page-carne-asada-kzmo4kdakvmuhurc94kw.vusercontent.net/placeholder.svg?height=299&width=299";

            const mealCardBody = document.createElement("DIV");
            mealCardBody.className = "card-body d-flex flex-column";

            const mealHeading = document.createElement("H4");
            mealHeading.textContent = strMeal ?? title;

            const mealBtn = document.createElement("BUTTON");
            mealBtn.className = "btn btn-primary w-100 mt-auto";
            mealBtn.textContent = "View recipe";
            mealBtn.onclick = () => selectMeal(idMeal ?? id);

            // Add elements in the body
            mealCardBody.appendChild(mealHeading);
            mealCardBody.appendChild(mealBtn);
            // Add body in the card
            mealCard.append(mealImg);
            mealCard.append(mealCardBody);

            // Add de card in the container
            mealContainer.appendChild(mealCard);

            // Inject in the HTML
            resultsContainer.appendChild(mealContainer);
        });
    }

    async function selectMeal(idMeal) {
        const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`;

        modal.show();
        const modalBody = $(".modal .modal-body");
        // Show a spinner
        const spinner = showSpinner(modalBody);
        fetch(url)
            .then((res) => res.json())
            .then(({ meals }) => {
                // Remove spinner when the fetch is resolve
                spinner.remove();
                showRecipe(meals[0]);
            });
    }

    function showRecipe(recipe) {
        const { idMeal, strInstructions, strMeal, strMealThumb } = recipe;

        // Select modal elements
        const modalTitle = $(".modal .modal-title");
        const modalBody = $(".modal .modal-body");

        // Add content to the modal
        modalTitle.textContent = strMeal;
        // As long you know where the information is provided from, using innerHTML is fine
        modalBody.innerHTML = `
            <img class="img-fluid" src="${strMealThumb}" alt="Recipe ${strMeal}">
            <h3 class="my-3">Instructions</h3>
            <p>${strInstructions}</p>
            <h3 class="my-3">Ingredients and quantities</h3> 
        `;

        // Show ingredients and quantities
        // Unorded list for the ingredients and quantities
        const listGroup = document.createElement("UL");
        listGroup.className = "list-group";

        // from 1 to 20 because is the quantity for default of the API
        for (let i = 1; i <= 20; i++) {
            // If there is an ingrendient
            if (recipe[`strIngredient${i}`]) {
                const ingredient = recipe[`strIngredient${i}`];
                const quantity = recipe[`strMeasure${i}`];

                const ingredientLI = document.createElement("LI");
                ingredientLI.className = "list-group-item";
                ingredientLI.textContent = `${ingredient} - ${quantity}`;

                listGroup.appendChild(ingredientLI);
            }
        }

        modalBody.appendChild(listGroup);

        // Close and favorite buttons
        // select modal footer
        const modalFooter = $(".modal .modal-footer");

        // Clear modalFooter
        clearHTML(modalFooter);

        const btnFavorite = document.createElement("BUTTON");

        btnFavorite.classList.add(
            "btn",
            "col",
            existsStorage(idMeal) ? "btn-danger" : "btn-success"
        );
        btnFavorite.textContent =
            // If the current recipe belongs to the favorites recipes it show the "Delete favorite" button
            existsStorage(idMeal) ? "Delete favorite" : "Save favorite";

        // localStorage
        btnFavorite.onclick = () => {
            // Prevent duplicate items
            if (existsStorage(idMeal)) {
                deleteFavorite(idMeal);
                btnFavorite.textContent = "Save Favorite";
                btnFavorite.classList.replace("btn-danger", "btn-success");
                // Show a toast alert
                showToast("Correctly deleted!");

                // If the current page is favorites.html, it will be reloaded when a meal is deleted
                location.pathname.includes("favorites") && location.reload();
                return;
            }

            addFavorite({
                // Meal information
                id: idMeal,
                title: strMeal,
                img: strMealThumb,
            });
            btnFavorite.textContent = "Delete Favorite";
            btnFavorite.classList.replace("btn-success", "btn-danger");
            showToast("Saved!");
        };

        const btnCloseModal = document.createElement("BUTTON");
        btnCloseModal.className = "btn btn-secondary col";
        btnCloseModal.textContent = "Close";
        btnCloseModal.onclick = () => modal.hide();
        modalFooter.appendChild(btnFavorite);
        modalFooter.appendChild(btnCloseModal);
    }

    // Meal will be an object
    function addFavorite(meal) {
        // If already exists favorites in localStorage get them else favorites will be an empty array
        // JSON.parse is to convert an string json to json type
        const favorites = JSON.parse(localStorage.getItem("favorites")) ?? [];

        // add the new favorite to localStorage with the spread operator
        // JSON.stringy is to convert a json object to a string
        localStorage.setItem("favorites", JSON.stringify([...favorites, meal]));
    }

    function deleteFavorite(id) {
        // Get favorites recipes
        const favorites = JSON.parse(localStorage.getItem("favorites")) ?? [];

        // New array without the favorite that must be deleted
        const newFavorites = favorites.filter((favorite) => favorite.id !== id);

        // Save the favorites new array in localStorage
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
    }

    // Check if an favorite meal already exists in the localStorage
    function existsStorage(id) {
        const favorites = JSON.parse(localStorage.getItem("favorites")) ?? [];
        return favorites.some((favorite) => favorite.id == id);
    }

    function showToast(msg) {
        const toastDiv = $("#toast");
        const toastBody = $(".toast-body");
        // Create a new toast
        const toast = new bootstrap.Toast(toastDiv);
        toastBody.textContent = msg;
        toast.show();
        setTimeout(() => {
            toast.hide();
        }, 2000);
    }

    function getFavorites() {
        // Get favorites from localStorage
        const favorites = JSON.parse(localStorage.getItem("favorites")) ?? [];

        // If there are no favorites yet
        if (!favorites.length) {
            const noFavorites = document.createElement("P");
            noFavorites.textContent = "No favorites yet";
            noFavorites.className = "fs-4 text-center font-bold mt-5";
            favoritesDiv.appendChild(noFavorites);
            return;
        }

        // Else there are favorites
        renderMeals(favorites);
    }

    function clearHTML(selector) {
        while (selector.firstChild) {
            selector.firstChild.remove();
        }
    }

    function showSpinner(selector) {
        clearHTML(selector);

        const spinner = document.createElement("DIV");
        spinner.className = "spinner";
        spinner.innerHTML = `
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
            `;
        selector.appendChild(spinner);

        // Return the spinner to delete when the fetch is resolve
        return spinner;
    }
}

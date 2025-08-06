// variables
const cart = document.querySelector("#carrito");
const cartContainer = document.querySelector("#lista-carrito tbody");
const clearCartBtn = document.querySelector("#vaciar-carrito");
const listCourses = document.querySelector("#lista-cursos");

// Variable to save courses in cart
let coursesCart = [];

loadEventListeners();
function loadEventListeners() {
    // add the course to the cart when the add button is clicked
    listCourses.addEventListener("click", addCourse);

    // delete courses from the cart
    cart.addEventListener("click", deleteCourse);

    // Empty cart
    clearCartBtn.addEventListener("click", () => {
        cartContainer.innerHTML = ""; // clear HTML content
        coursesCart = []; // reset array
    });
}

// Is used delegation because it is better for perfonmance, especially when working with a big collection of elements
function addCourse(e) {
    // check if the user clicks the add to cart button
    if (e.target.classList.contains("agregar-carrito")) {
        e.preventDefault();
        // get the card element of the clicked course
        const selectedCourse = e.target.parentElement.parentElement;
        const dataCourse = readDataCourse(selectedCourse);

        // check if the course to add already exists in the cart
        if (!coursesCart.some((course) => course.id == dataCourse.id)) {
            // add items to the cart
            // the spread operator is used to add the existing items plus the new one
            coursesCart = [...coursesCart, dataCourse];
        } else {
            const courseToUpdate = coursesCart.find(
                (course) => course.id == dataCourse.id
            );
            courseToUpdate.quantity++;
        }
        renderHTMLCart();
    }
}

// delete a course from the cart
function deleteCourse(e) {
    if (e.target.classList.contains("borrar-curso")) {
        const courseToDelete = e.target.parentElement.parentElement;

        courseToDelete.remove(); //remove the element from HTML cart

        // replace the coursesCart with a new array without the deleted course
        coursesCart = coursesCart.filter(
            (course) => course.id != e.target.dataset.id
        );
    }
}

// Read the HTML content that was clicked and get the information
function readDataCourse(selectedCourse) {
    // Create an object with the content of the current course
    return {
        id: selectedCourse.querySelector(".agregar-carrito").dataset.id,
        image: selectedCourse.querySelector("img").src,
        price: selectedCourse.querySelector(".precio span").textContent,
        quantity: 1,
        title: selectedCourse.querySelector("h4").textContent,
    };
}

// Show the cart on the HTML
function renderHTMLCart() {
    // Clear the cart before showing new HTML, it is to prevent repeat content
    cartContainer.innerHTML = "";

    // adds new rows to the cart with course information
    coursesCart.forEach((course) => {
        const row = document.createElement("TR");
        const { image, title, price, quantity, id } = course;
        row.innerHTML = `
            <td>
                <img src="${image}" width="80" height="80" style="object-fit:cover">
            </td>
            <td>${title}</td>
            <td>${price}</td>
            <td style="text-aligncenter">${quantity}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}">X</a>
            </td>
        `;

        // Add HTML of the cart in the tbody element
        cartContainer.appendChild(row);
    });
}

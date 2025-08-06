// Utils
const $ = (query) => document.querySelector(query);
const $$ = (query) => document.querySelectorAll(query);

// Variables
const form = $("#form");
const toDoList = $("#todo-list");
let toDoArr = [];

// Event Listeners
eventListeners();
function eventListeners() {
    // When the user add a new tweet
    form.addEventListener("submit", addTweet);

    // When the document is loaded
    document.addEventListener("DOMContentLoaded", () => {
        // get toDo from local storage and add them to the toDo array
        toDoArr = JSON.parse(localStorage.getItem("toDo")) || []; // if no toDo in local storage an empty array is assigned
        createHTML();
    });
}

// Functions
function addTweet(e) {
    e.preventDefault();

    // textarea where the user types
    const toDo = $("#todo").value.trim();

    // if the toDo is empty
    if (!toDo) {
        showError("The ToDo can't be empty");
        return; // Prevents the code continuing to execute
    }

    // Obj with info of the current toDo
    const toDoObj = {
        id: Date.now(),
        // if leave only one value javascript will write that as key and value
        toDo,
        // this is the same as above
        // toDo: toDo,
    };

    // Add to the toDo array
    toDoArr = [...toDoArr, toDoObj];

    // Once added, the html is created
    createHTML();

    // Clear form
    form.reset();
}

// Show msg
function showError(msg) {
    const msgError = document.createElement("P");
    msgError.textContent = msg;
    msgError.classList.add("error");

    // insert in the content
    const content = $("#content");
    content.appendChild(msgError);

    // delete error msg after two seconds
    setTimeout(() => {
        msgError.remove();
    }, 2000);
}

// Show a list of the tweets
function createHTML() {
    // clear the toDo list before show the tweets
    clearHTML();

    // if tweet array isn't empty
    if (toDoArr.length) {
        toDoArr.forEach((td) => {
            // add delete button
            const deleteBtn = document.createElement("A");
            deleteBtn.classList.add("borrar-todo");
            deleteBtn.textContent = "X";

            // add delete function
            deleteBtn.onclick = () => {
                deleteTweet(td.id);
            };

            // Create the HTML
            const li = document.createElement("LI");
            li.textContent = td.toDo;

            // assign button
            li.appendChild(deleteBtn);

            // Insert in to the HTML
            toDoList.appendChild(li);
        });
    } else {
        const msg = document.createElement("P");
        msg.textContent = "Empty";
        msg.classList.add("empty");
        toDoList.appendChild(msg);
    }

    syncStorage();
}

// Add the current tweets to localStorage
function syncStorage() {
    localStorage.setItem("toDo", JSON.stringify(toDoArr));
}

// Delete a tweet
function deleteTweet(id) {
    toDoArr = toDoArr.filter((td) => td.id != id);
    createHTML();
}

// Clear the HTML
function clearHTML() {
    while (toDoList.firstChild) {
        toDoList.firstChild.remove();
    }
}

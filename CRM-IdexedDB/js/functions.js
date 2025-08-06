export const $ = (q) => document.querySelector(q);
export const $$ = (q) => document.querySelectorAll(q);

export const generateId = () => Math.random().toString(36).substring(2);

export function showAlert({ txt, type }) {
    const form = $("#form");
    // If alert exists yet
    form.querySelector(".alert")?.remove();

    // create alert
    const divMsg = document.createElement("DIV");
    divMsg.className =
        "px-4 py-3 rounded max-w-lg mx-auto mt-6 text-center border alert";

    // Is concatenated depending the type of alert
    divMsg.className +=
        type == "error"
            ? " bg-red-100 border-red-400 text-red-700"
            : " bg-green-100 border-green-400 text-green-700";

    divMsg.textContent = txt;
    form.appendChild(divMsg);

    setTimeout(() => {
        divMsg.remove();
    }, 2000);
}

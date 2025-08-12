export function showAlert(msg) {
    document.querySelector(".bg-red-100")?.remove();

    const alert = document.createElement("DIV");
    alert.className =
        "bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded max-w-lg mx-auto mt-6 text-center";

    alert.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${msg}</span>
        `;
    document.querySelector("#form").appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 2000);
}

export const $ = (q) => document.querySelector(q);
export const $$ = (q) => document.querySelectorAll(q);

export function validateFields(inputs) {
    return Array.from(inputs).some((input) => input.value.trim() === "");
}

export function fillObj(obj, inputs) {
    inputs.forEach(({ name, value }) => {
        obj[name] = value;
    });
}

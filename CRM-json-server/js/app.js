import { getClients, deleteClient } from "./API.js";
import { $ } from "./functions.js";

(function () {
    const list = $("#client-list");

    addEventListener("DOMContentLoaded", showClients);
    list.addEventListener("click", confirmDelete);
    async function showClients() {
        const clients = await getClients();

        if (!clients.length) {
            return;
        }

        clients.forEach(({ name, email, phone, company, id }) => {
            const row = document.createElement("TR");
            row.innerHTML += `
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${name} </p>
                    <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                    <p class="text-gray-700">${phone}</p>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                    <p class="text-gray-600">${company}</p>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                    <a href="edit-client.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Edit</a>
                    <a href="#" data-client="${id}" class="text-red-600 hover:text-red-900 delete">Delete</a>
                </td>
            `;
            list.appendChild(row);
        });
    }

    function confirmDelete(e) {
        if (e.target.classList.contains("delete")) {
            const res = confirm("do you want to delete this client?");
            if (res) {
                const { client } = e.target.dataset;
                deleteClient(client);
            }
        }
    }
})();

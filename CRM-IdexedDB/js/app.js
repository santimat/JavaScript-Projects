import { getDB } from "./DB.js";
import { $ } from "./functions.js";
(function () {
    let DB;

    const clientList = $("#client-list");
    onload = async () => {
        DB = await getDB();
        loadCustomers();

        clientList.onclick = deleteCustomer;
    };

    function loadCustomers() {
        const transaction = DB.transaction("crm", "readonly");
        const objectStore = transaction.objectStore("crm");

        // clear previous HTML before the render
        while (clientList.firstChild) {
            clientList.firstChild.remove();
        }
        let hasCustomer;

        // openCursor() iterate the logs in the DB
        objectStore.openCursor().onsuccess = (e) => {
            const cursor = e.target.result;

            // If the cursor exists the client will be render
            if (cursor) {
                hasCustomer = true;

                // value will be the current log
                const { value } = cursor;
                const { firstName, email, phone, company, id } = value;
                const tableRow = document.createElement("TR");
                tableRow.innerHTML = `
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <p class="text-sm leading-5 font-medium text-gray-700 text-lg font-bold">${firstName}</p>
                    <p class="text-sm leading-5 text-gray-700">${email}</p>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <p class="text-gray-700">${phone}</p>
                </td>
                <td class="px-6 py-4 whitespace-no-warp border-b border-gray-200 leading-5 text-gray-600">
                    <p class="text-gray-600">${company}</p>
                </td>
                <td class="px-6 py-4 whitespace-no-warp border-b border-gray-200 leading-5 text-sm">
                    <a href="edit-client.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Edit</a>
                    <a href="#" data-customer="${id}" class="text-red-600 hover:text-red-900 deleteBtn">Delete</a>
                </td>
            `;
                clientList.appendChild(tableRow);

                // Continue with the next log
                cursor.continue();
            }

            // If hasCustomer is false that's mean that the DB is empty
            if (!hasCustomer) {
                clientList.innerHTML =
                    "<tr><td colspan='4' class='text-center py-3 font-medium text-sm'>No clients yet</td></tr>";
                return;
            }
        };
    }

    function deleteCustomer(e) {
        const element = e.target;
        if (element.classList.contains("deleteBtn")) {
            const customerId = element.dataset.customer;

            if (
                confirm("Are you sure that you want to delete this customer?")
            ) {
                const transaction = DB.transaction("crm", "readwrite");
                const objectStore = transaction.objectStore("crm");
                objectStore.delete(customerId);
                transaction.oncomplete = () => {
                    element.parentElement.parentElement.remove();
                };
                objectStore.count().onsuccess = (e) => {
                    e.target.result == 0 && loadCustomers();
                };
            }
        }
    }
})();

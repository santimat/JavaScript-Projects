const $ = (query) => document.querySelector(query);
const $$ = (query) => document.querySelectorAll(query);

// runs when the HTML document is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Object to save email information, which will be sent
    const email = {
        email: "",
        message: "",
        subject: "",
    };

    // Selecting the interface elements
    const inputs = $$(".form-input");
    const form = $("#formulario");
    const submitBtn = $("#formulario button[type='submit']");
    const resetBtn = $("#formulario button[type='reset']");
    const spinner = $("#spinner");

    // set events, some of these events are usually used for verification of email fields
    // blur event is executed when the user leaves a field
    inputs.forEach((i) => i.addEventListener("input", validate));

    resetBtn.addEventListener("click", (e) => {
        e.preventDefault();

        // reset the email object
        resetForm();
    });

    form.addEventListener("submit", sendEmail);
    function sendEmail(e) {
        e.preventDefault();

        spinner.classList.remove("hidden");

        setTimeout(() => {
            spinner.classList.add("hidden");

            const successAlert = document.createElement("P");
            successAlert.classList.add(
                "bg-green-500",
                "text-white",
                "p-2",
                "text-center",
                "rounded-lg",
                "mt-10",
                "font-bold",
                "text-sm",
                "uppercase"
            );
            successAlert.textContent = "Mensaje enviado correctamente";
            form.appendChild(successAlert);

            setTimeout(() => {
                successAlert.remove();
            }, 2000);
        }, 1500);

        resetForm();
    }

    function validate(e) {
        const input = e.target;

        const reference = input.parentElement;

        // the trim method is used to clear white spaces at the start or end of input value
        if (input.value.trim() === "" && input.id != "cc") {
            showAlert(`El campo ${input.id} es obligatorio`, reference);
            email[input.name] = "";
            checkEmail();
            return;
        }
        if (input.id == "email" && !validateEmail(input.value)) {
            showAlert("Email no valido", reference);
            email[input.name] = "";
            checkEmail();
            return;
        }

        if (
            input.id == "cc" &&
            input.value != "" &&
            !validateEmail(input.value)
        ) {
            showAlert("Destinatario extra no valido", reference);
            checkEmail();
            return;
        }

        // When the input value is not "", remove the alerts
        removeAlert(reference);

        // Saves the data in the email object
        // each property is accesesed by the name attribute of each input
        email[input.name] = input.value.trim(); // trim to clear white spaces at the start or end

        // Check the email object
        checkEmail();
    }

    function showAlert(msg, reference) {
        // Create HTML alert
        // Search the alert element from reference point, this way we will not delete another element by mistake
        const alert = reference.querySelector(".error");
        if (alert) {
            alert.remove();
        }

        const error = document.createElement("P");
        error.textContent = msg;
        error.classList.add("error", "text-red", "p-1");
        reference.appendChild(error);
    }

    function removeAlert(reference) {
        const alert = reference.querySelector(".error");
        alert && alert.remove();
    }

    function validateEmail(email) {
        const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        return regex.test(email);
    }

    function checkEmail() {
        // if the values in the email object aren't empty removes disabled attribute to submit button
        if (!Object.values(email).includes("")) {
            submitBtn.classList.remove("opacity-50");
            submitBtn.disabled = false;
            return;
        }
        submitBtn.classList.add("opacity-50");
        submitBtn.disabled = true;
    }

    function resetForm() {
        email.cc = "";
        email.email = "";
        email.message = "";
        email.subject = "";
        form.reset();
    }
});

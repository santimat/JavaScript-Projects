export const saveTestimonial = (req, res) => {
    // Validate
    const errors = [];
    const inputValues = {};
    // If some input value is empty it's added to error array

    Object.entries(req.body).forEach(([key, value]) => {
        inputValues[key] = value;
        value.trim() == "" && errors.push(key);
    });

    console.log(inputValues);

    if (errors.length) {
        // Show view with errors
        res.render("testimonials", {
            page: "Testimonials",
            errors,
            name: inputValues.name,
            email: inputValues.email,
            message: inputValues.message,
        });
    }
};

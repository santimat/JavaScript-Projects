import { Trip } from "../models/Trips.js";

export const pageHome = (req, res) => {
    res.render("home", {
        page: "Home",
    });
};

export const pageAboutUs = (req, res) => {
    res.render("us", { page: "About us" });
};

export const pageTrips = async (req, res) => {
    // Query to database
    const trips = await Trip.findAll();
    res.render("trips", { page: "Upcoming Trips", trips });
};

// Show a trip by their slug
export const pageDetailTrip = async (req, res) => {
    const { slug } = req.params;
    try {
        // Find by slug
        const response = await Trip.findOne({ where: { slug } });
        res.render("trip", {
            page: "Trip information",
            trip: response,
        });
    } catch (e) {
        console.log(e);
    }
};

export const pageTestimonials = (req, res) => {
    res.render("testimonials", { page: "Testimonials" });
};

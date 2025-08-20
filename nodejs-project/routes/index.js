import { Router } from "express";
import {
    pageAboutUs,
    pageDetailTrip,
    pageHome,
    pageTestimonials,
    pageTrips,
} from "../controllers/pagesController.js";
import { saveTestimonial } from "../controllers/testimonialController.js";

// In this ways is used the same instance of express app
const router = Router();

// Routing
router.get("/", pageHome);

router.get("/us", pageAboutUs);

router.get("/trips", pageTrips);

// : is a wildcard, this allow dynamics paths
router.get("/trips/:slug", pageDetailTrip);

router.get("/testimonials", pageTestimonials);
router.post("/testimonials", saveTestimonial);

// Export to router
export default router;

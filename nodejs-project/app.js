import express from "express";
import router from "./routes/index.js";
import db from "./config/db.js";

const app = express();

// Connect database
await db
    .authenticate() // <- return a promise
    .then(() => console.log("connected"))
    .catch((e) => console.log("hubo un error: ", e));

// Add body parser to read data
app.use(express.urlencoded({ extended: true }));

// Enable PUG as view engine
app.set("view engine", "pug");

// Get current year
app.use((req, res, next) => {
    const currentYear = new Date().getFullYear();
    // Send the currentYear by locals object
    res.locals.currentYear = currentYear;
    res.locals.siteName = "Travel agency";
    next();
});

// Set public directory as express static files
app.use(express.static("public"));

// Use the router
app.use(router);

// listen to port 3000
app.listen(3000, () => {
    console.log("server listening http://localhost:3000");
});

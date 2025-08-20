import Sequelize from "sequelize";
import db from "../config/db.js";

// Define a model
export const Trip = db.define(
    // Table name
    "trips",
    // Table columns
    {
        title: {
            // this say that the title should be a string
            type: Sequelize.STRING,
        },
        price: {
            type: Sequelize.STRING,
        },
        departure_date: {
            type: Sequelize.DATE,
        },
        return_date: {
            type: Sequelize.DATE,
        },
        image: {
            type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.STRING,
        },
        availables: {
            type: Sequelize.STRING,
        },
        slug: {
            type: Sequelize.STRING,
        },
    }
);

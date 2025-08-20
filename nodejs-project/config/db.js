import Sequelize from "sequelize";
const db = new Sequelize(
    // Db name
    "travelagency",
    // Db user
    "root",
    // Db password
    "root",
    {
        host: "localhost",
        port: 3306,
        dialect: "mysql",
        define: {
            timestamps: false,
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        operatorAliases: false,
    }
);

export default db;


require('dotenv').config()
// const mysql = require('mysql2/promise')
const mongoose = require("mongoose")

//test connection
// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT, //default 3306
//     password: process.env.DB_PASSWORD  //default empty
// });

// const connection = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT, //default 3306
//     password: process.env.DB_PASSWORD,  //default empty
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });
const dbState = [
    { value: 0, label: "disconnected" },
    { value: 1, label: "connected" },
    { value: 2, label: "connecting" },
    { value: 3, label: "disconnecting" }
];


const connection = async () => {

    try {
        const options = {
            user: process.env.DB_USER,
            pass: process.env.DB_PASSWORD,
            dbName: process.env.DB_NAME
        }
        await mongoose.connect(process.env.DB_HOST, options);

        const state = Number(mongoose.connection.readyState);
        console.log(dbState.find(f => f.value === state).label, "to db"); // connected to db
    } catch (error) {
        console.log(">>>err", error);
    }
}

module.exports = connection
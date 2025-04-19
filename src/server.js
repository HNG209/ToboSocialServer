require('dotenv').config()
const express = require('express')
const path = require('path')
const configViewEngine = require("./config/viewEngine")
const webRoutes = require("./routes/web")
const apiRoutes = require("./routes/social")
const fileUpload = require('express-fileupload')
const { MongoClient } = require('mongodb');
const cors = require('cors');

const connection = require("./config/database")
const { log } = require('console')
const mongoose = require('mongoose')

const app = express()
const port = process.env.PORT || 8888
const hostname = process.env.HOST_NAME

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//config template engine
configViewEngine(app)



app.use(fileUpload());

//khai bao route
// app.use('/', webRoutes);
// app.use('/v1/api', apiRoutes);
app.use('/v1/api', apiRoutes);

//test connection
(async () => {
    try {
        //using mongoose
        await connection()

        //using mongo driver
        // Connection URL
        // const url = process.env.DB_HOST_WITH_DRIVER;
        // const client = new MongoClient(url);

        // // Database Name
        // const dbName = process.env.DB_NAME;

        // await client.connect();
        // console.log('Connected successfully to server');

        // const db = client.db(dbName);
        // const collection = db.collection('customers');

        // // let a = await collection.find({})
        // // console.log(">>>find", a)

        app.listen(port, hostname, () => {
            console.log(`Example app listening on port ${port}`)
        })

    } catch (error) {
        console.log(error)
    }
})()


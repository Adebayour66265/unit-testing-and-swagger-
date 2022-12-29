const express = require('express');
const app = express();
const { connectDb } = require('./database/db');
require("dotenv").config();
const userRoutes = require('./routes/user');
const productRoute = require('./routes/product');

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require('swagger-jsdoc');



PORT = process.env.PORT;

const spec = swaggerJsDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Photo Store API",
            version: "1.0.0",
            description: "Buy/Sell photoS"
        },
        server: [{
            url: process.env.BASE_URL
        }]
    },
    apis: ["./routes/*.js"]
});



app.use('/api/user', userRoutes);
app.use('/api/product', productRoute);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(spec));

app.listen(PORT, () => {
    console.log('Server is listing');
    connectDb();
})
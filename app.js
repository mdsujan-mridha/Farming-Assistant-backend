const express = require('express');

const app = express();

const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errorMiddleware = require("./middleware/error");

// import somethings from controller
const user = require("./routes/userRoute");
// import product 
const product = require("./routes/productRoute");
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:3000',
    'Content-Type': 'Authorization',
    "Content-type": "application/json",
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
// user api 
app.use("/api/v1", user);
// product api 
app.use("/api/v1", product)

app.use(errorMiddleware);
module.exports = app;
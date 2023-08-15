const express = require('express');

const app = express();

const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errorMiddleware = require("./middleware/error");

// import somethings from controller
const user = require("./routes/userRoute");

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1", user);


app.use(errorMiddleware);
module.exports = app;
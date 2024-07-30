const app = require("./app");

const dotenv = require("dotenv");
const path = require('path');
const port = process.env.PORT || 5000;

const database = require("./config/dbConnection");
const cloudinary = require("cloudinary");

//handler uncaught type error
process.on("uncaughtException", err => {
    console.log(`Err: ${err.message}`);
    console.log(`Shutting down the server due to uncaught Exception `);
    process.exit(1);
});
//config
dotenv.config({ path: "./config/config.env" });
// console.log(process.env.STRIPE_SECRET_KEY)
// connect with database 
database();

//cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// sendFile will go here 
app.get("/", async (req, res) => {

    res.sendFile(path.join(__dirname, '/index.html'));

});

// listen app when anyone hit on api from client or any browser 
const server = app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`)
});

// handle Promise Rejection
process.on("unhandledRejection", err => {
    console.log(`Err: ${err.message}`)
    console.log(`Shutting down the server due to Unhandled Promise Rejection`)

    server.close(() => {
        process.exit(1);
    });
});
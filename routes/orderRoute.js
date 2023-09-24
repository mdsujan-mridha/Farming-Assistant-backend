

const express = require("express");
const { newOrder } = require("../controllers/orderController");

const router = express.Router();

// create order route 
router.route("/order/new").post(newOrder);


module.exports = router;
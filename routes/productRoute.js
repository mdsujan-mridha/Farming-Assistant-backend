const express = require('express');
const { createProduct } = require('../controllers/productContoller');

const router = express.Router();

router.route("/product/new").post(createProduct);


module.exports = router;
const express = require('express');
const { createProduct, getAllProducts, getProductDetails } = require('../controllers/productContoller');

const router = express.Router();

router.route("/product/new").post(createProduct);

// get all products 
router.route("/products").get(getAllProducts);
// get products details 
router.route("/product/:id").get(getProductDetails);

module.exports = router;
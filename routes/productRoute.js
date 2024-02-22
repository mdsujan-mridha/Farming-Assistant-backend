const express = require('express');
const {
    createProduct,
    getAllProducts,
    getProductDetails,
    updateProduct,
    deleteProduct,
    getAdminProduct,
    createProductReview,
    getProductReviews,
    deleteReview
} = require('../controllers/productContoller');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.route("/product/new").post(isAuthenticatedUser, createProduct);

// get all products 
router.route("/products").get(getAllProducts);
// get products details 
router.route("/product/:id").get(getProductDetails);
// update product by admin 
router.route("/admin/product/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);
// get all product by admin 
router.route("/admin/products").get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProduct);


// product review 
router.route("/review").put(isAuthenticatedUser, createProductReview);
router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser, deleteReview);

module.exports = router;


const express = require("express");
const { newOrder, getOrder, myOrders, getAllOrder, deleteOrder, updateOrder } = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// create order route 
router.route("/order/new").post(isAuthenticatedUser, newOrder);
// get logged user order 
router.route("order/me").get(isAuthenticatedUser, myOrders);

// order details 
router.route("/order/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getOrder);


// get all orders by admin 
router.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrder);
// delete or update order  by  admin 
router.route("/admin/order/:id")
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
    ;

module.exports = router;
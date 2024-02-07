const express = require('express');
const {
    registerUser,
    login,
    logout,
    getSingleUser,
    getAllUsers,
    getAllUser,
    updateUserRole,
    deleteUser
} = require('../controllers/userController');
const {
    isAuthenticatedUser, authorizeRoles
} = require("../middleware/auth");

const router = express.Router();


// crate user or register 
router.route("/register").post(registerUser);
// login router 
router.route("/login").post(login);
//logout router
router.route("/logout").get(logout);
// get logged user details 
router.route("/me").get(isAuthenticatedUser, getSingleUser);
// get all user by admin 
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.route("/admin/user/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser)
    
module.exports = router;
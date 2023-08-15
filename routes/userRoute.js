const express = require('express');
const {
    registerUser,
    login,
    logout
} = require('../controllers/userController');

const router = express.Router();


// crate user or register 
router.route("/register").post(registerUser);
// login router 
router.route("/login").post(login);
//logout router
router.route("/logout").get(logout);


module.exports = router;
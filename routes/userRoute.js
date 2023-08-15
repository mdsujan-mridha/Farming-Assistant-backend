const express = require('express');
const { registerUser, login } = require('../controllers/userController');

const router = express.Router();


// crate user or register 
router.route("/register").post(registerUser);
// login router 
router.route("/login").post(login);



module.exports = router;
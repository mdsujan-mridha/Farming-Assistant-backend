const express = require("express");
const { createPost } = require("../controllers/postController");

const router = express.Router();

// create post by admin
router.route("/admin/post/new").post(createPost);


module.exports = router;


const express = require("express");
const { createVideo, getAllVideos, deleteVideo } = require("../controllers/videoController");

const router = express.Router();

// create video 
router.route("/video/new").post(createVideo);
// get all video 
router.route("/videos").get(getAllVideos);
// delete video 
router.route("/delete/video/:id").delete(deleteVideo);

module.exports = router;
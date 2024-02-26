

const express = require('express');
const { newMessage, getAllMessage, getMessage, deleteMessage } = require('../controllers/messageContoller');

const router = express.Router();

router.route("/new/message").post(newMessage);
// get message by admin 
router.route("/messages").get(getAllMessage);
// get a single message 
router.route("/message/:id").get(getMessage);
// delete message
router.route("/message/:id").delete(deleteMessage);


module.exports = router;
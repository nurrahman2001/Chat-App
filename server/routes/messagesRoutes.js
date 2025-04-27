const { addMessage, getAllMessage,deleteMessageById } = require("../controllers/messagesController");
const upload = require("../middlewares/uploadMiddleware");
const router = require("express").Router();

router.post("/addmsg", upload.single('file'), addMessage);
router.post("/getmsg", getAllMessage);
router.post("/delete/:messageId", deleteMessageById);


module.exports = router;

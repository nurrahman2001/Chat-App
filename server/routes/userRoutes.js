const {
  register,
  login,
  getAllUsers,
  getUserById,
  AddContact,
  setAvatar
} = require("../controllers/userController");

const { authenticateToken } = require("../middlewares/tokenVerify");
const upload = require("../middlewares/uploadMiddleware");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar", authenticateToken, upload.single("avatar"),setAvatar);
router.get("/allusers", authenticateToken, getAllUsers);
router.get("/me", authenticateToken, (req, res) => { res.json(req.user); });
router.get("/user/:id", getUserById);
router.post("/add-contact", authenticateToken, AddContact);



module.exports = router;

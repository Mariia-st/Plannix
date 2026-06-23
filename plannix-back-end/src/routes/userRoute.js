const express = require("express");
const router = express.Router();
const { changeDataUser, updateAvatar } = require("../controlllers/userController");
const authenticateToken = require("../middlewares/authMiddleware");
const upload= require("../../config/multerConfig")


router.put("", authenticateToken, changeDataUser);
router.put("/avatar",upload.single("image"),authenticateToken,updateAvatar)

module.exports= router
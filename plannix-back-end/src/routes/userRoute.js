const express = require("express");
const router = express.Router();
const { changeDataUser, updateAvatar, changePassword, generateCodeTelegram } = require("../controlllers/userController");
const authenticateToken = require("../middlewares/authMiddleware");
const upload= require("../../config/multerConfig")


router.put("", authenticateToken, changeDataUser);
router.put("/avatar",upload.single("image"),authenticateToken,updateAvatar)
router.put("/password",authenticateToken,changePassword)
router.get("/code",authenticateToken,generateCodeTelegram)

module.exports= router
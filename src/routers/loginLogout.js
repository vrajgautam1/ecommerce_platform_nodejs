const express = require("express");
const router = express.Router()
const loginController = require("../controllers/loginController")
const auth = require("../middlewares/authMiddleWare")

router.post("/login", loginController.login)
router.post("/logout", auth, loginController.logout)
router.post("/viewProfile", auth, )

module.exports = router
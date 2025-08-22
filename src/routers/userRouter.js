const express = require("express")
const router = express.Router()
const auth = require("../middlewares/authMiddleWare")
const roleCheck = require("../middlewares/rolecheckMiddleware")
const userController = require("../controllers/userController")
const imgUploadMiddleWare = require("../middlewares/imgUploadMiddleware")

router.put("/user/:id", imgUploadMiddleWare, userController)
router.delete("/user/:id", userController)


module.exports = router
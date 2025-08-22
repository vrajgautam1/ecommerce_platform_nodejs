const express = require("express")
const router = express.Router()
const auth = require("../middlewares/authMiddleWare")

router.get("/addresses", auth, )

module.exports = router
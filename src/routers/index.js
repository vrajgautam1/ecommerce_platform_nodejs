const express = require("express");
const router = express.Router()
const registrationRouter =  require("./registrationRouter")
const loginLogoutRouter = require("./loginLogout")

router.use(registrationRouter)
router.use(loginLogoutRouter)

module.exports = router
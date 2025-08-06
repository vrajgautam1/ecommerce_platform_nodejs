const express = require("express");
const router = express.Router()
const registrationRouter =  require("./registrationRouter")
const loginLogoutRouter = require("./loginLogout")
const vendorRouter = require("./vendorRouters")
const adminRouter = require("./adminRouter")

router.use(registrationRouter)
router.use(loginLogoutRouter)

router.use(vendorRouter)
router.use(adminRouter)

module.exports = router
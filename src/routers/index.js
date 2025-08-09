const express = require("express");
const router = express.Router()
const registrationRouter =  require("./registrationRouter")
const loginLogoutRouter = require("./loginLogout")
const vendorRouter = require("./vendorRouters")
const adminRouter = require("./adminRouter")
const catSubCatRouter = require("./catSubCatRouter")
const productRouter = require("./productRouter")

router.use(registrationRouter)
router.use(loginLogoutRouter)
router.use(vendorRouter)
router.use(adminRouter)
router.use(catSubCatRouter)
router.use(productRouter)

module.exports = router
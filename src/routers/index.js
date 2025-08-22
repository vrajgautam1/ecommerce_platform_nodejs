const express = require("express");
const router = express.Router()
const registrationRouter =  require("./registrationRouter")
const loginLogoutRouter = require("./loginLogout")
const vendorRouter = require("./vendorRouters")
const adminRouter = require("./adminRouter")
const catSubCatRouter = require("./catSubCatRouter")
const productRouter = require("./productRouter")
const userRouter = require("./userRouter")
const addressRouter = require("./addressRouter")

router.use(registrationRouter)
router.use(loginLogoutRouter)
router.use(vendorRouter)
router.use(adminRouter)
router.use(catSubCatRouter)
router.use(productRouter)
router.use(userRouter)
router.use(addressRouter)

module.exports = router

 
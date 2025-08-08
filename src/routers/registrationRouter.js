const express = require("express");
const router = express.Router()
const registrationController = require("../controllers/registrationController")
router.post("/register", registrationController.register) //done
router.post("/verifyOtp", registrationController.verifyOtp) //done
router.post("/resendOtp", registrationController.resendOtp) //wip

module.exports = router


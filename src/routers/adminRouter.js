const express = require("express")
const router = express.Router()
const adminController = require("../controllers/adminController")
const auth = require("../middlewares/authMiddleWare")
const roleCheck = require("../middlewares/rolecheckMiddleware")

router.use(auth)
router.get("/viewAdminLogs", roleCheck(["admin"]), adminController.viewAdminLogs) 
router.post("/vendorApproveReject", roleCheck(["admin"]), adminController.vendorApproveReject)

module.exports = router

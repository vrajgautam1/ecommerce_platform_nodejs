const express = require("express")
const router = express.Router()
const vendorController = require("../controllers/vendorController")
const auth = require("../middlewares/authMiddleWare")
const roleCheck = require("../middlewares/rolecheckMiddleware")

router.use(auth)
router.post("VendorDataFillUp", vendorController.VendorDataFillUp)
router.get("/viewVendorDetails", roleCheck(["admin", "vendor"]), vendorController)
router.put("/updateVendorDetails", roleCheck(["admin", "vendor"]), vendorController)
router.delete("/deleteVendor", roleCheck(["admin", "vendor"]), vendorController)

module.exports = router
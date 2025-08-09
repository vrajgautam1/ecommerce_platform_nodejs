const express = require("express")
const router = express.Router()
const productController = require("../controllers/productController")
const auth = require("../middlewares/authMiddleWare")
const roleCheck = require("../middlewares/rolecheckMiddleware")

router.post("/product", auth, roleCheck(["admin", "vendor"]))
router.get("/products")
router.get("/product/:slug")

module.exports = router
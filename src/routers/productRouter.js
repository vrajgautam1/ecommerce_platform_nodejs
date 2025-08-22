const express = require("express")
const router = express.Router()
const productController = require("../controllers/productController")
const auth = require("../middlewares/authMiddleWare")
const roleCheck = require("../middlewares/rolecheckMiddleware")
const imgUploadMiddleware = require("../middlewares/imgUploadMiddleware")

router.post("/product", auth, roleCheck(["admin", "vendor"]), imgUploadMiddleware, productController.addProduct)
router.get("/products", productController.getProductsList)
router.get("/product/:slug", productController.fetchSingleProductAllAttributes)
router.put("/product/:slug", auth, roleCheck(["admin", "vendor"]), imgUploadMiddleware, productController.updateSingleProduct)
router.delete("/product/:slug", auth, roleCheck(["admin"]), productController.deleteSingleProduct)

module.exports = router
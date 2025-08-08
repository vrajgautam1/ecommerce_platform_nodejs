const express = require("express");
const router = express.Router()
const auth = require("../middlewares/authMiddleWare")
const roleCheck = require("../middlewares/rolecheckMiddleware")
const catSubCatController = require("../controllers/catSubCatController")

router.get("/categories", catSubCatController.fetchAllCategories)
router.get("/categories/:id", catSubCatController.fetchCatById)
router.get("/subCategories", catSubCatController.getAllSubCats) //no need for client side
router.get("/categories/:id/subcategories", catSubCatController.subCatsInCat)


router.post("/category", auth, roleCheck(["admin"]), catSubCatController.createCategory)
router.post("/subCategory", auth, roleCheck(["admin"]), catSubCatController)

router.put("/category", auth, roleCheck(["admin"]), catSubCatController.updateCategory)
router.put("/subCategory", auth, roleCheck(["admin"]), catSubCatController.updateSubCategory)

router.delete("/category/:id", auth, roleCheck(["admin"]), catSubCatController.deleteCategory)
router.delete("/subCategory/:id", auth, roleCheck(["admin"]), )

module.exports = router
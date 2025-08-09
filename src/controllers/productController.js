const db = require("../models")
const Products = db.Products
const Category = db.Category
const SubCategory = db.SubCategory
const {productCreateSchema, productUpdateSchema} = require("../validations/productValidation")

module.exports.addProduct = async(req, res)=>{
    const{error} = productCreateSchema.validate(req.body)

    if(error){
        return res.status(400).json({error: error.message})
    }

    const{title, description, price, stock, discount, tags, categoryId, subCategoryId, slug} = req.body
    const vendorId = req.user.id
    const displayImage = req.files?.displayImage?.[0]?.filename || null
    const productImages = req.files?.productImages?.map(file=>file.filename) || []
    
    try {
        const categoryExists = Category.findByPk(categoryId)

        if(!categoryExists){
            return res.status(400).json({error:"category does not exist"})
        }

        const subCategoryExists = SubCategory.findByPk(subCategoryId)

        if(!subCategoryExists){
            return res.status(400).json({error: "subcategory does not exist"})
        }

        const newProduct = await Products.create({
            title,
            description,
            imgUrl: displayImage,
            categoryId,
            subCategoryId,
            vendorId,
            price,
            discount,
            slug, 
            
        })
    } catch (error) {
        return res.status(500).json({error:error.message})
    }

}
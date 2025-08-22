const fs = require("fs");
const db = require("../models");
const Products = db.Products;
const ProductImages = db.productImages;
const Category = db.Category;
const SubCategory = db.SubCategory;
const { Op } = require("sequelize");
const path = require("path");
const {
  productCreateSchema,
  productUpdateSchema,
  productListSchema,
} = require("../validations/productValidation");
const Products = require("../models/products");

module.exports.addProduct = async (req, res) => {
  const { error } = productCreateSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const {
    title,
    description,
    price,
    stock,
    discount,
    tags,
    categoryId,
    subCategoryId,
    slug,
  } = req.body;
  const vendorId = req.user.id;
  const displayImage = req.files?.displayImage?.[0]?.filename || null;
  const productImages =
    req.files?.productImages?.map((file) => file.filename) || [];

  try {
    const categoryExists = Category.findByPk(categoryId);

    if (!categoryExists) {
      return res.status(400).json({ error: "category does not exist" });
    }

    const subCategoryExists = SubCategory.findByPk(subCategoryId);

    if (!subCategoryExists) {
      return res.status(400).json({ error: "subcategory does not exist" });
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
    });

    const images = await ProductImages.bulkCreate(productImages);

    return res.status(200).json({
      success: "product created successfully",
      product: newProduct,
      images,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.getProductsList = async (req, res) => {
  const { value, error } = productListSchema.validate(req.query);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const {
    q,
    categoryId,
    subCategoryId,
    minPrice,
    maxPrice,
    inStock,
    rating,
    sortBy,
    sortOrder,
    page,
  } = value;

  const cleanq = q?.trim().toLowerCase();
  const where = {};
  let foundWhatUserIsLookingFor = false;
  if (cleanq) {
    const category = await Category.findOne({
      where: {
        name: { [Op.like]: `%${cleanq}%` },
      },
    });

    if (category) {
      where.categoryId = category.id;
      foundWhatUserIsLookingFor = true;
    }

    if (!foundWhatUserIsLookingFor) {
      const subCat = await SubCategory.findOne({
        where: {
          name: { [Op.like]: `%${cleanq}%` },
        },
      });

      if (subCat) {
        where.subCategoryId = subCat.id;
        foundWhatUserIsLookingFor = true;
      }
    }

    if (!foundWhatUserIsLookingFor) {
      where.brand = { [Op.like]: `%${cleanq}%` };
      foundWhatUserIsLookingFor = true;
    }

    if (!foundWhatUserIsLookingFor) {
      where[Op.or] = [
        { name: { [Op.like]: `%${cleanq}%` } },
        { description: { [Op.like]: `%${cleanq}%` } },
      ];
    }
  }

  if (categoryId) where.categoryId = categoryId;
  if (subCategoryId) where.subCategoryId = subCategoryId;
  if (minPrice) where.price = { ...(where.price || {}), [Op.gte]: minPrice };
  if (maxPrice) where.price = { ...(where.price || {}), [Op.lte]: maxPrice };
  if (inStock !== true) where.stock = inStock ? { [Op.gte]: 1 } : 0;
  if (inStock !== true) where.stock = 0;
  if (rating !== undefined) where.rating = { [Op.gte]: rating };

  const limit = 20;
  const total = await products.findAll({ where });
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < total;
  const hasPrevPage = page > 0;
  const products = await Products.findAll({
    where,
    limit: limit,
    offset: (page - 1) * limit,
    order: [[sortBy, sortOrder]],
  });

  return res.status(200).json({
    data: products,
    meta: {
      page,
      limit: 20,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
  });
};

module.exports.fetchSingleProductAllAttributes = async (req, res) => {
  const { slug } = req.params;

  if (!slug || slug === undefined) {
    return res.status(400).json({ error: `product slug is needed` });
  }

  try {
    const productFound = await Products.findOne({
      where: {
        slug: { [Op.eq]: slug },
      },
    });

    if (!productFound) {
      return res.status(404).json({ error: `${slug} not found` });
    }

    const productImagesFound = await ProductImages.findAll({
      where: {
        productId: productFound.id,
      },
      attributes: ["imgUrl", "altText"],
    });

    if (!productImagesFound.length) {
      return res.status(404).json({
        success: false,
        message: `product images not found`,
      });
    }

    return res.status(200).json({
      success: `product found`,
      product: productFound,
      productImages: productImagesFound,
    });
  } catch (error) {
    return res.status(500).json({ error: "something went wrong at our end" });
  }
};

module.exports.updateSingleProduct = async (req, res) => {
  try {
    const { slug } = req.params;

    //-1 check if the product exists
    const productFound = await Products.findOne({
      where: {
        slug: { [Op.eq]: slug },
      },
    });

    if (!productFound) {
      return res
        .status(404)
        .json({ success: false, message: `product not found` });
    }

    const { error, value } = productUpdateSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: true, message: error.message });
    }

    const {
      title,
      description,
      price,
      stock,
      categoryId,
      subCategoryId,
      discount,
      tags,
    } = value;

    //2.1 check if the category exists
    
    if (categoryId !== undefined) {
      const categoryExists = await Category.findByPk(categoryId);

      if (!categoryExists) {
        return res
          .status(400)
          .json({ success: false, message: `category not found` });
      }
    }

    //2.2 - incase we want to update the subcategory, check if it exists
    if (subCategoryId !== undefined) {
      const subCatExists = await SubCategory.findByPk(subCategoryId);
      
      if (!subCatExists) {
        return res
          .status(400)
          .json({ success: false, message: `sub Category not found` });
      }

      let targetCategoryId

      if(categoryId !== undefined){
        targetCategoryId = categoryId
      }else{
        targetCategoryId = productFound.categoryId
      }

      if (subCatExists.categoryId !== targetCategoryId) {
        return res.status(400).json({
          success: false,
          message: "subcategory is not a part of category",
        });
      }

    }

    //-2.3 if we want to update the display image first check if it exists
    const updatedDisplayImage = req.files?.displayImage?.[0]?.filename || null;

    if (updatedDisplayImage) {
      const oldPath = path.join(__dirname, "..", "uploads", imgUrl);
      try {
        if (productFound.imgUrl) {
          await fs.promises.unlink(oldPath);
        }
      } catch (error) {
        return res
          .status(400)
          .json({ error: true, message: "image not deleted" });
      }
    }

    const attributes = {};

    if (title !== undefined) attributes.title = title;
    if (description  !== undefined) attributes.description = description;
    if (price !== undefined) attributes.price = price;
    if (stock !== undefined) attributes.stock = stock;
    if (categoryId !== undefined) attributes.categoryId = categoryId;
    if (subCategoryId !== undefined) attributes.subCategoryId = subCategoryId;
    if (discount !== undefined) attributes.discount = discount;
    if (Array.isArray(tags) && tags.length > 0) attributes.tags = tags;
    if (updatedDisplayImage) attributes.imgUrl = updatedDisplayImage;

    const updatedProduct = await productFound.update(attributes);

    if (!updatedProduct) {
      return res.status(400).json({ success: false, message: `failed to update product` });
    }

    return res.status(200).json({
      success: true,
      message: `product updated successfully`,
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `something went wrong at our end`,
    });
  }
};

module.exports.deleteSingleProduct = async(req, res)=>{
    const {slug} = req.params
    try {
        const productToDelete = await Products.destroy(slug)
        if(!productToDelete){
            return res.status(400).json({success:false, message:`product could not be deleted`})
        }
        return res.status(200).json({success:true, message:`product deleted successfully`})
    } catch (error) {
        
    }
}

const Joi = require('joi');
const { SubCategory } = require('../models');

const productCreateSchema = Joi.object({
    title: Joi.string().required().min(5).max(30).messages({
        "string.empty":"please enter name of the product"
    }),

    description: Joi.string().required().min(20).max(300).messages({
        "string.empty": "please enter the description of the product"
    }),

    price: Joi.number().integer().messages({
        "any.required": "please enter the price of the product",
        "number.base": "price must be a number",
        "number.integer": "price must be an integer"
    }), 
    
    stock: Joi.number().messages({
        "any.required": "please enter the stock of the product",
        "number.base": "stock must be a number",
    }),

    categoryId: Joi.number().required().messages({
        "any.required": "please enter the category ID of the product",
        "number.base": "category ID must be a number"
    }),

    subCategoryId: Joi.number.required().messages({
        "any.required": "please enter the subcategory ID of the product",
        "number.base": "category ID must be a number"
    }), 

    tags: Joi.array().items(
        Joi.string().min(2).max(20).messages({
            "string.base":"each tag must be a string",
            "string.min": "each tag must be atleast 2 characters",
            "string.max":"each tag must not exceed 20 characters"
        })
    ),

    slug: Joi.string().messages({
        "string.base":"Slug must be a string"
    })
})

const productUpdateSchema = Joi.object({
  id: Joi.number().required().messages({
    "any.required": "Product ID is required for update",
    "number.base": "Product ID must be a number"
  }),

  title: Joi.string().min(5).max(30).messages({
    "string.base": "Title must be a string",
    "string.min": "Title must have at least 5 characters",
    "string.max": "Title must not exceed 30 characters"
  }),

  description: Joi.string().min(20).max(300).messages({
    "string.base": "Description must be a string",
    "string.min": "Description must have at least 20 characters",
    "string.max": "Description must not exceed 300 characters"
  }),

  price: Joi.number().integer().messages({
    "number.base": "Price must be a number",
    "number.integer": "Price must be an integer"
  }),

  stock: Joi.number().messages({
    "number.base": "Stock must be a number"
  }),

  imgUrl: Joi.string().messages({
    "string.base": "Image URL must be a string"
  }),

  categoryId: Joi.number().messages({
    "number.base": "Category ID must be a number"
  }),

  subCategoryId: Joi.number().messages({
    "number.base": "Subcategory ID must be a number"
  }),

  discount: Joi.number().messages({
    "number.base": "Discount must be a number"
  }),

  tags: Joi.array().items(
    Joi.string().min(2).max(20).messages({
      "string.base": "Each tag must be a string",
      "string.min": "Each tag must have at least 2 characters",
      "string.max": "Each tag must not exceed 20 characters"
    })
  ).messages({
    "array.base": "Tags must be an array"
  }),
})

const productListSchema = Joi.object({
  q: Joi.string().min(3).max(64),
  categoryId: Joi.number().integer(),
  subCategoryId: Joi.number().integer(),
  minPrice: Joi.number().min(0), //the number should not be less than 0 by accident
  maxPrice: Joi.number().min(0), //same as above
  inStock: Joi.boolean(),
  rating: Joi.number().min(0).max(5),
  sortBy: Joi.string().valid("id", "price", "rating", "stock").default("rating"),
  sortOrder: Joi.string().valid("ASC", "DESC").default("ASC"),
  page: Joi.number().integer().min(1).default(1)
})

module.exports = {productCreateSchema, productUpdateSchema, productListSchema}
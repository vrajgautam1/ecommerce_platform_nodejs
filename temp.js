// let {Country, State, City} = require("country-state-city")

const db = require("../models")
const Products = db.Products
const ProductImages = db.productImages
const Category = db.Category
const SubCategory = db.SubCategory
const {Op} = require("sequelize")
const {productCreateSchema, productUpdateSchema, productListSchema} = require("../validations/productValidation")
const Products = require("../models/products")



// // console.log(State.getStatesOfCountry("IN"))
// // console.log(City.getCitiesOfState("IN","GJ"))


// const statesList = State.getStatesOfCountry("IN")
// // console.log(typeof states)
// // console.log(states);

// // const lowercaseStateList = statesList.map(state => state.name.toLowerCase())
// // const isValidState = lowercaseStateList.includes(stateName.toLowerCase())
// // console.log(isValidState)

// let stateName = "Gujarat"
// const state = statesList.find(state => state.name.toLowerCase() === stateName.toLowerCase())
// // const somethingWillHappen = statesList.some(state => state.name.toLowerCase() === stateName.toLowerCase())
// // console.log(somethingWillHappen)

// // console.log(state.isoCode)

// let cityName = "mumbai"
// const citiesList = City.getCitiesOfState("IN", state.isoCode)

// const city = citiesList.find(city => city.name.toLowerCase() === cityName.toLowerCase())
// console.log(city);

// if(!city){
//   console.log(`please check ${cityName} probably is not located in ${stateName}`);
// }

const{error, value} = productListSchema.validate()
const {q,
  categoryId,
  subCategoryId,
  minPrice, 
  maxPrice, 
  inStock,
  rating,
  sortBy, 
  sortOrder,
  page} = value

  const cleanq = q?.trim().toLowerCase()
  const where = {}
  let foundWhatUserIsLookingFor = false //initially we assume that we will get what we are seeking in the first try. 
  if(cleanq){
    const itsACategory = await Category.findOne({
      where:{
        name:{[Op.like]:`%${cleanq}%`}
      }
    })

    if(itsACategory){
      where.categoryId = itsACategory.categoryId
      foundWhatUserIsLookingFor  = true //since we got what we were looking for we do not need to continue search. 
    }

    if(foundWhatUserIsLookingFor === false){
      const itsASubCategory = await SubCategory.findOne({
        where:{
          subCategoryId:{[Op.like]:`%${cleanq}%`}
        }
      })

      if(itsASubCategory){
        where.subCategoryId = itsASubCategory.id
        foundWhatUserIsLookingFor = true 
      }
    }

    if(foundWhatUserIsLookingFor === false){
      const itsABrand = await Products.findOne({
        where:{
          brand:{[Op.like]:`%${cleanq}%`}
        }
      })

      if(itsABrand){
        where.brand = 
      }
    }
 
  }
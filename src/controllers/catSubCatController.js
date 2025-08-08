const db = require("../models");
const Categories = db.Category;
const SubCategories = db.SubCategory;
const {
  catCreationSchema,
  subCatCreationSchema,
  catSubCatUpdateSchema,
} = require("../validations/catSubCatValidation");

module.exports.fetchAllCategories = async (req, res) => {
  try {
    const includeSubCats = req.query.includeSubCats === "true";
    const categoriesList = Categories.findAll(
      { attributes: { exclude: ["createdAt", "updatedAt"] } }, //this is a classic case of a dropdown list with cats and subcats. the frontend dev will have to deal with very less confusing data aswell as we just saved a lot of kbs resulting in faster loading times.

      //either i can write it like {attributes:["name", "imgUrl"]}
      //plus if i want subcats jo bhi include subCats ki value hogi woh aa jayega
      //in that case the frontend developer will have to mannually set include subcats to true
      {
        include: includeSubCats
          ? [{ model: SubCategories, attributes: ["name", "imgUrl"] }]
          : [],
      }
    );
    return res.status(200).json({ categoriesList });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.fetchCatById = async (req, res) => {
  const { id } = Number(req.params);
  try {
    const category = Categories.findByPk(id, {
      include: [{ model: SubCategories }],
    });

    if (!category) {
      return res.status(404).json({ error: "category not found" });
    }

    return res.status(200).json({ category });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.getAllSubCats = async (req, res) => {
  try {
    const filters = {};
    if (req.query.status) {
      filters.status = req.query.status;
    }
    if (req.query.categoryId) {
      filters.catId = req.query.categoryId;
    }
    if (req.query.subCatName) {
      filters.subCat = req.query.subCatName;
    }
    const subCatList = SubCategories.findAll({ where: filters });
    return res.status(200).json({ subCatList });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.subCatsInCat = async (req, res) => {
  try {
    let catId = req.params.id;

    if (isNaN(catId)) {
      //there are strong chances we will receive something. but that something can be different than a number in that case we must check if it is a NaN
      return res.status(400).json({ error: "received invalid categoryId" });
    }

    const category = Categories.findByPk(catId);

    if (!category) {
      return res
        .status(404)
        .json({ error: "category with this id does not exist" });
    }

    let displayData = await SubCategories.findAll(
      { where: { catId } },
      { attributes: ["name", "description", "imgUrl"] }
    );

    if (!displayData) {
      return res.status(400).json({
        error: "category does not exist so cant get any sub categories aswell",
      });
    }

    return res.status(200).json({ data: displayData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.createCategory = async (req, res) => {
  const { error } = catCreationSchema.validate(req.body);
  let imgUrl = req.file.filename;

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const { name, description } = req.body;
  try {
    const categoryExists = await Categories.findOne({
      where: { category: name },
    });

    if (!categoryExists) {
      return res
        .status(400)
        .json({ error: "A category with that name already exists" });
    }

    const category = await Categories.create({
      name: name,
      description,
      imgUrl: imgUrl ? imgUrl : null,
    });

    return res
      .status(200)
      .json({ success: "category created", data: category });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.createSubCategory = async (req, res) => {
  const { error } = subCatCreationSchema.validate(req.body);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const imgUrl = req.file.filename;
  const { category, name, description } = req.body;

  try {
    const catExists = await Categories.findOne({
      where: { category: category },
    });

    if (!catExists) {
      return res.status(404).json({
        error:
          "the category in which you are trying to enter a sub category does not exist",
      });
    }

    const subCatExistsInCat = await SubCategories.findOne({
      where: { categoryId: catExists.id, name: name },
    });

    if (subCatExistsInCat) {
      return res.status(400).json({
        error:
          "a subcategory already exists in the category that you are trying to add a subcategory",
      });
    }

    const newSubCat = await SubCategories.create({
      name,
      description,
      categoryId: catExists.id,
      imgUrl,
    });

    return res.status(200).json({
      success: "new subcategory created successfully",
      data: newSubCat,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.updateCategory = async (req, res) => {
  const { error } = catSubCatUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const { name, description, id } = req.body;
  const imgUrl = req.file.filename;
  try {
    const catExists = await Categories.findByPk(id);

    if (!catExists) {
      return res
        .status(404)
        .json({ error: "the category that you want to update does not exist" });
    }

    let updatePayload = {};
    if (name !== undefined) updatePayload.name = name;
    if (description !== undefined) updatePayload.description = description;
    if (imgUrl !== undefined) updatePayload.imgUrl = imgUrl;

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const categoryUpdated = await Categories.update(updatePayload, {
      where: { id },
    });

    return res.status(200).json({
      success: "category updated succcessfully",
      data: categoryUpdated,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.updateSubCategory = async (req, res) => {
  const { error } = catSubCatUpdateSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const { id, name, description } = req.body;
  const imgUrl = req.file.filename;

  try {
    const subCatExists = SubCategories.findByPk(id);

    if (!subCatExists) {
      return res.status(400).json({ error: "subcategory does not exist" });
    }

    let updatePayload = {};

    if (name !== undefined) updatePayload.name = name;
    if (description !== undefined) updatePayload.description = description;
    if (imgUrl !== undefined) updatePayload.imgUrl = imgUrl;

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const updatedSubCategory = await SubCategories.update(updatePayload, {
      where: { id },
    });

    return res.status(200).json({
      success: "subcategory updated successfully",
      data: updatedSubCategory,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.deleteCategory = async(req, res)=>{
    const {id} = parseInt(req.params)

    if(isNaN(id) || id === null){
        return res.status(400).json({error: "invalid id"})
    }

    const categoryDeleted = await Categories.destroy({where:{id}})

    if(!categoryDeleted){
        return res.status(400).json({error:"the category could not be deleted"})
    }

    return res.status(200).json({success: "category deleted successfully"})
}

module.exports.deleteSubcategory = async(req, res)=>{
        const {id} = parseInt(req.params)

    if(isNaN(id) || id === null){
        return res.status(400).json({error: "invalid id"})
    }

    const categoryDeleted = await SubCategories.destroy({where:{id}})

    if(!categoryDeleted){
        return res.status(400).json({error:"the category could not be deleted"})
    }

    return res.status(200).json({success: "category deleted successfully"})
}

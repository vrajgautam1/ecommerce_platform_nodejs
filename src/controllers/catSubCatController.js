// controllers/categoryController.js

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
    const categoriesList = await Categories.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: includeSubCats
        ? [{ model: SubCategories, attributes: ["name", "imgUrl"] }]
        : [],
    });
    return res.status(200).json({ categoriesList });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.fetchCatById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const category = await Categories.findByPk(id, {
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
    if (req.query.status) filters.status = req.query.status;
    if (req.query.categoryId) filters.categoryId = req.query.categoryId;
    if (req.query.subCatName) filters.name = req.query.subCatName;

    const subCatList = await SubCategories.findAll({ where: filters });
    return res.status(200).json({ subCatList });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.subCatsInCat = async (req, res) => {
  try {
    const catId = parseInt(req.params.id);
    if (isNaN(catId)) {
      return res.status(400).json({ error: "received invalid categoryId" });
    }

    const category = await Categories.findByPk(catId);
    if (!category) {
      return res
        .status(404)
        .json({ error: "category with this id does not exist" });
    }

    const displayData = await SubCategories.findAll({
      where: { categoryId: catId },
      attributes: ["name", "description", "imgUrl"],
    });

    return res.status(200).json({ data: displayData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.createCategory = async (req, res) => {
  const { error } = catCreationSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  const imgUrl = req.file?.filename || null;
  const { name, description } = req.body;
  try {
    const categoryExists = await Categories.findOne({ where: { name } });
    if (categoryExists) {
      return res
        .status(400)
        .json({ error: "A category with that name already exists" });
    }

    const category = await Categories.create({ name, description, imgUrl });
    return res.status(201).json({ success: "category created", data: category });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.createSubCategory = async (req, res) => {
  const { error } = subCatCreationSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  const imgUrl = req.file?.filename || null;
  const { category, name, description } = req.body;

  try {
    const catExists = await Categories.findOne({ where: { name: category } });
    if (!catExists) {
      return res.status(404).json({
        error: "The category you're trying to assign the subcategory to doesn't exist",
      });
    }

    const subCatExistsInCat = await SubCategories.findOne({
      where: { categoryId: catExists.id, name },
    });
    if (subCatExistsInCat) {
      return res.status(409).json({
        error: "Subcategory already exists in this category",
      });
    }

    const newSubCat = await SubCategories.create({
      name,
      description,
      categoryId: catExists.id,
      imgUrl,
    });

    return res.status(201).json({
      success: "Subcategory created successfully",
      data: newSubCat,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.updateCategory = async (req, res) => {
  const { error } = catSubCatUpdateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  const { name, description, id } = req.body;
  const imgUrl = req.file?.filename;

  try {
    const catExists = await Categories.findByPk(id);
    if (!catExists) {
      return res.status(404).json({ error: "Category not found" });
    }

    const updatePayload = {};
    if (name !== undefined) updatePayload.name = name;
    if (description !== undefined) updatePayload.description = description;
    if (imgUrl !== undefined) updatePayload.imgUrl = imgUrl;

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    await Categories.update(updatePayload, { where: { id } });
    return res.status(200).json({ success: "Category updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.updateSubCategory = async (req, res) => {
  const { error } = catSubCatUpdateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  const { id, name, description } = req.body;
  const imgUrl = req.file?.filename;

  try {
    const subCatExists = await SubCategories.findByPk(id);
    if (!subCatExists) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    const updatePayload = {};
    if (name !== undefined) updatePayload.name = name;
    if (description !== undefined) updatePayload.description = description;
    if (imgUrl !== undefined) updatePayload.imgUrl = imgUrl;

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    await SubCategories.update(updatePayload, { where: { id } });
    return res.status(200).json({ success: "Subcategory updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.deleteCategory = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid category ID" });
  }

  try {
    const categoryDeleted = await Categories.destroy({ where: { id } });
    if (!categoryDeleted) {
      return res.status(400).json({ error: "Category could not be deleted" });
    }

    return res.status(200).json({ success: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.deleteSubcategory = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid subcategory ID" });
  }

  try {
    const subCatDeleted = await SubCategories.destroy({ where: { id } });
    if (!subCatDeleted) {
      return res.status(400).json({ error: "Subcategory could not be deleted" });
    }

    return res.status(200).json({ success: "Subcategory deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

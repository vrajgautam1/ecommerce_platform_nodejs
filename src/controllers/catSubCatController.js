const db = require("../models");
const Categories = db.Category;
const SubCategories = db.SubCategory;
const { catCreationSchema, subCatCreationSchema } = require("../validations/catSubCatValidation");

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
      return res
        .status(400)
        .json({
          error:
            "category does not exist so cant get any sub categories aswell",
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

  try {
    const categoryExists = await Categories.findOne({where:{category:name}})

    if(!categoryExists){
        return res.status(400).json({error: "A category with that name already exists"})
    }

    const category = await Categories.create({
      name:name,
      description,
      imgUrl: imgUrl ? imgUrl : null,
    })

    return res.status(200).json({success:"category created", data:category})
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.createSubCategory = async (req, res)=>{
    const {error} = subCatCreationSchema.validate(req.body)

    if(error){
        return res.status(400).json()
    }
}


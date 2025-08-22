const {
  updateUserSchema,
  deleteUserSchema,
} = require("../validations/userValidation");
const db = require("../models");
const UserModel = db.Users;
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt")

module.exports.updateUser = async (req, res) => {
  const { error, value } = updateUserSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const { username, name, email, gender, company } = value;

  const profilePic = req.files?.profileImage?.[0]?.filename || null;

  try {
    const user = await UserModel.findByPk(req.user.id);

    if (username && user.username !== username) {
      const exists = await UserModel.findOne({
        where: {
          username: username,
        },
      });

      if (exists) {
        return res
          .status(400)
          .json({ success: false, message: "username already exists" });
      }
    }

    const attributes = {};

    if (username !== undefined) attributes.username = username;
    if (name !== undefined) attributes.name = name;
    if (email !== undefined) attributes.email = email;
    if (gender !== undefined) attributes.gender = gender;
    if (company !== undefined) attributes.company = company;

    if (profilePic) {
      if (user.profileImg) {
        const oldPath = path.join(__dirname, "../uploads", user.profileImg);
        try {
          await fs.promises.unlink(oldPath);
        } catch (error) {
          console.warn("Old image not found, skipping delete");
        }
      }
      attributes.profileImg = profilePic;
    }

    const updatedUser = await user.update(attributes);

    return res.status(200).json({ success: true, updatedUser });
  } catch (error) {
    return res.status(500).json({ error: "something went wrong on our side" });
  }
};

module.exports.deleteUser = async (req, res) => {
  // Validate incoming request data using Joi schema
  const { error, value } = deleteUserSchema.validate(req.body);

  // Return early if validation fails
  if(error){
    return res.status(400).json({success:false, message:error.message})
  }

  // Extract user ID from JWT token (authenticated user)
  const id = req.user.id;
  // Extract username and password from validated request body
  const { username, password } = value;

  try {
    // Find the user by username in the database
    const user = await UserModel.findOne({
      where: {
        username: username,
      },
    });

    // Check if user exists in database
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user does not exist" });
    }

    // Security check: ensure authenticated user can only delete their own account
    if (user.id !== id) {
      return res
        .status(400)
        .json({
          success: false,
          message: "user is not authorized to delete this account",
        });
    }

    // Verify the provided password matches the stored hashed password
    const passwordValid = await bcrypt.compare(password, user.password)

    if(!passwordValid){
        return res.status(400).json({success:false, message:"password incorrect"})
    }
   
    // Delete the user from the database
    const userDeleted = await UserModel.destroy({
      where: {
        id: user.id,
      },
    });

    // Check if deletion was successful (returns number of affected rows)
    if (!userDeleted) {
      return res
        .status(400)
        .json({ success: false, message: `user could not be destroyed` });
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: `user deleted successfully` });
  } catch (error) {
    // Handle any unexpected server errors
    return res
      .status(500)
      .json({ success: false, message: "something went wrong" });
  }
};

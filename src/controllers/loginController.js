const db = require("../models");
const Users = db.Users;
const { loginSchema } = require("../validations/userValidation");
const { otpGen } = require("../utils/otpPwGen");
const { sendOtp } = require("../utils/nodemailer");
const redisClient = require("../../config/redisClient");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;
const moment = require("moment");

module.exports.login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const { cred, password } = req.body;

  const isEmail = Joi.string().email().validate(cred).error;

  let userInDb;

  try {
    if (isEmail) {
      userInDb = await Users.findOne({ where: { email: cred } });
    } else {
      userInDb = await Users.findOne({ where: { username: cred } });
    }

    if (!userInDb) {
      return res.status(400).json({ error: "user does not exist" });
    } else if (userInDb.accountStatus === "inactive") {
      let emailOtp = otpGen();
      await sendOtp(userInDb.name, userInDb.email, emailOtp);
      await redisClient.set(`otpfor${userInDb.email}`, emailOtp, {
        EX: 60 * 10,
      });
      return res.status(403).json({
        accessUnauthorized: "user found but is inactive",
        otpSent:
          "otp sent to registered email. please find it and verify it to login and use features of this website.",
      });
    }

    const pwValid = await bcrypt.compare(password, userInDb.password);

    if (!pwValid) {
      return res.status(400).json({ error: "password incorrect" });
    }

    let token = jwt.sign({ id: userInDb.id, role: userInDb.role }, secret);

    await redisClient.set(`jwtTokenFor${userInDb.id}`, token, {
      EX: 60 * 60 * 24,
    });

    await userInDb.update({
      lastLoginAt: moment().format("DD MMM YYYY, hh:mm A"),
    });

    return res.status(200).json({
      success: "login successful",
      token: token,
      userInfo: {
        name: userInDb.name,
        email: userInDb.email,
        username: userInDb.username,
        role: userInDb.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.logout = async (req, res) => {
  const id = req.user.id;

  try {
    const user = await Users.findOne({ where: { id } });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    await user.update({lastLogOutAt: moment().format("DD MMM YYYY, hh:mm A"),})

    await redisClient.del(`jwtTokenFor${id}`);

    return res.status(200).json({ success: "logout successful" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.viewProfile = async(req, res)=>{
    let id = req.user.id
    try {
        let userInDb = Users.find({where:{id}}, {attributes:["name", "username", "email", "company", "role", "accountStatus", "gender", "lastLoginAt", "lastLogOutAt"]})

        //or
        // const {name, username, email, company, role, accountStatus, gender, lastLoginAt, lastLogOutAt} = userInDb

        // const userDataToShow = {name, email, username, company, role, accountStatus, gender, lastLogOutAt,lastLoginAt}

        return res.status(200).json({userInDb})
    } catch (error) {   
        return res.status(500).json({ error: error.message });
    }
}

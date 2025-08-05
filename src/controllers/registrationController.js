const db = require("../models");
const Users = db.Users;
const {
  registerSchema,
  verifyOtpSchema,
  verifyResendOtp
} = require("../validations/userValidation");
const { otpGen } = require("../utils/otpPwGen");
const { sendOtp } = require("../utils/nodemailer");
const redisClient = require("../../config/redisClient");
const bcrypt = require("bcrypt")
const { Op } = require("sequelize"); 


module.exports.register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  const { name, email, username, gender, phone, password, role } = req.body; //role is just an input field

  let roleArray = ["user"] //predefine an array with users as a default field

  if(role === "vendor"){
    roleArray.push("vendor")
  }

  try {
    const userExists = await Users.findOne({
      where: {
        [Op.or]: [{ email: email }, { username: username }],
      },
    });
    if (userExists) {
      return res.status(409).json({
        error:
          "a user with this email or username already exists in our database",
      });
    }
    const encryptedPassword = await bcrypt.hash(password, 5)
    await Users.create({
      name,
      username,
      email,
      phone,
      gender,
      password:encryptedPassword,
      role: roleArray
    });

    const otpForUser = otpGen();

    await redisClient.set(`otpFor${email}`, otpForUser, { EX: 60 * 5 });

    await sendOtp(name, email, otpForUser);

    return res.status(200).json({
      otp_sent:
        "otp sent to registered email, please use it to verify your account",
      user_created: "your account is created but is inactive",
    });
  } catch (error) {
    return res.status(500).json({ error: "something went wrong at our end" });
  }
};

module.exports.verifyOtp = async (req, res) => {
  const {error} = verifyOtpSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const { otp, email } = req.body;

  try {
    const otpInRedis = await redisClient.get(`otpFor${email}`);

    if (!otpInRedis) {
      return res
        .status(410)
        .json({ error: "OTP expired. Please request a new one." });
    }

    if (otpInRedis !== otp) {
      return res.status(401).json({ error: "Incorrect OTP." });
    }

    const userInDb = await Users.findOne({ where: { email } });

    if (!userInDb) {
      return res
        .status(404)
        .json({ error: "User not found. Please register." });
    }

    if(userInDb.accountStatus === "active"){
        return res.status(409).json({error: "user already exists with an active account"})
    }
    await userInDb.update({ accountStatus: "active" });

    await redisClient.del(`otpFor${email}`)

    return res.status(201).json({success: "your account is now active"})

  } catch (error) {
    return res.status(500).json({ error: "something went wrong at our end" });
  }
};

module.exports.resendOtp = async(req, res)=>{
    const {error} = verifyResendOtp.validate(req.body)

    if(error){
        return res.status(400).json({error: error.message})
    }

    const{email} = req.body

    try {
        const userInDb = await Users.findOne({where:{email}})

        if(!userInDb){
            return res.status(400).json({error: "user does not exist"})
        }

        if(userInDb.accountStatus === "active"){
            return res.status(400).json({error: "user is active no need for otp request"})
        }

        let otpInRedis = await redisClient.get(`otpFor${email}`)
        let ttl = await redisClient.ttl(`otpFor${email}`)

        if(otpInRedis){
            return res.status(400).json({error: `please wait for ${ttl} seconds to request a new otp`})
        }

        let otpForEmail = otpGen()

        await redisClient.set(`otpFor${email}`, otpForEmail, {EX: 60*5})

        await sendOtp(userInDb.name, email, otpForEmail)

        return res.status(200).json({email_sent: "email sent successfully please check your registered email"})

    } catch (error) {
        return res.status(500).json({error: "something went wrong at our end"})
    }
}

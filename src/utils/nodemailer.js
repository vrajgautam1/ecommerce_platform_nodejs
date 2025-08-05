const nodemailer = require("nodemailer");
const otpTemplate = require("./emailTemplates");

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "maddison53@ethereal.email",
    pass: "jn7jnAPss4f63QBp6D",
  },
});

async function sendOTP(name, email, otp) {
  let emailBody = otpTemplate(name, otp);
  
  const obj = {
    from: '"Vraj Gautam" <gautamvraj1999@gmail.com>',
    to: email,
    subject: "OTP for verification",
    text: `here is your otp for email verification`,
    html: emailBody,
  };

  const info = await transporter.sendMail(obj);

  console.log("Message sent:", info.messageId);
}

module.exports = { sendOTP };

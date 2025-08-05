function otpTemplate(name, otp) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #4CAF50;">🛍️ Welcome to Shopfinity, ${name}!</h2>
      <p>Thanks for signing up. To complete your registration, please use the OTP below:</p>
      <div style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #333;">
        ${otp}
      </div>
      <p>This OTP is valid for <strong>2 minutes</strong>. Do not share it with anyone.</p>
      <br />
      <p style="color: #888;">– The Shopfinity Team</p>
    </div>
  `;
}

module.exports = {otpTemplate};

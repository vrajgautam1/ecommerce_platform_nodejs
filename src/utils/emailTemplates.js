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

function vendorRequestTemplate(companyName, email) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #4CAF50;">📥 New Vendor Request</h2>
      <p>A new vendor has submitted a request for approval:</p>
      <ul>
        <li><strong>Business Name:</strong> ${companyName}</li>
        <li><strong>Vendor Email:</strong> ${email}</li>
      </ul>
      <p>Please log in to the admin panel and visit vendorDetails section to review and approve/reject the request.</p>
      <br />
      <p style="color: #888;">– Shopfinity System</p>
    </div>
  `;
}


module.exports = {otpTemplate, vendorRequestTemplate};

const db = require("../models");
const Address = db.Address;
const vendorDetails = db.VendorDetails;
const adminLogs = db.AdminLogs;
const { vendorApplyingFormSchema } = require("../validations/vendorValidation");
const { isValidCity, isValidState } = require("../utils/geoValidator");
const {sendVendorRequest} = require("../utils/emailTemplates")

module.exports.VendorDataFillUp = async (req, res) => {
  const { error } = vendorApplyingFormSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const {
    addressLine1,
    addressLine2,
    companyName,
    gstNumber,
    businessEmail,
    businessPhone,
    city,
    state,
    pincode,
    PAN,
  } = req.body;

  if (!isValidState(state)) {
    return res.status(400).json({ error: `${state} does not belong in India` });
  }

  if (!isValidCity(state, city)) {
    return res
      .status(400)
      .json({ error: `${city} does not belong in ${state}` });
  }

  try {

      let address = await Address.create({
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      PAN,
      userId: req.user.id
    });

    let vendor = await vendorDetails.create({
      companyName,
      gstNumber,
      businessEmail,
      businessPhone,
      PAN,
      addressId: address.id,
      userId: req.user.id,
    });

  

    let adminLog = await adminLogs.create({
      userId: req.user.id,
      type: "vendor_approval",
      data: {
        vendorId: vendor.id,
        addressId: address.id,
        companyName,
        gstNumber,
        businessEmail,
        businessPhone,
        PAN,
        city,
        state,
        pincode,
      },
    });

    await sendVendorRequest(companyName, businessEmail)

    return res.status(200).json({vendorDetails: vendor, address: address, adminLog: adminLog, success:"otp sent to admin successfuly"})


  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

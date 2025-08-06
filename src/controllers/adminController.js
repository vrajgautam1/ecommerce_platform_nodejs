const db = require("../models");
const AdminLogs = db.AdminLogs;
const Users = db.Users;
const { vendorApproveRejectSchema } = require("../validations/adminValidation");

module.exports.viewAdminLogs = async (req, res) => {
  try {
    const adminLogs = await AdminLogs.findAll();
    return res.status(200).json({ adminLogs });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.vendorApproveReject = async (req, res) => {
  const { error } = vendorApproveRejectSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  const { userId, logId, status } = req.body;

  try {
    
    const [updatedLogCount] = await AdminLogs.update(
      { status },
      { where: { id: logId } }
    );

    if (updatedLogCount === 0) {
      return res.status(404).json({ error: "Log not found or not updated" });
    }

    if (status === "rejected") {
      return res.status(200).json({
        success: "Vendor application request rejected by admin",
      });
    }

   
    const [updatedUserCount] = await Users.update(
      { role: ["vendor", "user"] },
      { where: { id: userId } }
    );

    if (updatedUserCount === 0) {
      return res.status(404).json({ error: "User not found or not updated" });
    }

    return res.status(200).json({
      success: "Vendor application request approved by admin",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


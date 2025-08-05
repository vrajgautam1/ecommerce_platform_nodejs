module.exports = function checkRole(allowedRoles = []) {
  return (req, res, next) => {
    const userRoles = Array.isArray(req.user.role)
      ? req.user.role
      : JSON.parse(req.user.role); //incase it is in a string format use JSON.parse to convert it to array

    const isAllowedToAccess = allowedRoles.some(role => userRoles.includes(role)); //take allowedroles array and then and then see if userRoles array has even a single item matching 

    if (!isAllowedToAccess) {
      return res.status(403).json({ error: "Access denied: insufficient permissions" });
    }
    
    next();
  };
};

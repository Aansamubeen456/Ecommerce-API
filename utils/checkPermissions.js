const CustomError = require("../errors");

const checkPermissions = (requestUser, resouceUserId) => {
  // console.log(requestUser);
  // console.log(resouceUserId);
  // console.log(typeof resouceUserId);

  if (requestUser.role === "admin") return;
  if (requestUser.userId === resouceUserId.toString()) return;
  throw new CustomError.forbiddenError("unauthorized access to this route");
};
module.exports = checkPermissions;

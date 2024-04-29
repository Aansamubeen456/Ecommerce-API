const {
  createToken,
  isTokenValid,
  attachCookiesToResponse,
  removeCookie,
} = require("./jwt");

const createTokenUser = require("./createTokenUser");
const checkPermissions = require("./checkPermissions");

module.exports = {
  createToken,
  isTokenValid,
  attachCookiesToResponse,
  removeCookie,
  createTokenUser,
  checkPermissions,
};

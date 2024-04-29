const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  attachCookiesToResponse,
  removeCookie,
  createTokenUser,
} = require("../utils");

const registerUser = async (req, res) => {
  const { email, name, password } = req.body;

  const emailExist = await User.findOne({ email });
  if (emailExist) {
    throw new CustomError.BadRequestError("email already exist");
  }
  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  // console.log(isFirstAccount);
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ name, email, password, role });

  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError(
      "please provide valid email and password"
    );
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError("invalid credentials");
  }
  const isCorrectPassword = await user.comparePassword(password);
  if (!isCorrectPassword) {
    throw new CustomError.UnauthenticatedError("invalid credentials");
  }
  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logoutUser = async (req, res) => {
  removeCookie(res);
  res.status(StatusCodes.OK).json({ msg: "logout user" });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};

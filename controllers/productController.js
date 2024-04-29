const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");
const CustomError = require("../errors");
const path = require("path");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const products = await Product.create(req.body);

  res.status(StatusCodes.CREATED).json({ products });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});

  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId }).populate({
    path: "reviews",
  });

  if (!product) {
    throw new CustomError.BadRequestError(
      `product does not exist with the id: ${productId}`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    runValidators: true,
    new: true,
  });

  if (!product) {
    throw new CustomError.BadRequestError(
      `product does not exist with the id: ${productId}`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndDelete({ _id: productId });

  if (!product) {
    throw new CustomError.BadRequestError(
      `product does not exist with the id: ${productId}`
    );
  }
  await product.deleteOne();
  // await product.remove();
  res.status(StatusCodes.OK).json({ msg: `Success!!! product is removed` });
};

const uploadImage = async (req, res) => {
  console.log(req.files);
  const productImage = req.files.image;

  if (!productImage) {
    throw new CustomError.BadRequestError("file does not exist");
  }

  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("please upload image");
  }

  const imageSize = 1024 * 1024;
  if (productImage.size > imageSize) {
    throw new CustomError.BadRequestError("please upload image less than 1MB");
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );

  await productImage.mv(imagePath);

  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};

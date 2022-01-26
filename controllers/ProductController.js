const Product = require("../models/productModel");

// @desc    Gets All Products
// @route   GET /api/products
async function getProducts(req, res) {
  try {
    const products = await Product.find();

    return products;
  } catch (error) {
    console.log(error);
  }
}

// @desc    Create a Product
// @route   POST /api/products
async function addProduct(req, res, result) {
  try {
    console.log("add ..");
    //  const body = await getPostData(req);

    const {
      product_id,
      product_name,
      product_price,
      product_description,
      product_nutrients,
      product_quantity,
      product_img_src,
    } = result;

    console.log(product_name);

    const product = {
      product_id,
      product_name,
      product_price,
      product_description,
      product_nutrients,
      product_quantity,
      product_img_src,
    };

    const newProduct = await Product.create(product);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getProducts,
  addProduct,
};

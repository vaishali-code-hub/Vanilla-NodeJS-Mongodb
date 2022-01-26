const mongoose = require("mongoose");

const ProductShema = new mongoose.Schema(
  {
    product_id: { type: String, required: true },
    product_name: { type: String, required: true },
    product_price: { type: String, required: true },
    product_description: { type: String },
    product_nutrients: { type: String },
    product_quantity: { type: String },
    product_img_src: { type: String },
  },
  { collection: "test4_products" }
);

const model = mongoose.model("ProductModel", ProductShema);

module.exports = model;

const mongoose = require("mongoose");

const posSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
});

const Product = mongoose.model("product", posSchema);

module.exports = Product;

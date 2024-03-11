const express = require("express");
const Product = require("../models/product");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, price } = req.body;

    // Create a new product using the Product model
    const newProduct = new Product({
      name,
      price,
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    // Use the Product model to retrieve all products
    const ProductData = await Product.find();

    res.json(ProductData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Use the Product model to find a product by ID
    const ProductData = await Product.findById(productId);

    if (!ProductData) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(ProductData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price } = req.body;

    // Use the Product model to find and update a product by ID
    const updateProduct = await Product.findByIdAndUpdate(
      productId,
      { name, price },
      { new: true } // This option returns the updated document
    );

    if (!updateProduct) {
      return res.status(404).json({ message: "Product Entry not found" });
    }

    res.json(updateProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Use the Product model to find and remove a product by ID
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Item deleted successfully", deletedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

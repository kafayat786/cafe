const express = require("express");
const Employee = require("../models/employee");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, department, ropstamId } = req.body;

    // Create a new product using the Product model
    const newEmployee = new Employee({
      ropstamId,
      name,
      department,
    });

    // Save the product to the database
    const savedProduct = await newEmployee.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    // Use the Product model to retrieve all products
    const EmployeeData = await Employee.find();

    res.json(EmployeeData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Use the Product model to find a product by ID
    const EmployeeData = await Employee.findById(productId);

    if (!EmployeeData) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(EmployeeData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const { ropstamId, name, department } = req.body;

    // Use the Product model to find and update a product by ID
    const updateEmployee = await Employee.findByIdAndUpdate(
      productId,
      { ropstamId, name, department },
      { new: true } // This option returns the updated document
    );

    if (!updateEmployee) {
      return res.status(404).json({ message: "Employee Entry not found" });
    }

    res.json(updateEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Use the Product model to find and remove a product by ID
    const deletedProduct = await Employee.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "POS deleted successfully", deletedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

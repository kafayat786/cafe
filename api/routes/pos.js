const express = require("express");
const Pos = require("../models/pos");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, price, purchase, posId, employeeId } = req.body;

    // Create a new product using the Product model
    const newPos = new Pos({
      posId,
      name,
      price,
      purchase,
      employeeId,
    });

    // Save the product to the database
    const savedProduct = await newPos.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    // Use the Product model to retrieve all products
    const PosData = await Pos.find()
      .populate({
        path: "employeeId",
        select: "name _id department ropstamId",
      })
      .populate({
        path: "purchase",
        select: "name _id price",
      })
      .populate({
        path: "employeeId",
        select: "name _id department",
      });

    res.json(PosData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getEmployees", async (req, res) => {
  try {
    // Use the Pos model to retrieve aggregated data
    const PosData = await Pos.aggregate([
      {
        $lookup: {
          from: "employees",
          localField: "employeeId",
          foreignField: "_id",
          as: "employeeData",
        },
      },
      {
        $unwind: "$employeeData",
      },
      {
        $group: {
          _id: {
            employeeId: "$employeeData._id",
            name: "$employeeData.name",
            department: "$employeeData.department", // Corrected field name
          },
          totalPurchase: { $sum: "$price" },
          posData: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          employeeId: "$_id.employeeId",
          employeeName: "$_id.name", // Corrected field name
          department: "$_id.department", // Corrected field name
          totalPurchase: 1,
          posData: 1,
        },
      },
    ]);

    res.json(PosData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Use the Product model to find a product by ID
    const PosData = await Pos.findById(productId);

    if (!PosData) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(PosData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price, purchase, posId } = req.body;

    // Use the Product model to find and update a product by ID
    const updatePos = await Pos.findByIdAndUpdate(
      productId,
      { name, price, purchase, posId },
      { new: true } // This option returns the updated document
    );

    if (!updatePos) {
      return res.status(404).json({ message: "Pos Entry not found" });
    }

    res.json(updatePos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Use the Product model to find and remove a product by ID
    const deletedProduct = await Pos.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Item deleted successfully", deletedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

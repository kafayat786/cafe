const express = require("express");
const router = express.Router();
const Pos = require("../models/pos"); // Import your Pos model

router.get("/", async (req, res) => {
  //TODO: startDate/endDate = YYYY-MM-DD

  let { startDate, endDate } = req.query;

  if (!startDate) {
    const currentDate = new Date();
    startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      .toISOString()
      .split("T")[0];
  }
  if (!endDate) {
    endDate = new Date().toISOString().split("T")[0];
  }

  try {
    const report = await Pos.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(startDate),
            $lt: new Date(endDate + "T23:59:59.999Z"),
          },
        },
      },
      {
        $lookup: {
          from: "employees", // Adjust the collection name if needed
          localField: "employeeId",
          foreignField: "_id",
          as: "employeeDetails",
        },
      },
      {
        $unwind: {
          path: "$employeeDetails",
        },
      },
      {
        $group: {
          _id: "$employeeId",
          totalPurchasePrice: { $sum: "$price" },
          department: { $first: "$employeeDetails.department" },
          name: { $first: "$employeeDetails.name" },
          ropstamId: { $first: "$employeeDetails.ropstamId" },
          date: { $first: "$date" },
        },
      },
    ]);

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

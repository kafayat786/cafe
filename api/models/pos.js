const mongoose = require("mongoose");

const posSchema = new mongoose.Schema({
  posId: { type: String },
  name: { type: String },
  date: { type: Date, default: Date.now },
  price: { type: Number, required: true },
  purchase: [{ type: mongoose.Types.ObjectId, ref: "product" }],
  employeeId: { type: mongoose.Types.ObjectId, ref: "Employee" },
});

const Pos = mongoose.model("pos", posSchema);

module.exports = Pos;

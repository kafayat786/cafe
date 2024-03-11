const mongoose = require("mongoose");

const ropstamSchema = new mongoose.Schema({
  ropstamId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
});

const Employee = mongoose.model("Employee", ropstamSchema);

module.exports = Employee;

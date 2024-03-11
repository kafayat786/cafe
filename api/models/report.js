const mongoose = require("mongoose");

const employeeReportSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Types.ObjectId, ref: "Employee" },
  name: { type: String },
  department: { type: String },
  totalPurchase: { type: Number },
});

const EmployeeReport = mongoose.model("EmployeeReport", employeeReportSchema);

module.exports = EmployeeReport;

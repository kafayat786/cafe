const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const Posrouter = require("./routes/pos");
const Employee = require("./routes/employees");
const Products = require("./routes/products");
const Reports = require("./routes/reports");

const bodyParser = require("body-parser");

const app = express();

const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost/cafe-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/user", userRoutes);
app.use("/pos", Posrouter);
app.use("/employees", Employee);
app.use("/products", Products);
app.use("/reports", Reports);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

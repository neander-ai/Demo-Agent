const express = require("express");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
// const cors = require("cors");
const { scriptPlayer } = require("./controllers/scriptPlayer");
const gptController = require("./utils/gpt");
const productController = require("./controllers/product");
const eventController = require("./controllers/event");
const { connectToMongoDB } = require("./models");

const envPath = path.join(__dirname, "..", ".env");
dotenv.config({ path: envPath });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectToMongoDB();
});

// ROUTES
app.get("/", (req, res) => {
  res.json({ messages: ["Welcome!", "How can I help?"] });
});

// Centralised error handling here, add more as needed
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "An error occurred", error: err.message });
});

// DB SETUP
app.get("/dbsetup", async (req, res) => {
  try {
    await createSampleData();
    res.status(200).json({ message: "Sample data created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create sample data", details: error.message });
  }
});

// Endpoint to create a company
app.post("/api/companies", async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    // Set a cookie with the company ID
    res.cookie("companyId", company._id.toString(), { httpOnly: true });
  } catch (error) {
    console.error("Error creating company:", error);
    res.status(500).send("Failed to create company.");
  }
});

// The request body should contain both the company and product details.
app.post("/api/addProduct", productController.addProduct);

app.post("/api/addEvent", eventController.addEvent);

app.get("/api/flows", productController.getFlows);

// GPT API
app.post("/api/messages", gptController.testGPT);
app.post("/api/interrupt", gptController.interruptFunc);

// DEMO SIDE
app.get("/getProductWithEvents", async (req, res) => {
  try {
    await getProductWithEvents("product_id_here");
    res.send("Product with Events fetched successfully.");
  } catch (error) {
    console.error("Error fetching product with events:", error);
    res.status(500).send("Failed to fetch product with events.");
  }
});

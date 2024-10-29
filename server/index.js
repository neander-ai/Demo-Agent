const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const { connectToMongoDB, createSampleData } = require('./dbSetup');
const { getProductWithEvents } = require('./dbHelpers');
const { callGPT } = require('./gpt');

const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

const app = express();
const PORT = process.env.PORT || 3001;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectToMongoDB(); // Call MongoDB connection function
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/testGpt", async (req, res) => {
  const result = await callGPT().catch(console.error);
  res.send(200,result);
});

app.get("/dbsetup", async (req, res) => {
  try {
    await createSampleData();
    res.send("Sample data created successfully.");
  } catch (error) {
    console.error("Error setting up sample data:", error);
    res.status(500).send("Failed to create sample data.");
  }
});

app.get("/getProductWithEvents", async (req, res) => {
  try {
    await getProductWithEvents("product_id_here");
    res.send("Product with Events fetched successfully.");
  } catch (error) {
    console.error("Error fetching product with events:", error);
    res.status(500).send("Failed to fetch product with events.");
  }
});

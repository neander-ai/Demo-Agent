const express = require("express");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
// const cors = require("cors");
const { scriptPlayer } = require("./controllers/scriptPlayer");
const gptController = require("./controllers/gpt");
const productController = require("./controllers/product");
const { connectToMongoDB } = require("./models");

const envPath = path.join(__dirname, "..", ".env");
dotenv.config({ path: envPath });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
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

// Endpoint to create an event
app.post("/api/addEvent", async (req, res) => {
  try {
    const {
      name,
      partition,
      nextEventId,
      heading,
      tags,
      description,
      video_data,
      video_duration,
    } = req.body;
    // check if productId cookie is set

    const cookieProductId = req.cookies.productId;
    if(!cookieProductId) {
      return res.status(400).send("Product ID not found in cookies");
    }

    // Create the event with the product ID
    const event = new Event({
      name,
      partition,
      nextEventId,
      heading,
      tags,
      description,
      llm_text,
      video_data,
      video_duration,
      audio_data : null,
      audio_duration : null,
      product_id : cookieProductId
    });

    await event.save();
    res.status(201).send(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).send("Failed to create event.");
  }
});

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

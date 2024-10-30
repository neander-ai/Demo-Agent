const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const {scriptPlayer} = require('./controllers/scriptPlayer');
const gptController = require('./controllers/gpt'); 
const productController = require('./controllers/product');
const { connectToMongoDB } = require('./models');

const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectToMongoDB();
});

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/dbsetup", async (req, res) => {
  try {
    await createSampleData();
      res.status(200).json({ message: 'Sample data created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create sample data', details: error.message });
  }
});

// Centralised error handling here, add more as needed
app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).json({ message: "An error occurred", error: err.message });
});

// Route for testing llm text generation
app.get("/getllmtext", gptController.callGPT);


// ONBOARDING 
// Endpoint to create a company
app.post("/companies", async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    // Set a cookie with the company ID
    res.cookie('companyId', company._id.toString(), { httpOnly: true });
    res.status(201).send(company);
  } catch (error) {
    console.error("Error creating company:", error);
    res.status(500).send("Failed to create company.");
  }
});

app.post("/addProduct", productController.addProduct);

// Endpoint to create an event
app.post("/events", async (req, res) => {
  try {
    const { name, partition, partition_order, description, llm_text, tags, video_data, video_duration, audio_data, audio_duration } = req.body;
    const productId = req.cookies.productId;

    if (!productId) {
      return res.status(400).send("Product ID not found in cookies");
    }
    // Create the event with the product ID
    const event = new Event({
      name,
      partition,
      partition_order,
      description,
      llm_text,
      tags,
      video_data,
      video_duration,
      audio_data,
      audio_duration,
      product: productId
    });

    await event.save();
    res.status(201).send(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).send("Failed to create event.");
  }
});


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
const { createEvent, getEvent } = require("../models/event");
const fs = require("fs");
const path = require("path");
const { getEventByNameAndPartition } = require("../models/event");

const addEvent = async (req, res, next) => {
  try {
    const { formData, largeJSON } = req.body;
    console.log(formData);
    // console.log("largeJSON", largeJSON);

    const { name, partition, heading, tags, description } = formData;

    console.log(name);
    console.log("Cookieesss", req.cookies);

    const cookieProductId = req.cookies.productId;
    if (!cookieProductId) {
      return res.status(400).send("Product ID not found in cookies");
    }
    // get shopify product id for testing

    // Create the event with the product ID
    const event = {
      name,
      partition,
      nextEventId: null,
      event_heading: heading,
      event_description: description,
      llm_text: null,
      tags,
      video_data: largeJSON,
      video_duration: null,
      audio_data: null,
      audio_duration: null,
    };
    await createEvent(event, cookieProductId);

    res.status(200).json({ message: "Data saved successfully" });
  } catch (error) {
    console.error("Error processing the data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Todo: Add get event function with script
const getEventfromName = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    console.log("name is:", name);
    const event = await getEvent(name);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching the data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addEvent, getEventfromName };

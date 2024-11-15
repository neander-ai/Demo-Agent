const { createEvent, getAllEvents } = require("../models/event");
const fs = require("fs");
const path = require("path");

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

// Get event from name
const getEventfromName = async (req, res) => {
  try {
    const events = await getAllEvents();
    if (!events) {
      return res.status(404).json({ message: "Event not found" });
    }
    console.log(events.length);
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching the data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addEvent, getEventfromName };

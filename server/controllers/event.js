const { createEvent } = require('../models/event');
const fs = require('fs');
const path = require('path');

const addEvent = async (req, res, next) => {
    try {
      const { formData, largeJSON } = req.body;
      console.log(formData);
      // console.log("largeJSON", largeJSON);
  
      const {
        name,
        partition,
        heading,
        tags,
        description,
      } = formData;
  
      console.log(name)
      console.log("Cookieesss" , req.cookies);
  
      const cookieProductId = req.cookies.productId;
      if(!cookieProductId) {
        return res.status(400).send("Product ID not found in cookies");
      } 
      // get shopify product id for testing
      
      // Create the event with the product ID
      const event = {
        name,
        partition,
        nextEventId : null,
        event_heading: heading,
        event_description: description,
        llm_text : null,
        tags,
        video_data : largeJSON,
        video_duration : null, 
        audio_data : null,
        audio_duration : null,
      }
  
      const newEvent = await createEvent(event, cookieProductId);

      // TODO : Add functions to find video duration, call gpt flow and add llm text
  
      // SAVING IN FILESYSTEM FOR TESTING
      const combinedData = req.body;
      const filePath = path.join(__dirname, 'uploads', combinedData.filename);
      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(combinedData, null, 2));
  
      res.status(200).json({ message: 'Data saved successfully', filePath: filePath });
  
    } catch (error) {
      console.error('Error processing the data:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  
};

module.exports = { addEvent };
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: String,
  partition: String,
  nextEventId: {
    type: mongoose.Schema.Types.Mixed,
    ref: "Event",
    default: null,
  },
  event_heading: String,
  event_description: String,
  llm_text: { type: String, default: null },
  tags: [String],
  video_data: { type: mongoose.Schema.Types.Mixed, default: null },
  video_duration: String,
  audio_data: { type: mongoose.Schema.Types.Mixed, default: null },
  audio_duration: String,
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
});

eventSchema.index({ product: 1 });
const Event = mongoose.model("Event", eventSchema);

const createEvent = async (eventData, productId) => {
  const event = new Event({ ...eventData, product: productId });
  await event.save();
  return event;
};

const getEvent = async (eventName) => {
  const event = await Event.findOne({ name: eventName });
  console.log(event);
  return event;
};

const findOrCreateEvent = async (EventName) => {
  let companyDoc = await Company.findOne({ name: companyName });
  if (!companyDoc) {
    companyDoc = new Company({ name: companyName });
    await companyDoc.save();
  }
  return companyDoc;
};

module.exports = {
  Event,
  createEvent,
  findOrCreateEvent,
  getEvent,
};

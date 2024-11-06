const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: String,
  partition: String,
  nextEventId: { type: mongoose.Schema.Types.Mixed, ref: 'Event', default: null },
  event_description: String,
  llm_text: { type: String, default: null },
  tags: [String],
  video_data: { type: mongoose.Schema.Types.Mixed, default: null },
  video_duration: String,
  audio_data: { type: mongoose.Schema.Types.Mixed, default: null },
  audio_duration: String,
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
});

eventSchema.index({ product: 1 });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;

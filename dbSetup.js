const mongoose = require('mongoose');
const dotenv = require("dotenv");
const path = require("path");
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

const companySchema = new mongoose.Schema({
  id: Number,
  name: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

const productSchema = new mongoose.Schema({
  name: String,
  product_description: String,
  sys_prompt: String,
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
});

const eventSchema = new mongoose.Schema({
  name: String,
  partition: Number,
  partition_order: Number,
  description: String,
  llm_text: { type: String, default: null },
  tags: [String],
  video_data: { type: mongoose.Schema.Types.Mixed, default: null },
  video_duration: String,
  audio_data: { type: mongoose.Schema.Types.Mixed, default: null },
  audio_duration: String,
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
});

eventSchema.index({ product: 1 });

const Company = mongoose.model('Company', companySchema);
const Product = mongoose.model('Product', productSchema);
const Event = mongoose.model('Event', eventSchema);

const mongoURI = process.env.MONGODB_USERNAME && process.env.MONGODB_PASSWORD
  ? `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}`
  : `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}`;

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB with Mongoose");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};



module.exports = {
  Company,
  Product,
  Event,
  createSampleData,
  connectToMongoDB,
};

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Company = require('./company');
const Product = require('./product');
const Event = require('./event');

const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

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

async function createSampleData() {
    try {
      const company = new Company({ id: 1, name: "Parent Company" });
      await company.save();
  
      const product = new Product({
        name: "Shopify",
        product_description: `Shopify is a leading e-commerce platform that enables businesses of all sizes to create, customize, and manage online stores with ease. Designed for flexibility, Shopify provides users with intuitive tools for building websites, handling product catalogs, processing payments, and managing orders, all within a unified platform. 
        Its comprehensive set of features includes customizable storefront themes, secure and integrated payment gateways, inventory management, and marketing tools such as SEO optimization, email marketing, and social media integrations. 
        Shopify supports multi-channel selling, allowing businesses to reach customers across social media, in-person retail, and online marketplaces.`,
        sys_prompt: `Shopify empowers you to handle every detail of running an online store by simplifying each essential task into manageable parts. 
        First, it enables you to set up a store by providing customizable, mobile-responsive themes and an intuitive site builder that requires no coding skills. 
        Shopify then lets you add products with descriptions, prices, and images, automatically organizing them for easy browsing. It handles secure payments with integrated gateways, making checkout straightforward for your customers. 
        For shipping, Shopify offers shipping label generation, real-time rate calculations, and fulfillment support, whether you ship in-house or use third-party logistics. 
        It includes order management tools to track, fulfill, and manage returns seamlessly. Shopify’s inventory management keeps track of stock levels, allowing you to set up notifications to reorder when needed.
        On the sales and marketing side, Shopify provides built-in SEO tools, email marketing, and social media integration, so you can easily promote products across channels. It also has data analytics, allowing you to see sales performance, customer behavior, and store traffic at a glance. 
        For added customization, the Shopify App Store offers hundreds of tools to extend your store’s functionality, from customer support chatbots to advanced reporting tools. Whether you’re capturing leads, retargeting customers, or managing shipping logistics,
        Shopify breaks down each function to help you grow your business with clarity and control.`,
        company: company._id
      });
      await product.save();
  
      company.products.push(product._id);
      await company.save();
  
      const event1 = new Event({
        event_name: "login",
        partition: 1,
        partition_order: 1,
        altname: "login",
        event_description: "login event",
        llm_text: null,
        tags: ["login", "authentication"],
        video_data: null,
        video_duration: "5:00",
        audio: "link",
        audio_duration: "5:00",
        product: product._id,
        company: company._id
      });
  
      await event1.save();
      await event2.save();
  
      console.log("Sample data created successfully.");
    } catch (error) {
      console.error("Error creating sample data:", error);
    }
  }
  
module.exports = {
  Company,
  Product,
  Event,
  createSampleData,
  connectToMongoDB,
};

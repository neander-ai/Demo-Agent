const mongoose = require('mongoose');
const Event = require('./event'); // Import Event model for reference

const productSchema = new mongoose.Schema({
  name: String,
  product_overview: String,
  product_description: String,
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
});

const Product = mongoose.model('Product', productSchema);

const createProduct = async (productData, companyId) => {
  const newProduct = new Product({ ...productData, company: companyId });
  await newProduct.save();
  return newProduct;
};

const getProductWithEvents = async (productId) => {
  try {
    const productWithEvents = await Product.findById(productId)
      .populate('company') // Populate the 'company' field
      .populate({
        path: 'events',     // Ensure 'events' is the correct field for event references
        model: 'Event',
        match: { product: productId } // Optional: filter by matching productId
      });

    console.log("Product with Events:", productWithEvents);
    return productWithEvents; // Return the populated result
  } catch (error) {
    console.error("Error fetching product with events:", error);
    throw error; // Rethrow the error to handle it upstream
  }
}

module.exports = {
  Product,
  createProduct,
  getProductWithEvents
};

async function getProductWithEvents(productId) {
    try {
      const productWithEvents = await Product.findById(productId)
        .populate('company')
        .populate({
          path: '_id',
          model: 'Event',
          match: { product: productId }
        });
  
      console.log("Product with Events:", productWithEvents);
    } catch (error) {
      console.error("Error fetching product with events:", error);
    }
  }

module.exports = { getProductWithEvents };
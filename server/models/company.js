const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});
const Company = mongoose.model('Company', companySchema);

const findOrCreateCompany = async (companyName) => {
  let companyDoc = await Company.findOne({ name: companyName });
  if (!companyDoc) {
    companyDoc = new Company({ name: companyName });
    await companyDoc.save();
  }
  return companyDoc;
};

const updateCompanyWithProduct = async (companyDoc, productId) => {
  companyDoc.products.push(productId);
  await companyDoc.save();
};

module.exports = {
  Company,
  updateCompanyWithProduct,
  findOrCreateCompany
}

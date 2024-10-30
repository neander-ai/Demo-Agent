const { createProduct } = require('../models/product');
const { findOrCreateCompany , updateCompanyWithProduct} = require('../models/company');

const addProduct = async (req, res, next) => {
  try {
    const { company, product } = req.body;

    const companyDoc = await findOrCreateCompany(company.name);
    const newProduct = await createProduct(product, companyDoc._id);

    // Update the company with the new product
    await updateCompanyWithProduct(companyDoc, newProduct._id);
    res.status(201).json({ message: "Product and company saved successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { addProduct };

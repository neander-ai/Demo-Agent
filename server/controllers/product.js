const { createProduct } = require('../models/product');
const { findOrCreateCompany , updateCompanyWithProduct} = require('../models/company');
const fs = require('fs');
const path = require('path');

const addProduct = async (req, res, next) => {
  try {
    const { company, product } = req.body;

    const companyDoc = await findOrCreateCompany(company.name);
    const newProduct = await createProduct(product, companyDoc._id);

    // Update the company with the new product
    await updateCompanyWithProduct(companyDoc, newProduct._id);
    res.cookie("companyId", companyDoc._id.toString(), { httpOnly: false }, { maxAge: 1000 * 60 * 60 * 24 * 7 }, { sameSite: 'none' }, ); //TODO: remove for security in prod (csrf and http and id security)
    res.cookie("productId", newProduct._id.toString(), { httpOnly: false }, { maxAge: 1000 * 60 * 60 * 24 * 7 }, { sameSite: 'none' }, );
    res.status(201).json({ message: "Product and company saved successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//TODO: get this in DB
const getFlows = async (req, res, next) => {
  try {
    // const flows = await scriptPlayer.getFlows();
    const flows = [{
      "eventNumber": 1,
      "eventName": "name",
      "eventDescription": "description"
    }];
    res.status(200).json({ flows });
  } catch (error) {
    console.error('Error getting flows:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { addProduct, getFlows };

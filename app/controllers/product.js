'use strict';

/**
 *  Module dependencies
 */
const _ = require('lodash');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Product = mongoose.model('Product');
const productService = new require('../services/product')();

module.exports.addOne = addProduct;
module.exports.getAll = getAllProducts;
module.exports.findById = findProductById;
module.exports.update = updateProduct;
module.exports.delete = deleteProduct;

function addProduct(req, res, next) {
  productService.addProduct(req.body, (err, updatedProduct) {
    req.resources.product = updatedProduct;
    next();
  });
};

function findProductById(req, res, next) {
  if (!ObjectId.isValid(req.params.productId)) {
    return res.status(404).json({ message: '404 not found.'});
  }

  Product.findById(req.params.productId, (err, product) => {
    if (err) {
      next(err);
    }
    else if (product) {
      req.resources.product = product;
      next();
    }
    else {
      next(new Error('failed to find product'));
    }
  });
};

function getAllProducts(req, res, next) {
  Product.find((err, products) => {
    if (err) {
      return next(err);
    }

    req.resources.products = products;
    next();
  });
};

function updateProduct(req, res, next) {
  let product = req.resources.product;
  _.assign(product, req.body);

  product.save((err, updatedProduct) => {
    if (err) {
      return next(err);
    }

    req.resources.product = updatedProduct;
    next();
  });
};

function deleteProduct(req, res, next) {
  req.resources.product.remove(err => {
    if (err) {
      return next(err);
    }

    res.status(204).json();
  });
};

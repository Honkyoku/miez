'use strict';
const _ = require('lodash');
const Product = require('../models/product');
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 50;
const DEFAULT_SKIP = 0;

class ProductService {
  constructor(ProductModel) {
    this.Product = ProductModel || Product;
  }

  create(data, callback) {
    this.Product.create(data, callback);
  }

  getAll(query, limit, skip, callback) {
    if (typeof query === "function") {
      callback = query;
      query = {};
      limit = DEFAULT_LIMIT;
      skip = DEFAULT_SKIP;
    }
    else if (typeof limit === "function") {
      callback = limit;
      limit = DEFAULT_LIMIT;
      skip = DEFAULT_SKIP;
    }
    else {
      limit = limit || DEFAULT_LIMIT;
      if (limit > MAX_LIMIT) {
        limit = MAX_LIMIT;
      }
      skip = skip || DEFAULT_SKIP;
    }

    Product.find(query).skip(skip).limit(limit).exec(callback);
  }

  findBySKU(sku, callback) {
    this.Product.findOne({sku: sku}, function(err, prod) {
      if (!prod) {
        err = { error: "Product not found", status: 404 };
      }

      callback(err, prod);
    });
  }

  update(sku, data, callback) {
    this.Product.findOne({sku: sku}, (err, result) => {
      _.assign(result, data);

      result.save((err, updatedProduct) => {
        if (err) return err;

        return callback(err, updatedProduct);
      });
    });
  }

  remove(sku, callback) {
    if (!sku) {
      let NoSKUErr = new Error('SKU is required');
      NoSKUErr.type = 'required_sku';
      NoSKUErr.status = 400;

      return callback(NoSKUErr);
    }

    this.Product.findOneAndRemove({sku: sku}, callback);
  }
}

module.exports = ProductService;

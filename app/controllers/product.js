'use strict';

const ProductService = require('../services/product');
const productService = new ProductService();

module.exports.create = create;
module.exports.update = update;
module.exports.getAll = getAll;
module.exports.getBySku = getBySku;
module.exports.remove = remove;


function create(req, res, next) {
  const data = req.body;

  productService.create(data, (err, product) => {
    if (err) {
      return next(err);
    }

    res.status(201).json(product);
  });
};

function update(req, res, next) {
  const data = req.body;
  let sku = req.params.sku;
  productService.update(sku, data, (err, product) => {
    if (err) {
      return next(err);
    }

    res.status(200).json(product);
  });
};

function getAll(req, res, next) {
  let body = req.body;
  let query = body.query;
  let limit = body.limit;
  let skip = body.skip;

  productService.getAll(query, limit, skip, (err, products) => {
    if (err) {
      return next(err);
    }

    res.status(200).json(products);
  });
};

function getBySku(req, res, next) {
  let sku = req.params.sku;

  productService.findBySKU(sku, (err, product) => {
    if (err && err.status) {
      return res.status(err.status).json(product);
    } else if (err) {
      return next(err);
    }

    res.status(200).json(product);
  });
};

function remove(req, res, next) {
  let sku = req.params.sku;

  productService.remove(sku, (err, product) => {
    if (err) {
      return next(err);
    }

    res.status(200).json(product);
  });
};

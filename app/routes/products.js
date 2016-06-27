'use strict';

const express = require('express');
const router = express.Router();
const ProductService = require('../controllers/product');
const productCtrl = new ProductService();
const auth = require('../middlewares/authentication');
const response = require('../helpers/response');

router.get('/products', auth.ensured, productCtrl.getAll, response.toJSON('products'));
router.get('/products/:productId', auth.ensured, productCtrl.findById, response.toJSON('product'));
router.put('/products/:productId', auth.ensured, productCtrl.findById, productCtrl.update, response.toJSON('product'));
router.delete('/products/:productId', auth.ensured, productCtrl.delete);

module.exports = router;

'use strict';

const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product');

router.post('/products', productCtrl.create);
router.put('/products/:sku', productCtrl.update);
router.get('/products', productCtrl.getAll);
router.get('/products/:sku', productCtrl.getBySku);
router.delete('/products/:sku', productCtrl.remove);

module.exports = router;

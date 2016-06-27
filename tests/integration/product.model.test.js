'use strict';

/**
 * Important! Set the environment to test
 */
process.env.NODE_ENV = 'test';
const common = require('../../app/helpers/common');
var chai = require('chai');
var should = chai.should();
var config = require('../../config/environments/test');

describe('Product model', function() {
  var mongoose;
  var Product;
  var _product;
  var newProductData = {
    sku: "LG-230-BLK",
    category: "Computers",
    title: "LG 230-series Black",
    details: {
      title: 'Laptop',
      details: 'Un laptop forte fain',
      summary: 'Laptop fain'
    },
    price: {
      amount: 2500
    },
    active: true
  };

  before(function(done) {
    mongoose = require('../../config/mongoose').init();
    Product = require('../../app/controllers/product');

    done();
  });

  after(function(done) {
    Product.remove({}).exec(err => {
      if (err) throw err;

      mongoose.connection.close(() => {
        setTimeout(function() { done(); }, 1000);
      });
    });
  });

  it('should register a product', done => {
    Product.addProduct(newProductData, (err, product) => {
      if (err) throw err;

      should.exist(product);
      // product.email.should.equal(newProductData.email);
      // should.exist(product.createdAt);

      _product = product;
      done();
    });
  });
});

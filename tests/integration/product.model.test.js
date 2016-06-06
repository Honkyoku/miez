'use strict';

/**
 * Important! Set the environment to test
 */
process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();
var config = require('../../config/environments/test');

describe('Product model', function() {
  var mongoose;
  var Product;
  var _product;
  var newProductData = {
    email: 'register_product@test.com',
    name: 'New Test Product'
  };

  before(function(done) {
    mongoose = require('../../config/mongoose').init();
    Product = require('../../app/models/product');
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
    Product.create(newProductData, (err, product) => {
      if (err) throw err;

      should.exist(product);
      product.email.should.equal(newProductData.email);
      should.exist(product.createdAt);

      _product = product;
      done();
    });
  });

  it('should not register a product if already exists', done => {
    Product.register(newProductData, (err, product) => {
      should.exist(err);
      err.code.should.equal(11000); // duplicate key error
      should.not.exist(product);
      done();
    });
  });
});

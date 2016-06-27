'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
let mongoose, Product, ProductService, productService;

describe('Product service test', function() {
  before(function(done) {
    mongoose = require('../../config/mongoose').init();
    ProductService = require('../../app/services/product');
    Product = mongoose.model('Product');
    productService = new ProductService();

    done();
  });
  // after();

  describe('Create product', function() {
    after(function(done) {
      Product.remove({}, (err) => {
        if (err) throw err;

        done();
      });
    });

    it('should add a new product', function(done) {
      let productData = {
        sku: 'THIS-IS-A-PROD',
        title: 'This is a new awesome product',
        price: {
          value: 3.49
        }
      };

      productService.create(productData, (err, product) => {
        if (err) throw err;
        // if (err) done(err);
        // should.not.exist(err);

        product.title.should.equal(productData.title);
        done();
      });
    });
  });

  describe('Find by sku', function() {
    let productData = {
      sku: 'THIS-IS-A-PROD',
      title: 'This is a new awesome product',
      price: {
        value: 3.49
      }
    };

    let newProductData = {
      title: 'This is an updated product',
      price: {
        value: 3.14
      }
    }

    after(function(done) {
      Product.remove({}, (err) => {
        if (err) throw err;

        done();
      });
    });

    it('should add a new product', function(done) {
      productService.create(productData, (err, product) => {
        if (err) throw err;
        // if (err) done(err);
        // should.not.exist(err);

        should.exist(product);
        done();
      });
    });

    it('should return a product with specific sku', function(done) {
      productService.findBySKU(productData.sku, (err, product) => {
        if (err) throw err;
        // if (err) done(err);
        // should.not.exist(err);

        should.exist(product);
        product.sku.should.equal(productData.sku);
        done();
      });
    });

    it('should update a product with specific sku', function(done) {
      productService.update(productData.sku, newProductData, (err, product) => {
        if (err) throw err;
        // if (err) done(err);
        // should.not.exist(err);

        should.exist(product);
        product.title.should.equal(newProductData.title);
        product.price.value.should.equal(newProductData.price.value);
        product.sku.should.equal(productData.sku);

        done();
      });
    });

    it('should delete a product with specific sku', function(done) {
      productService.remove(productData.sku, (err, removedProduct) => {
        if (err) throw err;
        // if (err) done(err);

        should.exist(removedProduct);

        productService.findBySKU(productData.sku, (err, product) => {
          if (err) throw err;
          // if (err) done(err);
          // should.not.exist(err);

          should.not.exist(product);

          done();
        });
      });
    });
  });

  describe('Get all', function() {
    let products = [{
      sku: 'THIS-IS-A-PROD-1',
      title: 'This is a new awesome product',
      price: {
        value: 3.49
      }
    },
    {
      sku: 'THIS-IS-A-PROD-2',
      title: 'Should be in the list',
      price: {
        value: 3.49
      }
    },
    {
      sku: 'THIS-IS-A-PROD-3',
      title: 'Should be in the list',
      price: {
        value: 3.49
      }
    }];

    before(function(done) {
      let inc = 0;
      let maxInc = products.length;

      for (let p of products) {
        productService.create(p, (err, product) => {
          if (err) throw err;
          // if (err) done(err);
          // should.not.exist(err);
          tryDone();
        });
      }
      function tryDone() {
        inc++;
        if (inc == maxInc) {
          done();
        }
      };
    });

    after(function(done) {
      Product.remove({}, (err) => {
        if (err) throw err;

        done();
      });
    });

    it('sould return all products', function(done) {
      productService.getAll((err, returnedProducts) => {
        if (err) throw err;

        for (let i in returnedProducts) {
          returnedProducts[i].sku.should.equal(products[i].sku);
          returnedProducts[i].title.should.equal(products[i].title);
          returnedProducts[i].price.value.should.equal(products[i].price.value);
        }
        done();
      });
    });

    it('sould return filtered products', function(done) {
      productService.getAll({title:  'Should be in the list'}, (err, returnedProducts) => {
        if (err) throw err;

        for (let i in returnedProducts) {
          returnedProducts[i].title.should.equal('Should be in the list');
        }

        done();
      });
    });

    it('sould return third product only', function(done) {
      productService.getAll({}, 2, 2, (err, returnedProducts) => {
        if (err) throw err;

        returnedProducts.length.should.equal(1);
        returnedProducts[0].sku.should.equal(products[2].sku);
        done();
      });
    });
  });
});

'use strict';

/**
 * Important! Set the environment to test
 */
process.env.NODE_ENV = 'test';

const http = require('http');
const request = require('request');
const chai = require('chai');
const should = chai.should();

describe('Product', function() {
  let mongoose;
  let app;
  let appServer;
  let config;
  let baseUrl, apiUrl;
  let Product;

  before(function(done) {
    app = require('../../server');
    config = app.get('config');
    baseUrl = config.baseUrl;
    apiUrl = `${baseUrl}/api/products`;
    appServer = http.createServer(app);

    appServer.on('listening', () => {
      mongoose = app.get('mongoose');
      Product = mongoose.model('Product');
      done();
    });

    appServer.listen(config.port);
  });

  after(function(done) {
    appServer.on('close', () => {
      setTimeout(function() { done(); }, 1000);
    });

    mongoose.connection.db.command({ dropDatabase: 1 }, (err, resp) => {
      if (err) throw err;

      mongoose.connection.close(() => {
        appServer.close();
      });
    });
  });

  describe('Create product', function() {
    after(function(done) {
      Product.remove({}, (err) => {
        if (err) throw err;

        done();
      });
    });

    it('should create a product', function(done) {
      let dataProduct = {
        sku: 'MIEZ-001',
        title: 'First awesome product',
        price: {
          value: 9.99
        }
      };

      request({
        method: 'POST',
        url: `${apiUrl}`,
        headers: {
        },
        body: dataProduct,
        json: true
      },
      function(err, res, body) {
        if (err) throw err;

        res.statusCode.should.equal(201);
        res.body.sku.should.equal(dataProduct.sku);
        res.body.title.should.equal(dataProduct.title);
        res.body.price.value.should.equal(dataProduct.price.value);
        done();
      });
    });

    it('should update a product', function(done) {
      let dataProduct = {
        title: 'Updated awesome product',
        price: {
          value: 19.99
        }
      };

      request({
        method: 'PUT',
        url: `${apiUrl}/MIEZ-001`,
        headers: {
        },
        body: dataProduct,
        json: true
      },
      function(err, res, body) {
        if (err) throw err;

        res.statusCode.should.equal(200);
        res.body.sku.should.equal('MIEZ-001');
        res.body.title.should.equal(dataProduct.title);
        res.body.price.value.should.equal(dataProduct.price.value);
        done();
      });
    });

    it('should delete a product', function(done) {
      request({
        method: 'DELETE',
        url: `${apiUrl}/MIEZ-001`,
        headers: {
        },
        json: true
      },
      function(err, res) {
        if (err) throw err;

        res.statusCode.should.equal(200);
        should.exist(res.body);

        request({
          method: 'GET',
          url: `${apiUrl}/MIEZ-001`,
          headers: {
          },
          json: true
        },
        function(err, res) {
          res.statusCode.should.equal(404);
          should.not.exist(res.body);
          done();
        });
      });
    });
  });

  describe('Get all products', function() {
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
        request({
          method: 'POST',
          url: `${apiUrl}`,
          headers: {
          },
          body: p,
          json: true
        }, function(err) {
          if (err) throw err;
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
      request({
        method: 'GET',
        url: `${apiUrl}`,
        headers: {
        },
        body: {
        },
        json: true
      },
      function(err, res) {
        if (err) throw err;

        res.statusCode.should.equal(200);
        for (let i in res.body) {
          res.body[i].sku.should.equal(products[i].sku);
          res.body[i].title.should.equal(products[i].title);
          res.body[i].price.value.should.equal(products[i].price.value);
        }
        done();
      });
    });

    it('sould return filtered products', function(done) {
      request({
        method: 'GET',
        url: `${apiUrl}`,
        headers: {
        },
        body: {
          query: {
            title: 'Should be in the list'
          }
        },
        json: true
      },
      function(err, res) {
        if (err) throw err;

        res.statusCode.should.equal(200);
        for (let i in res.body) {
          res.body[i].title.should.equal('Should be in the list');
        }

        done();
      });
    });

    it('sould return third product only', function(done) {
      request({
        method: 'GET',
        url: `${apiUrl}`,
        headers: {
        },
        body: {
          limit: 2,
          skip: 2,
        },
        json: true
      },
      function(err, res) {
        if (err) throw err;

        res.statusCode.should.equal(200);
        res.body.length.should.equal(1);
        res.body[0].sku.should.equal(products[2].sku);

        done();
      });
    });

    it('sould return product by sku', function(done) {
      request({
        method: 'GET',
        url: `${apiUrl}/THIS-IS-A-PROD-2`,
        headers: {
        },
        body: {
        },
        json: true
      },
      function(err, res) {
        if (err) throw err;

        res.statusCode.should.equal(200);
        res.body.sku.should.equal("THIS-IS-A-PROD-2");

        done();
      });
    });
  });
});

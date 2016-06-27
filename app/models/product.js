'use strict';

const mongoose = require('mongoose');
// your common helpers file
const commonHelper = require('../helpers/common');
// custom schema
const Money = require('./money').schema;
const ProductDetail = require('./product-detail').schema;
const Schema = mongoose.Schema;
// mongoose schema
const ObjectId = Schema.ObjectId;
const Mixed = Schema.Types.Mixed;

const ProductSchema = new Schema({
  sku:          { type: String, required: true, unique: true },
  category:     { type: String },
  slug:         { type: String },
  title:        { type: String },
  images:       { type: [
    {
      caption:  { type: String },
      filename: { type: String }
    }
  ] },
  details:      { type: ProductDetail },
  price:        { type: Money },
  active:       { type: Boolean, default: false }
});

ProductSchema.pre('save', function(next) {
  // generic `slug` creation method
  this.slug = commonHelper.createSlug(this.title);
  next();
});

ProductSchema.statics.findBySKU = function findBySKU(sku, callback) {
  this.findOne({ sku: sku }, callback);
}

ProductSchema.statics.findBySlug = function findBySlug(sku, callback) {
  this.findOne({ slug: slug }, callback);
}

module.exports = mongoose.model('Product', ProductSchema);

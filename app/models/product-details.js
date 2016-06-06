'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ProductDetailSchema = new Schema({
  title:        { type: String, required: true },
  description:  { type: String },
  summary:      { type: String, required: true }
}, {
  _id: false,
  strict: false,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

module.exports = mongoose.model('ProductDetail', ProductDetailSchema);

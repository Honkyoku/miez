'use strict';

const slug = require('slug');
module.exports.createSlug = createSlug;

function createSlug(text) {
  return slug(text);
}

'use strict';

var nulls = require('./nulls');
var throws = require('./throws');

var api = {
  nulls: nulls,
  throws: throws(nulls)
};

module.exports = api;

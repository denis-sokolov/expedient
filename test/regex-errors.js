'use strict';

var lib = require('./lib');

[123, null, true, {}, []].forEach(function(v){
  lib.regex.throws('fail with invalid regexp (' + v + ')', v, 'dummy', /must be/);
  lib.regex.throws('fail with invalid data (' + v + ')', '[a-z]', {}, v, /must be/);
});


'use strict';

var lib = require('./lib');

['f', 'foo', '  1234foo '].forEach(function(d){
  lib.regex.equal('simple validation (' + d + ')', '[a-z]', d, true);
});
['', '123', 'TEST'].forEach(function(f){
  lib.regex.equal('simple validation (' + f + ')', '[a-z]', f, false);
});

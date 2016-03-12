'use strict';

var lib = require('./lib');

['f', 'foo', '  1234foo '].forEach(function(d){
  lib.regex.equal('simple validation (' + d + ')', '[a-z]', d, true);
});
['', '123', 'TEST'].forEach(function(f){
  lib.regex.equal('simple validation (' + f + ')', '[a-z]', f, false);
});

['f=f', 'foo=f', '  1234foo =f'].forEach(function(d){
  var data = d.substring(0, d.length - 2);
  var result = d.substring(d.length - 1);
  lib.regex.equal('one capturing group ([a-z], ' + d + ')', '([a-z])', data, result);
});

['', '123', 'TEST'].forEach(function(d){
  lib.regex('fails with false ([a-z], ' + d + ')', '([a-z])', d, {
    onlyNulls: true
  }, function(t, run){
    t.strictEqual(run(), false);
    t.end();
  });
});

['', '123', 'TEST'].forEach(function(d){
  lib.regex('throws  ([a-z], ' + d + ')', '([a-z])', d, {
    onlyNulls: true
  }, function(t, run){
    t.strictEqual(run(), false);
    t.end();
  });
});

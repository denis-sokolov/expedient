'use strict';

var test = require('tape');

var expedient = require('../../..');

var bothLibs = function(cb){
  cb('throws', expedient.regex.throws);
  cb('nulls', expedient.regex.nulls);
};

var stringAndRegex = function(rx, cb){
  if (typeof rx !== 'string')
    return cb('custom', rx);
  cb('string', rx);
  cb('RegExp', new RegExp(rx));
};

var allFour = function(rx, cb){
  bothLibs(function(fType, f){
    stringAndRegex(rx, function(rType, r){
      cb(fType, rType, f, r);
    });
  });
};

var all = function(rx, options, data, cb){
  allFour(rx, function(fType, rType, f, r){
    if (!options)
      cb([fType, rType], function(){ return f(r, data); });
    cb([fType, rType, 'options'], function(){ return f(r, options || {}, data); });
    if (!options)
      cb([fType, rType, 'bind'], function(){ return f(r)(data); });
    cb([fType, rType, 'options', 'bind'], function(){ return f(r, options || {})(data); });
  });
};

// options can be skipped
var api = function(name, rx, options, data, cb){
  if (!cb) {
    cb = data;
    data = options;
    options = null;
  }
  all(rx, options, data, function(params, run){
    test(name + ' (' + params.join(', ') + ')', function(t){
      cb(t, run);
    });
  });
};

api.equal = function(name, rx, options, data, result){
  if (!result) {
    result = data;
    data = options;
    options = null;
  }
  api(name, rx, options, data, function(t, run){
    t.strictEqual(run(), result);
    t.end();
  });
};

api.throws = function(name, rx, options, data, what){
  if (!what) {
    what = data;
    data = options;
    options = null;
  }
  api(name, rx, options, data, function(t, run){
    t.throws(run, what);
    t.end();
  });
};

module.exports = api;

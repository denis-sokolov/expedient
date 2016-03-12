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

/**
 * Perform an action with possible permutations of function call types
 * all({
 *   rx: 'regex',
 *   rxOptions: {},
 *   data: 'value to match on'
 * }, function(params, run){
 * });
 */
var all = function(opts, cb){
  allFour(opts.rx, function(fType, rType, f, r){
    if (!opts.rxOptions)
      cb([fType, rType], function(){ return f(r, opts.data); });
    cb([fType, rType, 'options'], function(){ return f(r, opts.rxOptions || {}, opts.data); });
    if (!opts.rxOptions)
      cb([fType, rType, 'bind'], function(){ return f(r)(opts.data); });
    cb([fType, rType, 'options', 'bind'], function(){ return f(r, opts.rxOptions || {})(opts.data); });
  });
};

// options can be skipped
var api = function(name, rx, data, opts, cb){
  if (!cb) {
    cb = opts;
    opts = {};
  }
  all(rx, opts.rxOptions, data, function(params, run){
    test(name + ' (' + params.join(', ') + ')', function(t){
      cb(t, run);
    });
  });
};

api.equal = function(name, rx, rxOptions, data, result){
  if (!result) {
    result = data;
    data = rxOptions;
    rxOptions = null;
  }
  api(name, rx, data, { rxOptions: rxOptions }, function(t, run){
    t.strictEqual(run(), result);
    t.end();
  });
};

api.throws = function(name, rx, rxOptions, data, what){
  if (!what) {
    what = data;
    data = rxOptions;
    rxOptions = null;
  }
  api(name, rx, data, { rxOptions: rxOptions }, function(t, run){
    t.throws(run, what);
    t.end();
  });
};

api.onlyNulls = function(name, rx, rxOptions, data, cb){
  if (!cb) {
    cb = data;
    data = rxOptions;
    rxOptions = null;
  }
  all(rx, data, { rxOptions: rxOptions }, function(params, run){
    if (params.indexOf('nulls') === -1)
      return;
    test(name + ' (' + params.join(', ') + ')', function(t){
      cb(t, run);
    });
  });
};

api.onlyThrows = function(name, rx, options, data, cb){
  if (!cb) {
    cb = data;
    data = options;
    options = null;
  }
  all(rx, options, data, function(params, run){
    if (params.indexOf('nulls') === -1)
      return;
    test(name + ' (' + params.join(', ') + ')', function(t){
      cb(t, run);
    });
  });
};

module.exports = api;

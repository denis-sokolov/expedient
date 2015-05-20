'use strict';

var api = function(rx, options, input){
  if (arguments.length === 1 || typeof options !== 'string' && arguments.length === 2)
    return api.bind(null, rx, options);
  if (!input && typeof options === 'string') {
    input = options;
    options = null;
  }
  options = options || {};
  if (typeof rx === 'string')
    rx = new RegExp(rx);
  if (!rx || !rx.exec)
    throw new Error('First argument must be a string or a RegExp object');
  if (typeof input !== 'string')
    throw new Error('Data argument must be a string');
  return !!rx.exec(input);
};

module.exports = api;

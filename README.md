# Expedient APIs for JavaScript

[![Build Status](https://travis-ci.org/denis-sokolov/expedient.svg?branch=master)](https://travis-ci.org/denis-sokolov/expedient)
[![Code Climate](http://img.shields.io/codeclimate/github/denis-sokolov/expedient.svg)](https://codeclimate.com/github/denis-sokolov/expedient)
[![bitHound Score](https://app.bithound.io/denis-sokolov/remote-dotfiles/badges/score.svg)](http://app.bithound.io/denis-sokolov/remote-dotfiles)
[![Dependency Status](https://gemnasium.com/denis-sokolov/expedient.svg)](https://gemnasium.com/denis-sokolov/expedient)

An experiment in figuring out how popular APIs, such as regular expressions, `exec`, and others can be made more convenient, allowing to fulfill main use cases without much boilerplate and thinking about the argument order.

## Regular expressions

### Quick overview

```javascript
// Throws if not matched
var regex = require('expedient').regex.throws;
// Returns nulls if not matched
var regexNulls = require('expedient').regex.nulls;

// Validation returns boolean
// This never throws nor returns null.
regex('[a-z]+', 'foo'); // true
regex('[a-z]+', 'NOPE'); //false

// All regex calls can take RegExp as the first argument
regex(/[a-z]+/, 'foo'); // true
// All regex calls can bind transparently
regex('[a-z]+')('foo'); // true
// All regex calls can take options as the second argument
regex('[a-z]+', {multiline: true}, 'foo');

// One capturing group returns string
regex('^(.+)@example.com$', 'john@example.com'); // john

// More capturing groups return Array
regex('^(.+)@([^@]+)$', 'john@example.com'); // ['john', 'example.com']
// Name the fields for convenience:
regex('^(.+)@([^@]+)$', {fields: ['name', 'domain']}, 'john@example.com'); // {name: 'john', domain: 'example.com'}

// .count always returns a number
regex.count('[a-z]+', 'foo bar quux'); // 3
regex.count('[a-z]+', '029 09801'); // 0

// .all returns Array
regex.all('[a-z]+', 'foo bar quux'); // ['foo', 'bar', 'quux']
// Capturing group count influences the values of the Array
regex.all('([^ ]+).example.com', 'foo.example.com bar.example.com'); // ['foo', 'bar']
regex.all('([^ ]+).example.([^ .]+)', 'foo.example.com bar.example.net'); // [['foo', 'com'], ['bar', 'net']]
regex.all('([^ ]+).example.([^ .]+)', {fields: ['name', 'domain']}, 'foo.example.com bar.example.net'); // [{name:'foo', domain:'com'}, {name:'bar', domain:'net'}]

// .replace finds and replace
// .replace is global by default, no need for a `g` flag!
// Return value is always string
regex.replace('[0-9]', 'X', 'foo123 bar'); // 'fooXXX bar'
```

### Main flexibility forms

To use the regular expression API, pass a string or a RegExp object as the first argument to all API functions and string to test as the second:

```javascript
var regex = require('expedient').regex.throws;
regex('[a-z]+', 'foo');
regex(/[a-z]+/, 'foo');
```

You can also bind transparently if you are to match the argument more than once:

```javascript
var regex = require('expedient').regex.throws;
var isNumeric = regex('^[0-9]+$');
isNumeric('123');
isNumeric('foo');
```

Options (of which there are few and they will be mentioned later) can be passed as the second argument.

```javascript
regex('^[0-9]+$', {option: 'value'}, '');
```

The `regex` function returns very different return values depending on the use case and the type of regexp you pass it. The use cases are described in the following section.

### Error handling

Unless otherwise noted, `regex` will throw if it does not match. This allows creating quick and clean happy path code:

```javascript
var url = regexp('^GET ([^ ]+) HTTP', input);
var resource = regexp('^/([^/]+)', url);
```

If you dislike that, you can require the version that returns nulls instead:

```javascript
var regex = require('expedient').regex.nulls;
```

If you catch the thrown error, you can inspect it. No match errors will have a property `nomatch` to distinguish it from others:

```javascript
try {
  regexp('', '');
} catch (e) {
  if (!e.nomatch) throw e;
  
  // Input data that has been passed and did not match
  e.input;
  // Source of the original regular expression
  e.regexp;
}
```

### Validating a string

The most popular use case for regular expressions is checking whether a string fits a particular pattern or not. To validate a string, pass a regex that contains no capturing groups and the function will return a boolean:

```javascript
if (regex('^[0-9]+$', input)) {
  console.log('Input is numeric');
} else {
  console.log('Input is invalid');
}
```

### Retrieving a single value

If you need to retrieve a single value, use a single capturing group. The return value will be a string.

```javascript
var name = regex('(.+)@example.com', 'john@example.com');
console.log('Hi,', name);
```

### Retrieving multiple values

To get multiple values from the string, define multiple capturing groups in your regular expression and `regex` will return an Array or null:

```javascript
var details = regex('(.+)@([^@]+)', 'john@example.com');
console.log('Hi,', details[0], 'at', details[1]);
```

JavaScript regular expressions do not have named capturing groups, but if you provide names for your fields to `regex`, it will happily construct a nice object:

```javascript
var details = regex('(.+)@([^@]+)', ['name', 'domain'], 'john@example.com');
console.log('Hi,', details.name, 'at', details.domain);
```

### Counting matches

`regex.count` counts how many times a regular expression matched in the string and always returns a number:

```javascript
var wordCount = regex.count('[a-z]+', 'foo bar quux');
console.log('There are', wordCount, 'words.');
```

### Matching multiple times

`regex.all` matches multiple times in the string and returns an Array:

```javascript
var words = regex.all('[a-z]+', 'foo bar quux');
console.log('Words:', words.join(', '));
```

The structure of items in the array depends on the number of capturing groups in the regular expression, same as with a singular expression:

```javascript
var subdomains = regex.all('([^ ]+).example.com', 'foo.example.com bar.example.com'); // ['foo', 'bar']
var domains = regex.all('([^ ]+).example.([^ .]+)', 'foo.example.com bar.example.net'); // [['foo', 'com'], ['bar', 'net']]
var domains = regex.all('([^ ]+).example.([^ .]+)', ['name', 'domain'] 'foo.example.com bar.example.net'); // [{name:'foo', domain:'com'}, {name:'bar', domain:'net'}]
```

### Replacing strings

`regex.replace` performs a global search and replace on a string. No global flag is needed.

```javascript
// .replace finds and replace
// .replace is always, `g` flag does not matter!
// Return value is always string
regex.replace('[0-9]', 'X', 'foo123 bar'); // 'fooXXX bar'
```











#!/usr/bin/env node

'use strict';

var fs$4 = require('fs');
var require$$0 = require('os');
var path$1 = require('path');
var require$$0$1 = require('util');
var require$$0$2 = require('stream');
var require$$0$3 = require('events');
var crypto = require('crypto');
var minimist = require('minimist');
var url = require('url');
var pc = require('picocolors');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
function _interopNamespaceDefault(e) {
	var n = Object.create(null);
	if (e) {
		Object.keys(e).forEach(function (k) {
			if (k !== 'default') {
				var d = Object.getOwnPropertyDescriptor(e, k);
				Object.defineProperty(n, k, d.get ? d : {
					enumerable: true,
					get: function () { return e[k]; }
				});
			}
		});
	}
	n.default = e;
	return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs$4);
var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path$1);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var tasks = {};

var utils$3 = {};

var array = {};

var hasRequiredArray;

function requireArray () {
	if (hasRequiredArray) return array;
	hasRequiredArray = 1;
	Object.defineProperty(array, "__esModule", { value: true });
	array.splitWhen = array.flatten = void 0;
	function flatten(items) {
	    return items.reduce((collection, item) => [].concat(collection, item), []);
	}
	array.flatten = flatten;
	function splitWhen(items, predicate) {
	    const result = [[]];
	    let groupIndex = 0;
	    for (const item of items) {
	        if (predicate(item)) {
	            groupIndex++;
	            result[groupIndex] = [];
	        }
	        else {
	            result[groupIndex].push(item);
	        }
	    }
	    return result;
	}
	array.splitWhen = splitWhen;
	return array;
}

var errno = {};

var hasRequiredErrno;

function requireErrno () {
	if (hasRequiredErrno) return errno;
	hasRequiredErrno = 1;
	Object.defineProperty(errno, "__esModule", { value: true });
	errno.isEnoentCodeError = void 0;
	function isEnoentCodeError(error) {
	    return error.code === 'ENOENT';
	}
	errno.isEnoentCodeError = isEnoentCodeError;
	return errno;
}

var fs$3 = {};

var hasRequiredFs$3;

function requireFs$3 () {
	if (hasRequiredFs$3) return fs$3;
	hasRequiredFs$3 = 1;
	Object.defineProperty(fs$3, "__esModule", { value: true });
	fs$3.createDirentFromStats = void 0;
	class DirentFromStats {
	    constructor(name, stats) {
	        this.name = name;
	        this.isBlockDevice = stats.isBlockDevice.bind(stats);
	        this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
	        this.isDirectory = stats.isDirectory.bind(stats);
	        this.isFIFO = stats.isFIFO.bind(stats);
	        this.isFile = stats.isFile.bind(stats);
	        this.isSocket = stats.isSocket.bind(stats);
	        this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
	    }
	}
	function createDirentFromStats(name, stats) {
	    return new DirentFromStats(name, stats);
	}
	fs$3.createDirentFromStats = createDirentFromStats;
	return fs$3;
}

var path = {};

var hasRequiredPath;

function requirePath () {
	if (hasRequiredPath) return path;
	hasRequiredPath = 1;
	Object.defineProperty(path, "__esModule", { value: true });
	path.convertPosixPathToPattern = path.convertWindowsPathToPattern = path.convertPathToPattern = path.escapePosixPath = path.escapeWindowsPath = path.escape = path.removeLeadingDotSegment = path.makeAbsolute = path.unixify = void 0;
	const os = require$$0;
	const path$2 = path$1;
	const IS_WINDOWS_PLATFORM = os.platform() === 'win32';
	const LEADING_DOT_SEGMENT_CHARACTERS_COUNT = 2; // ./ or .\\
	/**
	 * All non-escaped special characters.
	 * Posix: ()*?[]{|}, !+@ before (, ! at the beginning, \\ before non-special characters.
	 * Windows: (){}[], !+@ before (, ! at the beginning.
	 */
	const POSIX_UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()*?[\]{|}]|^!|[!+@](?=\()|\\(?![!()*+?@[\]{|}]))/g;
	const WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()[\]{}]|^!|[!+@](?=\())/g;
	/**
	 * The device path (\\.\ or \\?\).
	 * https://learn.microsoft.com/en-us/dotnet/standard/io/file-path-formats#dos-device-paths
	 */
	const DOS_DEVICE_PATH_RE = /^\\\\([.?])/;
	/**
	 * All backslashes except those escaping special characters.
	 * Windows: !()+@{}
	 * https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file#naming-conventions
	 */
	const WINDOWS_BACKSLASHES_RE = /\\(?![!()+@[\]{}])/g;
	/**
	 * Designed to work only with simple paths: `dir\\file`.
	 */
	function unixify(filepath) {
	    return filepath.replace(/\\/g, '/');
	}
	path.unixify = unixify;
	function makeAbsolute(cwd, filepath) {
	    return path$2.resolve(cwd, filepath);
	}
	path.makeAbsolute = makeAbsolute;
	function removeLeadingDotSegment(entry) {
	    // We do not use `startsWith` because this is 10x slower than current implementation for some cases.
	    // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
	    if (entry.charAt(0) === '.') {
	        const secondCharactery = entry.charAt(1);
	        if (secondCharactery === '/' || secondCharactery === '\\') {
	            return entry.slice(LEADING_DOT_SEGMENT_CHARACTERS_COUNT);
	        }
	    }
	    return entry;
	}
	path.removeLeadingDotSegment = removeLeadingDotSegment;
	path.escape = IS_WINDOWS_PLATFORM ? escapeWindowsPath : escapePosixPath;
	function escapeWindowsPath(pattern) {
	    return pattern.replace(WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE, '\\$2');
	}
	path.escapeWindowsPath = escapeWindowsPath;
	function escapePosixPath(pattern) {
	    return pattern.replace(POSIX_UNESCAPED_GLOB_SYMBOLS_RE, '\\$2');
	}
	path.escapePosixPath = escapePosixPath;
	path.convertPathToPattern = IS_WINDOWS_PLATFORM ? convertWindowsPathToPattern : convertPosixPathToPattern;
	function convertWindowsPathToPattern(filepath) {
	    return escapeWindowsPath(filepath)
	        .replace(DOS_DEVICE_PATH_RE, '//$1')
	        .replace(WINDOWS_BACKSLASHES_RE, '/');
	}
	path.convertWindowsPathToPattern = convertWindowsPathToPattern;
	function convertPosixPathToPattern(filepath) {
	    return escapePosixPath(filepath);
	}
	path.convertPosixPathToPattern = convertPosixPathToPattern;
	return path;
}

var pattern = {};

/*!
 * is-extglob <https://github.com/jonschlinkert/is-extglob>
 *
 * Copyright (c) 2014-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var isExtglob;
var hasRequiredIsExtglob;

function requireIsExtglob () {
	if (hasRequiredIsExtglob) return isExtglob;
	hasRequiredIsExtglob = 1;
	isExtglob = function isExtglob(str) {
	  if (typeof str !== 'string' || str === '') {
	    return false;
	  }

	  var match;
	  while ((match = /(\\).|([@?!+*]\(.*\))/g.exec(str))) {
	    if (match[2]) return true;
	    str = str.slice(match.index + match[0].length);
	  }

	  return false;
	};
	return isExtglob;
}

/*!
 * is-glob <https://github.com/jonschlinkert/is-glob>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var isGlob;
var hasRequiredIsGlob;

function requireIsGlob () {
	if (hasRequiredIsGlob) return isGlob;
	hasRequiredIsGlob = 1;
	var isExtglob = requireIsExtglob();
	var chars = { '{': '}', '(': ')', '[': ']'};
	var strictCheck = function(str) {
	  if (str[0] === '!') {
	    return true;
	  }
	  var index = 0;
	  var pipeIndex = -2;
	  var closeSquareIndex = -2;
	  var closeCurlyIndex = -2;
	  var closeParenIndex = -2;
	  var backSlashIndex = -2;
	  while (index < str.length) {
	    if (str[index] === '*') {
	      return true;
	    }

	    if (str[index + 1] === '?' && /[\].+)]/.test(str[index])) {
	      return true;
	    }

	    if (closeSquareIndex !== -1 && str[index] === '[' && str[index + 1] !== ']') {
	      if (closeSquareIndex < index) {
	        closeSquareIndex = str.indexOf(']', index);
	      }
	      if (closeSquareIndex > index) {
	        if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) {
	          return true;
	        }
	        backSlashIndex = str.indexOf('\\', index);
	        if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) {
	          return true;
	        }
	      }
	    }

	    if (closeCurlyIndex !== -1 && str[index] === '{' && str[index + 1] !== '}') {
	      closeCurlyIndex = str.indexOf('}', index);
	      if (closeCurlyIndex > index) {
	        backSlashIndex = str.indexOf('\\', index);
	        if (backSlashIndex === -1 || backSlashIndex > closeCurlyIndex) {
	          return true;
	        }
	      }
	    }

	    if (closeParenIndex !== -1 && str[index] === '(' && str[index + 1] === '?' && /[:!=]/.test(str[index + 2]) && str[index + 3] !== ')') {
	      closeParenIndex = str.indexOf(')', index);
	      if (closeParenIndex > index) {
	        backSlashIndex = str.indexOf('\\', index);
	        if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) {
	          return true;
	        }
	      }
	    }

	    if (pipeIndex !== -1 && str[index] === '(' && str[index + 1] !== '|') {
	      if (pipeIndex < index) {
	        pipeIndex = str.indexOf('|', index);
	      }
	      if (pipeIndex !== -1 && str[pipeIndex + 1] !== ')') {
	        closeParenIndex = str.indexOf(')', pipeIndex);
	        if (closeParenIndex > pipeIndex) {
	          backSlashIndex = str.indexOf('\\', pipeIndex);
	          if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) {
	            return true;
	          }
	        }
	      }
	    }

	    if (str[index] === '\\') {
	      var open = str[index + 1];
	      index += 2;
	      var close = chars[open];

	      if (close) {
	        var n = str.indexOf(close, index);
	        if (n !== -1) {
	          index = n + 1;
	        }
	      }

	      if (str[index] === '!') {
	        return true;
	      }
	    } else {
	      index++;
	    }
	  }
	  return false;
	};

	var relaxedCheck = function(str) {
	  if (str[0] === '!') {
	    return true;
	  }
	  var index = 0;
	  while (index < str.length) {
	    if (/[*?{}()[\]]/.test(str[index])) {
	      return true;
	    }

	    if (str[index] === '\\') {
	      var open = str[index + 1];
	      index += 2;
	      var close = chars[open];

	      if (close) {
	        var n = str.indexOf(close, index);
	        if (n !== -1) {
	          index = n + 1;
	        }
	      }

	      if (str[index] === '!') {
	        return true;
	      }
	    } else {
	      index++;
	    }
	  }
	  return false;
	};

	isGlob = function isGlob(str, options) {
	  if (typeof str !== 'string' || str === '') {
	    return false;
	  }

	  if (isExtglob(str)) {
	    return true;
	  }

	  var check = strictCheck;

	  // optionally relax check
	  if (options && options.strict === false) {
	    check = relaxedCheck;
	  }

	  return check(str);
	};
	return isGlob;
}

var globParent;
var hasRequiredGlobParent;

function requireGlobParent () {
	if (hasRequiredGlobParent) return globParent;
	hasRequiredGlobParent = 1;

	var isGlob = requireIsGlob();
	var pathPosixDirname = path$1.posix.dirname;
	var isWin32 = require$$0.platform() === 'win32';

	var slash = '/';
	var backslash = /\\/g;
	var enclosure = /[\{\[].*[\}\]]$/;
	var globby = /(^|[^\\])([\{\[]|\([^\)]+$)/;
	var escaped = /\\([\!\*\?\|\[\]\(\)\{\}])/g;

	/**
	 * @param {string} str
	 * @param {Object} opts
	 * @param {boolean} [opts.flipBackslashes=true]
	 * @returns {string}
	 */
	globParent = function globParent(str, opts) {
	  var options = Object.assign({ flipBackslashes: true }, opts);

	  // flip windows path separators
	  if (options.flipBackslashes && isWin32 && str.indexOf(slash) < 0) {
	    str = str.replace(backslash, slash);
	  }

	  // special case for strings ending in enclosure containing path separator
	  if (enclosure.test(str)) {
	    str += slash;
	  }

	  // preserves full path in case of trailing path separator
	  str += 'a';

	  // remove path parts that are globby
	  do {
	    str = pathPosixDirname(str);
	  } while (isGlob(str) || globby.test(str));

	  // remove escape chars and return result
	  return str.replace(escaped, '$1');
	};
	return globParent;
}

var utils$2 = {};

var hasRequiredUtils$3;

function requireUtils$3 () {
	if (hasRequiredUtils$3) return utils$2;
	hasRequiredUtils$3 = 1;
	(function (exports$1) {

		exports$1.isInteger = num => {
		  if (typeof num === 'number') {
		    return Number.isInteger(num);
		  }
		  if (typeof num === 'string' && num.trim() !== '') {
		    return Number.isInteger(Number(num));
		  }
		  return false;
		};

		/**
		 * Find a node of the given type
		 */

		exports$1.find = (node, type) => node.nodes.find(node => node.type === type);

		/**
		 * Find a node of the given type
		 */

		exports$1.exceedsLimit = (min, max, step = 1, limit) => {
		  if (limit === false) return false;
		  if (!exports$1.isInteger(min) || !exports$1.isInteger(max)) return false;
		  return ((Number(max) - Number(min)) / Number(step)) >= limit;
		};

		/**
		 * Escape the given node with '\\' before node.value
		 */

		exports$1.escapeNode = (block, n = 0, type) => {
		  const node = block.nodes[n];
		  if (!node) return;

		  if ((type && node.type === type) || node.type === 'open' || node.type === 'close') {
		    if (node.escaped !== true) {
		      node.value = '\\' + node.value;
		      node.escaped = true;
		    }
		  }
		};

		/**
		 * Returns true if the given brace node should be enclosed in literal braces
		 */

		exports$1.encloseBrace = node => {
		  if (node.type !== 'brace') return false;
		  if ((node.commas >> 0 + node.ranges >> 0) === 0) {
		    node.invalid = true;
		    return true;
		  }
		  return false;
		};

		/**
		 * Returns true if a brace node is invalid.
		 */

		exports$1.isInvalidBrace = block => {
		  if (block.type !== 'brace') return false;
		  if (block.invalid === true || block.dollar) return true;
		  if ((block.commas >> 0 + block.ranges >> 0) === 0) {
		    block.invalid = true;
		    return true;
		  }
		  if (block.open !== true || block.close !== true) {
		    block.invalid = true;
		    return true;
		  }
		  return false;
		};

		/**
		 * Returns true if a node is an open or close node
		 */

		exports$1.isOpenOrClose = node => {
		  if (node.type === 'open' || node.type === 'close') {
		    return true;
		  }
		  return node.open === true || node.close === true;
		};

		/**
		 * Reduce an array of text nodes.
		 */

		exports$1.reduce = nodes => nodes.reduce((acc, node) => {
		  if (node.type === 'text') acc.push(node.value);
		  if (node.type === 'range') node.type = 'text';
		  return acc;
		}, []);

		/**
		 * Flatten an array
		 */

		exports$1.flatten = (...args) => {
		  const result = [];

		  const flat = arr => {
		    for (let i = 0; i < arr.length; i++) {
		      const ele = arr[i];

		      if (Array.isArray(ele)) {
		        flat(ele);
		        continue;
		      }

		      if (ele !== undefined) {
		        result.push(ele);
		      }
		    }
		    return result;
		  };

		  flat(args);
		  return result;
		}; 
	} (utils$2));
	return utils$2;
}

var stringify;
var hasRequiredStringify;

function requireStringify () {
	if (hasRequiredStringify) return stringify;
	hasRequiredStringify = 1;

	const utils = requireUtils$3();

	stringify = (ast, options = {}) => {
	  const stringify = (node, parent = {}) => {
	    const invalidBlock = options.escapeInvalid && utils.isInvalidBrace(parent);
	    const invalidNode = node.invalid === true && options.escapeInvalid === true;
	    let output = '';

	    if (node.value) {
	      if ((invalidBlock || invalidNode) && utils.isOpenOrClose(node)) {
	        return '\\' + node.value;
	      }
	      return node.value;
	    }

	    if (node.value) {
	      return node.value;
	    }

	    if (node.nodes) {
	      for (const child of node.nodes) {
	        output += stringify(child);
	      }
	    }
	    return output;
	  };

	  return stringify(ast);
	};
	return stringify;
}

/*!
 * is-number <https://github.com/jonschlinkert/is-number>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Released under the MIT License.
 */

var isNumber;
var hasRequiredIsNumber;

function requireIsNumber () {
	if (hasRequiredIsNumber) return isNumber;
	hasRequiredIsNumber = 1;

	isNumber = function(num) {
	  if (typeof num === 'number') {
	    return num - num === 0;
	  }
	  if (typeof num === 'string' && num.trim() !== '') {
	    return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
	  }
	  return false;
	};
	return isNumber;
}

/*!
 * to-regex-range <https://github.com/micromatch/to-regex-range>
 *
 * Copyright (c) 2015-present, Jon Schlinkert.
 * Released under the MIT License.
 */

var toRegexRange_1;
var hasRequiredToRegexRange;

function requireToRegexRange () {
	if (hasRequiredToRegexRange) return toRegexRange_1;
	hasRequiredToRegexRange = 1;

	const isNumber = requireIsNumber();

	const toRegexRange = (min, max, options) => {
	  if (isNumber(min) === false) {
	    throw new TypeError('toRegexRange: expected the first argument to be a number');
	  }

	  if (max === void 0 || min === max) {
	    return String(min);
	  }

	  if (isNumber(max) === false) {
	    throw new TypeError('toRegexRange: expected the second argument to be a number.');
	  }

	  let opts = { relaxZeros: true, ...options };
	  if (typeof opts.strictZeros === 'boolean') {
	    opts.relaxZeros = opts.strictZeros === false;
	  }

	  let relax = String(opts.relaxZeros);
	  let shorthand = String(opts.shorthand);
	  let capture = String(opts.capture);
	  let wrap = String(opts.wrap);
	  let cacheKey = min + ':' + max + '=' + relax + shorthand + capture + wrap;

	  if (toRegexRange.cache.hasOwnProperty(cacheKey)) {
	    return toRegexRange.cache[cacheKey].result;
	  }

	  let a = Math.min(min, max);
	  let b = Math.max(min, max);

	  if (Math.abs(a - b) === 1) {
	    let result = min + '|' + max;
	    if (opts.capture) {
	      return `(${result})`;
	    }
	    if (opts.wrap === false) {
	      return result;
	    }
	    return `(?:${result})`;
	  }

	  let isPadded = hasPadding(min) || hasPadding(max);
	  let state = { min, max, a, b };
	  let positives = [];
	  let negatives = [];

	  if (isPadded) {
	    state.isPadded = isPadded;
	    state.maxLen = String(state.max).length;
	  }

	  if (a < 0) {
	    let newMin = b < 0 ? Math.abs(b) : 1;
	    negatives = splitToPatterns(newMin, Math.abs(a), state, opts);
	    a = state.a = 0;
	  }

	  if (b >= 0) {
	    positives = splitToPatterns(a, b, state, opts);
	  }

	  state.negatives = negatives;
	  state.positives = positives;
	  state.result = collatePatterns(negatives, positives);

	  if (opts.capture === true) {
	    state.result = `(${state.result})`;
	  } else if (opts.wrap !== false && (positives.length + negatives.length) > 1) {
	    state.result = `(?:${state.result})`;
	  }

	  toRegexRange.cache[cacheKey] = state;
	  return state.result;
	};

	function collatePatterns(neg, pos, options) {
	  let onlyNegative = filterPatterns(neg, pos, '-', false) || [];
	  let onlyPositive = filterPatterns(pos, neg, '', false) || [];
	  let intersected = filterPatterns(neg, pos, '-?', true) || [];
	  let subpatterns = onlyNegative.concat(intersected).concat(onlyPositive);
	  return subpatterns.join('|');
	}

	function splitToRanges(min, max) {
	  let nines = 1;
	  let zeros = 1;

	  let stop = countNines(min, nines);
	  let stops = new Set([max]);

	  while (min <= stop && stop <= max) {
	    stops.add(stop);
	    nines += 1;
	    stop = countNines(min, nines);
	  }

	  stop = countZeros(max + 1, zeros) - 1;

	  while (min < stop && stop <= max) {
	    stops.add(stop);
	    zeros += 1;
	    stop = countZeros(max + 1, zeros) - 1;
	  }

	  stops = [...stops];
	  stops.sort(compare);
	  return stops;
	}

	/**
	 * Convert a range to a regex pattern
	 * @param {Number} `start`
	 * @param {Number} `stop`
	 * @return {String}
	 */

	function rangeToPattern(start, stop, options) {
	  if (start === stop) {
	    return { pattern: start, count: [], digits: 0 };
	  }

	  let zipped = zip(start, stop);
	  let digits = zipped.length;
	  let pattern = '';
	  let count = 0;

	  for (let i = 0; i < digits; i++) {
	    let [startDigit, stopDigit] = zipped[i];

	    if (startDigit === stopDigit) {
	      pattern += startDigit;

	    } else if (startDigit !== '0' || stopDigit !== '9') {
	      pattern += toCharacterClass(startDigit, stopDigit);

	    } else {
	      count++;
	    }
	  }

	  if (count) {
	    pattern += options.shorthand === true ? '\\d' : '[0-9]';
	  }

	  return { pattern, count: [count], digits };
	}

	function splitToPatterns(min, max, tok, options) {
	  let ranges = splitToRanges(min, max);
	  let tokens = [];
	  let start = min;
	  let prev;

	  for (let i = 0; i < ranges.length; i++) {
	    let max = ranges[i];
	    let obj = rangeToPattern(String(start), String(max), options);
	    let zeros = '';

	    if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
	      if (prev.count.length > 1) {
	        prev.count.pop();
	      }

	      prev.count.push(obj.count[0]);
	      prev.string = prev.pattern + toQuantifier(prev.count);
	      start = max + 1;
	      continue;
	    }

	    if (tok.isPadded) {
	      zeros = padZeros(max, tok, options);
	    }

	    obj.string = zeros + obj.pattern + toQuantifier(obj.count);
	    tokens.push(obj);
	    start = max + 1;
	    prev = obj;
	  }

	  return tokens;
	}

	function filterPatterns(arr, comparison, prefix, intersection, options) {
	  let result = [];

	  for (let ele of arr) {
	    let { string } = ele;

	    // only push if _both_ are negative...
	    if (!intersection && !contains(comparison, 'string', string)) {
	      result.push(prefix + string);
	    }

	    // or _both_ are positive
	    if (intersection && contains(comparison, 'string', string)) {
	      result.push(prefix + string);
	    }
	  }
	  return result;
	}

	/**
	 * Zip strings
	 */

	function zip(a, b) {
	  let arr = [];
	  for (let i = 0; i < a.length; i++) arr.push([a[i], b[i]]);
	  return arr;
	}

	function compare(a, b) {
	  return a > b ? 1 : b > a ? -1 : 0;
	}

	function contains(arr, key, val) {
	  return arr.some(ele => ele[key] === val);
	}

	function countNines(min, len) {
	  return Number(String(min).slice(0, -len) + '9'.repeat(len));
	}

	function countZeros(integer, zeros) {
	  return integer - (integer % Math.pow(10, zeros));
	}

	function toQuantifier(digits) {
	  let [start = 0, stop = ''] = digits;
	  if (stop || start > 1) {
	    return `{${start + (stop ? ',' + stop : '')}}`;
	  }
	  return '';
	}

	function toCharacterClass(a, b, options) {
	  return `[${a}${(b - a === 1) ? '' : '-'}${b}]`;
	}

	function hasPadding(str) {
	  return /^-?(0+)\d/.test(str);
	}

	function padZeros(value, tok, options) {
	  if (!tok.isPadded) {
	    return value;
	  }

	  let diff = Math.abs(tok.maxLen - String(value).length);
	  let relax = options.relaxZeros !== false;

	  switch (diff) {
	    case 0:
	      return '';
	    case 1:
	      return relax ? '0?' : '0';
	    case 2:
	      return relax ? '0{0,2}' : '00';
	    default: {
	      return relax ? `0{0,${diff}}` : `0{${diff}}`;
	    }
	  }
	}

	/**
	 * Cache
	 */

	toRegexRange.cache = {};
	toRegexRange.clearCache = () => (toRegexRange.cache = {});

	/**
	 * Expose `toRegexRange`
	 */

	toRegexRange_1 = toRegexRange;
	return toRegexRange_1;
}

/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var fillRange;
var hasRequiredFillRange;

function requireFillRange () {
	if (hasRequiredFillRange) return fillRange;
	hasRequiredFillRange = 1;

	const util = require$$0$1;
	const toRegexRange = requireToRegexRange();

	const isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);

	const transform = toNumber => {
	  return value => toNumber === true ? Number(value) : String(value);
	};

	const isValidValue = value => {
	  return typeof value === 'number' || (typeof value === 'string' && value !== '');
	};

	const isNumber = num => Number.isInteger(+num);

	const zeros = input => {
	  let value = `${input}`;
	  let index = -1;
	  if (value[0] === '-') value = value.slice(1);
	  if (value === '0') return false;
	  while (value[++index] === '0');
	  return index > 0;
	};

	const stringify = (start, end, options) => {
	  if (typeof start === 'string' || typeof end === 'string') {
	    return true;
	  }
	  return options.stringify === true;
	};

	const pad = (input, maxLength, toNumber) => {
	  if (maxLength > 0) {
	    let dash = input[0] === '-' ? '-' : '';
	    if (dash) input = input.slice(1);
	    input = (dash + input.padStart(dash ? maxLength - 1 : maxLength, '0'));
	  }
	  if (toNumber === false) {
	    return String(input);
	  }
	  return input;
	};

	const toMaxLen = (input, maxLength) => {
	  let negative = input[0] === '-' ? '-' : '';
	  if (negative) {
	    input = input.slice(1);
	    maxLength--;
	  }
	  while (input.length < maxLength) input = '0' + input;
	  return negative ? ('-' + input) : input;
	};

	const toSequence = (parts, options, maxLen) => {
	  parts.negatives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
	  parts.positives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);

	  let prefix = options.capture ? '' : '?:';
	  let positives = '';
	  let negatives = '';
	  let result;

	  if (parts.positives.length) {
	    positives = parts.positives.map(v => toMaxLen(String(v), maxLen)).join('|');
	  }

	  if (parts.negatives.length) {
	    negatives = `-(${prefix}${parts.negatives.map(v => toMaxLen(String(v), maxLen)).join('|')})`;
	  }

	  if (positives && negatives) {
	    result = `${positives}|${negatives}`;
	  } else {
	    result = positives || negatives;
	  }

	  if (options.wrap) {
	    return `(${prefix}${result})`;
	  }

	  return result;
	};

	const toRange = (a, b, isNumbers, options) => {
	  if (isNumbers) {
	    return toRegexRange(a, b, { wrap: false, ...options });
	  }

	  let start = String.fromCharCode(a);
	  if (a === b) return start;

	  let stop = String.fromCharCode(b);
	  return `[${start}-${stop}]`;
	};

	const toRegex = (start, end, options) => {
	  if (Array.isArray(start)) {
	    let wrap = options.wrap === true;
	    let prefix = options.capture ? '' : '?:';
	    return wrap ? `(${prefix}${start.join('|')})` : start.join('|');
	  }
	  return toRegexRange(start, end, options);
	};

	const rangeError = (...args) => {
	  return new RangeError('Invalid range arguments: ' + util.inspect(...args));
	};

	const invalidRange = (start, end, options) => {
	  if (options.strictRanges === true) throw rangeError([start, end]);
	  return [];
	};

	const invalidStep = (step, options) => {
	  if (options.strictRanges === true) {
	    throw new TypeError(`Expected step "${step}" to be a number`);
	  }
	  return [];
	};

	const fillNumbers = (start, end, step = 1, options = {}) => {
	  let a = Number(start);
	  let b = Number(end);

	  if (!Number.isInteger(a) || !Number.isInteger(b)) {
	    if (options.strictRanges === true) throw rangeError([start, end]);
	    return [];
	  }

	  // fix negative zero
	  if (a === 0) a = 0;
	  if (b === 0) b = 0;

	  let descending = a > b;
	  let startString = String(start);
	  let endString = String(end);
	  let stepString = String(step);
	  step = Math.max(Math.abs(step), 1);

	  let padded = zeros(startString) || zeros(endString) || zeros(stepString);
	  let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
	  let toNumber = padded === false && stringify(start, end, options) === false;
	  let format = options.transform || transform(toNumber);

	  if (options.toRegex && step === 1) {
	    return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), true, options);
	  }

	  let parts = { negatives: [], positives: [] };
	  let push = num => parts[num < 0 ? 'negatives' : 'positives'].push(Math.abs(num));
	  let range = [];
	  let index = 0;

	  while (descending ? a >= b : a <= b) {
	    if (options.toRegex === true && step > 1) {
	      push(a);
	    } else {
	      range.push(pad(format(a, index), maxLen, toNumber));
	    }
	    a = descending ? a - step : a + step;
	    index++;
	  }

	  if (options.toRegex === true) {
	    return step > 1
	      ? toSequence(parts, options, maxLen)
	      : toRegex(range, null, { wrap: false, ...options });
	  }

	  return range;
	};

	const fillLetters = (start, end, step = 1, options = {}) => {
	  if ((!isNumber(start) && start.length > 1) || (!isNumber(end) && end.length > 1)) {
	    return invalidRange(start, end, options);
	  }

	  let format = options.transform || (val => String.fromCharCode(val));
	  let a = `${start}`.charCodeAt(0);
	  let b = `${end}`.charCodeAt(0);

	  let descending = a > b;
	  let min = Math.min(a, b);
	  let max = Math.max(a, b);

	  if (options.toRegex && step === 1) {
	    return toRange(min, max, false, options);
	  }

	  let range = [];
	  let index = 0;

	  while (descending ? a >= b : a <= b) {
	    range.push(format(a, index));
	    a = descending ? a - step : a + step;
	    index++;
	  }

	  if (options.toRegex === true) {
	    return toRegex(range, null, { wrap: false, options });
	  }

	  return range;
	};

	const fill = (start, end, step, options = {}) => {
	  if (end == null && isValidValue(start)) {
	    return [start];
	  }

	  if (!isValidValue(start) || !isValidValue(end)) {
	    return invalidRange(start, end, options);
	  }

	  if (typeof step === 'function') {
	    return fill(start, end, 1, { transform: step });
	  }

	  if (isObject(step)) {
	    return fill(start, end, 0, step);
	  }

	  let opts = { ...options };
	  if (opts.capture === true) opts.wrap = true;
	  step = step || opts.step || 1;

	  if (!isNumber(step)) {
	    if (step != null && !isObject(step)) return invalidStep(step, opts);
	    return fill(start, end, 1, step);
	  }

	  if (isNumber(start) && isNumber(end)) {
	    return fillNumbers(start, end, step, opts);
	  }

	  return fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
	};

	fillRange = fill;
	return fillRange;
}

var compile_1;
var hasRequiredCompile;

function requireCompile () {
	if (hasRequiredCompile) return compile_1;
	hasRequiredCompile = 1;

	const fill = requireFillRange();
	const utils = requireUtils$3();

	const compile = (ast, options = {}) => {
	  const walk = (node, parent = {}) => {
	    const invalidBlock = utils.isInvalidBrace(parent);
	    const invalidNode = node.invalid === true && options.escapeInvalid === true;
	    const invalid = invalidBlock === true || invalidNode === true;
	    const prefix = options.escapeInvalid === true ? '\\' : '';
	    let output = '';

	    if (node.isOpen === true) {
	      return prefix + node.value;
	    }

	    if (node.isClose === true) {
	      console.log('node.isClose', prefix, node.value);
	      return prefix + node.value;
	    }

	    if (node.type === 'open') {
	      return invalid ? prefix + node.value : '(';
	    }

	    if (node.type === 'close') {
	      return invalid ? prefix + node.value : ')';
	    }

	    if (node.type === 'comma') {
	      return node.prev.type === 'comma' ? '' : invalid ? node.value : '|';
	    }

	    if (node.value) {
	      return node.value;
	    }

	    if (node.nodes && node.ranges > 0) {
	      const args = utils.reduce(node.nodes);
	      const range = fill(...args, { ...options, wrap: false, toRegex: true, strictZeros: true });

	      if (range.length !== 0) {
	        return args.length > 1 && range.length > 1 ? `(${range})` : range;
	      }
	    }

	    if (node.nodes) {
	      for (const child of node.nodes) {
	        output += walk(child, node);
	      }
	    }

	    return output;
	  };

	  return walk(ast);
	};

	compile_1 = compile;
	return compile_1;
}

var expand_1;
var hasRequiredExpand;

function requireExpand () {
	if (hasRequiredExpand) return expand_1;
	hasRequiredExpand = 1;

	const fill = requireFillRange();
	const stringify = requireStringify();
	const utils = requireUtils$3();

	const append = (queue = '', stash = '', enclose = false) => {
	  const result = [];

	  queue = [].concat(queue);
	  stash = [].concat(stash);

	  if (!stash.length) return queue;
	  if (!queue.length) {
	    return enclose ? utils.flatten(stash).map(ele => `{${ele}}`) : stash;
	  }

	  for (const item of queue) {
	    if (Array.isArray(item)) {
	      for (const value of item) {
	        result.push(append(value, stash, enclose));
	      }
	    } else {
	      for (let ele of stash) {
	        if (enclose === true && typeof ele === 'string') ele = `{${ele}}`;
	        result.push(Array.isArray(ele) ? append(item, ele, enclose) : item + ele);
	      }
	    }
	  }
	  return utils.flatten(result);
	};

	const expand = (ast, options = {}) => {
	  const rangeLimit = options.rangeLimit === undefined ? 1000 : options.rangeLimit;

	  const walk = (node, parent = {}) => {
	    node.queue = [];

	    let p = parent;
	    let q = parent.queue;

	    while (p.type !== 'brace' && p.type !== 'root' && p.parent) {
	      p = p.parent;
	      q = p.queue;
	    }

	    if (node.invalid || node.dollar) {
	      q.push(append(q.pop(), stringify(node, options)));
	      return;
	    }

	    if (node.type === 'brace' && node.invalid !== true && node.nodes.length === 2) {
	      q.push(append(q.pop(), ['{}']));
	      return;
	    }

	    if (node.nodes && node.ranges > 0) {
	      const args = utils.reduce(node.nodes);

	      if (utils.exceedsLimit(...args, options.step, rangeLimit)) {
	        throw new RangeError('expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.');
	      }

	      let range = fill(...args, options);
	      if (range.length === 0) {
	        range = stringify(node, options);
	      }

	      q.push(append(q.pop(), range));
	      node.nodes = [];
	      return;
	    }

	    const enclose = utils.encloseBrace(node);
	    let queue = node.queue;
	    let block = node;

	    while (block.type !== 'brace' && block.type !== 'root' && block.parent) {
	      block = block.parent;
	      queue = block.queue;
	    }

	    for (let i = 0; i < node.nodes.length; i++) {
	      const child = node.nodes[i];

	      if (child.type === 'comma' && node.type === 'brace') {
	        if (i === 1) queue.push('');
	        queue.push('');
	        continue;
	      }

	      if (child.type === 'close') {
	        q.push(append(q.pop(), queue, enclose));
	        continue;
	      }

	      if (child.value && child.type !== 'open') {
	        queue.push(append(queue.pop(), child.value));
	        continue;
	      }

	      if (child.nodes) {
	        walk(child, node);
	      }
	    }

	    return queue;
	  };

	  return utils.flatten(walk(ast));
	};

	expand_1 = expand;
	return expand_1;
}

var constants$2;
var hasRequiredConstants$2;

function requireConstants$2 () {
	if (hasRequiredConstants$2) return constants$2;
	hasRequiredConstants$2 = 1;

	constants$2 = {
	  MAX_LENGTH: 10000,

	  // Digits
	  CHAR_0: '0', /* 0 */
	  CHAR_9: '9', /* 9 */

	  // Alphabet chars.
	  CHAR_UPPERCASE_A: 'A', /* A */
	  CHAR_LOWERCASE_A: 'a', /* a */
	  CHAR_UPPERCASE_Z: 'Z', /* Z */
	  CHAR_LOWERCASE_Z: 'z', /* z */

	  CHAR_LEFT_PARENTHESES: '(', /* ( */
	  CHAR_RIGHT_PARENTHESES: ')', /* ) */

	  CHAR_ASTERISK: '*', /* * */

	  // Non-alphabetic chars.
	  CHAR_AMPERSAND: '&', /* & */
	  CHAR_AT: '@', /* @ */
	  CHAR_BACKSLASH: '\\', /* \ */
	  CHAR_BACKTICK: '`', /* ` */
	  CHAR_CARRIAGE_RETURN: '\r', /* \r */
	  CHAR_CIRCUMFLEX_ACCENT: '^', /* ^ */
	  CHAR_COLON: ':', /* : */
	  CHAR_COMMA: ',', /* , */
	  CHAR_DOLLAR: '$', /* . */
	  CHAR_DOT: '.', /* . */
	  CHAR_DOUBLE_QUOTE: '"', /* " */
	  CHAR_EQUAL: '=', /* = */
	  CHAR_EXCLAMATION_MARK: '!', /* ! */
	  CHAR_FORM_FEED: '\f', /* \f */
	  CHAR_FORWARD_SLASH: '/', /* / */
	  CHAR_HASH: '#', /* # */
	  CHAR_HYPHEN_MINUS: '-', /* - */
	  CHAR_LEFT_ANGLE_BRACKET: '<', /* < */
	  CHAR_LEFT_CURLY_BRACE: '{', /* { */
	  CHAR_LEFT_SQUARE_BRACKET: '[', /* [ */
	  CHAR_LINE_FEED: '\n', /* \n */
	  CHAR_NO_BREAK_SPACE: '\u00A0', /* \u00A0 */
	  CHAR_PERCENT: '%', /* % */
	  CHAR_PLUS: '+', /* + */
	  CHAR_QUESTION_MARK: '?', /* ? */
	  CHAR_RIGHT_ANGLE_BRACKET: '>', /* > */
	  CHAR_RIGHT_CURLY_BRACE: '}', /* } */
	  CHAR_RIGHT_SQUARE_BRACKET: ']', /* ] */
	  CHAR_SEMICOLON: ';', /* ; */
	  CHAR_SINGLE_QUOTE: '\'', /* ' */
	  CHAR_SPACE: ' ', /*   */
	  CHAR_TAB: '\t', /* \t */
	  CHAR_UNDERSCORE: '_', /* _ */
	  CHAR_VERTICAL_LINE: '|', /* | */
	  CHAR_ZERO_WIDTH_NOBREAK_SPACE: '\uFEFF' /* \uFEFF */
	};
	return constants$2;
}

var parse_1$1;
var hasRequiredParse$1;

function requireParse$1 () {
	if (hasRequiredParse$1) return parse_1$1;
	hasRequiredParse$1 = 1;

	const stringify = requireStringify();

	/**
	 * Constants
	 */

	const {
	  MAX_LENGTH,
	  CHAR_BACKSLASH, /* \ */
	  CHAR_BACKTICK, /* ` */
	  CHAR_COMMA, /* , */
	  CHAR_DOT, /* . */
	  CHAR_LEFT_PARENTHESES, /* ( */
	  CHAR_RIGHT_PARENTHESES, /* ) */
	  CHAR_LEFT_CURLY_BRACE, /* { */
	  CHAR_RIGHT_CURLY_BRACE, /* } */
	  CHAR_LEFT_SQUARE_BRACKET, /* [ */
	  CHAR_RIGHT_SQUARE_BRACKET, /* ] */
	  CHAR_DOUBLE_QUOTE, /* " */
	  CHAR_SINGLE_QUOTE, /* ' */
	  CHAR_NO_BREAK_SPACE,
	  CHAR_ZERO_WIDTH_NOBREAK_SPACE
	} = requireConstants$2();

	/**
	 * parse
	 */

	const parse = (input, options = {}) => {
	  if (typeof input !== 'string') {
	    throw new TypeError('Expected a string');
	  }

	  const opts = options || {};
	  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
	  if (input.length > max) {
	    throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
	  }

	  const ast = { type: 'root', input, nodes: [] };
	  const stack = [ast];
	  let block = ast;
	  let prev = ast;
	  let brackets = 0;
	  const length = input.length;
	  let index = 0;
	  let depth = 0;
	  let value;

	  /**
	   * Helpers
	   */

	  const advance = () => input[index++];
	  const push = node => {
	    if (node.type === 'text' && prev.type === 'dot') {
	      prev.type = 'text';
	    }

	    if (prev && prev.type === 'text' && node.type === 'text') {
	      prev.value += node.value;
	      return;
	    }

	    block.nodes.push(node);
	    node.parent = block;
	    node.prev = prev;
	    prev = node;
	    return node;
	  };

	  push({ type: 'bos' });

	  while (index < length) {
	    block = stack[stack.length - 1];
	    value = advance();

	    /**
	     * Invalid chars
	     */

	    if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) {
	      continue;
	    }

	    /**
	     * Escaped chars
	     */

	    if (value === CHAR_BACKSLASH) {
	      push({ type: 'text', value: (options.keepEscaping ? value : '') + advance() });
	      continue;
	    }

	    /**
	     * Right square bracket (literal): ']'
	     */

	    if (value === CHAR_RIGHT_SQUARE_BRACKET) {
	      push({ type: 'text', value: '\\' + value });
	      continue;
	    }

	    /**
	     * Left square bracket: '['
	     */

	    if (value === CHAR_LEFT_SQUARE_BRACKET) {
	      brackets++;

	      let next;

	      while (index < length && (next = advance())) {
	        value += next;

	        if (next === CHAR_LEFT_SQUARE_BRACKET) {
	          brackets++;
	          continue;
	        }

	        if (next === CHAR_BACKSLASH) {
	          value += advance();
	          continue;
	        }

	        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
	          brackets--;

	          if (brackets === 0) {
	            break;
	          }
	        }
	      }

	      push({ type: 'text', value });
	      continue;
	    }

	    /**
	     * Parentheses
	     */

	    if (value === CHAR_LEFT_PARENTHESES) {
	      block = push({ type: 'paren', nodes: [] });
	      stack.push(block);
	      push({ type: 'text', value });
	      continue;
	    }

	    if (value === CHAR_RIGHT_PARENTHESES) {
	      if (block.type !== 'paren') {
	        push({ type: 'text', value });
	        continue;
	      }
	      block = stack.pop();
	      push({ type: 'text', value });
	      block = stack[stack.length - 1];
	      continue;
	    }

	    /**
	     * Quotes: '|"|`
	     */

	    if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
	      const open = value;
	      let next;

	      if (options.keepQuotes !== true) {
	        value = '';
	      }

	      while (index < length && (next = advance())) {
	        if (next === CHAR_BACKSLASH) {
	          value += next + advance();
	          continue;
	        }

	        if (next === open) {
	          if (options.keepQuotes === true) value += next;
	          break;
	        }

	        value += next;
	      }

	      push({ type: 'text', value });
	      continue;
	    }

	    /**
	     * Left curly brace: '{'
	     */

	    if (value === CHAR_LEFT_CURLY_BRACE) {
	      depth++;

	      const dollar = prev.value && prev.value.slice(-1) === '$' || block.dollar === true;
	      const brace = {
	        type: 'brace',
	        open: true,
	        close: false,
	        dollar,
	        depth,
	        commas: 0,
	        ranges: 0,
	        nodes: []
	      };

	      block = push(brace);
	      stack.push(block);
	      push({ type: 'open', value });
	      continue;
	    }

	    /**
	     * Right curly brace: '}'
	     */

	    if (value === CHAR_RIGHT_CURLY_BRACE) {
	      if (block.type !== 'brace') {
	        push({ type: 'text', value });
	        continue;
	      }

	      const type = 'close';
	      block = stack.pop();
	      block.close = true;

	      push({ type, value });
	      depth--;

	      block = stack[stack.length - 1];
	      continue;
	    }

	    /**
	     * Comma: ','
	     */

	    if (value === CHAR_COMMA && depth > 0) {
	      if (block.ranges > 0) {
	        block.ranges = 0;
	        const open = block.nodes.shift();
	        block.nodes = [open, { type: 'text', value: stringify(block) }];
	      }

	      push({ type: 'comma', value });
	      block.commas++;
	      continue;
	    }

	    /**
	     * Dot: '.'
	     */

	    if (value === CHAR_DOT && depth > 0 && block.commas === 0) {
	      const siblings = block.nodes;

	      if (depth === 0 || siblings.length === 0) {
	        push({ type: 'text', value });
	        continue;
	      }

	      if (prev.type === 'dot') {
	        block.range = [];
	        prev.value += value;
	        prev.type = 'range';

	        if (block.nodes.length !== 3 && block.nodes.length !== 5) {
	          block.invalid = true;
	          block.ranges = 0;
	          prev.type = 'text';
	          continue;
	        }

	        block.ranges++;
	        block.args = [];
	        continue;
	      }

	      if (prev.type === 'range') {
	        siblings.pop();

	        const before = siblings[siblings.length - 1];
	        before.value += prev.value + value;
	        prev = before;
	        block.ranges--;
	        continue;
	      }

	      push({ type: 'dot', value });
	      continue;
	    }

	    /**
	     * Text
	     */

	    push({ type: 'text', value });
	  }

	  // Mark imbalanced braces and brackets as invalid
	  do {
	    block = stack.pop();

	    if (block.type !== 'root') {
	      block.nodes.forEach(node => {
	        if (!node.nodes) {
	          if (node.type === 'open') node.isOpen = true;
	          if (node.type === 'close') node.isClose = true;
	          if (!node.nodes) node.type = 'text';
	          node.invalid = true;
	        }
	      });

	      // get the location of the block on parent.nodes (block's siblings)
	      const parent = stack[stack.length - 1];
	      const index = parent.nodes.indexOf(block);
	      // replace the (invalid) block with it's nodes
	      parent.nodes.splice(index, 1, ...block.nodes);
	    }
	  } while (stack.length > 0);

	  push({ type: 'eos' });
	  return ast;
	};

	parse_1$1 = parse;
	return parse_1$1;
}

var braces_1;
var hasRequiredBraces;

function requireBraces () {
	if (hasRequiredBraces) return braces_1;
	hasRequiredBraces = 1;

	const stringify = requireStringify();
	const compile = requireCompile();
	const expand = requireExpand();
	const parse = requireParse$1();

	/**
	 * Expand the given pattern or create a regex-compatible string.
	 *
	 * ```js
	 * const braces = require('braces');
	 * console.log(braces('{a,b,c}', { compile: true })); //=> ['(a|b|c)']
	 * console.log(braces('{a,b,c}')); //=> ['a', 'b', 'c']
	 * ```
	 * @param {String} `str`
	 * @param {Object} `options`
	 * @return {String}
	 * @api public
	 */

	const braces = (input, options = {}) => {
	  let output = [];

	  if (Array.isArray(input)) {
	    for (const pattern of input) {
	      const result = braces.create(pattern, options);
	      if (Array.isArray(result)) {
	        output.push(...result);
	      } else {
	        output.push(result);
	      }
	    }
	  } else {
	    output = [].concat(braces.create(input, options));
	  }

	  if (options && options.expand === true && options.nodupes === true) {
	    output = [...new Set(output)];
	  }
	  return output;
	};

	/**
	 * Parse the given `str` with the given `options`.
	 *
	 * ```js
	 * // braces.parse(pattern, [, options]);
	 * const ast = braces.parse('a/{b,c}/d');
	 * console.log(ast);
	 * ```
	 * @param {String} pattern Brace pattern to parse
	 * @param {Object} options
	 * @return {Object} Returns an AST
	 * @api public
	 */

	braces.parse = (input, options = {}) => parse(input, options);

	/**
	 * Creates a braces string from an AST, or an AST node.
	 *
	 * ```js
	 * const braces = require('braces');
	 * let ast = braces.parse('foo/{a,b}/bar');
	 * console.log(stringify(ast.nodes[2])); //=> '{a,b}'
	 * ```
	 * @param {String} `input` Brace pattern or AST.
	 * @param {Object} `options`
	 * @return {Array} Returns an array of expanded values.
	 * @api public
	 */

	braces.stringify = (input, options = {}) => {
	  if (typeof input === 'string') {
	    return stringify(braces.parse(input, options), options);
	  }
	  return stringify(input, options);
	};

	/**
	 * Compiles a brace pattern into a regex-compatible, optimized string.
	 * This method is called by the main [braces](#braces) function by default.
	 *
	 * ```js
	 * const braces = require('braces');
	 * console.log(braces.compile('a/{b,c}/d'));
	 * //=> ['a/(b|c)/d']
	 * ```
	 * @param {String} `input` Brace pattern or AST.
	 * @param {Object} `options`
	 * @return {Array} Returns an array of expanded values.
	 * @api public
	 */

	braces.compile = (input, options = {}) => {
	  if (typeof input === 'string') {
	    input = braces.parse(input, options);
	  }
	  return compile(input, options);
	};

	/**
	 * Expands a brace pattern into an array. This method is called by the
	 * main [braces](#braces) function when `options.expand` is true. Before
	 * using this method it's recommended that you read the [performance notes](#performance))
	 * and advantages of using [.compile](#compile) instead.
	 *
	 * ```js
	 * const braces = require('braces');
	 * console.log(braces.expand('a/{b,c}/d'));
	 * //=> ['a/b/d', 'a/c/d'];
	 * ```
	 * @param {String} `pattern` Brace pattern
	 * @param {Object} `options`
	 * @return {Array} Returns an array of expanded values.
	 * @api public
	 */

	braces.expand = (input, options = {}) => {
	  if (typeof input === 'string') {
	    input = braces.parse(input, options);
	  }

	  let result = expand(input, options);

	  // filter out empty strings if specified
	  if (options.noempty === true) {
	    result = result.filter(Boolean);
	  }

	  // filter out duplicates if specified
	  if (options.nodupes === true) {
	    result = [...new Set(result)];
	  }

	  return result;
	};

	/**
	 * Processes a brace pattern and returns either an expanded array
	 * (if `options.expand` is true), a highly optimized regex-compatible string.
	 * This method is called by the main [braces](#braces) function.
	 *
	 * ```js
	 * const braces = require('braces');
	 * console.log(braces.create('user-{200..300}/project-{a,b,c}-{1..10}'))
	 * //=> 'user-(20[0-9]|2[1-9][0-9]|300)/project-(a|b|c)-([1-9]|10)'
	 * ```
	 * @param {String} `pattern` Brace pattern
	 * @param {Object} `options`
	 * @return {Array} Returns an array of expanded values.
	 * @api public
	 */

	braces.create = (input, options = {}) => {
	  if (input === '' || input.length < 3) {
	    return [input];
	  }

	  return options.expand !== true
	    ? braces.compile(input, options)
	    : braces.expand(input, options);
	};

	/**
	 * Expose "braces"
	 */

	braces_1 = braces;
	return braces_1;
}

var utils$1 = {};

var constants$1;
var hasRequiredConstants$1;

function requireConstants$1 () {
	if (hasRequiredConstants$1) return constants$1;
	hasRequiredConstants$1 = 1;

	const path = path$1;
	const WIN_SLASH = '\\\\/';
	const WIN_NO_SLASH = `[^${WIN_SLASH}]`;

	/**
	 * Posix glob regex
	 */

	const DOT_LITERAL = '\\.';
	const PLUS_LITERAL = '\\+';
	const QMARK_LITERAL = '\\?';
	const SLASH_LITERAL = '\\/';
	const ONE_CHAR = '(?=.)';
	const QMARK = '[^/]';
	const END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
	const START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
	const DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
	const NO_DOT = `(?!${DOT_LITERAL})`;
	const NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
	const NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
	const NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
	const QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
	const STAR = `${QMARK}*?`;

	const POSIX_CHARS = {
	  DOT_LITERAL,
	  PLUS_LITERAL,
	  QMARK_LITERAL,
	  SLASH_LITERAL,
	  ONE_CHAR,
	  QMARK,
	  END_ANCHOR,
	  DOTS_SLASH,
	  NO_DOT,
	  NO_DOTS,
	  NO_DOT_SLASH,
	  NO_DOTS_SLASH,
	  QMARK_NO_DOT,
	  STAR,
	  START_ANCHOR
	};

	/**
	 * Windows glob regex
	 */

	const WINDOWS_CHARS = {
	  ...POSIX_CHARS,

	  SLASH_LITERAL: `[${WIN_SLASH}]`,
	  QMARK: WIN_NO_SLASH,
	  STAR: `${WIN_NO_SLASH}*?`,
	  DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
	  NO_DOT: `(?!${DOT_LITERAL})`,
	  NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
	  NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
	  NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
	  QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
	  START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
	  END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
	};

	/**
	 * POSIX Bracket Regex
	 */

	const POSIX_REGEX_SOURCE = {
	  alnum: 'a-zA-Z0-9',
	  alpha: 'a-zA-Z',
	  ascii: '\\x00-\\x7F',
	  blank: ' \\t',
	  cntrl: '\\x00-\\x1F\\x7F',
	  digit: '0-9',
	  graph: '\\x21-\\x7E',
	  lower: 'a-z',
	  print: '\\x20-\\x7E ',
	  punct: '\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~',
	  space: ' \\t\\r\\n\\v\\f',
	  upper: 'A-Z',
	  word: 'A-Za-z0-9_',
	  xdigit: 'A-Fa-f0-9'
	};

	constants$1 = {
	  MAX_LENGTH: 1024 * 64,
	  POSIX_REGEX_SOURCE,

	  // regular expressions
	  REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
	  REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
	  REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
	  REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
	  REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
	  REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,

	  // Replace globs with equivalent patterns to reduce parsing time.
	  REPLACEMENTS: {
	    '***': '*',
	    '**/**': '**',
	    '**/**/**': '**'
	  },

	  // Digits
	  CHAR_0: 48, /* 0 */
	  CHAR_9: 57, /* 9 */

	  // Alphabet chars.
	  CHAR_UPPERCASE_A: 65, /* A */
	  CHAR_LOWERCASE_A: 97, /* a */
	  CHAR_UPPERCASE_Z: 90, /* Z */
	  CHAR_LOWERCASE_Z: 122, /* z */

	  CHAR_LEFT_PARENTHESES: 40, /* ( */
	  CHAR_RIGHT_PARENTHESES: 41, /* ) */

	  CHAR_ASTERISK: 42, /* * */

	  // Non-alphabetic chars.
	  CHAR_AMPERSAND: 38, /* & */
	  CHAR_AT: 64, /* @ */
	  CHAR_BACKWARD_SLASH: 92, /* \ */
	  CHAR_CARRIAGE_RETURN: 13, /* \r */
	  CHAR_CIRCUMFLEX_ACCENT: 94, /* ^ */
	  CHAR_COLON: 58, /* : */
	  CHAR_COMMA: 44, /* , */
	  CHAR_DOT: 46, /* . */
	  CHAR_DOUBLE_QUOTE: 34, /* " */
	  CHAR_EQUAL: 61, /* = */
	  CHAR_EXCLAMATION_MARK: 33, /* ! */
	  CHAR_FORM_FEED: 12, /* \f */
	  CHAR_FORWARD_SLASH: 47, /* / */
	  CHAR_GRAVE_ACCENT: 96, /* ` */
	  CHAR_HASH: 35, /* # */
	  CHAR_HYPHEN_MINUS: 45, /* - */
	  CHAR_LEFT_ANGLE_BRACKET: 60, /* < */
	  CHAR_LEFT_CURLY_BRACE: 123, /* { */
	  CHAR_LEFT_SQUARE_BRACKET: 91, /* [ */
	  CHAR_LINE_FEED: 10, /* \n */
	  CHAR_NO_BREAK_SPACE: 160, /* \u00A0 */
	  CHAR_PERCENT: 37, /* % */
	  CHAR_PLUS: 43, /* + */
	  CHAR_QUESTION_MARK: 63, /* ? */
	  CHAR_RIGHT_ANGLE_BRACKET: 62, /* > */
	  CHAR_RIGHT_CURLY_BRACE: 125, /* } */
	  CHAR_RIGHT_SQUARE_BRACKET: 93, /* ] */
	  CHAR_SEMICOLON: 59, /* ; */
	  CHAR_SINGLE_QUOTE: 39, /* ' */
	  CHAR_SPACE: 32, /*   */
	  CHAR_TAB: 9, /* \t */
	  CHAR_UNDERSCORE: 95, /* _ */
	  CHAR_VERTICAL_LINE: 124, /* | */
	  CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279, /* \uFEFF */

	  SEP: path.sep,

	  /**
	   * Create EXTGLOB_CHARS
	   */

	  extglobChars(chars) {
	    return {
	      '!': { type: 'negate', open: '(?:(?!(?:', close: `))${chars.STAR})` },
	      '?': { type: 'qmark', open: '(?:', close: ')?' },
	      '+': { type: 'plus', open: '(?:', close: ')+' },
	      '*': { type: 'star', open: '(?:', close: ')*' },
	      '@': { type: 'at', open: '(?:', close: ')' }
	    };
	  },

	  /**
	   * Create GLOB_CHARS
	   */

	  globChars(win32) {
	    return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
	  }
	};
	return constants$1;
}

var hasRequiredUtils$2;

function requireUtils$2 () {
	if (hasRequiredUtils$2) return utils$1;
	hasRequiredUtils$2 = 1;
	(function (exports$1) {

		const path = path$1;
		const win32 = process.platform === 'win32';
		const {
		  REGEX_BACKSLASH,
		  REGEX_REMOVE_BACKSLASH,
		  REGEX_SPECIAL_CHARS,
		  REGEX_SPECIAL_CHARS_GLOBAL
		} = requireConstants$1();

		exports$1.isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);
		exports$1.hasRegexChars = str => REGEX_SPECIAL_CHARS.test(str);
		exports$1.isRegexChar = str => str.length === 1 && exports$1.hasRegexChars(str);
		exports$1.escapeRegex = str => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, '\\$1');
		exports$1.toPosixSlashes = str => str.replace(REGEX_BACKSLASH, '/');

		exports$1.removeBackslashes = str => {
		  return str.replace(REGEX_REMOVE_BACKSLASH, match => {
		    return match === '\\' ? '' : match;
		  });
		};

		exports$1.supportsLookbehinds = () => {
		  const segs = process.version.slice(1).split('.').map(Number);
		  if (segs.length === 3 && segs[0] >= 9 || (segs[0] === 8 && segs[1] >= 10)) {
		    return true;
		  }
		  return false;
		};

		exports$1.isWindows = options => {
		  if (options && typeof options.windows === 'boolean') {
		    return options.windows;
		  }
		  return win32 === true || path.sep === '\\';
		};

		exports$1.escapeLast = (input, char, lastIdx) => {
		  const idx = input.lastIndexOf(char, lastIdx);
		  if (idx === -1) return input;
		  if (input[idx - 1] === '\\') return exports$1.escapeLast(input, char, idx - 1);
		  return `${input.slice(0, idx)}\\${input.slice(idx)}`;
		};

		exports$1.removePrefix = (input, state = {}) => {
		  let output = input;
		  if (output.startsWith('./')) {
		    output = output.slice(2);
		    state.prefix = './';
		  }
		  return output;
		};

		exports$1.wrapOutput = (input, state = {}, options = {}) => {
		  const prepend = options.contains ? '' : '^';
		  const append = options.contains ? '' : '$';

		  let output = `${prepend}(?:${input})${append}`;
		  if (state.negated === true) {
		    output = `(?:^(?!${output}).*$)`;
		  }
		  return output;
		}; 
	} (utils$1));
	return utils$1;
}

var scan_1;
var hasRequiredScan;

function requireScan () {
	if (hasRequiredScan) return scan_1;
	hasRequiredScan = 1;

	const utils = requireUtils$2();
	const {
	  CHAR_ASTERISK,             /* * */
	  CHAR_AT,                   /* @ */
	  CHAR_BACKWARD_SLASH,       /* \ */
	  CHAR_COMMA,                /* , */
	  CHAR_DOT,                  /* . */
	  CHAR_EXCLAMATION_MARK,     /* ! */
	  CHAR_FORWARD_SLASH,        /* / */
	  CHAR_LEFT_CURLY_BRACE,     /* { */
	  CHAR_LEFT_PARENTHESES,     /* ( */
	  CHAR_LEFT_SQUARE_BRACKET,  /* [ */
	  CHAR_PLUS,                 /* + */
	  CHAR_QUESTION_MARK,        /* ? */
	  CHAR_RIGHT_CURLY_BRACE,    /* } */
	  CHAR_RIGHT_PARENTHESES,    /* ) */
	  CHAR_RIGHT_SQUARE_BRACKET  /* ] */
	} = requireConstants$1();

	const isPathSeparator = code => {
	  return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
	};

	const depth = token => {
	  if (token.isPrefix !== true) {
	    token.depth = token.isGlobstar ? Infinity : 1;
	  }
	};

	/**
	 * Quickly scans a glob pattern and returns an object with a handful of
	 * useful properties, like `isGlob`, `path` (the leading non-glob, if it exists),
	 * `glob` (the actual pattern), `negated` (true if the path starts with `!` but not
	 * with `!(`) and `negatedExtglob` (true if the path starts with `!(`).
	 *
	 * ```js
	 * const pm = require('picomatch');
	 * console.log(pm.scan('foo/bar/*.js'));
	 * { isGlob: true, input: 'foo/bar/*.js', base: 'foo/bar', glob: '*.js' }
	 * ```
	 * @param {String} `str`
	 * @param {Object} `options`
	 * @return {Object} Returns an object with tokens and regex source string.
	 * @api public
	 */

	const scan = (input, options) => {
	  const opts = options || {};

	  const length = input.length - 1;
	  const scanToEnd = opts.parts === true || opts.scanToEnd === true;
	  const slashes = [];
	  const tokens = [];
	  const parts = [];

	  let str = input;
	  let index = -1;
	  let start = 0;
	  let lastIndex = 0;
	  let isBrace = false;
	  let isBracket = false;
	  let isGlob = false;
	  let isExtglob = false;
	  let isGlobstar = false;
	  let braceEscaped = false;
	  let backslashes = false;
	  let negated = false;
	  let negatedExtglob = false;
	  let finished = false;
	  let braces = 0;
	  let prev;
	  let code;
	  let token = { value: '', depth: 0, isGlob: false };

	  const eos = () => index >= length;
	  const peek = () => str.charCodeAt(index + 1);
	  const advance = () => {
	    prev = code;
	    return str.charCodeAt(++index);
	  };

	  while (index < length) {
	    code = advance();
	    let next;

	    if (code === CHAR_BACKWARD_SLASH) {
	      backslashes = token.backslashes = true;
	      code = advance();

	      if (code === CHAR_LEFT_CURLY_BRACE) {
	        braceEscaped = true;
	      }
	      continue;
	    }

	    if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
	      braces++;

	      while (eos() !== true && (code = advance())) {
	        if (code === CHAR_BACKWARD_SLASH) {
	          backslashes = token.backslashes = true;
	          advance();
	          continue;
	        }

	        if (code === CHAR_LEFT_CURLY_BRACE) {
	          braces++;
	          continue;
	        }

	        if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
	          isBrace = token.isBrace = true;
	          isGlob = token.isGlob = true;
	          finished = true;

	          if (scanToEnd === true) {
	            continue;
	          }

	          break;
	        }

	        if (braceEscaped !== true && code === CHAR_COMMA) {
	          isBrace = token.isBrace = true;
	          isGlob = token.isGlob = true;
	          finished = true;

	          if (scanToEnd === true) {
	            continue;
	          }

	          break;
	        }

	        if (code === CHAR_RIGHT_CURLY_BRACE) {
	          braces--;

	          if (braces === 0) {
	            braceEscaped = false;
	            isBrace = token.isBrace = true;
	            finished = true;
	            break;
	          }
	        }
	      }

	      if (scanToEnd === true) {
	        continue;
	      }

	      break;
	    }

	    if (code === CHAR_FORWARD_SLASH) {
	      slashes.push(index);
	      tokens.push(token);
	      token = { value: '', depth: 0, isGlob: false };

	      if (finished === true) continue;
	      if (prev === CHAR_DOT && index === (start + 1)) {
	        start += 2;
	        continue;
	      }

	      lastIndex = index + 1;
	      continue;
	    }

	    if (opts.noext !== true) {
	      const isExtglobChar = code === CHAR_PLUS
	        || code === CHAR_AT
	        || code === CHAR_ASTERISK
	        || code === CHAR_QUESTION_MARK
	        || code === CHAR_EXCLAMATION_MARK;

	      if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
	        isGlob = token.isGlob = true;
	        isExtglob = token.isExtglob = true;
	        finished = true;
	        if (code === CHAR_EXCLAMATION_MARK && index === start) {
	          negatedExtglob = true;
	        }

	        if (scanToEnd === true) {
	          while (eos() !== true && (code = advance())) {
	            if (code === CHAR_BACKWARD_SLASH) {
	              backslashes = token.backslashes = true;
	              code = advance();
	              continue;
	            }

	            if (code === CHAR_RIGHT_PARENTHESES) {
	              isGlob = token.isGlob = true;
	              finished = true;
	              break;
	            }
	          }
	          continue;
	        }
	        break;
	      }
	    }

	    if (code === CHAR_ASTERISK) {
	      if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
	      isGlob = token.isGlob = true;
	      finished = true;

	      if (scanToEnd === true) {
	        continue;
	      }
	      break;
	    }

	    if (code === CHAR_QUESTION_MARK) {
	      isGlob = token.isGlob = true;
	      finished = true;

	      if (scanToEnd === true) {
	        continue;
	      }
	      break;
	    }

	    if (code === CHAR_LEFT_SQUARE_BRACKET) {
	      while (eos() !== true && (next = advance())) {
	        if (next === CHAR_BACKWARD_SLASH) {
	          backslashes = token.backslashes = true;
	          advance();
	          continue;
	        }

	        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
	          isBracket = token.isBracket = true;
	          isGlob = token.isGlob = true;
	          finished = true;
	          break;
	        }
	      }

	      if (scanToEnd === true) {
	        continue;
	      }

	      break;
	    }

	    if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
	      negated = token.negated = true;
	      start++;
	      continue;
	    }

	    if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
	      isGlob = token.isGlob = true;

	      if (scanToEnd === true) {
	        while (eos() !== true && (code = advance())) {
	          if (code === CHAR_LEFT_PARENTHESES) {
	            backslashes = token.backslashes = true;
	            code = advance();
	            continue;
	          }

	          if (code === CHAR_RIGHT_PARENTHESES) {
	            finished = true;
	            break;
	          }
	        }
	        continue;
	      }
	      break;
	    }

	    if (isGlob === true) {
	      finished = true;

	      if (scanToEnd === true) {
	        continue;
	      }

	      break;
	    }
	  }

	  if (opts.noext === true) {
	    isExtglob = false;
	    isGlob = false;
	  }

	  let base = str;
	  let prefix = '';
	  let glob = '';

	  if (start > 0) {
	    prefix = str.slice(0, start);
	    str = str.slice(start);
	    lastIndex -= start;
	  }

	  if (base && isGlob === true && lastIndex > 0) {
	    base = str.slice(0, lastIndex);
	    glob = str.slice(lastIndex);
	  } else if (isGlob === true) {
	    base = '';
	    glob = str;
	  } else {
	    base = str;
	  }

	  if (base && base !== '' && base !== '/' && base !== str) {
	    if (isPathSeparator(base.charCodeAt(base.length - 1))) {
	      base = base.slice(0, -1);
	    }
	  }

	  if (opts.unescape === true) {
	    if (glob) glob = utils.removeBackslashes(glob);

	    if (base && backslashes === true) {
	      base = utils.removeBackslashes(base);
	    }
	  }

	  const state = {
	    prefix,
	    input,
	    start,
	    base,
	    glob,
	    isBrace,
	    isBracket,
	    isGlob,
	    isExtglob,
	    isGlobstar,
	    negated,
	    negatedExtglob
	  };

	  if (opts.tokens === true) {
	    state.maxDepth = 0;
	    if (!isPathSeparator(code)) {
	      tokens.push(token);
	    }
	    state.tokens = tokens;
	  }

	  if (opts.parts === true || opts.tokens === true) {
	    let prevIndex;

	    for (let idx = 0; idx < slashes.length; idx++) {
	      const n = prevIndex ? prevIndex + 1 : start;
	      const i = slashes[idx];
	      const value = input.slice(n, i);
	      if (opts.tokens) {
	        if (idx === 0 && start !== 0) {
	          tokens[idx].isPrefix = true;
	          tokens[idx].value = prefix;
	        } else {
	          tokens[idx].value = value;
	        }
	        depth(tokens[idx]);
	        state.maxDepth += tokens[idx].depth;
	      }
	      if (idx !== 0 || value !== '') {
	        parts.push(value);
	      }
	      prevIndex = i;
	    }

	    if (prevIndex && prevIndex + 1 < input.length) {
	      const value = input.slice(prevIndex + 1);
	      parts.push(value);

	      if (opts.tokens) {
	        tokens[tokens.length - 1].value = value;
	        depth(tokens[tokens.length - 1]);
	        state.maxDepth += tokens[tokens.length - 1].depth;
	      }
	    }

	    state.slashes = slashes;
	    state.parts = parts;
	  }

	  return state;
	};

	scan_1 = scan;
	return scan_1;
}

var parse_1;
var hasRequiredParse;

function requireParse () {
	if (hasRequiredParse) return parse_1;
	hasRequiredParse = 1;

	const constants = requireConstants$1();
	const utils = requireUtils$2();

	/**
	 * Constants
	 */

	const {
	  MAX_LENGTH,
	  POSIX_REGEX_SOURCE,
	  REGEX_NON_SPECIAL_CHARS,
	  REGEX_SPECIAL_CHARS_BACKREF,
	  REPLACEMENTS
	} = constants;

	/**
	 * Helpers
	 */

	const expandRange = (args, options) => {
	  if (typeof options.expandRange === 'function') {
	    return options.expandRange(...args, options);
	  }

	  args.sort();
	  const value = `[${args.join('-')}]`;

	  try {
	    /* eslint-disable-next-line no-new */
	    new RegExp(value);
	  } catch (ex) {
	    return args.map(v => utils.escapeRegex(v)).join('..');
	  }

	  return value;
	};

	/**
	 * Create the message for a syntax error
	 */

	const syntaxError = (type, char) => {
	  return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
	};

	/**
	 * Parse the given input string.
	 * @param {String} input
	 * @param {Object} options
	 * @return {Object}
	 */

	const parse = (input, options) => {
	  if (typeof input !== 'string') {
	    throw new TypeError('Expected a string');
	  }

	  input = REPLACEMENTS[input] || input;

	  const opts = { ...options };
	  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;

	  let len = input.length;
	  if (len > max) {
	    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
	  }

	  const bos = { type: 'bos', value: '', output: opts.prepend || '' };
	  const tokens = [bos];

	  const capture = opts.capture ? '' : '?:';
	  const win32 = utils.isWindows(options);

	  // create constants based on platform, for windows or posix
	  const PLATFORM_CHARS = constants.globChars(win32);
	  const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);

	  const {
	    DOT_LITERAL,
	    PLUS_LITERAL,
	    SLASH_LITERAL,
	    ONE_CHAR,
	    DOTS_SLASH,
	    NO_DOT,
	    NO_DOT_SLASH,
	    NO_DOTS_SLASH,
	    QMARK,
	    QMARK_NO_DOT,
	    STAR,
	    START_ANCHOR
	  } = PLATFORM_CHARS;

	  const globstar = opts => {
	    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
	  };

	  const nodot = opts.dot ? '' : NO_DOT;
	  const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
	  let star = opts.bash === true ? globstar(opts) : STAR;

	  if (opts.capture) {
	    star = `(${star})`;
	  }

	  // minimatch options support
	  if (typeof opts.noext === 'boolean') {
	    opts.noextglob = opts.noext;
	  }

	  const state = {
	    input,
	    index: -1,
	    start: 0,
	    dot: opts.dot === true,
	    consumed: '',
	    output: '',
	    prefix: '',
	    backtrack: false,
	    negated: false,
	    brackets: 0,
	    braces: 0,
	    parens: 0,
	    quotes: 0,
	    globstar: false,
	    tokens
	  };

	  input = utils.removePrefix(input, state);
	  len = input.length;

	  const extglobs = [];
	  const braces = [];
	  const stack = [];
	  let prev = bos;
	  let value;

	  /**
	   * Tokenizing helpers
	   */

	  const eos = () => state.index === len - 1;
	  const peek = state.peek = (n = 1) => input[state.index + n];
	  const advance = state.advance = () => input[++state.index] || '';
	  const remaining = () => input.slice(state.index + 1);
	  const consume = (value = '', num = 0) => {
	    state.consumed += value;
	    state.index += num;
	  };

	  const append = token => {
	    state.output += token.output != null ? token.output : token.value;
	    consume(token.value);
	  };

	  const negate = () => {
	    let count = 1;

	    while (peek() === '!' && (peek(2) !== '(' || peek(3) === '?')) {
	      advance();
	      state.start++;
	      count++;
	    }

	    if (count % 2 === 0) {
	      return false;
	    }

	    state.negated = true;
	    state.start++;
	    return true;
	  };

	  const increment = type => {
	    state[type]++;
	    stack.push(type);
	  };

	  const decrement = type => {
	    state[type]--;
	    stack.pop();
	  };

	  /**
	   * Push tokens onto the tokens array. This helper speeds up
	   * tokenizing by 1) helping us avoid backtracking as much as possible,
	   * and 2) helping us avoid creating extra tokens when consecutive
	   * characters are plain text. This improves performance and simplifies
	   * lookbehinds.
	   */

	  const push = tok => {
	    if (prev.type === 'globstar') {
	      const isBrace = state.braces > 0 && (tok.type === 'comma' || tok.type === 'brace');
	      const isExtglob = tok.extglob === true || (extglobs.length && (tok.type === 'pipe' || tok.type === 'paren'));

	      if (tok.type !== 'slash' && tok.type !== 'paren' && !isBrace && !isExtglob) {
	        state.output = state.output.slice(0, -prev.output.length);
	        prev.type = 'star';
	        prev.value = '*';
	        prev.output = star;
	        state.output += prev.output;
	      }
	    }

	    if (extglobs.length && tok.type !== 'paren') {
	      extglobs[extglobs.length - 1].inner += tok.value;
	    }

	    if (tok.value || tok.output) append(tok);
	    if (prev && prev.type === 'text' && tok.type === 'text') {
	      prev.value += tok.value;
	      prev.output = (prev.output || '') + tok.value;
	      return;
	    }

	    tok.prev = prev;
	    tokens.push(tok);
	    prev = tok;
	  };

	  const extglobOpen = (type, value) => {
	    const token = { ...EXTGLOB_CHARS[value], conditions: 1, inner: '' };

	    token.prev = prev;
	    token.parens = state.parens;
	    token.output = state.output;
	    const output = (opts.capture ? '(' : '') + token.open;

	    increment('parens');
	    push({ type, value, output: state.output ? '' : ONE_CHAR });
	    push({ type: 'paren', extglob: true, value: advance(), output });
	    extglobs.push(token);
	  };

	  const extglobClose = token => {
	    let output = token.close + (opts.capture ? ')' : '');
	    let rest;

	    if (token.type === 'negate') {
	      let extglobStar = star;

	      if (token.inner && token.inner.length > 1 && token.inner.includes('/')) {
	        extglobStar = globstar(opts);
	      }

	      if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
	        output = token.close = `)$))${extglobStar}`;
	      }

	      if (token.inner.includes('*') && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) {
	        // Any non-magical string (`.ts`) or even nested expression (`.{ts,tsx}`) can follow after the closing parenthesis.
	        // In this case, we need to parse the string and use it in the output of the original pattern.
	        // Suitable patterns: `/!(*.d).ts`, `/!(*.d).{ts,tsx}`, `**/!(*-dbg).@(js)`.
	        //
	        // Disabling the `fastpaths` option due to a problem with parsing strings as `.ts` in the pattern like `**/!(*.d).ts`.
	        const expression = parse(rest, { ...options, fastpaths: false }).output;

	        output = token.close = `)${expression})${extglobStar})`;
	      }

	      if (token.prev.type === 'bos') {
	        state.negatedExtglob = true;
	      }
	    }

	    push({ type: 'paren', extglob: true, value, output });
	    decrement('parens');
	  };

	  /**
	   * Fast paths
	   */

	  if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
	    let backslashes = false;

	    let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
	      if (first === '\\') {
	        backslashes = true;
	        return m;
	      }

	      if (first === '?') {
	        if (esc) {
	          return esc + first + (rest ? QMARK.repeat(rest.length) : '');
	        }
	        if (index === 0) {
	          return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : '');
	        }
	        return QMARK.repeat(chars.length);
	      }

	      if (first === '.') {
	        return DOT_LITERAL.repeat(chars.length);
	      }

	      if (first === '*') {
	        if (esc) {
	          return esc + first + (rest ? star : '');
	        }
	        return star;
	      }
	      return esc ? m : `\\${m}`;
	    });

	    if (backslashes === true) {
	      if (opts.unescape === true) {
	        output = output.replace(/\\/g, '');
	      } else {
	        output = output.replace(/\\+/g, m => {
	          return m.length % 2 === 0 ? '\\\\' : (m ? '\\' : '');
	        });
	      }
	    }

	    if (output === input && opts.contains === true) {
	      state.output = input;
	      return state;
	    }

	    state.output = utils.wrapOutput(output, state, options);
	    return state;
	  }

	  /**
	   * Tokenize input until we reach end-of-string
	   */

	  while (!eos()) {
	    value = advance();

	    if (value === '\u0000') {
	      continue;
	    }

	    /**
	     * Escaped characters
	     */

	    if (value === '\\') {
	      const next = peek();

	      if (next === '/' && opts.bash !== true) {
	        continue;
	      }

	      if (next === '.' || next === ';') {
	        continue;
	      }

	      if (!next) {
	        value += '\\';
	        push({ type: 'text', value });
	        continue;
	      }

	      // collapse slashes to reduce potential for exploits
	      const match = /^\\+/.exec(remaining());
	      let slashes = 0;

	      if (match && match[0].length > 2) {
	        slashes = match[0].length;
	        state.index += slashes;
	        if (slashes % 2 !== 0) {
	          value += '\\';
	        }
	      }

	      if (opts.unescape === true) {
	        value = advance();
	      } else {
	        value += advance();
	      }

	      if (state.brackets === 0) {
	        push({ type: 'text', value });
	        continue;
	      }
	    }

	    /**
	     * If we're inside a regex character class, continue
	     * until we reach the closing bracket.
	     */

	    if (state.brackets > 0 && (value !== ']' || prev.value === '[' || prev.value === '[^')) {
	      if (opts.posix !== false && value === ':') {
	        const inner = prev.value.slice(1);
	        if (inner.includes('[')) {
	          prev.posix = true;

	          if (inner.includes(':')) {
	            const idx = prev.value.lastIndexOf('[');
	            const pre = prev.value.slice(0, idx);
	            const rest = prev.value.slice(idx + 2);
	            const posix = POSIX_REGEX_SOURCE[rest];
	            if (posix) {
	              prev.value = pre + posix;
	              state.backtrack = true;
	              advance();

	              if (!bos.output && tokens.indexOf(prev) === 1) {
	                bos.output = ONE_CHAR;
	              }
	              continue;
	            }
	          }
	        }
	      }

	      if ((value === '[' && peek() !== ':') || (value === '-' && peek() === ']')) {
	        value = `\\${value}`;
	      }

	      if (value === ']' && (prev.value === '[' || prev.value === '[^')) {
	        value = `\\${value}`;
	      }

	      if (opts.posix === true && value === '!' && prev.value === '[') {
	        value = '^';
	      }

	      prev.value += value;
	      append({ value });
	      continue;
	    }

	    /**
	     * If we're inside a quoted string, continue
	     * until we reach the closing double quote.
	     */

	    if (state.quotes === 1 && value !== '"') {
	      value = utils.escapeRegex(value);
	      prev.value += value;
	      append({ value });
	      continue;
	    }

	    /**
	     * Double quotes
	     */

	    if (value === '"') {
	      state.quotes = state.quotes === 1 ? 0 : 1;
	      if (opts.keepQuotes === true) {
	        push({ type: 'text', value });
	      }
	      continue;
	    }

	    /**
	     * Parentheses
	     */

	    if (value === '(') {
	      increment('parens');
	      push({ type: 'paren', value });
	      continue;
	    }

	    if (value === ')') {
	      if (state.parens === 0 && opts.strictBrackets === true) {
	        throw new SyntaxError(syntaxError('opening', '('));
	      }

	      const extglob = extglobs[extglobs.length - 1];
	      if (extglob && state.parens === extglob.parens + 1) {
	        extglobClose(extglobs.pop());
	        continue;
	      }

	      push({ type: 'paren', value, output: state.parens ? ')' : '\\)' });
	      decrement('parens');
	      continue;
	    }

	    /**
	     * Square brackets
	     */

	    if (value === '[') {
	      if (opts.nobracket === true || !remaining().includes(']')) {
	        if (opts.nobracket !== true && opts.strictBrackets === true) {
	          throw new SyntaxError(syntaxError('closing', ']'));
	        }

	        value = `\\${value}`;
	      } else {
	        increment('brackets');
	      }

	      push({ type: 'bracket', value });
	      continue;
	    }

	    if (value === ']') {
	      if (opts.nobracket === true || (prev && prev.type === 'bracket' && prev.value.length === 1)) {
	        push({ type: 'text', value, output: `\\${value}` });
	        continue;
	      }

	      if (state.brackets === 0) {
	        if (opts.strictBrackets === true) {
	          throw new SyntaxError(syntaxError('opening', '['));
	        }

	        push({ type: 'text', value, output: `\\${value}` });
	        continue;
	      }

	      decrement('brackets');

	      const prevValue = prev.value.slice(1);
	      if (prev.posix !== true && prevValue[0] === '^' && !prevValue.includes('/')) {
	        value = `/${value}`;
	      }

	      prev.value += value;
	      append({ value });

	      // when literal brackets are explicitly disabled
	      // assume we should match with a regex character class
	      if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
	        continue;
	      }

	      const escaped = utils.escapeRegex(prev.value);
	      state.output = state.output.slice(0, -prev.value.length);

	      // when literal brackets are explicitly enabled
	      // assume we should escape the brackets to match literal characters
	      if (opts.literalBrackets === true) {
	        state.output += escaped;
	        prev.value = escaped;
	        continue;
	      }

	      // when the user specifies nothing, try to match both
	      prev.value = `(${capture}${escaped}|${prev.value})`;
	      state.output += prev.value;
	      continue;
	    }

	    /**
	     * Braces
	     */

	    if (value === '{' && opts.nobrace !== true) {
	      increment('braces');

	      const open = {
	        type: 'brace',
	        value,
	        output: '(',
	        outputIndex: state.output.length,
	        tokensIndex: state.tokens.length
	      };

	      braces.push(open);
	      push(open);
	      continue;
	    }

	    if (value === '}') {
	      const brace = braces[braces.length - 1];

	      if (opts.nobrace === true || !brace) {
	        push({ type: 'text', value, output: value });
	        continue;
	      }

	      let output = ')';

	      if (brace.dots === true) {
	        const arr = tokens.slice();
	        const range = [];

	        for (let i = arr.length - 1; i >= 0; i--) {
	          tokens.pop();
	          if (arr[i].type === 'brace') {
	            break;
	          }
	          if (arr[i].type !== 'dots') {
	            range.unshift(arr[i].value);
	          }
	        }

	        output = expandRange(range, opts);
	        state.backtrack = true;
	      }

	      if (brace.comma !== true && brace.dots !== true) {
	        const out = state.output.slice(0, brace.outputIndex);
	        const toks = state.tokens.slice(brace.tokensIndex);
	        brace.value = brace.output = '\\{';
	        value = output = '\\}';
	        state.output = out;
	        for (const t of toks) {
	          state.output += (t.output || t.value);
	        }
	      }

	      push({ type: 'brace', value, output });
	      decrement('braces');
	      braces.pop();
	      continue;
	    }

	    /**
	     * Pipes
	     */

	    if (value === '|') {
	      if (extglobs.length > 0) {
	        extglobs[extglobs.length - 1].conditions++;
	      }
	      push({ type: 'text', value });
	      continue;
	    }

	    /**
	     * Commas
	     */

	    if (value === ',') {
	      let output = value;

	      const brace = braces[braces.length - 1];
	      if (brace && stack[stack.length - 1] === 'braces') {
	        brace.comma = true;
	        output = '|';
	      }

	      push({ type: 'comma', value, output });
	      continue;
	    }

	    /**
	     * Slashes
	     */

	    if (value === '/') {
	      // if the beginning of the glob is "./", advance the start
	      // to the current index, and don't add the "./" characters
	      // to the state. This greatly simplifies lookbehinds when
	      // checking for BOS characters like "!" and "." (not "./")
	      if (prev.type === 'dot' && state.index === state.start + 1) {
	        state.start = state.index + 1;
	        state.consumed = '';
	        state.output = '';
	        tokens.pop();
	        prev = bos; // reset "prev" to the first token
	        continue;
	      }

	      push({ type: 'slash', value, output: SLASH_LITERAL });
	      continue;
	    }

	    /**
	     * Dots
	     */

	    if (value === '.') {
	      if (state.braces > 0 && prev.type === 'dot') {
	        if (prev.value === '.') prev.output = DOT_LITERAL;
	        const brace = braces[braces.length - 1];
	        prev.type = 'dots';
	        prev.output += value;
	        prev.value += value;
	        brace.dots = true;
	        continue;
	      }

	      if ((state.braces + state.parens) === 0 && prev.type !== 'bos' && prev.type !== 'slash') {
	        push({ type: 'text', value, output: DOT_LITERAL });
	        continue;
	      }

	      push({ type: 'dot', value, output: DOT_LITERAL });
	      continue;
	    }

	    /**
	     * Question marks
	     */

	    if (value === '?') {
	      const isGroup = prev && prev.value === '(';
	      if (!isGroup && opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
	        extglobOpen('qmark', value);
	        continue;
	      }

	      if (prev && prev.type === 'paren') {
	        const next = peek();
	        let output = value;

	        if (next === '<' && !utils.supportsLookbehinds()) {
	          throw new Error('Node.js v10 or higher is required for regex lookbehinds');
	        }

	        if ((prev.value === '(' && !/[!=<:]/.test(next)) || (next === '<' && !/<([!=]|\w+>)/.test(remaining()))) {
	          output = `\\${value}`;
	        }

	        push({ type: 'text', value, output });
	        continue;
	      }

	      if (opts.dot !== true && (prev.type === 'slash' || prev.type === 'bos')) {
	        push({ type: 'qmark', value, output: QMARK_NO_DOT });
	        continue;
	      }

	      push({ type: 'qmark', value, output: QMARK });
	      continue;
	    }

	    /**
	     * Exclamation
	     */

	    if (value === '!') {
	      if (opts.noextglob !== true && peek() === '(') {
	        if (peek(2) !== '?' || !/[!=<:]/.test(peek(3))) {
	          extglobOpen('negate', value);
	          continue;
	        }
	      }

	      if (opts.nonegate !== true && state.index === 0) {
	        negate();
	        continue;
	      }
	    }

	    /**
	     * Plus
	     */

	    if (value === '+') {
	      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
	        extglobOpen('plus', value);
	        continue;
	      }

	      if ((prev && prev.value === '(') || opts.regex === false) {
	        push({ type: 'plus', value, output: PLUS_LITERAL });
	        continue;
	      }

	      if ((prev && (prev.type === 'bracket' || prev.type === 'paren' || prev.type === 'brace')) || state.parens > 0) {
	        push({ type: 'plus', value });
	        continue;
	      }

	      push({ type: 'plus', value: PLUS_LITERAL });
	      continue;
	    }

	    /**
	     * Plain text
	     */

	    if (value === '@') {
	      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
	        push({ type: 'at', extglob: true, value, output: '' });
	        continue;
	      }

	      push({ type: 'text', value });
	      continue;
	    }

	    /**
	     * Plain text
	     */

	    if (value !== '*') {
	      if (value === '$' || value === '^') {
	        value = `\\${value}`;
	      }

	      const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
	      if (match) {
	        value += match[0];
	        state.index += match[0].length;
	      }

	      push({ type: 'text', value });
	      continue;
	    }

	    /**
	     * Stars
	     */

	    if (prev && (prev.type === 'globstar' || prev.star === true)) {
	      prev.type = 'star';
	      prev.star = true;
	      prev.value += value;
	      prev.output = star;
	      state.backtrack = true;
	      state.globstar = true;
	      consume(value);
	      continue;
	    }

	    let rest = remaining();
	    if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
	      extglobOpen('star', value);
	      continue;
	    }

	    if (prev.type === 'star') {
	      if (opts.noglobstar === true) {
	        consume(value);
	        continue;
	      }

	      const prior = prev.prev;
	      const before = prior.prev;
	      const isStart = prior.type === 'slash' || prior.type === 'bos';
	      const afterStar = before && (before.type === 'star' || before.type === 'globstar');

	      if (opts.bash === true && (!isStart || (rest[0] && rest[0] !== '/'))) {
	        push({ type: 'star', value, output: '' });
	        continue;
	      }

	      const isBrace = state.braces > 0 && (prior.type === 'comma' || prior.type === 'brace');
	      const isExtglob = extglobs.length && (prior.type === 'pipe' || prior.type === 'paren');
	      if (!isStart && prior.type !== 'paren' && !isBrace && !isExtglob) {
	        push({ type: 'star', value, output: '' });
	        continue;
	      }

	      // strip consecutive `/**/`
	      while (rest.slice(0, 3) === '/**') {
	        const after = input[state.index + 4];
	        if (after && after !== '/') {
	          break;
	        }
	        rest = rest.slice(3);
	        consume('/**', 3);
	      }

	      if (prior.type === 'bos' && eos()) {
	        prev.type = 'globstar';
	        prev.value += value;
	        prev.output = globstar(opts);
	        state.output = prev.output;
	        state.globstar = true;
	        consume(value);
	        continue;
	      }

	      if (prior.type === 'slash' && prior.prev.type !== 'bos' && !afterStar && eos()) {
	        state.output = state.output.slice(0, -(prior.output + prev.output).length);
	        prior.output = `(?:${prior.output}`;

	        prev.type = 'globstar';
	        prev.output = globstar(opts) + (opts.strictSlashes ? ')' : '|$)');
	        prev.value += value;
	        state.globstar = true;
	        state.output += prior.output + prev.output;
	        consume(value);
	        continue;
	      }

	      if (prior.type === 'slash' && prior.prev.type !== 'bos' && rest[0] === '/') {
	        const end = rest[1] !== void 0 ? '|$' : '';

	        state.output = state.output.slice(0, -(prior.output + prev.output).length);
	        prior.output = `(?:${prior.output}`;

	        prev.type = 'globstar';
	        prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
	        prev.value += value;

	        state.output += prior.output + prev.output;
	        state.globstar = true;

	        consume(value + advance());

	        push({ type: 'slash', value: '/', output: '' });
	        continue;
	      }

	      if (prior.type === 'bos' && rest[0] === '/') {
	        prev.type = 'globstar';
	        prev.value += value;
	        prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
	        state.output = prev.output;
	        state.globstar = true;
	        consume(value + advance());
	        push({ type: 'slash', value: '/', output: '' });
	        continue;
	      }

	      // remove single star from output
	      state.output = state.output.slice(0, -prev.output.length);

	      // reset previous token to globstar
	      prev.type = 'globstar';
	      prev.output = globstar(opts);
	      prev.value += value;

	      // reset output with globstar
	      state.output += prev.output;
	      state.globstar = true;
	      consume(value);
	      continue;
	    }

	    const token = { type: 'star', value, output: star };

	    if (opts.bash === true) {
	      token.output = '.*?';
	      if (prev.type === 'bos' || prev.type === 'slash') {
	        token.output = nodot + token.output;
	      }
	      push(token);
	      continue;
	    }

	    if (prev && (prev.type === 'bracket' || prev.type === 'paren') && opts.regex === true) {
	      token.output = value;
	      push(token);
	      continue;
	    }

	    if (state.index === state.start || prev.type === 'slash' || prev.type === 'dot') {
	      if (prev.type === 'dot') {
	        state.output += NO_DOT_SLASH;
	        prev.output += NO_DOT_SLASH;

	      } else if (opts.dot === true) {
	        state.output += NO_DOTS_SLASH;
	        prev.output += NO_DOTS_SLASH;

	      } else {
	        state.output += nodot;
	        prev.output += nodot;
	      }

	      if (peek() !== '*') {
	        state.output += ONE_CHAR;
	        prev.output += ONE_CHAR;
	      }
	    }

	    push(token);
	  }

	  while (state.brackets > 0) {
	    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ']'));
	    state.output = utils.escapeLast(state.output, '[');
	    decrement('brackets');
	  }

	  while (state.parens > 0) {
	    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ')'));
	    state.output = utils.escapeLast(state.output, '(');
	    decrement('parens');
	  }

	  while (state.braces > 0) {
	    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', '}'));
	    state.output = utils.escapeLast(state.output, '{');
	    decrement('braces');
	  }

	  if (opts.strictSlashes !== true && (prev.type === 'star' || prev.type === 'bracket')) {
	    push({ type: 'maybe_slash', value: '', output: `${SLASH_LITERAL}?` });
	  }

	  // rebuild the output if we had to backtrack at any point
	  if (state.backtrack === true) {
	    state.output = '';

	    for (const token of state.tokens) {
	      state.output += token.output != null ? token.output : token.value;

	      if (token.suffix) {
	        state.output += token.suffix;
	      }
	    }
	  }

	  return state;
	};

	/**
	 * Fast paths for creating regular expressions for common glob patterns.
	 * This can significantly speed up processing and has very little downside
	 * impact when none of the fast paths match.
	 */

	parse.fastpaths = (input, options) => {
	  const opts = { ...options };
	  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
	  const len = input.length;
	  if (len > max) {
	    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
	  }

	  input = REPLACEMENTS[input] || input;
	  const win32 = utils.isWindows(options);

	  // create constants based on platform, for windows or posix
	  const {
	    DOT_LITERAL,
	    SLASH_LITERAL,
	    ONE_CHAR,
	    DOTS_SLASH,
	    NO_DOT,
	    NO_DOTS,
	    NO_DOTS_SLASH,
	    STAR,
	    START_ANCHOR
	  } = constants.globChars(win32);

	  const nodot = opts.dot ? NO_DOTS : NO_DOT;
	  const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
	  const capture = opts.capture ? '' : '?:';
	  const state = { negated: false, prefix: '' };
	  let star = opts.bash === true ? '.*?' : STAR;

	  if (opts.capture) {
	    star = `(${star})`;
	  }

	  const globstar = opts => {
	    if (opts.noglobstar === true) return star;
	    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
	  };

	  const create = str => {
	    switch (str) {
	      case '*':
	        return `${nodot}${ONE_CHAR}${star}`;

	      case '.*':
	        return `${DOT_LITERAL}${ONE_CHAR}${star}`;

	      case '*.*':
	        return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

	      case '*/*':
	        return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;

	      case '**':
	        return nodot + globstar(opts);

	      case '**/*':
	        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;

	      case '**/*.*':
	        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

	      case '**/.*':
	        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;

	      default: {
	        const match = /^(.*?)\.(\w+)$/.exec(str);
	        if (!match) return;

	        const source = create(match[1]);
	        if (!source) return;

	        return source + DOT_LITERAL + match[2];
	      }
	    }
	  };

	  const output = utils.removePrefix(input, state);
	  let source = create(output);

	  if (source && opts.strictSlashes !== true) {
	    source += `${SLASH_LITERAL}?`;
	  }

	  return source;
	};

	parse_1 = parse;
	return parse_1;
}

var picomatch_1;
var hasRequiredPicomatch$1;

function requirePicomatch$1 () {
	if (hasRequiredPicomatch$1) return picomatch_1;
	hasRequiredPicomatch$1 = 1;

	const path = path$1;
	const scan = requireScan();
	const parse = requireParse();
	const utils = requireUtils$2();
	const constants = requireConstants$1();
	const isObject = val => val && typeof val === 'object' && !Array.isArray(val);

	/**
	 * Creates a matcher function from one or more glob patterns. The
	 * returned function takes a string to match as its first argument,
	 * and returns true if the string is a match. The returned matcher
	 * function also takes a boolean as the second argument that, when true,
	 * returns an object with additional information.
	 *
	 * ```js
	 * const picomatch = require('picomatch');
	 * // picomatch(glob[, options]);
	 *
	 * const isMatch = picomatch('*.!(*a)');
	 * console.log(isMatch('a.a')); //=> false
	 * console.log(isMatch('a.b')); //=> true
	 * ```
	 * @name picomatch
	 * @param {String|Array} `globs` One or more glob patterns.
	 * @param {Object=} `options`
	 * @return {Function=} Returns a matcher function.
	 * @api public
	 */

	const picomatch = (glob, options, returnState = false) => {
	  if (Array.isArray(glob)) {
	    const fns = glob.map(input => picomatch(input, options, returnState));
	    const arrayMatcher = str => {
	      for (const isMatch of fns) {
	        const state = isMatch(str);
	        if (state) return state;
	      }
	      return false;
	    };
	    return arrayMatcher;
	  }

	  const isState = isObject(glob) && glob.tokens && glob.input;

	  if (glob === '' || (typeof glob !== 'string' && !isState)) {
	    throw new TypeError('Expected pattern to be a non-empty string');
	  }

	  const opts = options || {};
	  const posix = utils.isWindows(options);
	  const regex = isState
	    ? picomatch.compileRe(glob, options)
	    : picomatch.makeRe(glob, options, false, true);

	  const state = regex.state;
	  delete regex.state;

	  let isIgnored = () => false;
	  if (opts.ignore) {
	    const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
	    isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
	  }

	  const matcher = (input, returnObject = false) => {
	    const { isMatch, match, output } = picomatch.test(input, regex, options, { glob, posix });
	    const result = { glob, state, regex, posix, input, output, match, isMatch };

	    if (typeof opts.onResult === 'function') {
	      opts.onResult(result);
	    }

	    if (isMatch === false) {
	      result.isMatch = false;
	      return returnObject ? result : false;
	    }

	    if (isIgnored(input)) {
	      if (typeof opts.onIgnore === 'function') {
	        opts.onIgnore(result);
	      }
	      result.isMatch = false;
	      return returnObject ? result : false;
	    }

	    if (typeof opts.onMatch === 'function') {
	      opts.onMatch(result);
	    }
	    return returnObject ? result : true;
	  };

	  if (returnState) {
	    matcher.state = state;
	  }

	  return matcher;
	};

	/**
	 * Test `input` with the given `regex`. This is used by the main
	 * `picomatch()` function to test the input string.
	 *
	 * ```js
	 * const picomatch = require('picomatch');
	 * // picomatch.test(input, regex[, options]);
	 *
	 * console.log(picomatch.test('foo/bar', /^(?:([^/]*?)\/([^/]*?))$/));
	 * // { isMatch: true, match: [ 'foo/', 'foo', 'bar' ], output: 'foo/bar' }
	 * ```
	 * @param {String} `input` String to test.
	 * @param {RegExp} `regex`
	 * @return {Object} Returns an object with matching info.
	 * @api public
	 */

	picomatch.test = (input, regex, options, { glob, posix } = {}) => {
	  if (typeof input !== 'string') {
	    throw new TypeError('Expected input to be a string');
	  }

	  if (input === '') {
	    return { isMatch: false, output: '' };
	  }

	  const opts = options || {};
	  const format = opts.format || (posix ? utils.toPosixSlashes : null);
	  let match = input === glob;
	  let output = (match && format) ? format(input) : input;

	  if (match === false) {
	    output = format ? format(input) : input;
	    match = output === glob;
	  }

	  if (match === false || opts.capture === true) {
	    if (opts.matchBase === true || opts.basename === true) {
	      match = picomatch.matchBase(input, regex, options, posix);
	    } else {
	      match = regex.exec(output);
	    }
	  }

	  return { isMatch: Boolean(match), match, output };
	};

	/**
	 * Match the basename of a filepath.
	 *
	 * ```js
	 * const picomatch = require('picomatch');
	 * // picomatch.matchBase(input, glob[, options]);
	 * console.log(picomatch.matchBase('foo/bar.js', '*.js'); // true
	 * ```
	 * @param {String} `input` String to test.
	 * @param {RegExp|String} `glob` Glob pattern or regex created by [.makeRe](#makeRe).
	 * @return {Boolean}
	 * @api public
	 */

	picomatch.matchBase = (input, glob, options, posix = utils.isWindows(options)) => {
	  const regex = glob instanceof RegExp ? glob : picomatch.makeRe(glob, options);
	  return regex.test(path.basename(input));
	};

	/**
	 * Returns true if **any** of the given glob `patterns` match the specified `string`.
	 *
	 * ```js
	 * const picomatch = require('picomatch');
	 * // picomatch.isMatch(string, patterns[, options]);
	 *
	 * console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
	 * console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
	 * ```
	 * @param {String|Array} str The string to test.
	 * @param {String|Array} patterns One or more glob patterns to use for matching.
	 * @param {Object} [options] See available [options](#options).
	 * @return {Boolean} Returns true if any patterns match `str`
	 * @api public
	 */

	picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);

	/**
	 * Parse a glob pattern to create the source string for a regular
	 * expression.
	 *
	 * ```js
	 * const picomatch = require('picomatch');
	 * const result = picomatch.parse(pattern[, options]);
	 * ```
	 * @param {String} `pattern`
	 * @param {Object} `options`
	 * @return {Object} Returns an object with useful properties and output to be used as a regex source string.
	 * @api public
	 */

	picomatch.parse = (pattern, options) => {
	  if (Array.isArray(pattern)) return pattern.map(p => picomatch.parse(p, options));
	  return parse(pattern, { ...options, fastpaths: false });
	};

	/**
	 * Scan a glob pattern to separate the pattern into segments.
	 *
	 * ```js
	 * const picomatch = require('picomatch');
	 * // picomatch.scan(input[, options]);
	 *
	 * const result = picomatch.scan('!./foo/*.js');
	 * console.log(result);
	 * { prefix: '!./',
	 *   input: '!./foo/*.js',
	 *   start: 3,
	 *   base: 'foo',
	 *   glob: '*.js',
	 *   isBrace: false,
	 *   isBracket: false,
	 *   isGlob: true,
	 *   isExtglob: false,
	 *   isGlobstar: false,
	 *   negated: true }
	 * ```
	 * @param {String} `input` Glob pattern to scan.
	 * @param {Object} `options`
	 * @return {Object} Returns an object with
	 * @api public
	 */

	picomatch.scan = (input, options) => scan(input, options);

	/**
	 * Compile a regular expression from the `state` object returned by the
	 * [parse()](#parse) method.
	 *
	 * @param {Object} `state`
	 * @param {Object} `options`
	 * @param {Boolean} `returnOutput` Intended for implementors, this argument allows you to return the raw output from the parser.
	 * @param {Boolean} `returnState` Adds the state to a `state` property on the returned regex. Useful for implementors and debugging.
	 * @return {RegExp}
	 * @api public
	 */

	picomatch.compileRe = (state, options, returnOutput = false, returnState = false) => {
	  if (returnOutput === true) {
	    return state.output;
	  }

	  const opts = options || {};
	  const prepend = opts.contains ? '' : '^';
	  const append = opts.contains ? '' : '$';

	  let source = `${prepend}(?:${state.output})${append}`;
	  if (state && state.negated === true) {
	    source = `^(?!${source}).*$`;
	  }

	  const regex = picomatch.toRegex(source, options);
	  if (returnState === true) {
	    regex.state = state;
	  }

	  return regex;
	};

	/**
	 * Create a regular expression from a parsed glob pattern.
	 *
	 * ```js
	 * const picomatch = require('picomatch');
	 * const state = picomatch.parse('*.js');
	 * // picomatch.compileRe(state[, options]);
	 *
	 * console.log(picomatch.compileRe(state));
	 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
	 * ```
	 * @param {String} `state` The object returned from the `.parse` method.
	 * @param {Object} `options`
	 * @param {Boolean} `returnOutput` Implementors may use this argument to return the compiled output, instead of a regular expression. This is not exposed on the options to prevent end-users from mutating the result.
	 * @param {Boolean} `returnState` Implementors may use this argument to return the state from the parsed glob with the returned regular expression.
	 * @return {RegExp} Returns a regex created from the given pattern.
	 * @api public
	 */

	picomatch.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
	  if (!input || typeof input !== 'string') {
	    throw new TypeError('Expected a non-empty string');
	  }

	  let parsed = { negated: false, fastpaths: true };

	  if (options.fastpaths !== false && (input[0] === '.' || input[0] === '*')) {
	    parsed.output = parse.fastpaths(input, options);
	  }

	  if (!parsed.output) {
	    parsed = parse(input, options);
	  }

	  return picomatch.compileRe(parsed, options, returnOutput, returnState);
	};

	/**
	 * Create a regular expression from the given regex source string.
	 *
	 * ```js
	 * const picomatch = require('picomatch');
	 * // picomatch.toRegex(source[, options]);
	 *
	 * const { output } = picomatch.parse('*.js');
	 * console.log(picomatch.toRegex(output));
	 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
	 * ```
	 * @param {String} `source` Regular expression source string.
	 * @param {Object} `options`
	 * @return {RegExp}
	 * @api public
	 */

	picomatch.toRegex = (source, options) => {
	  try {
	    const opts = options || {};
	    return new RegExp(source, opts.flags || (opts.nocase ? 'i' : ''));
	  } catch (err) {
	    if (options && options.debug === true) throw err;
	    return /$^/;
	  }
	};

	/**
	 * Picomatch constants.
	 * @return {Object}
	 */

	picomatch.constants = constants;

	/**
	 * Expose "picomatch"
	 */

	picomatch_1 = picomatch;
	return picomatch_1;
}

var picomatch;
var hasRequiredPicomatch;

function requirePicomatch () {
	if (hasRequiredPicomatch) return picomatch;
	hasRequiredPicomatch = 1;

	picomatch = requirePicomatch$1();
	return picomatch;
}

var micromatch_1;
var hasRequiredMicromatch;

function requireMicromatch () {
	if (hasRequiredMicromatch) return micromatch_1;
	hasRequiredMicromatch = 1;

	const util = require$$0$1;
	const braces = requireBraces();
	const picomatch = requirePicomatch();
	const utils = requireUtils$2();

	const isEmptyString = v => v === '' || v === './';
	const hasBraces = v => {
	  const index = v.indexOf('{');
	  return index > -1 && v.indexOf('}', index) > -1;
	};

	/**
	 * Returns an array of strings that match one or more glob patterns.
	 *
	 * ```js
	 * const mm = require('micromatch');
	 * // mm(list, patterns[, options]);
	 *
	 * console.log(mm(['a.js', 'a.txt'], ['*.js']));
	 * //=> [ 'a.js' ]
	 * ```
	 * @param {String|Array<string>} `list` List of strings to match.
	 * @param {String|Array<string>} `patterns` One or more glob patterns to use for matching.
	 * @param {Object} `options` See available [options](#options)
	 * @return {Array} Returns an array of matches
	 * @summary false
	 * @api public
	 */

	const micromatch = (list, patterns, options) => {
	  patterns = [].concat(patterns);
	  list = [].concat(list);

	  let omit = new Set();
	  let keep = new Set();
	  let items = new Set();
	  let negatives = 0;

	  let onResult = state => {
	    items.add(state.output);
	    if (options && options.onResult) {
	      options.onResult(state);
	    }
	  };

	  for (let i = 0; i < patterns.length; i++) {
	    let isMatch = picomatch(String(patterns[i]), { ...options, onResult }, true);
	    let negated = isMatch.state.negated || isMatch.state.negatedExtglob;
	    if (negated) negatives++;

	    for (let item of list) {
	      let matched = isMatch(item, true);

	      let match = negated ? !matched.isMatch : matched.isMatch;
	      if (!match) continue;

	      if (negated) {
	        omit.add(matched.output);
	      } else {
	        omit.delete(matched.output);
	        keep.add(matched.output);
	      }
	    }
	  }

	  let result = negatives === patterns.length ? [...items] : [...keep];
	  let matches = result.filter(item => !omit.has(item));

	  if (options && matches.length === 0) {
	    if (options.failglob === true) {
	      throw new Error(`No matches found for "${patterns.join(', ')}"`);
	    }

	    if (options.nonull === true || options.nullglob === true) {
	      return options.unescape ? patterns.map(p => p.replace(/\\/g, '')) : patterns;
	    }
	  }

	  return matches;
	};

	/**
	 * Backwards compatibility
	 */

	micromatch.match = micromatch;

	/**
	 * Returns a matcher function from the given glob `pattern` and `options`.
	 * The returned function takes a string to match as its only argument and returns
	 * true if the string is a match.
	 *
	 * ```js
	 * const mm = require('micromatch');
	 * // mm.matcher(pattern[, options]);
	 *
	 * const isMatch = mm.matcher('*.!(*a)');
	 * console.log(isMatch('a.a')); //=> false
	 * console.log(isMatch('a.b')); //=> true
	 * ```
	 * @param {String} `pattern` Glob pattern
	 * @param {Object} `options`
	 * @return {Function} Returns a matcher function.
	 * @api public
	 */

	micromatch.matcher = (pattern, options) => picomatch(pattern, options);

	/**
	 * Returns true if **any** of the given glob `patterns` match the specified `string`.
	 *
	 * ```js
	 * const mm = require('micromatch');
	 * // mm.isMatch(string, patterns[, options]);
	 *
	 * console.log(mm.isMatch('a.a', ['b.*', '*.a'])); //=> true
	 * console.log(mm.isMatch('a.a', 'b.*')); //=> false
	 * ```
	 * @param {String} `str` The string to test.
	 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
	 * @param {Object} `[options]` See available [options](#options).
	 * @return {Boolean} Returns true if any patterns match `str`
	 * @api public
	 */

	micromatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);

	/**
	 * Backwards compatibility
	 */

	micromatch.any = micromatch.isMatch;

	/**
	 * Returns a list of strings that _**do not match any**_ of the given `patterns`.
	 *
	 * ```js
	 * const mm = require('micromatch');
	 * // mm.not(list, patterns[, options]);
	 *
	 * console.log(mm.not(['a.a', 'b.b', 'c.c'], '*.a'));
	 * //=> ['b.b', 'c.c']
	 * ```
	 * @param {Array} `list` Array of strings to match.
	 * @param {String|Array} `patterns` One or more glob pattern to use for matching.
	 * @param {Object} `options` See available [options](#options) for changing how matches are performed
	 * @return {Array} Returns an array of strings that **do not match** the given patterns.
	 * @api public
	 */

	micromatch.not = (list, patterns, options = {}) => {
	  patterns = [].concat(patterns).map(String);
	  let result = new Set();
	  let items = [];

	  let onResult = state => {
	    if (options.onResult) options.onResult(state);
	    items.push(state.output);
	  };

	  let matches = new Set(micromatch(list, patterns, { ...options, onResult }));

	  for (let item of items) {
	    if (!matches.has(item)) {
	      result.add(item);
	    }
	  }
	  return [...result];
	};

	/**
	 * Returns true if the given `string` contains the given pattern. Similar
	 * to [.isMatch](#isMatch) but the pattern can match any part of the string.
	 *
	 * ```js
	 * var mm = require('micromatch');
	 * // mm.contains(string, pattern[, options]);
	 *
	 * console.log(mm.contains('aa/bb/cc', '*b'));
	 * //=> true
	 * console.log(mm.contains('aa/bb/cc', '*d'));
	 * //=> false
	 * ```
	 * @param {String} `str` The string to match.
	 * @param {String|Array} `patterns` Glob pattern to use for matching.
	 * @param {Object} `options` See available [options](#options) for changing how matches are performed
	 * @return {Boolean} Returns true if any of the patterns matches any part of `str`.
	 * @api public
	 */

	micromatch.contains = (str, pattern, options) => {
	  if (typeof str !== 'string') {
	    throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
	  }

	  if (Array.isArray(pattern)) {
	    return pattern.some(p => micromatch.contains(str, p, options));
	  }

	  if (typeof pattern === 'string') {
	    if (isEmptyString(str) || isEmptyString(pattern)) {
	      return false;
	    }

	    if (str.includes(pattern) || (str.startsWith('./') && str.slice(2).includes(pattern))) {
	      return true;
	    }
	  }

	  return micromatch.isMatch(str, pattern, { ...options, contains: true });
	};

	/**
	 * Filter the keys of the given object with the given `glob` pattern
	 * and `options`. Does not attempt to match nested keys. If you need this feature,
	 * use [glob-object][] instead.
	 *
	 * ```js
	 * const mm = require('micromatch');
	 * // mm.matchKeys(object, patterns[, options]);
	 *
	 * const obj = { aa: 'a', ab: 'b', ac: 'c' };
	 * console.log(mm.matchKeys(obj, '*b'));
	 * //=> { ab: 'b' }
	 * ```
	 * @param {Object} `object` The object with keys to filter.
	 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
	 * @param {Object} `options` See available [options](#options) for changing how matches are performed
	 * @return {Object} Returns an object with only keys that match the given patterns.
	 * @api public
	 */

	micromatch.matchKeys = (obj, patterns, options) => {
	  if (!utils.isObject(obj)) {
	    throw new TypeError('Expected the first argument to be an object');
	  }
	  let keys = micromatch(Object.keys(obj), patterns, options);
	  let res = {};
	  for (let key of keys) res[key] = obj[key];
	  return res;
	};

	/**
	 * Returns true if some of the strings in the given `list` match any of the given glob `patterns`.
	 *
	 * ```js
	 * const mm = require('micromatch');
	 * // mm.some(list, patterns[, options]);
	 *
	 * console.log(mm.some(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
	 * // true
	 * console.log(mm.some(['foo.js'], ['*.js', '!foo.js']));
	 * // false
	 * ```
	 * @param {String|Array} `list` The string or array of strings to test. Returns as soon as the first match is found.
	 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
	 * @param {Object} `options` See available [options](#options) for changing how matches are performed
	 * @return {Boolean} Returns true if any `patterns` matches any of the strings in `list`
	 * @api public
	 */

	micromatch.some = (list, patterns, options) => {
	  let items = [].concat(list);

	  for (let pattern of [].concat(patterns)) {
	    let isMatch = picomatch(String(pattern), options);
	    if (items.some(item => isMatch(item))) {
	      return true;
	    }
	  }
	  return false;
	};

	/**
	 * Returns true if every string in the given `list` matches
	 * any of the given glob `patterns`.
	 *
	 * ```js
	 * const mm = require('micromatch');
	 * // mm.every(list, patterns[, options]);
	 *
	 * console.log(mm.every('foo.js', ['foo.js']));
	 * // true
	 * console.log(mm.every(['foo.js', 'bar.js'], ['*.js']));
	 * // true
	 * console.log(mm.every(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
	 * // false
	 * console.log(mm.every(['foo.js'], ['*.js', '!foo.js']));
	 * // false
	 * ```
	 * @param {String|Array} `list` The string or array of strings to test.
	 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
	 * @param {Object} `options` See available [options](#options) for changing how matches are performed
	 * @return {Boolean} Returns true if all `patterns` matches all of the strings in `list`
	 * @api public
	 */

	micromatch.every = (list, patterns, options) => {
	  let items = [].concat(list);

	  for (let pattern of [].concat(patterns)) {
	    let isMatch = picomatch(String(pattern), options);
	    if (!items.every(item => isMatch(item))) {
	      return false;
	    }
	  }
	  return true;
	};

	/**
	 * Returns true if **all** of the given `patterns` match
	 * the specified string.
	 *
	 * ```js
	 * const mm = require('micromatch');
	 * // mm.all(string, patterns[, options]);
	 *
	 * console.log(mm.all('foo.js', ['foo.js']));
	 * // true
	 *
	 * console.log(mm.all('foo.js', ['*.js', '!foo.js']));
	 * // false
	 *
	 * console.log(mm.all('foo.js', ['*.js', 'foo.js']));
	 * // true
	 *
	 * console.log(mm.all('foo.js', ['*.js', 'f*', '*o*', '*o.js']));
	 * // true
	 * ```
	 * @param {String|Array} `str` The string to test.
	 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
	 * @param {Object} `options` See available [options](#options) for changing how matches are performed
	 * @return {Boolean} Returns true if any patterns match `str`
	 * @api public
	 */

	micromatch.all = (str, patterns, options) => {
	  if (typeof str !== 'string') {
	    throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
	  }

	  return [].concat(patterns).every(p => picomatch(p, options)(str));
	};

	/**
	 * Returns an array of matches captured by `pattern` in `string, or `null` if the pattern did not match.
	 *
	 * ```js
	 * const mm = require('micromatch');
	 * // mm.capture(pattern, string[, options]);
	 *
	 * console.log(mm.capture('test/*.js', 'test/foo.js'));
	 * //=> ['foo']
	 * console.log(mm.capture('test/*.js', 'foo/bar.css'));
	 * //=> null
	 * ```
	 * @param {String} `glob` Glob pattern to use for matching.
	 * @param {String} `input` String to match
	 * @param {Object} `options` See available [options](#options) for changing how matches are performed
	 * @return {Array|null} Returns an array of captures if the input matches the glob pattern, otherwise `null`.
	 * @api public
	 */

	micromatch.capture = (glob, input, options) => {
	  let posix = utils.isWindows(options);
	  let regex = picomatch.makeRe(String(glob), { ...options, capture: true });
	  let match = regex.exec(posix ? utils.toPosixSlashes(input) : input);

	  if (match) {
	    return match.slice(1).map(v => v === void 0 ? '' : v);
	  }
	};

	/**
	 * Create a regular expression from the given glob `pattern`.
	 *
	 * ```js
	 * const mm = require('micromatch');
	 * // mm.makeRe(pattern[, options]);
	 *
	 * console.log(mm.makeRe('*.js'));
	 * //=> /^(?:(\.[\\\/])?(?!\.)(?=.)[^\/]*?\.js)$/
	 * ```
	 * @param {String} `pattern` A glob pattern to convert to regex.
	 * @param {Object} `options`
	 * @return {RegExp} Returns a regex created from the given pattern.
	 * @api public
	 */

	micromatch.makeRe = (...args) => picomatch.makeRe(...args);

	/**
	 * Scan a glob pattern to separate the pattern into segments. Used
	 * by the [split](#split) method.
	 *
	 * ```js
	 * const mm = require('micromatch');
	 * const state = mm.scan(pattern[, options]);
	 * ```
	 * @param {String} `pattern`
	 * @param {Object} `options`
	 * @return {Object} Returns an object with
	 * @api public
	 */

	micromatch.scan = (...args) => picomatch.scan(...args);

	/**
	 * Parse a glob pattern to create the source string for a regular
	 * expression.
	 *
	 * ```js
	 * const mm = require('micromatch');
	 * const state = mm.parse(pattern[, options]);
	 * ```
	 * @param {String} `glob`
	 * @param {Object} `options`
	 * @return {Object} Returns an object with useful properties and output to be used as regex source string.
	 * @api public
	 */

	micromatch.parse = (patterns, options) => {
	  let res = [];
	  for (let pattern of [].concat(patterns || [])) {
	    for (let str of braces(String(pattern), options)) {
	      res.push(picomatch.parse(str, options));
	    }
	  }
	  return res;
	};

	/**
	 * Process the given brace `pattern`.
	 *
	 * ```js
	 * const { braces } = require('micromatch');
	 * console.log(braces('foo/{a,b,c}/bar'));
	 * //=> [ 'foo/(a|b|c)/bar' ]
	 *
	 * console.log(braces('foo/{a,b,c}/bar', { expand: true }));
	 * //=> [ 'foo/a/bar', 'foo/b/bar', 'foo/c/bar' ]
	 * ```
	 * @param {String} `pattern` String with brace pattern to process.
	 * @param {Object} `options` Any [options](#options) to change how expansion is performed. See the [braces][] library for all available options.
	 * @return {Array}
	 * @api public
	 */

	micromatch.braces = (pattern, options) => {
	  if (typeof pattern !== 'string') throw new TypeError('Expected a string');
	  if ((options && options.nobrace === true) || !hasBraces(pattern)) {
	    return [pattern];
	  }
	  return braces(pattern, options);
	};

	/**
	 * Expand braces
	 */

	micromatch.braceExpand = (pattern, options) => {
	  if (typeof pattern !== 'string') throw new TypeError('Expected a string');
	  return micromatch.braces(pattern, { ...options, expand: true });
	};

	/**
	 * Expose micromatch
	 */

	// exposed for tests
	micromatch.hasBraces = hasBraces;
	micromatch_1 = micromatch;
	return micromatch_1;
}

var hasRequiredPattern;

function requirePattern () {
	if (hasRequiredPattern) return pattern;
	hasRequiredPattern = 1;
	Object.defineProperty(pattern, "__esModule", { value: true });
	pattern.isAbsolute = pattern.partitionAbsoluteAndRelative = pattern.removeDuplicateSlashes = pattern.matchAny = pattern.convertPatternsToRe = pattern.makeRe = pattern.getPatternParts = pattern.expandBraceExpansion = pattern.expandPatternsWithBraceExpansion = pattern.isAffectDepthOfReadingPattern = pattern.endsWithSlashGlobStar = pattern.hasGlobStar = pattern.getBaseDirectory = pattern.isPatternRelatedToParentDirectory = pattern.getPatternsOutsideCurrentDirectory = pattern.getPatternsInsideCurrentDirectory = pattern.getPositivePatterns = pattern.getNegativePatterns = pattern.isPositivePattern = pattern.isNegativePattern = pattern.convertToNegativePattern = pattern.convertToPositivePattern = pattern.isDynamicPattern = pattern.isStaticPattern = void 0;
	const path = path$1;
	const globParent = requireGlobParent();
	const micromatch = requireMicromatch();
	const GLOBSTAR = '**';
	const ESCAPE_SYMBOL = '\\';
	const COMMON_GLOB_SYMBOLS_RE = /[*?]|^!/;
	const REGEX_CHARACTER_CLASS_SYMBOLS_RE = /\[[^[]*]/;
	const REGEX_GROUP_SYMBOLS_RE = /(?:^|[^!*+?@])\([^(]*\|[^|]*\)/;
	const GLOB_EXTENSION_SYMBOLS_RE = /[!*+?@]\([^(]*\)/;
	const BRACE_EXPANSION_SEPARATORS_RE = /,|\.\./;
	/**
	 * Matches a sequence of two or more consecutive slashes, excluding the first two slashes at the beginning of the string.
	 * The latter is due to the presence of the device path at the beginning of the UNC path.
	 */
	const DOUBLE_SLASH_RE = /(?!^)\/{2,}/g;
	function isStaticPattern(pattern, options = {}) {
	    return !isDynamicPattern(pattern, options);
	}
	pattern.isStaticPattern = isStaticPattern;
	function isDynamicPattern(pattern, options = {}) {
	    /**
	     * A special case with an empty string is necessary for matching patterns that start with a forward slash.
	     * An empty string cannot be a dynamic pattern.
	     * For example, the pattern `/lib/*` will be spread into parts: '', 'lib', '*'.
	     */
	    if (pattern === '') {
	        return false;
	    }
	    /**
	     * When the `caseSensitiveMatch` option is disabled, all patterns must be marked as dynamic, because we cannot check
	     * filepath directly (without read directory).
	     */
	    if (options.caseSensitiveMatch === false || pattern.includes(ESCAPE_SYMBOL)) {
	        return true;
	    }
	    if (COMMON_GLOB_SYMBOLS_RE.test(pattern) || REGEX_CHARACTER_CLASS_SYMBOLS_RE.test(pattern) || REGEX_GROUP_SYMBOLS_RE.test(pattern)) {
	        return true;
	    }
	    if (options.extglob !== false && GLOB_EXTENSION_SYMBOLS_RE.test(pattern)) {
	        return true;
	    }
	    if (options.braceExpansion !== false && hasBraceExpansion(pattern)) {
	        return true;
	    }
	    return false;
	}
	pattern.isDynamicPattern = isDynamicPattern;
	function hasBraceExpansion(pattern) {
	    const openingBraceIndex = pattern.indexOf('{');
	    if (openingBraceIndex === -1) {
	        return false;
	    }
	    const closingBraceIndex = pattern.indexOf('}', openingBraceIndex + 1);
	    if (closingBraceIndex === -1) {
	        return false;
	    }
	    const braceContent = pattern.slice(openingBraceIndex, closingBraceIndex);
	    return BRACE_EXPANSION_SEPARATORS_RE.test(braceContent);
	}
	function convertToPositivePattern(pattern) {
	    return isNegativePattern(pattern) ? pattern.slice(1) : pattern;
	}
	pattern.convertToPositivePattern = convertToPositivePattern;
	function convertToNegativePattern(pattern) {
	    return '!' + pattern;
	}
	pattern.convertToNegativePattern = convertToNegativePattern;
	function isNegativePattern(pattern) {
	    return pattern.startsWith('!') && pattern[1] !== '(';
	}
	pattern.isNegativePattern = isNegativePattern;
	function isPositivePattern(pattern) {
	    return !isNegativePattern(pattern);
	}
	pattern.isPositivePattern = isPositivePattern;
	function getNegativePatterns(patterns) {
	    return patterns.filter(isNegativePattern);
	}
	pattern.getNegativePatterns = getNegativePatterns;
	function getPositivePatterns(patterns) {
	    return patterns.filter(isPositivePattern);
	}
	pattern.getPositivePatterns = getPositivePatterns;
	/**
	 * Returns patterns that can be applied inside the current directory.
	 *
	 * @example
	 * // ['./*', '*', 'a/*']
	 * getPatternsInsideCurrentDirectory(['./*', '*', 'a/*', '../*', './../*'])
	 */
	function getPatternsInsideCurrentDirectory(patterns) {
	    return patterns.filter((pattern) => !isPatternRelatedToParentDirectory(pattern));
	}
	pattern.getPatternsInsideCurrentDirectory = getPatternsInsideCurrentDirectory;
	/**
	 * Returns patterns to be expanded relative to (outside) the current directory.
	 *
	 * @example
	 * // ['../*', './../*']
	 * getPatternsInsideCurrentDirectory(['./*', '*', 'a/*', '../*', './../*'])
	 */
	function getPatternsOutsideCurrentDirectory(patterns) {
	    return patterns.filter(isPatternRelatedToParentDirectory);
	}
	pattern.getPatternsOutsideCurrentDirectory = getPatternsOutsideCurrentDirectory;
	function isPatternRelatedToParentDirectory(pattern) {
	    return pattern.startsWith('..') || pattern.startsWith('./..');
	}
	pattern.isPatternRelatedToParentDirectory = isPatternRelatedToParentDirectory;
	function getBaseDirectory(pattern) {
	    return globParent(pattern, { flipBackslashes: false });
	}
	pattern.getBaseDirectory = getBaseDirectory;
	function hasGlobStar(pattern) {
	    return pattern.includes(GLOBSTAR);
	}
	pattern.hasGlobStar = hasGlobStar;
	function endsWithSlashGlobStar(pattern) {
	    return pattern.endsWith('/' + GLOBSTAR);
	}
	pattern.endsWithSlashGlobStar = endsWithSlashGlobStar;
	function isAffectDepthOfReadingPattern(pattern) {
	    const basename = path.basename(pattern);
	    return endsWithSlashGlobStar(pattern) || isStaticPattern(basename);
	}
	pattern.isAffectDepthOfReadingPattern = isAffectDepthOfReadingPattern;
	function expandPatternsWithBraceExpansion(patterns) {
	    return patterns.reduce((collection, pattern) => {
	        return collection.concat(expandBraceExpansion(pattern));
	    }, []);
	}
	pattern.expandPatternsWithBraceExpansion = expandPatternsWithBraceExpansion;
	function expandBraceExpansion(pattern) {
	    const patterns = micromatch.braces(pattern, { expand: true, nodupes: true, keepEscaping: true });
	    /**
	     * Sort the patterns by length so that the same depth patterns are processed side by side.
	     * `a/{b,}/{c,}/*` – `['a///*', 'a/b//*', 'a//c/*', 'a/b/c/*']`
	     */
	    patterns.sort((a, b) => a.length - b.length);
	    /**
	     * Micromatch can return an empty string in the case of patterns like `{a,}`.
	     */
	    return patterns.filter((pattern) => pattern !== '');
	}
	pattern.expandBraceExpansion = expandBraceExpansion;
	function getPatternParts(pattern, options) {
	    let { parts } = micromatch.scan(pattern, Object.assign(Object.assign({}, options), { parts: true }));
	    /**
	     * The scan method returns an empty array in some cases.
	     * See micromatch/picomatch#58 for more details.
	     */
	    if (parts.length === 0) {
	        parts = [pattern];
	    }
	    /**
	     * The scan method does not return an empty part for the pattern with a forward slash.
	     * This is another part of micromatch/picomatch#58.
	     */
	    if (parts[0].startsWith('/')) {
	        parts[0] = parts[0].slice(1);
	        parts.unshift('');
	    }
	    return parts;
	}
	pattern.getPatternParts = getPatternParts;
	function makeRe(pattern, options) {
	    return micromatch.makeRe(pattern, options);
	}
	pattern.makeRe = makeRe;
	function convertPatternsToRe(patterns, options) {
	    return patterns.map((pattern) => makeRe(pattern, options));
	}
	pattern.convertPatternsToRe = convertPatternsToRe;
	function matchAny(entry, patternsRe) {
	    return patternsRe.some((patternRe) => patternRe.test(entry));
	}
	pattern.matchAny = matchAny;
	/**
	 * This package only works with forward slashes as a path separator.
	 * Because of this, we cannot use the standard `path.normalize` method, because on Windows platform it will use of backslashes.
	 */
	function removeDuplicateSlashes(pattern) {
	    return pattern.replace(DOUBLE_SLASH_RE, '/');
	}
	pattern.removeDuplicateSlashes = removeDuplicateSlashes;
	function partitionAbsoluteAndRelative(patterns) {
	    const absolute = [];
	    const relative = [];
	    for (const pattern of patterns) {
	        if (isAbsolute(pattern)) {
	            absolute.push(pattern);
	        }
	        else {
	            relative.push(pattern);
	        }
	    }
	    return [absolute, relative];
	}
	pattern.partitionAbsoluteAndRelative = partitionAbsoluteAndRelative;
	function isAbsolute(pattern) {
	    return path.isAbsolute(pattern);
	}
	pattern.isAbsolute = isAbsolute;
	return pattern;
}

var stream$3 = {};

var merge2_1;
var hasRequiredMerge2;

function requireMerge2 () {
	if (hasRequiredMerge2) return merge2_1;
	hasRequiredMerge2 = 1;
	/*
	 * merge2
	 * https://github.com/teambition/merge2
	 *
	 * Copyright (c) 2014-2020 Teambition
	 * Licensed under the MIT license.
	 */
	const Stream = require$$0$2;
	const PassThrough = Stream.PassThrough;
	const slice = Array.prototype.slice;

	merge2_1 = merge2;

	function merge2 () {
	  const streamsQueue = [];
	  const args = slice.call(arguments);
	  let merging = false;
	  let options = args[args.length - 1];

	  if (options && !Array.isArray(options) && options.pipe == null) {
	    args.pop();
	  } else {
	    options = {};
	  }

	  const doEnd = options.end !== false;
	  const doPipeError = options.pipeError === true;
	  if (options.objectMode == null) {
	    options.objectMode = true;
	  }
	  if (options.highWaterMark == null) {
	    options.highWaterMark = 64 * 1024;
	  }
	  const mergedStream = PassThrough(options);

	  function addStream () {
	    for (let i = 0, len = arguments.length; i < len; i++) {
	      streamsQueue.push(pauseStreams(arguments[i], options));
	    }
	    mergeStream();
	    return this
	  }

	  function mergeStream () {
	    if (merging) {
	      return
	    }
	    merging = true;

	    let streams = streamsQueue.shift();
	    if (!streams) {
	      process.nextTick(endStream);
	      return
	    }
	    if (!Array.isArray(streams)) {
	      streams = [streams];
	    }

	    let pipesCount = streams.length + 1;

	    function next () {
	      if (--pipesCount > 0) {
	        return
	      }
	      merging = false;
	      mergeStream();
	    }

	    function pipe (stream) {
	      function onend () {
	        stream.removeListener('merge2UnpipeEnd', onend);
	        stream.removeListener('end', onend);
	        if (doPipeError) {
	          stream.removeListener('error', onerror);
	        }
	        next();
	      }
	      function onerror (err) {
	        mergedStream.emit('error', err);
	      }
	      // skip ended stream
	      if (stream._readableState.endEmitted) {
	        return next()
	      }

	      stream.on('merge2UnpipeEnd', onend);
	      stream.on('end', onend);

	      if (doPipeError) {
	        stream.on('error', onerror);
	      }

	      stream.pipe(mergedStream, { end: false });
	      // compatible for old stream
	      stream.resume();
	    }

	    for (let i = 0; i < streams.length; i++) {
	      pipe(streams[i]);
	    }

	    next();
	  }

	  function endStream () {
	    merging = false;
	    // emit 'queueDrain' when all streams merged.
	    mergedStream.emit('queueDrain');
	    if (doEnd) {
	      mergedStream.end();
	    }
	  }

	  mergedStream.setMaxListeners(0);
	  mergedStream.add = addStream;
	  mergedStream.on('unpipe', function (stream) {
	    stream.emit('merge2UnpipeEnd');
	  });

	  if (args.length) {
	    addStream.apply(null, args);
	  }
	  return mergedStream
	}

	// check and pause streams for pipe.
	function pauseStreams (streams, options) {
	  if (!Array.isArray(streams)) {
	    // Backwards-compat with old-style streams
	    if (!streams._readableState && streams.pipe) {
	      streams = streams.pipe(PassThrough(options));
	    }
	    if (!streams._readableState || !streams.pause || !streams.pipe) {
	      throw new Error('Only readable stream can be merged.')
	    }
	    streams.pause();
	  } else {
	    for (let i = 0, len = streams.length; i < len; i++) {
	      streams[i] = pauseStreams(streams[i], options);
	    }
	  }
	  return streams
	}
	return merge2_1;
}

var hasRequiredStream$3;

function requireStream$3 () {
	if (hasRequiredStream$3) return stream$3;
	hasRequiredStream$3 = 1;
	Object.defineProperty(stream$3, "__esModule", { value: true });
	stream$3.merge = void 0;
	const merge2 = requireMerge2();
	function merge(streams) {
	    const mergedStream = merge2(streams);
	    streams.forEach((stream) => {
	        stream.once('error', (error) => mergedStream.emit('error', error));
	    });
	    mergedStream.once('close', () => propagateCloseEventToSources(streams));
	    mergedStream.once('end', () => propagateCloseEventToSources(streams));
	    return mergedStream;
	}
	stream$3.merge = merge;
	function propagateCloseEventToSources(streams) {
	    streams.forEach((stream) => stream.emit('close'));
	}
	return stream$3;
}

var string = {};

var hasRequiredString;

function requireString () {
	if (hasRequiredString) return string;
	hasRequiredString = 1;
	Object.defineProperty(string, "__esModule", { value: true });
	string.isEmpty = string.isString = void 0;
	function isString(input) {
	    return typeof input === 'string';
	}
	string.isString = isString;
	function isEmpty(input) {
	    return input === '';
	}
	string.isEmpty = isEmpty;
	return string;
}

var hasRequiredUtils$1;

function requireUtils$1 () {
	if (hasRequiredUtils$1) return utils$3;
	hasRequiredUtils$1 = 1;
	Object.defineProperty(utils$3, "__esModule", { value: true });
	utils$3.string = utils$3.stream = utils$3.pattern = utils$3.path = utils$3.fs = utils$3.errno = utils$3.array = void 0;
	const array = requireArray();
	utils$3.array = array;
	const errno = requireErrno();
	utils$3.errno = errno;
	const fs = requireFs$3();
	utils$3.fs = fs;
	const path = requirePath();
	utils$3.path = path;
	const pattern = requirePattern();
	utils$3.pattern = pattern;
	const stream = requireStream$3();
	utils$3.stream = stream;
	const string = requireString();
	utils$3.string = string;
	return utils$3;
}

var hasRequiredTasks;

function requireTasks () {
	if (hasRequiredTasks) return tasks;
	hasRequiredTasks = 1;
	Object.defineProperty(tasks, "__esModule", { value: true });
	tasks.convertPatternGroupToTask = tasks.convertPatternGroupsToTasks = tasks.groupPatternsByBaseDirectory = tasks.getNegativePatternsAsPositive = tasks.getPositivePatterns = tasks.convertPatternsToTasks = tasks.generate = void 0;
	const utils = requireUtils$1();
	function generate(input, settings) {
	    const patterns = processPatterns(input, settings);
	    const ignore = processPatterns(settings.ignore, settings);
	    const positivePatterns = getPositivePatterns(patterns);
	    const negativePatterns = getNegativePatternsAsPositive(patterns, ignore);
	    const staticPatterns = positivePatterns.filter((pattern) => utils.pattern.isStaticPattern(pattern, settings));
	    const dynamicPatterns = positivePatterns.filter((pattern) => utils.pattern.isDynamicPattern(pattern, settings));
	    const staticTasks = convertPatternsToTasks(staticPatterns, negativePatterns, /* dynamic */ false);
	    const dynamicTasks = convertPatternsToTasks(dynamicPatterns, negativePatterns, /* dynamic */ true);
	    return staticTasks.concat(dynamicTasks);
	}
	tasks.generate = generate;
	function processPatterns(input, settings) {
	    let patterns = input;
	    /**
	     * The original pattern like `{,*,**,a/*}` can lead to problems checking the depth when matching entry
	     * and some problems with the micromatch package (see fast-glob issues: #365, #394).
	     *
	     * To solve this problem, we expand all patterns containing brace expansion. This can lead to a slight slowdown
	     * in matching in the case of a large set of patterns after expansion.
	     */
	    if (settings.braceExpansion) {
	        patterns = utils.pattern.expandPatternsWithBraceExpansion(patterns);
	    }
	    /**
	     * If the `baseNameMatch` option is enabled, we must add globstar to patterns, so that they can be used
	     * at any nesting level.
	     *
	     * We do this here, because otherwise we have to complicate the filtering logic. For example, we need to change
	     * the pattern in the filter before creating a regular expression. There is no need to change the patterns
	     * in the application. Only on the input.
	     */
	    if (settings.baseNameMatch) {
	        patterns = patterns.map((pattern) => pattern.includes('/') ? pattern : `**/${pattern}`);
	    }
	    /**
	     * This method also removes duplicate slashes that may have been in the pattern or formed as a result of expansion.
	     */
	    return patterns.map((pattern) => utils.pattern.removeDuplicateSlashes(pattern));
	}
	/**
	 * Returns tasks grouped by basic pattern directories.
	 *
	 * Patterns that can be found inside (`./`) and outside (`../`) the current directory are handled separately.
	 * This is necessary because directory traversal starts at the base directory and goes deeper.
	 */
	function convertPatternsToTasks(positive, negative, dynamic) {
	    const tasks = [];
	    const patternsOutsideCurrentDirectory = utils.pattern.getPatternsOutsideCurrentDirectory(positive);
	    const patternsInsideCurrentDirectory = utils.pattern.getPatternsInsideCurrentDirectory(positive);
	    const outsideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsOutsideCurrentDirectory);
	    const insideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsInsideCurrentDirectory);
	    tasks.push(...convertPatternGroupsToTasks(outsideCurrentDirectoryGroup, negative, dynamic));
	    /*
	     * For the sake of reducing future accesses to the file system, we merge all tasks within the current directory
	     * into a global task, if at least one pattern refers to the root (`.`). In this case, the global task covers the rest.
	     */
	    if ('.' in insideCurrentDirectoryGroup) {
	        tasks.push(convertPatternGroupToTask('.', patternsInsideCurrentDirectory, negative, dynamic));
	    }
	    else {
	        tasks.push(...convertPatternGroupsToTasks(insideCurrentDirectoryGroup, negative, dynamic));
	    }
	    return tasks;
	}
	tasks.convertPatternsToTasks = convertPatternsToTasks;
	function getPositivePatterns(patterns) {
	    return utils.pattern.getPositivePatterns(patterns);
	}
	tasks.getPositivePatterns = getPositivePatterns;
	function getNegativePatternsAsPositive(patterns, ignore) {
	    const negative = utils.pattern.getNegativePatterns(patterns).concat(ignore);
	    const positive = negative.map(utils.pattern.convertToPositivePattern);
	    return positive;
	}
	tasks.getNegativePatternsAsPositive = getNegativePatternsAsPositive;
	function groupPatternsByBaseDirectory(patterns) {
	    const group = {};
	    return patterns.reduce((collection, pattern) => {
	        const base = utils.pattern.getBaseDirectory(pattern);
	        if (base in collection) {
	            collection[base].push(pattern);
	        }
	        else {
	            collection[base] = [pattern];
	        }
	        return collection;
	    }, group);
	}
	tasks.groupPatternsByBaseDirectory = groupPatternsByBaseDirectory;
	function convertPatternGroupsToTasks(positive, negative, dynamic) {
	    return Object.keys(positive).map((base) => {
	        return convertPatternGroupToTask(base, positive[base], negative, dynamic);
	    });
	}
	tasks.convertPatternGroupsToTasks = convertPatternGroupsToTasks;
	function convertPatternGroupToTask(base, positive, negative, dynamic) {
	    return {
	        dynamic,
	        positive,
	        negative,
	        base,
	        patterns: [].concat(positive, negative.map(utils.pattern.convertToNegativePattern))
	    };
	}
	tasks.convertPatternGroupToTask = convertPatternGroupToTask;
	return tasks;
}

var async$5 = {};

var async$4 = {};

var out$3 = {};

var async$3 = {};

var async$2 = {};

var out$2 = {};

var async$1 = {};

var out$1 = {};

var async = {};

var hasRequiredAsync$5;

function requireAsync$5 () {
	if (hasRequiredAsync$5) return async;
	hasRequiredAsync$5 = 1;
	Object.defineProperty(async, "__esModule", { value: true });
	async.read = void 0;
	function read(path, settings, callback) {
	    settings.fs.lstat(path, (lstatError, lstat) => {
	        if (lstatError !== null) {
	            callFailureCallback(callback, lstatError);
	            return;
	        }
	        if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
	            callSuccessCallback(callback, lstat);
	            return;
	        }
	        settings.fs.stat(path, (statError, stat) => {
	            if (statError !== null) {
	                if (settings.throwErrorOnBrokenSymbolicLink) {
	                    callFailureCallback(callback, statError);
	                    return;
	                }
	                callSuccessCallback(callback, lstat);
	                return;
	            }
	            if (settings.markSymbolicLink) {
	                stat.isSymbolicLink = () => true;
	            }
	            callSuccessCallback(callback, stat);
	        });
	    });
	}
	async.read = read;
	function callFailureCallback(callback, error) {
	    callback(error);
	}
	function callSuccessCallback(callback, result) {
	    callback(null, result);
	}
	return async;
}

var sync$5 = {};

var hasRequiredSync$5;

function requireSync$5 () {
	if (hasRequiredSync$5) return sync$5;
	hasRequiredSync$5 = 1;
	Object.defineProperty(sync$5, "__esModule", { value: true });
	sync$5.read = void 0;
	function read(path, settings) {
	    const lstat = settings.fs.lstatSync(path);
	    if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
	        return lstat;
	    }
	    try {
	        const stat = settings.fs.statSync(path);
	        if (settings.markSymbolicLink) {
	            stat.isSymbolicLink = () => true;
	        }
	        return stat;
	    }
	    catch (error) {
	        if (!settings.throwErrorOnBrokenSymbolicLink) {
	            return lstat;
	        }
	        throw error;
	    }
	}
	sync$5.read = read;
	return sync$5;
}

var settings$3 = {};

var fs$2 = {};

var hasRequiredFs$2;

function requireFs$2 () {
	if (hasRequiredFs$2) return fs$2;
	hasRequiredFs$2 = 1;
	(function (exports$1) {
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.createFileSystemAdapter = exports$1.FILE_SYSTEM_ADAPTER = void 0;
		const fs = fs$4;
		exports$1.FILE_SYSTEM_ADAPTER = {
		    lstat: fs.lstat,
		    stat: fs.stat,
		    lstatSync: fs.lstatSync,
		    statSync: fs.statSync
		};
		function createFileSystemAdapter(fsMethods) {
		    if (fsMethods === undefined) {
		        return exports$1.FILE_SYSTEM_ADAPTER;
		    }
		    return Object.assign(Object.assign({}, exports$1.FILE_SYSTEM_ADAPTER), fsMethods);
		}
		exports$1.createFileSystemAdapter = createFileSystemAdapter; 
	} (fs$2));
	return fs$2;
}

var hasRequiredSettings$3;

function requireSettings$3 () {
	if (hasRequiredSettings$3) return settings$3;
	hasRequiredSettings$3 = 1;
	Object.defineProperty(settings$3, "__esModule", { value: true });
	const fs = requireFs$2();
	class Settings {
	    constructor(_options = {}) {
	        this._options = _options;
	        this.followSymbolicLink = this._getValue(this._options.followSymbolicLink, true);
	        this.fs = fs.createFileSystemAdapter(this._options.fs);
	        this.markSymbolicLink = this._getValue(this._options.markSymbolicLink, false);
	        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
	    }
	    _getValue(option, value) {
	        return option !== null && option !== void 0 ? option : value;
	    }
	}
	settings$3.default = Settings;
	return settings$3;
}

var hasRequiredOut$3;

function requireOut$3 () {
	if (hasRequiredOut$3) return out$1;
	hasRequiredOut$3 = 1;
	Object.defineProperty(out$1, "__esModule", { value: true });
	out$1.statSync = out$1.stat = out$1.Settings = void 0;
	const async = requireAsync$5();
	const sync = requireSync$5();
	const settings_1 = requireSettings$3();
	out$1.Settings = settings_1.default;
	function stat(path, optionsOrSettingsOrCallback, callback) {
	    if (typeof optionsOrSettingsOrCallback === 'function') {
	        async.read(path, getSettings(), optionsOrSettingsOrCallback);
	        return;
	    }
	    async.read(path, getSettings(optionsOrSettingsOrCallback), callback);
	}
	out$1.stat = stat;
	function statSync(path, optionsOrSettings) {
	    const settings = getSettings(optionsOrSettings);
	    return sync.read(path, settings);
	}
	out$1.statSync = statSync;
	function getSettings(settingsOrOptions = {}) {
	    if (settingsOrOptions instanceof settings_1.default) {
	        return settingsOrOptions;
	    }
	    return new settings_1.default(settingsOrOptions);
	}
	return out$1;
}

/*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */

var queueMicrotask_1;
var hasRequiredQueueMicrotask;

function requireQueueMicrotask () {
	if (hasRequiredQueueMicrotask) return queueMicrotask_1;
	hasRequiredQueueMicrotask = 1;
	let promise;

	queueMicrotask_1 = typeof queueMicrotask === 'function'
	  ? queueMicrotask.bind(typeof window !== 'undefined' ? window : commonjsGlobal)
	  // reuse resolved promise, and allocate it lazily
	  : cb => (promise || (promise = Promise.resolve()))
	    .then(cb)
	    .catch(err => setTimeout(() => { throw err }, 0));
	return queueMicrotask_1;
}

/*! run-parallel. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */

var runParallel_1;
var hasRequiredRunParallel;

function requireRunParallel () {
	if (hasRequiredRunParallel) return runParallel_1;
	hasRequiredRunParallel = 1;
	runParallel_1 = runParallel;

	const queueMicrotask = requireQueueMicrotask();

	function runParallel (tasks, cb) {
	  let results, pending, keys;
	  let isSync = true;

	  if (Array.isArray(tasks)) {
	    results = [];
	    pending = tasks.length;
	  } else {
	    keys = Object.keys(tasks);
	    results = {};
	    pending = keys.length;
	  }

	  function done (err) {
	    function end () {
	      if (cb) cb(err, results);
	      cb = null;
	    }
	    if (isSync) queueMicrotask(end);
	    else end();
	  }

	  function each (i, err, result) {
	    results[i] = result;
	    if (--pending === 0 || err) {
	      done(err);
	    }
	  }

	  if (!pending) {
	    // empty
	    done(null);
	  } else if (keys) {
	    // object
	    keys.forEach(function (key) {
	      tasks[key](function (err, result) { each(key, err, result); });
	    });
	  } else {
	    // array
	    tasks.forEach(function (task, i) {
	      task(function (err, result) { each(i, err, result); });
	    });
	  }

	  isSync = false;
	}
	return runParallel_1;
}

var constants = {};

var hasRequiredConstants;

function requireConstants () {
	if (hasRequiredConstants) return constants;
	hasRequiredConstants = 1;
	Object.defineProperty(constants, "__esModule", { value: true });
	constants.IS_SUPPORT_READDIR_WITH_FILE_TYPES = void 0;
	const NODE_PROCESS_VERSION_PARTS = process.versions.node.split('.');
	if (NODE_PROCESS_VERSION_PARTS[0] === undefined || NODE_PROCESS_VERSION_PARTS[1] === undefined) {
	    throw new Error(`Unexpected behavior. The 'process.versions.node' variable has invalid value: ${process.versions.node}`);
	}
	const MAJOR_VERSION = Number.parseInt(NODE_PROCESS_VERSION_PARTS[0], 10);
	const MINOR_VERSION = Number.parseInt(NODE_PROCESS_VERSION_PARTS[1], 10);
	const SUPPORTED_MAJOR_VERSION = 10;
	const SUPPORTED_MINOR_VERSION = 10;
	const IS_MATCHED_BY_MAJOR = MAJOR_VERSION > SUPPORTED_MAJOR_VERSION;
	const IS_MATCHED_BY_MAJOR_AND_MINOR = MAJOR_VERSION === SUPPORTED_MAJOR_VERSION && MINOR_VERSION >= SUPPORTED_MINOR_VERSION;
	/**
	 * IS `true` for Node.js 10.10 and greater.
	 */
	constants.IS_SUPPORT_READDIR_WITH_FILE_TYPES = IS_MATCHED_BY_MAJOR || IS_MATCHED_BY_MAJOR_AND_MINOR;
	return constants;
}

var utils = {};

var fs$1 = {};

var hasRequiredFs$1;

function requireFs$1 () {
	if (hasRequiredFs$1) return fs$1;
	hasRequiredFs$1 = 1;
	Object.defineProperty(fs$1, "__esModule", { value: true });
	fs$1.createDirentFromStats = void 0;
	class DirentFromStats {
	    constructor(name, stats) {
	        this.name = name;
	        this.isBlockDevice = stats.isBlockDevice.bind(stats);
	        this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
	        this.isDirectory = stats.isDirectory.bind(stats);
	        this.isFIFO = stats.isFIFO.bind(stats);
	        this.isFile = stats.isFile.bind(stats);
	        this.isSocket = stats.isSocket.bind(stats);
	        this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
	    }
	}
	function createDirentFromStats(name, stats) {
	    return new DirentFromStats(name, stats);
	}
	fs$1.createDirentFromStats = createDirentFromStats;
	return fs$1;
}

var hasRequiredUtils;

function requireUtils () {
	if (hasRequiredUtils) return utils;
	hasRequiredUtils = 1;
	Object.defineProperty(utils, "__esModule", { value: true });
	utils.fs = void 0;
	const fs = requireFs$1();
	utils.fs = fs;
	return utils;
}

var common$1 = {};

var hasRequiredCommon$1;

function requireCommon$1 () {
	if (hasRequiredCommon$1) return common$1;
	hasRequiredCommon$1 = 1;
	Object.defineProperty(common$1, "__esModule", { value: true });
	common$1.joinPathSegments = void 0;
	function joinPathSegments(a, b, separator) {
	    /**
	     * The correct handling of cases when the first segment is a root (`/`, `C:/`) or UNC path (`//?/C:/`).
	     */
	    if (a.endsWith(separator)) {
	        return a + b;
	    }
	    return a + separator + b;
	}
	common$1.joinPathSegments = joinPathSegments;
	return common$1;
}

var hasRequiredAsync$4;

function requireAsync$4 () {
	if (hasRequiredAsync$4) return async$1;
	hasRequiredAsync$4 = 1;
	Object.defineProperty(async$1, "__esModule", { value: true });
	async$1.readdir = async$1.readdirWithFileTypes = async$1.read = void 0;
	const fsStat = requireOut$3();
	const rpl = requireRunParallel();
	const constants_1 = requireConstants();
	const utils = requireUtils();
	const common = requireCommon$1();
	function read(directory, settings, callback) {
	    if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
	        readdirWithFileTypes(directory, settings, callback);
	        return;
	    }
	    readdir(directory, settings, callback);
	}
	async$1.read = read;
	function readdirWithFileTypes(directory, settings, callback) {
	    settings.fs.readdir(directory, { withFileTypes: true }, (readdirError, dirents) => {
	        if (readdirError !== null) {
	            callFailureCallback(callback, readdirError);
	            return;
	        }
	        const entries = dirents.map((dirent) => ({
	            dirent,
	            name: dirent.name,
	            path: common.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator)
	        }));
	        if (!settings.followSymbolicLinks) {
	            callSuccessCallback(callback, entries);
	            return;
	        }
	        const tasks = entries.map((entry) => makeRplTaskEntry(entry, settings));
	        rpl(tasks, (rplError, rplEntries) => {
	            if (rplError !== null) {
	                callFailureCallback(callback, rplError);
	                return;
	            }
	            callSuccessCallback(callback, rplEntries);
	        });
	    });
	}
	async$1.readdirWithFileTypes = readdirWithFileTypes;
	function makeRplTaskEntry(entry, settings) {
	    return (done) => {
	        if (!entry.dirent.isSymbolicLink()) {
	            done(null, entry);
	            return;
	        }
	        settings.fs.stat(entry.path, (statError, stats) => {
	            if (statError !== null) {
	                if (settings.throwErrorOnBrokenSymbolicLink) {
	                    done(statError);
	                    return;
	                }
	                done(null, entry);
	                return;
	            }
	            entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
	            done(null, entry);
	        });
	    };
	}
	function readdir(directory, settings, callback) {
	    settings.fs.readdir(directory, (readdirError, names) => {
	        if (readdirError !== null) {
	            callFailureCallback(callback, readdirError);
	            return;
	        }
	        const tasks = names.map((name) => {
	            const path = common.joinPathSegments(directory, name, settings.pathSegmentSeparator);
	            return (done) => {
	                fsStat.stat(path, settings.fsStatSettings, (error, stats) => {
	                    if (error !== null) {
	                        done(error);
	                        return;
	                    }
	                    const entry = {
	                        name,
	                        path,
	                        dirent: utils.fs.createDirentFromStats(name, stats)
	                    };
	                    if (settings.stats) {
	                        entry.stats = stats;
	                    }
	                    done(null, entry);
	                });
	            };
	        });
	        rpl(tasks, (rplError, entries) => {
	            if (rplError !== null) {
	                callFailureCallback(callback, rplError);
	                return;
	            }
	            callSuccessCallback(callback, entries);
	        });
	    });
	}
	async$1.readdir = readdir;
	function callFailureCallback(callback, error) {
	    callback(error);
	}
	function callSuccessCallback(callback, result) {
	    callback(null, result);
	}
	return async$1;
}

var sync$4 = {};

var hasRequiredSync$4;

function requireSync$4 () {
	if (hasRequiredSync$4) return sync$4;
	hasRequiredSync$4 = 1;
	Object.defineProperty(sync$4, "__esModule", { value: true });
	sync$4.readdir = sync$4.readdirWithFileTypes = sync$4.read = void 0;
	const fsStat = requireOut$3();
	const constants_1 = requireConstants();
	const utils = requireUtils();
	const common = requireCommon$1();
	function read(directory, settings) {
	    if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
	        return readdirWithFileTypes(directory, settings);
	    }
	    return readdir(directory, settings);
	}
	sync$4.read = read;
	function readdirWithFileTypes(directory, settings) {
	    const dirents = settings.fs.readdirSync(directory, { withFileTypes: true });
	    return dirents.map((dirent) => {
	        const entry = {
	            dirent,
	            name: dirent.name,
	            path: common.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator)
	        };
	        if (entry.dirent.isSymbolicLink() && settings.followSymbolicLinks) {
	            try {
	                const stats = settings.fs.statSync(entry.path);
	                entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
	            }
	            catch (error) {
	                if (settings.throwErrorOnBrokenSymbolicLink) {
	                    throw error;
	                }
	            }
	        }
	        return entry;
	    });
	}
	sync$4.readdirWithFileTypes = readdirWithFileTypes;
	function readdir(directory, settings) {
	    const names = settings.fs.readdirSync(directory);
	    return names.map((name) => {
	        const entryPath = common.joinPathSegments(directory, name, settings.pathSegmentSeparator);
	        const stats = fsStat.statSync(entryPath, settings.fsStatSettings);
	        const entry = {
	            name,
	            path: entryPath,
	            dirent: utils.fs.createDirentFromStats(name, stats)
	        };
	        if (settings.stats) {
	            entry.stats = stats;
	        }
	        return entry;
	    });
	}
	sync$4.readdir = readdir;
	return sync$4;
}

var settings$2 = {};

var fs = {};

var hasRequiredFs;

function requireFs () {
	if (hasRequiredFs) return fs;
	hasRequiredFs = 1;
	(function (exports$1) {
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.createFileSystemAdapter = exports$1.FILE_SYSTEM_ADAPTER = void 0;
		const fs = fs$4;
		exports$1.FILE_SYSTEM_ADAPTER = {
		    lstat: fs.lstat,
		    stat: fs.stat,
		    lstatSync: fs.lstatSync,
		    statSync: fs.statSync,
		    readdir: fs.readdir,
		    readdirSync: fs.readdirSync
		};
		function createFileSystemAdapter(fsMethods) {
		    if (fsMethods === undefined) {
		        return exports$1.FILE_SYSTEM_ADAPTER;
		    }
		    return Object.assign(Object.assign({}, exports$1.FILE_SYSTEM_ADAPTER), fsMethods);
		}
		exports$1.createFileSystemAdapter = createFileSystemAdapter; 
	} (fs));
	return fs;
}

var hasRequiredSettings$2;

function requireSettings$2 () {
	if (hasRequiredSettings$2) return settings$2;
	hasRequiredSettings$2 = 1;
	Object.defineProperty(settings$2, "__esModule", { value: true });
	const path = path$1;
	const fsStat = requireOut$3();
	const fs = requireFs();
	class Settings {
	    constructor(_options = {}) {
	        this._options = _options;
	        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, false);
	        this.fs = fs.createFileSystemAdapter(this._options.fs);
	        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path.sep);
	        this.stats = this._getValue(this._options.stats, false);
	        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
	        this.fsStatSettings = new fsStat.Settings({
	            followSymbolicLink: this.followSymbolicLinks,
	            fs: this.fs,
	            throwErrorOnBrokenSymbolicLink: this.throwErrorOnBrokenSymbolicLink
	        });
	    }
	    _getValue(option, value) {
	        return option !== null && option !== void 0 ? option : value;
	    }
	}
	settings$2.default = Settings;
	return settings$2;
}

var hasRequiredOut$2;

function requireOut$2 () {
	if (hasRequiredOut$2) return out$2;
	hasRequiredOut$2 = 1;
	Object.defineProperty(out$2, "__esModule", { value: true });
	out$2.Settings = out$2.scandirSync = out$2.scandir = void 0;
	const async = requireAsync$4();
	const sync = requireSync$4();
	const settings_1 = requireSettings$2();
	out$2.Settings = settings_1.default;
	function scandir(path, optionsOrSettingsOrCallback, callback) {
	    if (typeof optionsOrSettingsOrCallback === 'function') {
	        async.read(path, getSettings(), optionsOrSettingsOrCallback);
	        return;
	    }
	    async.read(path, getSettings(optionsOrSettingsOrCallback), callback);
	}
	out$2.scandir = scandir;
	function scandirSync(path, optionsOrSettings) {
	    const settings = getSettings(optionsOrSettings);
	    return sync.read(path, settings);
	}
	out$2.scandirSync = scandirSync;
	function getSettings(settingsOrOptions = {}) {
	    if (settingsOrOptions instanceof settings_1.default) {
	        return settingsOrOptions;
	    }
	    return new settings_1.default(settingsOrOptions);
	}
	return out$2;
}

var queue = {exports: {}};

var reusify_1;
var hasRequiredReusify;

function requireReusify () {
	if (hasRequiredReusify) return reusify_1;
	hasRequiredReusify = 1;

	function reusify (Constructor) {
	  var head = new Constructor();
	  var tail = head;

	  function get () {
	    var current = head;

	    if (current.next) {
	      head = current.next;
	    } else {
	      head = new Constructor();
	      tail = head;
	    }

	    current.next = null;

	    return current
	  }

	  function release (obj) {
	    tail.next = obj;
	    tail = obj;
	  }

	  return {
	    get: get,
	    release: release
	  }
	}

	reusify_1 = reusify;
	return reusify_1;
}

var hasRequiredQueue;

function requireQueue () {
	if (hasRequiredQueue) return queue.exports;
	hasRequiredQueue = 1;

	/* eslint-disable no-var */

	var reusify = requireReusify();

	function fastqueue (context, worker, _concurrency) {
	  if (typeof context === 'function') {
	    _concurrency = worker;
	    worker = context;
	    context = null;
	  }

	  if (!(_concurrency >= 1)) {
	    throw new Error('fastqueue concurrency must be equal to or greater than 1')
	  }

	  var cache = reusify(Task);
	  var queueHead = null;
	  var queueTail = null;
	  var _running = 0;
	  var errorHandler = null;

	  var self = {
	    push: push,
	    drain: noop,
	    saturated: noop,
	    pause: pause,
	    paused: false,

	    get concurrency () {
	      return _concurrency
	    },
	    set concurrency (value) {
	      if (!(value >= 1)) {
	        throw new Error('fastqueue concurrency must be equal to or greater than 1')
	      }
	      _concurrency = value;

	      if (self.paused) return
	      for (; queueHead && _running < _concurrency;) {
	        _running++;
	        release();
	      }
	    },

	    running: running,
	    resume: resume,
	    idle: idle,
	    length: length,
	    getQueue: getQueue,
	    unshift: unshift,
	    empty: noop,
	    kill: kill,
	    killAndDrain: killAndDrain,
	    error: error
	  };

	  return self

	  function running () {
	    return _running
	  }

	  function pause () {
	    self.paused = true;
	  }

	  function length () {
	    var current = queueHead;
	    var counter = 0;

	    while (current) {
	      current = current.next;
	      counter++;
	    }

	    return counter
	  }

	  function getQueue () {
	    var current = queueHead;
	    var tasks = [];

	    while (current) {
	      tasks.push(current.value);
	      current = current.next;
	    }

	    return tasks
	  }

	  function resume () {
	    if (!self.paused) return
	    self.paused = false;
	    if (queueHead === null) {
	      _running++;
	      release();
	      return
	    }
	    for (; queueHead && _running < _concurrency;) {
	      _running++;
	      release();
	    }
	  }

	  function idle () {
	    return _running === 0 && self.length() === 0
	  }

	  function push (value, done) {
	    var current = cache.get();

	    current.context = context;
	    current.release = release;
	    current.value = value;
	    current.callback = done || noop;
	    current.errorHandler = errorHandler;

	    if (_running >= _concurrency || self.paused) {
	      if (queueTail) {
	        queueTail.next = current;
	        queueTail = current;
	      } else {
	        queueHead = current;
	        queueTail = current;
	        self.saturated();
	      }
	    } else {
	      _running++;
	      worker.call(context, current.value, current.worked);
	    }
	  }

	  function unshift (value, done) {
	    var current = cache.get();

	    current.context = context;
	    current.release = release;
	    current.value = value;
	    current.callback = done || noop;
	    current.errorHandler = errorHandler;

	    if (_running >= _concurrency || self.paused) {
	      if (queueHead) {
	        current.next = queueHead;
	        queueHead = current;
	      } else {
	        queueHead = current;
	        queueTail = current;
	        self.saturated();
	      }
	    } else {
	      _running++;
	      worker.call(context, current.value, current.worked);
	    }
	  }

	  function release (holder) {
	    if (holder) {
	      cache.release(holder);
	    }
	    var next = queueHead;
	    if (next && _running <= _concurrency) {
	      if (!self.paused) {
	        if (queueTail === queueHead) {
	          queueTail = null;
	        }
	        queueHead = next.next;
	        next.next = null;
	        worker.call(context, next.value, next.worked);
	        if (queueTail === null) {
	          self.empty();
	        }
	      } else {
	        _running--;
	      }
	    } else if (--_running === 0) {
	      self.drain();
	    }
	  }

	  function kill () {
	    queueHead = null;
	    queueTail = null;
	    self.drain = noop;
	  }

	  function killAndDrain () {
	    queueHead = null;
	    queueTail = null;
	    self.drain();
	    self.drain = noop;
	  }

	  function error (handler) {
	    errorHandler = handler;
	  }
	}

	function noop () {}

	function Task () {
	  this.value = null;
	  this.callback = noop;
	  this.next = null;
	  this.release = noop;
	  this.context = null;
	  this.errorHandler = null;

	  var self = this;

	  this.worked = function worked (err, result) {
	    var callback = self.callback;
	    var errorHandler = self.errorHandler;
	    var val = self.value;
	    self.value = null;
	    self.callback = noop;
	    if (self.errorHandler) {
	      errorHandler(err, val);
	    }
	    callback.call(self.context, err, result);
	    self.release(self);
	  };
	}

	function queueAsPromised (context, worker, _concurrency) {
	  if (typeof context === 'function') {
	    _concurrency = worker;
	    worker = context;
	    context = null;
	  }

	  function asyncWrapper (arg, cb) {
	    worker.call(this, arg)
	      .then(function (res) {
	        cb(null, res);
	      }, cb);
	  }

	  var queue = fastqueue(context, asyncWrapper, _concurrency);

	  var pushCb = queue.push;
	  var unshiftCb = queue.unshift;

	  queue.push = push;
	  queue.unshift = unshift;
	  queue.drained = drained;

	  return queue

	  function push (value) {
	    var p = new Promise(function (resolve, reject) {
	      pushCb(value, function (err, result) {
	        if (err) {
	          reject(err);
	          return
	        }
	        resolve(result);
	      });
	    });

	    // Let's fork the promise chain to
	    // make the error bubble up to the user but
	    // not lead to a unhandledRejection
	    p.catch(noop);

	    return p
	  }

	  function unshift (value) {
	    var p = new Promise(function (resolve, reject) {
	      unshiftCb(value, function (err, result) {
	        if (err) {
	          reject(err);
	          return
	        }
	        resolve(result);
	      });
	    });

	    // Let's fork the promise chain to
	    // make the error bubble up to the user but
	    // not lead to a unhandledRejection
	    p.catch(noop);

	    return p
	  }

	  function drained () {
	    var p = new Promise(function (resolve) {
	      process.nextTick(function () {
	        if (queue.idle()) {
	          resolve();
	        } else {
	          var previousDrain = queue.drain;
	          queue.drain = function () {
	            if (typeof previousDrain === 'function') previousDrain();
	            resolve();
	            queue.drain = previousDrain;
	          };
	        }
	      });
	    });

	    return p
	  }
	}

	queue.exports = fastqueue;
	queue.exports.promise = queueAsPromised;
	return queue.exports;
}

var common = {};

var hasRequiredCommon;

function requireCommon () {
	if (hasRequiredCommon) return common;
	hasRequiredCommon = 1;
	Object.defineProperty(common, "__esModule", { value: true });
	common.joinPathSegments = common.replacePathSegmentSeparator = common.isAppliedFilter = common.isFatalError = void 0;
	function isFatalError(settings, error) {
	    if (settings.errorFilter === null) {
	        return true;
	    }
	    return !settings.errorFilter(error);
	}
	common.isFatalError = isFatalError;
	function isAppliedFilter(filter, value) {
	    return filter === null || filter(value);
	}
	common.isAppliedFilter = isAppliedFilter;
	function replacePathSegmentSeparator(filepath, separator) {
	    return filepath.split(/[/\\]/).join(separator);
	}
	common.replacePathSegmentSeparator = replacePathSegmentSeparator;
	function joinPathSegments(a, b, separator) {
	    if (a === '') {
	        return b;
	    }
	    /**
	     * The correct handling of cases when the first segment is a root (`/`, `C:/`) or UNC path (`//?/C:/`).
	     */
	    if (a.endsWith(separator)) {
	        return a + b;
	    }
	    return a + separator + b;
	}
	common.joinPathSegments = joinPathSegments;
	return common;
}

var reader$1 = {};

var hasRequiredReader$1;

function requireReader$1 () {
	if (hasRequiredReader$1) return reader$1;
	hasRequiredReader$1 = 1;
	Object.defineProperty(reader$1, "__esModule", { value: true });
	const common = requireCommon();
	class Reader {
	    constructor(_root, _settings) {
	        this._root = _root;
	        this._settings = _settings;
	        this._root = common.replacePathSegmentSeparator(_root, _settings.pathSegmentSeparator);
	    }
	}
	reader$1.default = Reader;
	return reader$1;
}

var hasRequiredAsync$3;

function requireAsync$3 () {
	if (hasRequiredAsync$3) return async$2;
	hasRequiredAsync$3 = 1;
	Object.defineProperty(async$2, "__esModule", { value: true });
	const events_1 = require$$0$3;
	const fsScandir = requireOut$2();
	const fastq = requireQueue();
	const common = requireCommon();
	const reader_1 = requireReader$1();
	class AsyncReader extends reader_1.default {
	    constructor(_root, _settings) {
	        super(_root, _settings);
	        this._settings = _settings;
	        this._scandir = fsScandir.scandir;
	        this._emitter = new events_1.EventEmitter();
	        this._queue = fastq(this._worker.bind(this), this._settings.concurrency);
	        this._isFatalError = false;
	        this._isDestroyed = false;
	        this._queue.drain = () => {
	            if (!this._isFatalError) {
	                this._emitter.emit('end');
	            }
	        };
	    }
	    read() {
	        this._isFatalError = false;
	        this._isDestroyed = false;
	        setImmediate(() => {
	            this._pushToQueue(this._root, this._settings.basePath);
	        });
	        return this._emitter;
	    }
	    get isDestroyed() {
	        return this._isDestroyed;
	    }
	    destroy() {
	        if (this._isDestroyed) {
	            throw new Error('The reader is already destroyed');
	        }
	        this._isDestroyed = true;
	        this._queue.killAndDrain();
	    }
	    onEntry(callback) {
	        this._emitter.on('entry', callback);
	    }
	    onError(callback) {
	        this._emitter.once('error', callback);
	    }
	    onEnd(callback) {
	        this._emitter.once('end', callback);
	    }
	    _pushToQueue(directory, base) {
	        const queueItem = { directory, base };
	        this._queue.push(queueItem, (error) => {
	            if (error !== null) {
	                this._handleError(error);
	            }
	        });
	    }
	    _worker(item, done) {
	        this._scandir(item.directory, this._settings.fsScandirSettings, (error, entries) => {
	            if (error !== null) {
	                done(error, undefined);
	                return;
	            }
	            for (const entry of entries) {
	                this._handleEntry(entry, item.base);
	            }
	            done(null, undefined);
	        });
	    }
	    _handleError(error) {
	        if (this._isDestroyed || !common.isFatalError(this._settings, error)) {
	            return;
	        }
	        this._isFatalError = true;
	        this._isDestroyed = true;
	        this._emitter.emit('error', error);
	    }
	    _handleEntry(entry, base) {
	        if (this._isDestroyed || this._isFatalError) {
	            return;
	        }
	        const fullpath = entry.path;
	        if (base !== undefined) {
	            entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
	        }
	        if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
	            this._emitEntry(entry);
	        }
	        if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) {
	            this._pushToQueue(fullpath, base === undefined ? undefined : entry.path);
	        }
	    }
	    _emitEntry(entry) {
	        this._emitter.emit('entry', entry);
	    }
	}
	async$2.default = AsyncReader;
	return async$2;
}

var hasRequiredAsync$2;

function requireAsync$2 () {
	if (hasRequiredAsync$2) return async$3;
	hasRequiredAsync$2 = 1;
	Object.defineProperty(async$3, "__esModule", { value: true });
	const async_1 = requireAsync$3();
	class AsyncProvider {
	    constructor(_root, _settings) {
	        this._root = _root;
	        this._settings = _settings;
	        this._reader = new async_1.default(this._root, this._settings);
	        this._storage = [];
	    }
	    read(callback) {
	        this._reader.onError((error) => {
	            callFailureCallback(callback, error);
	        });
	        this._reader.onEntry((entry) => {
	            this._storage.push(entry);
	        });
	        this._reader.onEnd(() => {
	            callSuccessCallback(callback, this._storage);
	        });
	        this._reader.read();
	    }
	}
	async$3.default = AsyncProvider;
	function callFailureCallback(callback, error) {
	    callback(error);
	}
	function callSuccessCallback(callback, entries) {
	    callback(null, entries);
	}
	return async$3;
}

var stream$2 = {};

var hasRequiredStream$2;

function requireStream$2 () {
	if (hasRequiredStream$2) return stream$2;
	hasRequiredStream$2 = 1;
	Object.defineProperty(stream$2, "__esModule", { value: true });
	const stream_1 = require$$0$2;
	const async_1 = requireAsync$3();
	class StreamProvider {
	    constructor(_root, _settings) {
	        this._root = _root;
	        this._settings = _settings;
	        this._reader = new async_1.default(this._root, this._settings);
	        this._stream = new stream_1.Readable({
	            objectMode: true,
	            read: () => { },
	            destroy: () => {
	                if (!this._reader.isDestroyed) {
	                    this._reader.destroy();
	                }
	            }
	        });
	    }
	    read() {
	        this._reader.onError((error) => {
	            this._stream.emit('error', error);
	        });
	        this._reader.onEntry((entry) => {
	            this._stream.push(entry);
	        });
	        this._reader.onEnd(() => {
	            this._stream.push(null);
	        });
	        this._reader.read();
	        return this._stream;
	    }
	}
	stream$2.default = StreamProvider;
	return stream$2;
}

var sync$3 = {};

var sync$2 = {};

var hasRequiredSync$3;

function requireSync$3 () {
	if (hasRequiredSync$3) return sync$2;
	hasRequiredSync$3 = 1;
	Object.defineProperty(sync$2, "__esModule", { value: true });
	const fsScandir = requireOut$2();
	const common = requireCommon();
	const reader_1 = requireReader$1();
	class SyncReader extends reader_1.default {
	    constructor() {
	        super(...arguments);
	        this._scandir = fsScandir.scandirSync;
	        this._storage = [];
	        this._queue = new Set();
	    }
	    read() {
	        this._pushToQueue(this._root, this._settings.basePath);
	        this._handleQueue();
	        return this._storage;
	    }
	    _pushToQueue(directory, base) {
	        this._queue.add({ directory, base });
	    }
	    _handleQueue() {
	        for (const item of this._queue.values()) {
	            this._handleDirectory(item.directory, item.base);
	        }
	    }
	    _handleDirectory(directory, base) {
	        try {
	            const entries = this._scandir(directory, this._settings.fsScandirSettings);
	            for (const entry of entries) {
	                this._handleEntry(entry, base);
	            }
	        }
	        catch (error) {
	            this._handleError(error);
	        }
	    }
	    _handleError(error) {
	        if (!common.isFatalError(this._settings, error)) {
	            return;
	        }
	        throw error;
	    }
	    _handleEntry(entry, base) {
	        const fullpath = entry.path;
	        if (base !== undefined) {
	            entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
	        }
	        if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
	            this._pushToStorage(entry);
	        }
	        if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) {
	            this._pushToQueue(fullpath, base === undefined ? undefined : entry.path);
	        }
	    }
	    _pushToStorage(entry) {
	        this._storage.push(entry);
	    }
	}
	sync$2.default = SyncReader;
	return sync$2;
}

var hasRequiredSync$2;

function requireSync$2 () {
	if (hasRequiredSync$2) return sync$3;
	hasRequiredSync$2 = 1;
	Object.defineProperty(sync$3, "__esModule", { value: true });
	const sync_1 = requireSync$3();
	class SyncProvider {
	    constructor(_root, _settings) {
	        this._root = _root;
	        this._settings = _settings;
	        this._reader = new sync_1.default(this._root, this._settings);
	    }
	    read() {
	        return this._reader.read();
	    }
	}
	sync$3.default = SyncProvider;
	return sync$3;
}

var settings$1 = {};

var hasRequiredSettings$1;

function requireSettings$1 () {
	if (hasRequiredSettings$1) return settings$1;
	hasRequiredSettings$1 = 1;
	Object.defineProperty(settings$1, "__esModule", { value: true });
	const path = path$1;
	const fsScandir = requireOut$2();
	class Settings {
	    constructor(_options = {}) {
	        this._options = _options;
	        this.basePath = this._getValue(this._options.basePath, undefined);
	        this.concurrency = this._getValue(this._options.concurrency, Number.POSITIVE_INFINITY);
	        this.deepFilter = this._getValue(this._options.deepFilter, null);
	        this.entryFilter = this._getValue(this._options.entryFilter, null);
	        this.errorFilter = this._getValue(this._options.errorFilter, null);
	        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path.sep);
	        this.fsScandirSettings = new fsScandir.Settings({
	            followSymbolicLinks: this._options.followSymbolicLinks,
	            fs: this._options.fs,
	            pathSegmentSeparator: this._options.pathSegmentSeparator,
	            stats: this._options.stats,
	            throwErrorOnBrokenSymbolicLink: this._options.throwErrorOnBrokenSymbolicLink
	        });
	    }
	    _getValue(option, value) {
	        return option !== null && option !== void 0 ? option : value;
	    }
	}
	settings$1.default = Settings;
	return settings$1;
}

var hasRequiredOut$1;

function requireOut$1 () {
	if (hasRequiredOut$1) return out$3;
	hasRequiredOut$1 = 1;
	Object.defineProperty(out$3, "__esModule", { value: true });
	out$3.Settings = out$3.walkStream = out$3.walkSync = out$3.walk = void 0;
	const async_1 = requireAsync$2();
	const stream_1 = requireStream$2();
	const sync_1 = requireSync$2();
	const settings_1 = requireSettings$1();
	out$3.Settings = settings_1.default;
	function walk(directory, optionsOrSettingsOrCallback, callback) {
	    if (typeof optionsOrSettingsOrCallback === 'function') {
	        new async_1.default(directory, getSettings()).read(optionsOrSettingsOrCallback);
	        return;
	    }
	    new async_1.default(directory, getSettings(optionsOrSettingsOrCallback)).read(callback);
	}
	out$3.walk = walk;
	function walkSync(directory, optionsOrSettings) {
	    const settings = getSettings(optionsOrSettings);
	    const provider = new sync_1.default(directory, settings);
	    return provider.read();
	}
	out$3.walkSync = walkSync;
	function walkStream(directory, optionsOrSettings) {
	    const settings = getSettings(optionsOrSettings);
	    const provider = new stream_1.default(directory, settings);
	    return provider.read();
	}
	out$3.walkStream = walkStream;
	function getSettings(settingsOrOptions = {}) {
	    if (settingsOrOptions instanceof settings_1.default) {
	        return settingsOrOptions;
	    }
	    return new settings_1.default(settingsOrOptions);
	}
	return out$3;
}

var reader = {};

var hasRequiredReader;

function requireReader () {
	if (hasRequiredReader) return reader;
	hasRequiredReader = 1;
	Object.defineProperty(reader, "__esModule", { value: true });
	const path = path$1;
	const fsStat = requireOut$3();
	const utils = requireUtils$1();
	class Reader {
	    constructor(_settings) {
	        this._settings = _settings;
	        this._fsStatSettings = new fsStat.Settings({
	            followSymbolicLink: this._settings.followSymbolicLinks,
	            fs: this._settings.fs,
	            throwErrorOnBrokenSymbolicLink: this._settings.followSymbolicLinks
	        });
	    }
	    _getFullEntryPath(filepath) {
	        return path.resolve(this._settings.cwd, filepath);
	    }
	    _makeEntry(stats, pattern) {
	        const entry = {
	            name: pattern,
	            path: pattern,
	            dirent: utils.fs.createDirentFromStats(pattern, stats)
	        };
	        if (this._settings.stats) {
	            entry.stats = stats;
	        }
	        return entry;
	    }
	    _isFatalError(error) {
	        return !utils.errno.isEnoentCodeError(error) && !this._settings.suppressErrors;
	    }
	}
	reader.default = Reader;
	return reader;
}

var stream$1 = {};

var hasRequiredStream$1;

function requireStream$1 () {
	if (hasRequiredStream$1) return stream$1;
	hasRequiredStream$1 = 1;
	Object.defineProperty(stream$1, "__esModule", { value: true });
	const stream_1 = require$$0$2;
	const fsStat = requireOut$3();
	const fsWalk = requireOut$1();
	const reader_1 = requireReader();
	class ReaderStream extends reader_1.default {
	    constructor() {
	        super(...arguments);
	        this._walkStream = fsWalk.walkStream;
	        this._stat = fsStat.stat;
	    }
	    dynamic(root, options) {
	        return this._walkStream(root, options);
	    }
	    static(patterns, options) {
	        const filepaths = patterns.map(this._getFullEntryPath, this);
	        const stream = new stream_1.PassThrough({ objectMode: true });
	        stream._write = (index, _enc, done) => {
	            return this._getEntry(filepaths[index], patterns[index], options)
	                .then((entry) => {
	                if (entry !== null && options.entryFilter(entry)) {
	                    stream.push(entry);
	                }
	                if (index === filepaths.length - 1) {
	                    stream.end();
	                }
	                done();
	            })
	                .catch(done);
	        };
	        for (let i = 0; i < filepaths.length; i++) {
	            stream.write(i);
	        }
	        return stream;
	    }
	    _getEntry(filepath, pattern, options) {
	        return this._getStat(filepath)
	            .then((stats) => this._makeEntry(stats, pattern))
	            .catch((error) => {
	            if (options.errorFilter(error)) {
	                return null;
	            }
	            throw error;
	        });
	    }
	    _getStat(filepath) {
	        return new Promise((resolve, reject) => {
	            this._stat(filepath, this._fsStatSettings, (error, stats) => {
	                return error === null ? resolve(stats) : reject(error);
	            });
	        });
	    }
	}
	stream$1.default = ReaderStream;
	return stream$1;
}

var hasRequiredAsync$1;

function requireAsync$1 () {
	if (hasRequiredAsync$1) return async$4;
	hasRequiredAsync$1 = 1;
	Object.defineProperty(async$4, "__esModule", { value: true });
	const fsWalk = requireOut$1();
	const reader_1 = requireReader();
	const stream_1 = requireStream$1();
	class ReaderAsync extends reader_1.default {
	    constructor() {
	        super(...arguments);
	        this._walkAsync = fsWalk.walk;
	        this._readerStream = new stream_1.default(this._settings);
	    }
	    dynamic(root, options) {
	        return new Promise((resolve, reject) => {
	            this._walkAsync(root, options, (error, entries) => {
	                if (error === null) {
	                    resolve(entries);
	                }
	                else {
	                    reject(error);
	                }
	            });
	        });
	    }
	    async static(patterns, options) {
	        const entries = [];
	        const stream = this._readerStream.static(patterns, options);
	        // After #235, replace it with an asynchronous iterator.
	        return new Promise((resolve, reject) => {
	            stream.once('error', reject);
	            stream.on('data', (entry) => entries.push(entry));
	            stream.once('end', () => resolve(entries));
	        });
	    }
	}
	async$4.default = ReaderAsync;
	return async$4;
}

var provider = {};

var deep = {};

var partial = {};

var matcher = {};

var hasRequiredMatcher;

function requireMatcher () {
	if (hasRequiredMatcher) return matcher;
	hasRequiredMatcher = 1;
	Object.defineProperty(matcher, "__esModule", { value: true });
	const utils = requireUtils$1();
	class Matcher {
	    constructor(_patterns, _settings, _micromatchOptions) {
	        this._patterns = _patterns;
	        this._settings = _settings;
	        this._micromatchOptions = _micromatchOptions;
	        this._storage = [];
	        this._fillStorage();
	    }
	    _fillStorage() {
	        for (const pattern of this._patterns) {
	            const segments = this._getPatternSegments(pattern);
	            const sections = this._splitSegmentsIntoSections(segments);
	            this._storage.push({
	                complete: sections.length <= 1,
	                pattern,
	                segments,
	                sections
	            });
	        }
	    }
	    _getPatternSegments(pattern) {
	        const parts = utils.pattern.getPatternParts(pattern, this._micromatchOptions);
	        return parts.map((part) => {
	            const dynamic = utils.pattern.isDynamicPattern(part, this._settings);
	            if (!dynamic) {
	                return {
	                    dynamic: false,
	                    pattern: part
	                };
	            }
	            return {
	                dynamic: true,
	                pattern: part,
	                patternRe: utils.pattern.makeRe(part, this._micromatchOptions)
	            };
	        });
	    }
	    _splitSegmentsIntoSections(segments) {
	        return utils.array.splitWhen(segments, (segment) => segment.dynamic && utils.pattern.hasGlobStar(segment.pattern));
	    }
	}
	matcher.default = Matcher;
	return matcher;
}

var hasRequiredPartial;

function requirePartial () {
	if (hasRequiredPartial) return partial;
	hasRequiredPartial = 1;
	Object.defineProperty(partial, "__esModule", { value: true });
	const matcher_1 = requireMatcher();
	class PartialMatcher extends matcher_1.default {
	    match(filepath) {
	        const parts = filepath.split('/');
	        const levels = parts.length;
	        const patterns = this._storage.filter((info) => !info.complete || info.segments.length > levels);
	        for (const pattern of patterns) {
	            const section = pattern.sections[0];
	            /**
	             * In this case, the pattern has a globstar and we must read all directories unconditionally,
	             * but only if the level has reached the end of the first group.
	             *
	             * fixtures/{a,b}/**
	             *  ^ true/false  ^ always true
	            */
	            if (!pattern.complete && levels > section.length) {
	                return true;
	            }
	            const match = parts.every((part, index) => {
	                const segment = pattern.segments[index];
	                if (segment.dynamic && segment.patternRe.test(part)) {
	                    return true;
	                }
	                if (!segment.dynamic && segment.pattern === part) {
	                    return true;
	                }
	                return false;
	            });
	            if (match) {
	                return true;
	            }
	        }
	        return false;
	    }
	}
	partial.default = PartialMatcher;
	return partial;
}

var hasRequiredDeep;

function requireDeep () {
	if (hasRequiredDeep) return deep;
	hasRequiredDeep = 1;
	Object.defineProperty(deep, "__esModule", { value: true });
	const utils = requireUtils$1();
	const partial_1 = requirePartial();
	class DeepFilter {
	    constructor(_settings, _micromatchOptions) {
	        this._settings = _settings;
	        this._micromatchOptions = _micromatchOptions;
	    }
	    getFilter(basePath, positive, negative) {
	        const matcher = this._getMatcher(positive);
	        const negativeRe = this._getNegativePatternsRe(negative);
	        return (entry) => this._filter(basePath, entry, matcher, negativeRe);
	    }
	    _getMatcher(patterns) {
	        return new partial_1.default(patterns, this._settings, this._micromatchOptions);
	    }
	    _getNegativePatternsRe(patterns) {
	        const affectDepthOfReadingPatterns = patterns.filter(utils.pattern.isAffectDepthOfReadingPattern);
	        return utils.pattern.convertPatternsToRe(affectDepthOfReadingPatterns, this._micromatchOptions);
	    }
	    _filter(basePath, entry, matcher, negativeRe) {
	        if (this._isSkippedByDeep(basePath, entry.path)) {
	            return false;
	        }
	        if (this._isSkippedSymbolicLink(entry)) {
	            return false;
	        }
	        const filepath = utils.path.removeLeadingDotSegment(entry.path);
	        if (this._isSkippedByPositivePatterns(filepath, matcher)) {
	            return false;
	        }
	        return this._isSkippedByNegativePatterns(filepath, negativeRe);
	    }
	    _isSkippedByDeep(basePath, entryPath) {
	        /**
	         * Avoid unnecessary depth calculations when it doesn't matter.
	         */
	        if (this._settings.deep === Infinity) {
	            return false;
	        }
	        return this._getEntryLevel(basePath, entryPath) >= this._settings.deep;
	    }
	    _getEntryLevel(basePath, entryPath) {
	        const entryPathDepth = entryPath.split('/').length;
	        if (basePath === '') {
	            return entryPathDepth;
	        }
	        const basePathDepth = basePath.split('/').length;
	        return entryPathDepth - basePathDepth;
	    }
	    _isSkippedSymbolicLink(entry) {
	        return !this._settings.followSymbolicLinks && entry.dirent.isSymbolicLink();
	    }
	    _isSkippedByPositivePatterns(entryPath, matcher) {
	        return !this._settings.baseNameMatch && !matcher.match(entryPath);
	    }
	    _isSkippedByNegativePatterns(entryPath, patternsRe) {
	        return !utils.pattern.matchAny(entryPath, patternsRe);
	    }
	}
	deep.default = DeepFilter;
	return deep;
}

var entry$1 = {};

var hasRequiredEntry$1;

function requireEntry$1 () {
	if (hasRequiredEntry$1) return entry$1;
	hasRequiredEntry$1 = 1;
	Object.defineProperty(entry$1, "__esModule", { value: true });
	const utils = requireUtils$1();
	class EntryFilter {
	    constructor(_settings, _micromatchOptions) {
	        this._settings = _settings;
	        this._micromatchOptions = _micromatchOptions;
	        this.index = new Map();
	    }
	    getFilter(positive, negative) {
	        const [absoluteNegative, relativeNegative] = utils.pattern.partitionAbsoluteAndRelative(negative);
	        const patterns = {
	            positive: {
	                all: utils.pattern.convertPatternsToRe(positive, this._micromatchOptions)
	            },
	            negative: {
	                absolute: utils.pattern.convertPatternsToRe(absoluteNegative, Object.assign(Object.assign({}, this._micromatchOptions), { dot: true })),
	                relative: utils.pattern.convertPatternsToRe(relativeNegative, Object.assign(Object.assign({}, this._micromatchOptions), { dot: true }))
	            }
	        };
	        return (entry) => this._filter(entry, patterns);
	    }
	    _filter(entry, patterns) {
	        const filepath = utils.path.removeLeadingDotSegment(entry.path);
	        if (this._settings.unique && this._isDuplicateEntry(filepath)) {
	            return false;
	        }
	        if (this._onlyFileFilter(entry) || this._onlyDirectoryFilter(entry)) {
	            return false;
	        }
	        const isMatched = this._isMatchToPatternsSet(filepath, patterns, entry.dirent.isDirectory());
	        if (this._settings.unique && isMatched) {
	            this._createIndexRecord(filepath);
	        }
	        return isMatched;
	    }
	    _isDuplicateEntry(filepath) {
	        return this.index.has(filepath);
	    }
	    _createIndexRecord(filepath) {
	        this.index.set(filepath, undefined);
	    }
	    _onlyFileFilter(entry) {
	        return this._settings.onlyFiles && !entry.dirent.isFile();
	    }
	    _onlyDirectoryFilter(entry) {
	        return this._settings.onlyDirectories && !entry.dirent.isDirectory();
	    }
	    _isMatchToPatternsSet(filepath, patterns, isDirectory) {
	        const isMatched = this._isMatchToPatterns(filepath, patterns.positive.all, isDirectory);
	        if (!isMatched) {
	            return false;
	        }
	        const isMatchedByRelativeNegative = this._isMatchToPatterns(filepath, patterns.negative.relative, isDirectory);
	        if (isMatchedByRelativeNegative) {
	            return false;
	        }
	        const isMatchedByAbsoluteNegative = this._isMatchToAbsoluteNegative(filepath, patterns.negative.absolute, isDirectory);
	        if (isMatchedByAbsoluteNegative) {
	            return false;
	        }
	        return true;
	    }
	    _isMatchToAbsoluteNegative(filepath, patternsRe, isDirectory) {
	        if (patternsRe.length === 0) {
	            return false;
	        }
	        const fullpath = utils.path.makeAbsolute(this._settings.cwd, filepath);
	        return this._isMatchToPatterns(fullpath, patternsRe, isDirectory);
	    }
	    _isMatchToPatterns(filepath, patternsRe, isDirectory) {
	        if (patternsRe.length === 0) {
	            return false;
	        }
	        // Trying to match files and directories by patterns.
	        const isMatched = utils.pattern.matchAny(filepath, patternsRe);
	        // A pattern with a trailling slash can be used for directory matching.
	        // To apply such pattern, we need to add a tralling slash to the path.
	        if (!isMatched && isDirectory) {
	            return utils.pattern.matchAny(filepath + '/', patternsRe);
	        }
	        return isMatched;
	    }
	}
	entry$1.default = EntryFilter;
	return entry$1;
}

var error = {};

var hasRequiredError;

function requireError () {
	if (hasRequiredError) return error;
	hasRequiredError = 1;
	Object.defineProperty(error, "__esModule", { value: true });
	const utils = requireUtils$1();
	class ErrorFilter {
	    constructor(_settings) {
	        this._settings = _settings;
	    }
	    getFilter() {
	        return (error) => this._isNonFatalError(error);
	    }
	    _isNonFatalError(error) {
	        return utils.errno.isEnoentCodeError(error) || this._settings.suppressErrors;
	    }
	}
	error.default = ErrorFilter;
	return error;
}

var entry = {};

var hasRequiredEntry;

function requireEntry () {
	if (hasRequiredEntry) return entry;
	hasRequiredEntry = 1;
	Object.defineProperty(entry, "__esModule", { value: true });
	const utils = requireUtils$1();
	class EntryTransformer {
	    constructor(_settings) {
	        this._settings = _settings;
	    }
	    getTransformer() {
	        return (entry) => this._transform(entry);
	    }
	    _transform(entry) {
	        let filepath = entry.path;
	        if (this._settings.absolute) {
	            filepath = utils.path.makeAbsolute(this._settings.cwd, filepath);
	            filepath = utils.path.unixify(filepath);
	        }
	        if (this._settings.markDirectories && entry.dirent.isDirectory()) {
	            filepath += '/';
	        }
	        if (!this._settings.objectMode) {
	            return filepath;
	        }
	        return Object.assign(Object.assign({}, entry), { path: filepath });
	    }
	}
	entry.default = EntryTransformer;
	return entry;
}

var hasRequiredProvider;

function requireProvider () {
	if (hasRequiredProvider) return provider;
	hasRequiredProvider = 1;
	Object.defineProperty(provider, "__esModule", { value: true });
	const path = path$1;
	const deep_1 = requireDeep();
	const entry_1 = requireEntry$1();
	const error_1 = requireError();
	const entry_2 = requireEntry();
	class Provider {
	    constructor(_settings) {
	        this._settings = _settings;
	        this.errorFilter = new error_1.default(this._settings);
	        this.entryFilter = new entry_1.default(this._settings, this._getMicromatchOptions());
	        this.deepFilter = new deep_1.default(this._settings, this._getMicromatchOptions());
	        this.entryTransformer = new entry_2.default(this._settings);
	    }
	    _getRootDirectory(task) {
	        return path.resolve(this._settings.cwd, task.base);
	    }
	    _getReaderOptions(task) {
	        const basePath = task.base === '.' ? '' : task.base;
	        return {
	            basePath,
	            pathSegmentSeparator: '/',
	            concurrency: this._settings.concurrency,
	            deepFilter: this.deepFilter.getFilter(basePath, task.positive, task.negative),
	            entryFilter: this.entryFilter.getFilter(task.positive, task.negative),
	            errorFilter: this.errorFilter.getFilter(),
	            followSymbolicLinks: this._settings.followSymbolicLinks,
	            fs: this._settings.fs,
	            stats: this._settings.stats,
	            throwErrorOnBrokenSymbolicLink: this._settings.throwErrorOnBrokenSymbolicLink,
	            transform: this.entryTransformer.getTransformer()
	        };
	    }
	    _getMicromatchOptions() {
	        return {
	            dot: this._settings.dot,
	            matchBase: this._settings.baseNameMatch,
	            nobrace: !this._settings.braceExpansion,
	            nocase: !this._settings.caseSensitiveMatch,
	            noext: !this._settings.extglob,
	            noglobstar: !this._settings.globstar,
	            posix: true,
	            strictSlashes: false
	        };
	    }
	}
	provider.default = Provider;
	return provider;
}

var hasRequiredAsync;

function requireAsync () {
	if (hasRequiredAsync) return async$5;
	hasRequiredAsync = 1;
	Object.defineProperty(async$5, "__esModule", { value: true });
	const async_1 = requireAsync$1();
	const provider_1 = requireProvider();
	class ProviderAsync extends provider_1.default {
	    constructor() {
	        super(...arguments);
	        this._reader = new async_1.default(this._settings);
	    }
	    async read(task) {
	        const root = this._getRootDirectory(task);
	        const options = this._getReaderOptions(task);
	        const entries = await this.api(root, task, options);
	        return entries.map((entry) => options.transform(entry));
	    }
	    api(root, task, options) {
	        if (task.dynamic) {
	            return this._reader.dynamic(root, options);
	        }
	        return this._reader.static(task.patterns, options);
	    }
	}
	async$5.default = ProviderAsync;
	return async$5;
}

var stream = {};

var hasRequiredStream;

function requireStream () {
	if (hasRequiredStream) return stream;
	hasRequiredStream = 1;
	Object.defineProperty(stream, "__esModule", { value: true });
	const stream_1 = require$$0$2;
	const stream_2 = requireStream$1();
	const provider_1 = requireProvider();
	class ProviderStream extends provider_1.default {
	    constructor() {
	        super(...arguments);
	        this._reader = new stream_2.default(this._settings);
	    }
	    read(task) {
	        const root = this._getRootDirectory(task);
	        const options = this._getReaderOptions(task);
	        const source = this.api(root, task, options);
	        const destination = new stream_1.Readable({ objectMode: true, read: () => { } });
	        source
	            .once('error', (error) => destination.emit('error', error))
	            .on('data', (entry) => destination.emit('data', options.transform(entry)))
	            .once('end', () => destination.emit('end'));
	        destination
	            .once('close', () => source.destroy());
	        return destination;
	    }
	    api(root, task, options) {
	        if (task.dynamic) {
	            return this._reader.dynamic(root, options);
	        }
	        return this._reader.static(task.patterns, options);
	    }
	}
	stream.default = ProviderStream;
	return stream;
}

var sync$1 = {};

var sync = {};

var hasRequiredSync$1;

function requireSync$1 () {
	if (hasRequiredSync$1) return sync;
	hasRequiredSync$1 = 1;
	Object.defineProperty(sync, "__esModule", { value: true });
	const fsStat = requireOut$3();
	const fsWalk = requireOut$1();
	const reader_1 = requireReader();
	class ReaderSync extends reader_1.default {
	    constructor() {
	        super(...arguments);
	        this._walkSync = fsWalk.walkSync;
	        this._statSync = fsStat.statSync;
	    }
	    dynamic(root, options) {
	        return this._walkSync(root, options);
	    }
	    static(patterns, options) {
	        const entries = [];
	        for (const pattern of patterns) {
	            const filepath = this._getFullEntryPath(pattern);
	            const entry = this._getEntry(filepath, pattern, options);
	            if (entry === null || !options.entryFilter(entry)) {
	                continue;
	            }
	            entries.push(entry);
	        }
	        return entries;
	    }
	    _getEntry(filepath, pattern, options) {
	        try {
	            const stats = this._getStat(filepath);
	            return this._makeEntry(stats, pattern);
	        }
	        catch (error) {
	            if (options.errorFilter(error)) {
	                return null;
	            }
	            throw error;
	        }
	    }
	    _getStat(filepath) {
	        return this._statSync(filepath, this._fsStatSettings);
	    }
	}
	sync.default = ReaderSync;
	return sync;
}

var hasRequiredSync;

function requireSync () {
	if (hasRequiredSync) return sync$1;
	hasRequiredSync = 1;
	Object.defineProperty(sync$1, "__esModule", { value: true });
	const sync_1 = requireSync$1();
	const provider_1 = requireProvider();
	class ProviderSync extends provider_1.default {
	    constructor() {
	        super(...arguments);
	        this._reader = new sync_1.default(this._settings);
	    }
	    read(task) {
	        const root = this._getRootDirectory(task);
	        const options = this._getReaderOptions(task);
	        const entries = this.api(root, task, options);
	        return entries.map(options.transform);
	    }
	    api(root, task, options) {
	        if (task.dynamic) {
	            return this._reader.dynamic(root, options);
	        }
	        return this._reader.static(task.patterns, options);
	    }
	}
	sync$1.default = ProviderSync;
	return sync$1;
}

var settings = {};

var hasRequiredSettings;

function requireSettings () {
	if (hasRequiredSettings) return settings;
	hasRequiredSettings = 1;
	(function (exports$1) {
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.DEFAULT_FILE_SYSTEM_ADAPTER = void 0;
		const fs = fs$4;
		const os = require$$0;
		/**
		 * The `os.cpus` method can return zero. We expect the number of cores to be greater than zero.
		 * https://github.com/nodejs/node/blob/7faeddf23a98c53896f8b574a6e66589e8fb1eb8/lib/os.js#L106-L107
		 */
		const CPU_COUNT = Math.max(os.cpus().length, 1);
		exports$1.DEFAULT_FILE_SYSTEM_ADAPTER = {
		    lstat: fs.lstat,
		    lstatSync: fs.lstatSync,
		    stat: fs.stat,
		    statSync: fs.statSync,
		    readdir: fs.readdir,
		    readdirSync: fs.readdirSync
		};
		class Settings {
		    constructor(_options = {}) {
		        this._options = _options;
		        this.absolute = this._getValue(this._options.absolute, false);
		        this.baseNameMatch = this._getValue(this._options.baseNameMatch, false);
		        this.braceExpansion = this._getValue(this._options.braceExpansion, true);
		        this.caseSensitiveMatch = this._getValue(this._options.caseSensitiveMatch, true);
		        this.concurrency = this._getValue(this._options.concurrency, CPU_COUNT);
		        this.cwd = this._getValue(this._options.cwd, process.cwd());
		        this.deep = this._getValue(this._options.deep, Infinity);
		        this.dot = this._getValue(this._options.dot, false);
		        this.extglob = this._getValue(this._options.extglob, true);
		        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, true);
		        this.fs = this._getFileSystemMethods(this._options.fs);
		        this.globstar = this._getValue(this._options.globstar, true);
		        this.ignore = this._getValue(this._options.ignore, []);
		        this.markDirectories = this._getValue(this._options.markDirectories, false);
		        this.objectMode = this._getValue(this._options.objectMode, false);
		        this.onlyDirectories = this._getValue(this._options.onlyDirectories, false);
		        this.onlyFiles = this._getValue(this._options.onlyFiles, true);
		        this.stats = this._getValue(this._options.stats, false);
		        this.suppressErrors = this._getValue(this._options.suppressErrors, false);
		        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, false);
		        this.unique = this._getValue(this._options.unique, true);
		        if (this.onlyDirectories) {
		            this.onlyFiles = false;
		        }
		        if (this.stats) {
		            this.objectMode = true;
		        }
		        // Remove the cast to the array in the next major (#404).
		        this.ignore = [].concat(this.ignore);
		    }
		    _getValue(option, value) {
		        return option === undefined ? value : option;
		    }
		    _getFileSystemMethods(methods = {}) {
		        return Object.assign(Object.assign({}, exports$1.DEFAULT_FILE_SYSTEM_ADAPTER), methods);
		    }
		}
		exports$1.default = Settings; 
	} (settings));
	return settings;
}

var out;
var hasRequiredOut;

function requireOut () {
	if (hasRequiredOut) return out;
	hasRequiredOut = 1;
	const taskManager = requireTasks();
	const async_1 = requireAsync();
	const stream_1 = requireStream();
	const sync_1 = requireSync();
	const settings_1 = requireSettings();
	const utils = requireUtils$1();
	async function FastGlob(source, options) {
	    assertPatternsInput(source);
	    const works = getWorks(source, async_1.default, options);
	    const result = await Promise.all(works);
	    return utils.array.flatten(result);
	}
	// https://github.com/typescript-eslint/typescript-eslint/issues/60
	// eslint-disable-next-line no-redeclare
	(function (FastGlob) {
	    FastGlob.glob = FastGlob;
	    FastGlob.globSync = sync;
	    FastGlob.globStream = stream;
	    FastGlob.async = FastGlob;
	    function sync(source, options) {
	        assertPatternsInput(source);
	        const works = getWorks(source, sync_1.default, options);
	        return utils.array.flatten(works);
	    }
	    FastGlob.sync = sync;
	    function stream(source, options) {
	        assertPatternsInput(source);
	        const works = getWorks(source, stream_1.default, options);
	        /**
	         * The stream returned by the provider cannot work with an asynchronous iterator.
	         * To support asynchronous iterators, regardless of the number of tasks, we always multiplex streams.
	         * This affects performance (+25%). I don't see best solution right now.
	         */
	        return utils.stream.merge(works);
	    }
	    FastGlob.stream = stream;
	    function generateTasks(source, options) {
	        assertPatternsInput(source);
	        const patterns = [].concat(source);
	        const settings = new settings_1.default(options);
	        return taskManager.generate(patterns, settings);
	    }
	    FastGlob.generateTasks = generateTasks;
	    function isDynamicPattern(source, options) {
	        assertPatternsInput(source);
	        const settings = new settings_1.default(options);
	        return utils.pattern.isDynamicPattern(source, settings);
	    }
	    FastGlob.isDynamicPattern = isDynamicPattern;
	    function escapePath(source) {
	        assertPatternsInput(source);
	        return utils.path.escape(source);
	    }
	    FastGlob.escapePath = escapePath;
	    function convertPathToPattern(source) {
	        assertPatternsInput(source);
	        return utils.path.convertPathToPattern(source);
	    }
	    FastGlob.convertPathToPattern = convertPathToPattern;
	    (function (posix) {
	        function escapePath(source) {
	            assertPatternsInput(source);
	            return utils.path.escapePosixPath(source);
	        }
	        posix.escapePath = escapePath;
	        function convertPathToPattern(source) {
	            assertPatternsInput(source);
	            return utils.path.convertPosixPathToPattern(source);
	        }
	        posix.convertPathToPattern = convertPathToPattern;
	    })(FastGlob.posix || (FastGlob.posix = {}));
	    (function (win32) {
	        function escapePath(source) {
	            assertPatternsInput(source);
	            return utils.path.escapeWindowsPath(source);
	        }
	        win32.escapePath = escapePath;
	        function convertPathToPattern(source) {
	            assertPatternsInput(source);
	            return utils.path.convertWindowsPathToPattern(source);
	        }
	        win32.convertPathToPattern = convertPathToPattern;
	    })(FastGlob.win32 || (FastGlob.win32 = {}));
	})(FastGlob || (FastGlob = {}));
	function getWorks(source, _Provider, options) {
	    const patterns = [].concat(source);
	    const settings = new settings_1.default(options);
	    const tasks = taskManager.generate(patterns, settings);
	    const provider = new _Provider(settings);
	    return tasks.map(provider.read, provider);
	}
	function assertPatternsInput(input) {
	    const source = [].concat(input);
	    const isValidSource = source.every((item) => utils.string.isString(item) && !utils.string.isEmpty(item));
	    if (!isValidSource) {
	        throw new TypeError('Patterns must be a string (non empty) or an array of strings');
	    }
	}
	out = FastGlob;
	return out;
}

var outExports = requireOut();
var index = /*@__PURE__*/getDefaultExportFromCjs(outExports);

var index$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	default: index
});

// ————————————————————————————————
// Garur-CSS Core Tokens + Base Styles (Packed Export)
// ————————————————————————————————
//  Colors
const primary = "#3b82f6";
const primaryDark = "#2563eb";
const primaryLight = "#60a5fa";
const success = "#10b981";
const successDark = "#059669";
const successLight = "#34d399";
const danger = "#ef4444";
const dangerDark = "#dc2626";
const dangerLight = "#f87171";
const warning = "#f59e0b";
const warningDark = "#d97706";
const warningLight = "#fbbf24";
const info = "#06b6d4";
const infoDark = "#0891b2";
const infoLight = "#0ea5e9";
const textDark = "#111827";
const textLight = "#f9fafb";
const surfaceLight = "#ffffff";
const surfaceDark = "#1f2937";
const surfaceAltLight = "#f8fafc";
const surfaceAltDark = "#334155";
const borderColorLight = "rgba(0,0,0,0.08)";
const borderColorDark = "rgba(255,255,255,0.12)";
//  Radius
const radiusSm = "0.5rem";
const radiusMd = "0.75rem";
const radiusLg = "1rem";
const radiusXl = "1.5rem";
//  Shadows
const shadowSm = "0 2px 8px rgba(0,0,0,0.04)";
const shadowMd = "0 4px 16px rgba(0,0,0,0.08)";
const shadowLg = "0 8px 32px rgba(0,0,0,0.12)";
const shadowXl = "0 16px 48px rgba(0,0,0,0.08)";
//  Blur
const blurGlass = "blur(16px)";
const blurGlassHeavy = "blur(24px)";
//  Transition
const standardTransition = "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)";
//  Merge Utility
const mergeStyles = (base, override, theme) => ({
    ...base,
    ...override,
    ...(theme === "dark"
        ? { color: textLight, backgroundColor: surfaceDark }
        : {}),
});
// —————————————————————————————
// COMPONENT BASE STYLES EXPORT
// —————————————————————————————
//  BUTTON
const btnBase = { display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.5rem",
    borderRadius: radiusSm,
    border: "none",
    fontWeight: "600",
    letterSpacing: "0.25px",
    cursor: "pointer",
    transition: standardTransition,
    backdropFilter: blurGlass,
    boxShadow: shadowSm,
    position: "relative",
    overflow: "hidden",
    fontSize: "0.9375rem",
    lineHeight: "1.5",
    textDecoration: "none",
    userSelect: "none",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    // Shine effect
    "&::before": {
        content: '""',
        position: "absolute",
        top: "0",
        left: "-100%",
        width: "100%",
        height: "100%",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
        transition: "left 0.4s ease",
    },
    "&:hover::before": {
        left: "100%",
    },
    "&:focus": {
        outline: "none",
        boxShadow: `0 0 0 2px ${primary}20, ${shadowSm}`,
    },
    "&:active": {
        transform: "translateY(1px)",
    },
    "@media (prefers-reduced-motion: reduce)": {
        transition: "none",
        "&::before": {
            display: "none",
        },
    },
    "@media (max-width: 640px)": {
        padding: "0.625rem 1.25rem",
        fontSize: "0.875rem",
    }, };
//  INPUT
const inputBase = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: radiusSm,
    border: `1px solid ${borderColorLight}`,
    outline: "none",
    fontSize: "0.9375rem",
    color: textDark,
    background: surfaceLight,
    transition: standardTransition,
    backdropFilter: blurGlass,
    fontFamily: "inherit",
    "&:focus": {
        borderColor: primary,
        boxShadow: `0 0 0 2px ${primary}15`,
        transform: "translateY(-1px)",
    },
    "&::placeholder": {
        color: "rgba(0, 0, 0, 0.4)",
    },
    "@media (max-width: 640px)": {
        padding: "0.625rem 0.875rem",
        fontSize: "0.875rem",
    },
};
//  MODAL
const modalBase = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: surfaceLight,
    padding: "1.5rem", // Reduced
    "border-radius": radiusMd,
    "box-shadow": shadowLg,
    "z-index": "9999",
    width: "90%",
    "max-width": "450px", // Slightly smaller
    transition: standardTransition,
    "backdrop-filter": blurGlass,
    border: `1px solid ${borderColorLight}`,
    "@media (max-width: 640px)": {
        padding: "1.25rem",
        width: "95%",
    },
};
//  CARD
const cardBase = { background: surfaceLight,
    borderRadius: radiusMd,
    boxShadow: shadowSm,
    transition: standardTransition,
    overflow: "hidden",
    position: "relative",
    "@media (max-width: 640px)": {
        borderRadius: radiusSm,
    }, };
//  ALERT
const alertBase = { padding: "1rem 1.25rem",
    borderRadius: radiusMd,
    border: `1px solid ${borderColorLight}`,
    background: surfaceAltLight,
    backdropFilter: blurGlassHeavy,
    fontWeight: "500",
    boxShadow: shadowSm,
    transition: standardTransition,
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
    "&::before": {
        content: '""',
        position: "absolute",
        left: "0",
        top: "0",
        bottom: "0",
        width: "4px",
        borderRadius: `${radiusMd} 0 0 ${radiusMd}`,
    },
    "@media (max-width: 640px)": {
        padding: "0.875rem 1rem",
        gap: "0.5rem",
    }, };
//  AVATAR
const avatarBase = { width: "2.75rem", // Slightly smaller
    height: "2.75rem",
    "border-radius": "50%",
    "object-fit": "cover",
    border: `2px solid ${surfaceLight}`, // Thinner
    "box-shadow": shadowSm,
    transition: standardTransition, };
// PROGRESS
const progressBase = { width: "100%",
    borderRadius: radiusSm,
    overflow: "hidden",
    backdropFilter: blurGlass,
    position: "relative", };
//  TAB
const tabBase = { padding: "0.75rem 1.25rem", // Reduced
    background: "transparent",
    border: "none",
    "border-bottom": "2px solid transparent",
    color: textDark,
    cursor: "pointer",
    transition: standardTransition,
    "font-weight": "500",
    "border-radius": radiusSm, };
// SKELETON
const skeletonBase = {
    background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
    "background-size": "200% 100%",
    "border-radius": radiusSm,
    animation: "shimmer 1.5s infinite",
};
// SPINNER
const spinnerBase = { display: "inline-block",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    border: "2px solid transparent", };
const toastBase = {
    position: "fixed",
    bottom: "1.5rem",
    right: "1.5rem",
    padding: "1rem 1.25rem", // Reduced
    "border-radius": radiusMd,
    background: surfaceLight,
    color: textDark,
    "box-shadow": shadowLg,
    border: `1px solid ${borderColorLight}`,
    "z-index": "10000",
    "max-width": "20rem",
    "backdrop-filter": blurGlass,
    transition: standardTransition,
};

/**
 * ---------------------------------------------------------------------
 *  GARUR-CSS — Ultra-fast Atomic CSS Engine
 *  Author: Barshan Sarkar
 *  Version: 1.0.0
 *  License: MIT
 * ---------------------------------------------------------------------
 *
 *  This CLI powers the Garur-CSS ecosystem. It handles:
 *    • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 *    • File scanning across HTML / JS / TS / JSX / TSX
 *    • Cache management and orphan-class detection
 *    • Config file creation (garur.config.js)
 *    • Plugin boilerplate generation
 *    • Watch mode for real-time builds ,, (coming soon)
 *
 *  Technologies:
 *    - TypeScript
 *    - Rollup bundling (CJS-compatible output)
 *    - Node.js (CLI execution via shebang)
 *
 *  Notes for contributors:
 *    • Keep the CLI ESM/CJS compatible.
 *    • Avoid dynamic require unless wrapped safely.
 *    • Keep output messages clean, fast, and developer-friendly.
 *
 *  Made in India.
 * ---------------------------------------------------------------------
 */
const buttons = {
    btn: { base: btnBase },
    btnXs: {
        base: mergeStyles(btnBase, {
            padding: "0.375rem 0.75rem",
            fontSize: "0.75rem",
            borderRadius: radiusSm,
            gap: "0.25rem",
        }),
    },
    btnSm: {
        base: mergeStyles(btnBase, {
            padding: "0.5rem 1rem",
            fontSize: "0.8125rem",
            borderRadius: radiusSm,
        }),
    },
    btnMd: {
        base: mergeStyles(btnBase, {
            padding: "0.75rem 1.5rem",
            fontSize: "0.9375rem",
            borderRadius: radiusSm,
        }),
    },
    btnLg: {
        base: mergeStyles(btnBase, {
            padding: "1rem 2rem",
            fontSize: "1rem",
            borderRadius: radiusMd,
        }),
    },
    btnXl: {
        base: mergeStyles(btnBase, {
            padding: "1.125rem 2.25rem",
            fontSize: "1.125rem",
            borderRadius: radiusMd,
        }),
    },
    btnPrimary: {
        base: mergeStyles(btnBase, {
            background: `linear-gradient(135deg, ${primaryDark}, ${primary}, ${primaryLight})`,
            color: "#fff",
            boxShadow: shadowSm,
            "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: shadowMd,
            },
        }),
    },
    btnSecondary: {
        base: mergeStyles(btnBase, {
            border: `1px solid ${success}`,
            fontWeight: "600",
            color: success,
            background: surfaceLight,
            backdropFilter: blurGlass,
            "&:hover": {
                background: success,
                color: "#fff",
                transform: "translateY(-2px)",
                boxShadow: shadowMd,
            },
        }),
    },
    btnSuccess: {
        base: mergeStyles(btnBase, {
            background: `linear-gradient(135deg, ${successDark}, ${success}, ${successLight})`,
            color: "#fff",
            boxShadow: shadowSm,
            "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: shadowMd,
            },
        }),
    },
    btnDanger: {
        base: mergeStyles(btnBase, {
            background: `linear-gradient(135deg, ${dangerDark}, ${danger}, ${dangerLight})`,
            color: "#fff",
            boxShadow: shadowSm,
            "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: shadowMd,
            },
        }),
    },
    btnWarning: {
        base: mergeStyles(btnBase, {
            background: `linear-gradient(135deg, ${warningDark}, ${warning}, ${warningLight})`,
            color: "#fff",
            boxShadow: shadowSm,
            "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: shadowMd,
            },
        }),
    },
    btnInfo: {
        base: mergeStyles(btnBase, {
            background: `linear-gradient(135deg, ${infoDark}, ${info}, ${infoLight})`,
            color: "#fff",
            boxShadow: shadowSm,
            "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: shadowMd,
            },
        }),
    },
    btnOutline: {
        base: mergeStyles(btnBase, {
            border: `1px solid ${primary}`,
            color: primary,
            background: "transparent",
            "&:hover": {
                background: primary,
                color: "#fff",
                transform: "translateY(-2px)",
                boxShadow: shadowMd,
            },
        }),
    },
    btnOutlineSuccess: {
        base: mergeStyles(btnBase, {
            border: `1px solid ${success}`,
            color: success,
            background: "transparent",
            "&:hover": {
                background: success,
                color: "#fff",
                transform: "translateY(-2px)",
                boxShadow: shadowMd,
            },
        }),
    },
    btnOutlineDanger: {
        base: mergeStyles(btnBase, {
            border: `1px solid ${danger}`,
            color: danger,
            background: "transparent",
            "&:hover": {
                background: danger,
                color: "#fff",
                transform: "translateY(-2px)",
                boxShadow: shadowMd,
            },
        }),
    },
    btnOutlineWarning: {
        base: mergeStyles(btnBase, {
            border: `1px solid ${warning}`,
            color: warning,
            background: "transparent",
            "&:hover": {
                background: warning,
                color: "#fff",
                transform: "translateY(-2px)",
                boxShadow: shadowMd,
            },
        }),
    },
    btnOutlineInfo: {
        base: mergeStyles(btnBase, {
            border: `1px solid ${info}`,
            color: info,
            background: "transparent",
            "&:hover": {
                background: info,
                color: "#fff",
                transform: "translateY(-2px)",
                boxShadow: shadowMd,
            },
        }),
    },
    btnOutlineDark: {
        base: mergeStyles(btnBase, {
            border: `1px solid #000`,
            color: "#000",
            background: "transparent",
            "&:hover": {
                background: "#000",
                color: "#fff",
                transform: "translateY(-2px)",
                boxShadow: shadowMd,
            },
            "&:dark": {
                border: `1px solid #fff`,
                color: "#fff",
                background: "transparent",
                "&:hover": {
                    background: "#fff",
                    color: "#000",
                },
            },
        }),
    },
    btnDark: {
        base: mergeStyles(btnBase, {
            background: surfaceDark,
            color: textLight,
            border: `1px solid ${borderColorDark}`,
            boxShadow: shadowSm,
            "&:hover": {
                background: `${borderColorDark}`,
                transform: "translateY(-2px)",
                boxShadow: shadowMd,
            },
        }),
    },
    btnDisabled: {
        base: mergeStyles(btnBase, {
            opacity: "0.6",
            cursor: "not-allowed",
        }),
    },
    btnLoading: {
        base: mergeStyles(btnBase, {
            position: "relative",
            color: "transparent",
            pointerEvents: "none",
        }),
    },
    btnBlock: {
        base: mergeStyles(btnBase, {
            width: "100%",
            justifyContent: "center",
        }),
    },
    btnGroup: {
        base: {
            display: "inline-flex",
            borderRadius: radiusSm,
            overflow: "hidden",
        },
    },
    btnFloating: {
        base: mergeStyles(btnBase, {
            width: "3rem",
            height: "3rem",
            borderRadius: "50%",
            padding: "0",
            background: `linear-gradient(135deg, ${primaryDark}, ${primary}, ${primaryLight})`,
            color: "#fff",
            boxShadow: shadowSm,
            "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: shadowMd,
            },
        }),
    },
    btnFloatingSm: {
        base: mergeStyles(btnBase, {
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "50%",
            padding: "0",
            background: `linear-gradient(135deg, ${primaryDark}, ${primary}, ${primaryLight})`,
            color: "#fff",
            boxShadow: shadowSm,
            "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: shadowMd,
            },
        }),
    },
    btnFloatingLg: {
        base: mergeStyles(btnBase, {
            width: "4rem",
            height: "4rem",
            borderRadius: "50%",
            padding: "0",
            background: `linear-gradient(135deg, ${primaryDark}, ${primary}, ${primaryLight})`,
            color: "#fff",
            boxShadow: shadowSm,
            "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: shadowMd,
            },
        }),
    },
    btnGoogle: {
        base: mergeStyles(btnBase, {
            background: "#ffffff",
            color: "#3c4043",
            border: "1px solid #dadce0",
            boxShadow: shadowSm,
            "&:hover": {
                background: "#f8f9fa",
                transform: "translateY(-1px)",
                boxShadow: shadowMd,
            },
        }),
    },
    btnGithub: {
        base: mergeStyles(btnBase, {
            background: "#333",
            color: "#fff",
            boxShadow: shadowSm,
            "&:hover": {
                background: "#24292e",
                transform: "translateY(-1px)",
                boxShadow: shadowMd,
            },
        }),
    },
    btnFacebook: {
        base: mergeStyles(btnBase, {
            background: "#1877f2",
            color: "#fff",
            boxShadow: shadowSm,
            "&:hover": {
                background: "#166fe5",
                transform: "translateY(-1px)",
                boxShadow: shadowMd,
            },
        }),
    },
    btnTwitter: {
        base: mergeStyles(btnBase, {
            background: "#1da1f2",
            color: "#fff",
            boxShadow: shadowSm,
            "&:hover": {
                background: "#0d8bd9",
                transform: "translateY(-1px)",
                boxShadow: shadowMd,
            },
        }),
    },
    btnGhost: {
        base: mergeStyles(btnBase, {
            background: "transparent",
            color: primary,
            "&:hover": {
                background: `rgba(${primary.replace('#', '')}, 0.1)`,
                transform: "translateY(-1px)",
            },
        }),
    },
    btnGhostSuccess: {
        base: mergeStyles(btnBase, {
            background: "transparent",
            color: success,
            "&:hover": {
                background: `rgba(${success.replace('#', '')}, 0.1)`,
                transform: "translateY(-1px)",
            },
        }),
    },
    btnIcon: {
        base: mergeStyles(btnBase, {
            width: "2.5rem",
            height: "2.5rem",
            padding: "0",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: shadowSm,
            "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: shadowMd,
            },
        }),
    },
    btnIconSm: {
        base: mergeStyles(btnBase, {
            width: "2rem",
            height: "2rem",
            padding: "0",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: shadowSm,
            "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: shadowMd,
            },
        }),
    },
    btnIconLg: {
        base: mergeStyles(btnBase, {
            width: "3rem",
            height: "3rem",
            padding: "0",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: shadowSm,
            "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: shadowMd,
            },
        }),
    },
    btnLink: {
        base: mergeStyles(btnBase, {
            background: "transparent",
            color: primary,
            textDecoration: "underline",
            padding: "0.25rem 0",
            borderRadius: "0",
            "&:hover": {
                color: `${primaryDark}`,
                textDecoration: "none",
            },
        }),
    },
};

/**
 * ---------------------------------------------------------------------
 *  GARUR-CSS — Ultra-fast Atomic CSS Engine
 *  Author: Barshan Sarkar
 *  Version: 1.0.0
 *  License: MIT
 * ---------------------------------------------------------------------
 *
 *  This CLI powers the Garur-CSS ecosystem. It handles:
 *    • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 *    • File scanning across HTML / JS / TS / JSX / TSX
 *    • Cache management and orphan-class detection
 *    • Config file creation (garur.config.js)
 *    • Plugin boilerplate generation
 *    • Watch mode for real-time builds ,, (coming soon)
 *
 *  Technologies:
 *    - TypeScript
 *    - Rollup bundling (CJS-compatible output)
 *    - Node.js (CLI execution via shebang)
 *
 *  Notes for contributors:
 *    • Keep the CLI ESM/CJS compatible.
 *    • Avoid dynamic require unless wrapped safely.
 *    • Keep output messages clean, fast, and developer-friendly.
 *
 *  Made in India.
 * ---------------------------------------------------------------------
 */
// ei ekla ghor amar desh ... amar ekla thakar obhesh ... vabi kichu tei vabbona tomar kotha .. boba teliphone er pase bose ... tobu govir rater o govir cinemai jodi prem chay ...
const card = {
    cardSm: {
        base: mergeStyles(cardBase, { padding: "1rem" }),
    },
    cardMd: {
        base: mergeStyles(cardBase, { padding: "1.5rem" }),
    },
    cardLg: {
        base: mergeStyles(cardBase, { padding: "2rem" }),
    },
    cardXl: {
        base: mergeStyles(cardBase, { padding: "3rem" }),
    },
    card: {
        base: mergeStyles(cardBase, {
            padding: "1.5rem",
            border: `1px solid ${borderColorLight}`,
            background: surfaceLight,
            color: textDark,
            "&:hover": { transform: "translateY(-4px)", boxShadow: shadowMd }
        }),
    },
    cardOutlined: {
        base: mergeStyles(cardBase, {
            padding: "1.5rem",
            background: "transparent",
            color: textDark,
            border: `2px solid rgba(59, 130, 246, 0.2)`,
            "&:hover": {
                borderColor: primary,
                boxShadow: shadowSm,
                transform: "translateY(-2px)",
            },
        }),
    },
    cardBorderless: {
        base: mergeStyles(cardBase, {
            padding: "1.5rem",
            background: surfaceLight,
            boxShadow: shadowSm,
            border: "none",
        }),
    },
    cardGlass: {
        base: mergeStyles(cardBase, {
            padding: "2rem",
            borderRadius: radiusLg,
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: blurGlassHeavy,
            border: `1px solid rgba(255, 255, 255, 0.15)`,
            boxShadow: shadowLg,
            "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: shadowXl,
            },
        }),
    },
    cardHeader: {
        base: {
            padding: "1.5rem 1.5rem 1rem",
            borderBottom: `1px solid ${borderColorLight}`,
            fontWeight: "600",
            fontSize: "1.25rem",
        },
    },
    cardBody: {
        base: { padding: "1.5rem", flex: "1" },
    },
    cardFooter: {
        base: {
            padding: "1rem 1.5rem 1.5rem",
            borderTop: `1px solid ${borderColorLight}`,
            background: surfaceAltLight,
        },
    },
    cardWithImage: {
        base: mergeStyles(cardBase, {
            padding: "0",
            background: surfaceLight,
            overflow: "hidden",
            "&:hover": { transform: "translateY(-4px)", boxShadow: shadowLg },
        }),
    },
    cardImage: {
        base: {
            width: "100%",
            height: "12rem",
            objectFit: "cover",
        },
    },
    cardImageLg: {
        base: {
            width: "100%",
            height: "16rem",
            objectFit: "cover",
        },
    },
    cardImageSm: {
        base: {
            width: "100%",
            height: "8rem",
            objectFit: "cover",
        },
    },
    cardHover: {
        base: mergeStyles(cardBase, {
            padding: "1.5rem",
            cursor: "pointer",
            border: `1px solid ${borderColorLight}`,
            "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: shadowLg,
                borderColor: primary,
            },
        }),
    },
    cardClickable: {
        base: mergeStyles(cardBase, {
            padding: "1.5rem",
            cursor: "pointer",
            border: `1px solid ${borderColorLight}`,
            transition: "all 0.2s ease",
            "&:active": { transform: "translateY(2px)", boxShadow: shadowSm },
            "&:hover": { borderColor: primary },
        }),
    },
    cardGradient: {
        base: mergeStyles(cardBase, {
            padding: "1.5rem",
            color: "#fff",
            background: `linear-gradient(135deg, ${primaryLight}, ${primary})`,
        }),
    },
    cardGradientSuccess: {
        base: mergeStyles(cardBase, {
            padding: "1.5rem",
            color: "#fff",
            background: `linear-gradient(135deg, ${successLight}, ${success})`,
        }),
    },
    cardGradientDanger: {
        base: mergeStyles(cardBase, {
            padding: "1.5rem",
            color: "#fff",
            background: `linear-gradient(135deg, ${dangerLight}, ${danger})`,
        }),
    },
    cardDark: {
        base: mergeStyles(cardBase, {
            padding: "1.5rem",
            background: surfaceDark,
            color: textLight,
            border: `1px solid ${borderColorDark}`,
        }),
    },
    cardGlassDark: {
        base: mergeStyles(cardBase, {
            padding: "2rem",
            borderRadius: radiusLg,
            background: "rgba(31, 41, 55, 0.1)",
            backdropFilter: blurGlassHeavy,
            border: `1px solid ${borderColorDark}`,
            boxShadow: shadowLg,
        }),
    },
};

/**
 * ---------------------------------------------------------------------
 *  GARUR-CSS — Ultra-fast Atomic CSS Engine
 *  Author: Barshan Sarkar
 *  Version: 1.0.0
 *  License: MIT
 * ---------------------------------------------------------------------
 *
 *  This CLI powers the Garur-CSS ecosystem. It handles:
 *    • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 *    • File scanning across HTML / JS / TS / JSX / TSX
 *    • Cache management and orphan-class detection
 *    • Config file creation (garur.config.js)
 *    • Plugin boilerplate generation
 *    • Watch mode for real-time builds ,, (coming soon)
 *
 *  Technologies:
 *    - TypeScript
 *    - Rollup bundling (CJS-compatible output)
 *    - Node.js (CLI execution via shebang)
 *
 *  Notes for contributors:
 *    • Keep the CLI ESM/CJS compatible.
 *    • Avoid dynamic require unless wrapped safely.
 *    • Keep output messages clean, fast, and developer-friendly.
 *
 *  Made in India.
 * ---------------------------------------------------------------------
 */
const hero = {
    hero: {
        base: {
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(135deg, #0b132b 0%, #1c2a44 50%, #2d4059 100%)",
            color: "#f8fafc",
            textAlign: "center",
            padding: "0 1.5rem",
            isolation: "isolate",
            "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                background: `
            linear-gradient(90deg, transparent 60px, #334155 60px, #334155 120px),
            linear-gradient(0deg, transparent 30px, #334155 30px, #334155 60px)
          `,
                backgroundSize: "120px 60px",
                opacity: 0.08,
                animation: "gridScroll 40s linear infinite",
                pointerEvents: "none",
                willChange: "transform",
            },
            "&::after": {
                content: '""',
                position: "absolute",
                inset: 0,
                background: `
            radial-gradient(circle at 15% 85%, rgba(96, 165, 250, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 85% 15%, rgba(52, 211, 153, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 50% 40%, rgba(167, 139, 250, 0.4) 0%, transparent 60%)
          `,
                opacity: 0.4,
                animation: "meshPulse 22s ease-in-out infinite alternate",
                pointerEvents: "none",
            },
            "@media (max-width: 768px)": {
                padding: "0 1rem",
                minHeight: "90vh",
            },
            "@media (max-width: 480px)": {
                padding: "0 0.75rem",
                minHeight: "85vh",
            },
            "@media (prefers-reduced-motion: reduce)": {
                "&::before": {
                    animation: "none",
                    opacity: 0.05,
                },
                "&::after": {
                    animation: "none",
                    opacity: 0.3,
                },
            },
        },
    },
    heroLight: {
        base: {
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
            color: "#0f172a",
            textAlign: "center",
            padding: "0 1.5rem",
            isolation: "isolate",
            "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                background: `
            linear-gradient(90deg, transparent 60px, #e2e8f0 60px, #e2e8f0 120px),
            linear-gradient(0deg, transparent 30px, #e2e8f0 30px, #e2e8f0 60px)
          `,
                backgroundSize: "120px 60px",
                opacity: 0.06,
                animation: "gridScroll 40s linear infinite",
                pointerEvents: "none",
                willChange: "transform",
            },
            "&::after": {
                content: '""',
                position: "absolute",
                inset: 0,
                background: `
            radial-gradient(circle at 15% 85%, rgba(59, 130, 246, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 50% 40%, rgba(139, 92, 246, 0.4) 0%, transparent 60%)
          `,
                opacity: 0.3,
                animation: "meshPulse 22s ease-in-out infinite alternate",
                pointerEvents: "none",
            },
            "@media (max-width: 768px)": {
                padding: "0 1rem",
                minHeight: "90vh",
            },
            "@media (max-width: 480px)": {
                padding: "0 0.75rem",
                minHeight: "85vh",
            },
            "@media (prefers-reduced-motion: reduce)": {
                "&::before": {
                    animation: "none",
                    opacity: 0.04,
                },
                "&::after": {
                    animation: "none",
                    opacity: 0.2,
                },
            },
        },
    },
    heroContent: {
        base: {
            position: "relative",
            zIndex: 10,
            maxWidth: "1280px",
            margin: "0 auto",
            width: "100%",
            "@media (max-width: 768px)": {
                padding: "2rem 0",
            },
        },
    },
    heroTitle: {
        base: {
            fontSize: "clamp(3.5rem, 10vw, 7rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: "1.5rem",
            background: "linear-gradient(135deg, #60a5fa, #a78bfa, #ec4899)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "titleFloat 7s ease-in-out infinite",
            willChange: "transform",
            "@media (max-width: 768px)": {
                lineHeight: 1.1,
                marginBottom: "1rem",
                fontSize: "clamp(2.5rem, 12vw, 4rem)",
            },
            "@media (max-width: 480px)": {
                fontSize: "clamp(2rem, 10vw, 3rem)",
                marginBottom: "0.75rem",
            },
            "@media (prefers-reduced-motion: reduce)": {
                animation: "none",
            },
        },
    },
    heroTitleLight: {
        base: {
            fontSize: "clamp(3.5rem, 10vw, 7rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: "1.5rem",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "titleFloat 7s ease-in-out infinite",
            willChange: "transform",
            "@media (max-width: 768px)": {
                lineHeight: 1.1,
                marginBottom: "1rem",
                fontSize: "clamp(2.5rem, 12vw, 4rem)",
            },
            "@media (max-width: 480px)": {
                fontSize: "clamp(2rem, 10vw, 3rem)",
                marginBottom: "0.75rem",
            },
            "@media (prefers-reduced-motion: reduce)": {
                animation: "none",
            },
        },
    },
    heroSubtitle: {
        base: {
            fontSize: "clamp(1.125rem, 4vw, 1.75rem)",
            fontWeight: 500,
            opacity: 0.9,
            maxWidth: "48rem",
            margin: "0 auto 2.5rem",
            lineHeight: 1.6,
            color: "#e2e8f0",
            "@media (max-width: 768px)": {
                fontSize: "clamp(1rem, 4vw, 1.5rem)",
                margin: "0 auto 2rem",
                lineHeight: 1.5,
                padding: "0 1rem",
            },
            "@media (max-width: 480px)": {
                fontSize: "clamp(0.875rem, 4vw, 1.25rem)",
                margin: "0 auto 1.5rem",
                padding: "0 0.5rem",
            },
        },
    },
    heroSubtitleLight: {
        base: {
            fontSize: "clamp(1.125rem, 4vw, 1.75rem)",
            fontWeight: 500,
            opacity: 0.9,
            maxWidth: "48rem",
            margin: "0 auto 2.5rem",
            lineHeight: 1.6,
            color: "#475569",
            "@media (max-width: 768px)": {
                fontSize: "clamp(1rem, 4vw, 1.5rem)",
                margin: "0 auto 2rem",
                lineHeight: 1.5,
                padding: "0 1rem",
            },
            "@media (max-width: 480px)": {
                fontSize: "clamp(0.875rem, 4vw, 1.25rem)",
                margin: "0 auto 1.5rem",
                padding: "0 0.5rem",
            },
        },
    },
    heroCtaGroup: {
        base: {
            display: "flex",
            gap: "1.25rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "2rem",
            "@media (max-width: 768px)": {
                gap: "1rem",
                marginTop: "1.5rem",
                padding: "0 1rem",
            },
            "@media (max-width: 480px)": {
                flexDirection: "column",
                alignItems: "center",
                gap: "0.75rem",
                marginTop: "1rem",
            },
        },
    },
    heroCtaPrimary: {
        base: {
            padding: "1rem 2.5rem",
            fontSize: "1.125rem",
            fontWeight: 600,
            borderRadius: "9999px",
            background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
            color: "white",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(59, 130, 246, 0.35)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                transition: "left 0.5s ease",
            },
            "&:hover": {
                transform: "translateY(-4px) scale(1.02)",
                boxShadow: "0 20px 48px rgba(59, 130, 246, 0.45)",
                "&::before": {
                    left: "100%",
                },
            },
            "&:active": {
                transform: "translateY(-2px) scale(1.01)",
            },
            "&:focus": {
                outline: "none",
                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3), 0 8px 32px rgba(59, 130, 246, 0.35)",
            },
            "@media (max-width: 768px)": {
                padding: "0.875rem 2rem",
                fontSize: "1rem",
            },
            "@media (max-width: 480px)": {
                padding: "0.75rem 1.5rem",
                fontSize: "0.875rem",
                width: "100%",
                maxWidth: "280px",
            },
            "@media (prefers-reduced-motion: reduce)": {
                transition: "none",
                "&:hover": {
                    transform: "none",
                },
            },
        },
    },
    heroCtaSecondary: {
        base: {
            padding: "1rem 2.5rem",
            fontSize: "1.125rem",
            fontWeight: 600,
            borderRadius: "9999px",
            background: "rgba(255, 255, 255, 0.08)",
            color: "#e2e8f0",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(12px)",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(236, 72, 153, 0.1))",
                opacity: 0,
                transition: "opacity 0.3s ease",
            },
            "&:hover": {
                background: "rgba(255, 255, 255, 0.15)",
                borderColor: "#60a5fa",
                color: "#60a5fa",
                transform: "translateY(-4px)",
                "&::before": {
                    opacity: 1,
                },
            },
            "&:active": {
                transform: "translateY(-2px)",
            },
            "&:focus": {
                outline: "none",
                boxShadow: "0 0 0 3px rgba(96, 165, 250, 0.3)",
                borderColor: "#60a5fa",
            },
            "@media (max-width: 768px)": {
                padding: "0.875rem 2rem",
                fontSize: "1rem",
            },
            "@media (max-width: 480px)": {
                padding: "0.75rem 1.5rem",
                fontSize: "0.875rem",
                width: "100%",
                maxWidth: "280px",
            },
            "@media (prefers-reduced-motion: reduce)": {
                transition: "none",
                "&:hover": {
                    transform: "none",
                },
            },
        },
    },
    heroCtaSecondaryLight: {
        base: {
            padding: "1rem 2.5rem",
            fontSize: "1.125rem",
            fontWeight: 600,
            borderRadius: "9999px",
            background: "rgba(255, 255, 255, 0.8)",
            color: "#475569",
            border: "2px solid rgba(59, 130, 246, 0.2)",
            backdropFilter: "blur(12px)",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))",
                opacity: 0,
                transition: "opacity 0.3s ease",
            },
            "&:hover": {
                background: "rgba(255, 255, 255, 0.9)",
                borderColor: "#3b82f6",
                color: "#3b82f6",
                transform: "translateY(-4px)",
                "&::before": {
                    opacity: 1,
                },
            },
            "&:active": {
                transform: "translateY(-2px)",
            },
            "&:focus": {
                outline: "none",
                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
                borderColor: "#3b82f6",
            },
            "@media (max-width: 768px)": {
                padding: "0.875rem 2rem",
                fontSize: "1rem",
            },
            "@media (max-width: 480px)": {
                padding: "0.75rem 1.5rem",
                fontSize: "0.875rem",
                width: "100%",
                maxWidth: "280px",
            },
            "@media (prefers-reduced-motion: reduce)": {
                transition: "none",
                "&:hover": {
                    transform: "none",
                },
            },
        },
    },
    heroStats: {
        base: {
            display: "flex",
            justifyContent: "center",
            gap: "3rem",
            marginTop: "3rem",
            flexWrap: "wrap",
            "@media (max-width: 768px)": {
                gap: "2rem",
                marginTop: "2rem",
            },
            "@media (max-width: 480px)": {
                gap: "1.5rem",
                marginTop: "1.5rem",
            },
        },
    },
    heroStat: {
        base: {
            textAlign: "center",
            "&:hover .heroStatNumber": {
                transform: "scale(1.05)",
            },
        },
    },
    heroStatNumber: {
        base: {
            display: "block",
            fontSize: "2.5rem",
            fontWeight: 700,
            background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "0.5rem",
            transition: "transform 0.3s ease",
            "@media (max-width: 768px)": {
                fontSize: "2rem",
            },
            "@media (max-width: 480px)": {
                fontSize: "1.75rem",
            },
        },
    },
    heroStatLabel: {
        base: {
            fontSize: "0.875rem",
            color: "#94a3b8",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            "@media (max-width: 480px)": {
                fontSize: "0.75rem",
            },
        },
    },
    heroStatLabelLight: {
        base: {
            fontSize: "0.875rem",
            color: "#64748b",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            "@media (max-width: 480px)": {
                fontSize: "0.75rem",
            },
        },
    },
};

/**
 * ---------------------------------------------------------------------
 *  GARUR-CSS — Ultra-fast Atomic CSS Engine
 *  Author: Barshan Sarkar
 *  Version: 1.0.0
 *  License: MIT
 * ---------------------------------------------------------------------
 *
 *  This CLI powers the Garur-CSS ecosystem. It handles:
 *    • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 *    • File scanning across HTML / JS / TS / JSX / TSX
 *    • Cache management and orphan-class detection
 *    • Config file creation (garur.config.js)
 *    • Plugin boilerplate generation
 *    • Watch mode for real-time builds ,, (coming soon)
 *
 *  Technologies:
 *    - TypeScript
 *    - Rollup bundling (CJS-compatible output)
 *    - Node.js (CLI execution via shebang)
 *
 *  Notes for contributors:
 *    • Keep the CLI ESM/CJS compatible.
 *    • Avoid dynamic require unless wrapped safely.
 *    • Keep output messages clean, fast, and developer-friendly.
 *
 *  Made in India.
 * ---------------------------------------------------------------------
 */
const alert = {
    alert: {
        base: mergeStyles(alertBase, {
            color: textDark,
            "&::before": {
                background: primary,
            },
        }),
    },
    alertSuccess: {
        base: mergeStyles(alertBase, {
            border: `1px solid rgba(16, 185, 129, 0.2)`,
            background: `rgba(16, 185, 129, 0.08)`,
            color: success,
            "&::before": {
                background: success,
            },
        }),
    },
    alertError: {
        base: mergeStyles(alertBase, {
            border: `1px solid rgba(239, 68, 68, 0.2)`,
            background: `rgba(239, 68, 68, 0.08)`,
            color: danger,
            "&::before": {
                background: danger,
            },
        }),
    },
    alertWarning: {
        base: mergeStyles(alertBase, {
            border: `1px solid rgba(245, 158, 11, 0.2)`,
            background: `rgba(245, 158, 11, 0.08)`,
            color: warning,
            "&::before": {
                background: warning,
            },
        }),
    },
    alertInfo: {
        base: mergeStyles(alertBase, {
            border: `1px solid rgba(6, 182, 212, 0.2)`,
            background: `rgba(6, 182, 212, 0.08)`,
            color: info,
            "&::before": {
                background: info,
            },
        }),
    },
    alertDark: {
        base: mergeStyles(alertBase, {
            background: surfaceAltDark,
            border: `1px solid ${borderColorDark}`,
            color: textLight,
            "&::before": {
                background: primaryLight,
            },
        }, 'dark'),
    },
    alertSuccessDark: {
        base: mergeStyles(alertBase, {
            border: `1px solid rgba(52, 211, 153, 0.2)`,
            background: `rgba(52, 211, 153, 0.08)`,
            color: successLight,
            "&::before": {
                background: successLight,
            },
        }, 'dark'),
    },
    alertErrorDark: {
        base: mergeStyles(alertBase, {
            border: `1px solid rgba(248, 113, 113, 0.2)`,
            background: `rgba(248, 113, 113, 0.08)`,
            color: dangerLight,
            "&::before": {
                background: dangerLight,
            },
        }, 'dark'),
    },
    alertWarningDark: {
        base: mergeStyles(alertBase, {
            border: `1px solid rgba(251, 191, 36, 0.2)`,
            background: `rgba(251, 191, 36, 0.08)`,
            color: warningLight,
            "&::before": {
                background: warningLight,
            },
        }, 'dark'),
    },
    alertInfoDark: {
        base: mergeStyles(alertBase, {
            border: `1px solid rgba(14, 165, 233, 0.2)`,
            background: `rgba(14, 165, 233, 0.08)`,
            color: infoLight,
            "&::before": {
                background: infoLight,
            },
        }, 'dark'),
    },
    alertSm: {
        base: mergeStyles(alertBase, {
            padding: "0.75rem 1rem",
            fontSize: "0.875rem",
            "@media (max-width: 640px)": {
                padding: "0.625rem 0.875rem",
            },
        }),
    },
    alertLg: {
        base: mergeStyles(alertBase, {
            padding: "1.25rem 1.5rem",
            fontSize: "1.0625rem",
            "@media (max-width: 640px)": {
                padding: "1rem 1.25rem",
            },
        }),
    },
    alertDismissible: {
        base: mergeStyles(alertBase, {
            paddingRight: "3rem",
            "@media (max-width: 640px)": {
                paddingRight: "2.5rem",
            },
        }),
    },
    alertClose: {
        base: {
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            background: "none",
            border: "none",
            fontSize: "1.25rem",
            color: "inherit",
            opacity: "0.7",
            cursor: "pointer",
            padding: "0.25rem",
            borderRadius: radiusSm,
            transition: standardTransition,
            lineHeight: "1",
            width: "1.5rem",
            height: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
                opacity: "1",
                background: "rgba(0, 0, 0, 0.1)",
            },
            ".alertDark &:hover, .alertSuccessDark &:hover, .alertErrorDark &:hover, .alertWarningDark &:hover, .alertInfoDark &:hover": {
                background: "rgba(255, 255, 255, 0.1)",
            },
        },
    },
    alertIcon: {
        base: {
            fontSize: "1.25rem",
            lineHeight: "1",
            flexShrink: "0",
            marginTop: "0.125rem",
        },
    },
    alertContent: {
        base: {
            flex: "1",
            minWidth: "0",
        },
    },
    alertTitle: {
        base: {
            fontWeight: "600",
            margin: "0 0 0.25rem 0",
            fontSize: "1em",
        },
    },
    alertDescription: {
        base: {
            margin: "0",
            opacity: "0.9",
            fontSize: "0.9375em",
            lineHeight: "1.5",
        },
    },
    alertGroup: {
        base: {
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
        },
    },
    alertBanner: {
        base: mergeStyles(alertBase, {
            borderRadius: "0",
            borderLeft: "none",
            borderRight: "none",
            margin: "0 -1rem",
            padding: "0.75rem 1rem",
            "&::before": {
                borderRadius: "0",
            },
            "@media (min-width: 1025px)": {
                margin: "0 -2rem",
                padding: "0.75rem 2rem",
            },
        }),
    },
    alertBannerSuccess: {
        base: mergeStyles(alertBase, {
            border: `1px solid rgba(16, 185, 129, 0.2)`,
            background: `rgba(16, 185, 129, 0.08)`,
            color: success,
            "&::before": {
                background: success,
            },
        }),
    },
    alertWithActions: {
        base: mergeStyles(alertBase, {
            paddingBottom: "1.25rem",
        }),
    },
    alertActions: {
        base: {
            display: "flex",
            gap: "0.5rem",
            marginTop: "0.75rem",
            flexWrap: "wrap",
            "& .btnSm": {
                fontSize: "0.75rem",
                padding: "0.25rem 0.75rem",
            },
        },
    },
};

const navbar = {
    navbar: {
        base: {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            zIndex: "1000",
            background: "rgba(255, 255, 255, 0.85)",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            backdropFilter: "blur(16px)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&.scrolled": {
                background: "rgba(255, 255, 255, 0.95)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            },
        },
        dark: {
            background: "rgba(17, 24, 39, 0.85)",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
            "&.scrolled": {
                background: "rgba(17, 24, 39, 0.95)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
            },
        },
    },
    navContainer: {
        base: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "0 auto",
            maxWidth: "1280px",
            height: "3.5rem",
            padding: "0 1rem",
            "@media (min-width: 640px)": {
                height: "4rem",
                padding: "0 1.5rem",
            },
            "@media (min-width: 1025px)": {
                height: "4.5rem",
                padding: "0 2rem",
            },
        },
    },
    navBrand: {
        base: {
            fontSize: "1.25rem",
            fontWeight: "700",
            background: "linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textDecoration: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
                opacity: "0.9",
                transform: "scale(1.02)",
            },
            "@media (min-width: 640px)": {
                fontSize: "1.5rem",
            },
            "@media (max-width: 768px)": {
                fontSize: "1.125rem",
            },
        },
    },
    navLinks: {
        base: {
            display: "flex",
            gap: "1.5rem",
            alignItems: "center",
            listStyle: "none",
            "@media (max-width: 1024px)": {
                display: "none",
            },
        },
    },
    navLink: {
        base: {
            color: "#1e293b",
            fontWeight: "500",
            textDecoration: "none",
            padding: "0.375rem 0",
            position: "relative",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&.active": {
                color: "#3b82f6",
                "&::after": {
                    width: "100%",
                },
            },
            dark: {
                color: "#f1f5f9",
                "&.active": { color: "#60a5fa" },
            },
            "&::after": {
                content: '""',
                position: "absolute",
                bottom: "0",
                left: "50%",
                width: "0",
                height: "2px",
                background: "#3b82f6",
                transform: "translateX(-50%)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            },
            "&:hover": {
                color: "#3b82f6",
                dark: { color: "#60a5fa" },
                "&::after": {
                    width: "100%",
                },
            },
        },
    },
    menuButton: {
        base: {
            display: "none",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "2.5rem",
            height: "2.5rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.375rem",
            borderRadius: radiusMd,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            zIndex: "1001",
            color: "#1e293b",
            dark: { color: "#f1f5f9" },
            "&:hover": {
                background: "rgba(0, 0, 0, 0.05)",
                dark: { background: "rgba(255, 255, 255, 0.1)" },
            },
            "@media (max-width: 1024px)": {
                display: "flex",
            },
            "& .bar": {
                display: "block",
                width: "22px",
                height: "2px",
                background: "currentColor",
                margin: "3px 0",
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                borderRadius: "1px",
            },
        },
        active: {
            "& .bar:nth-child(1)": {
                transform: "translateY(7px) rotate(45deg)",
            },
            "& .bar:nth-child(2)": {
                opacity: "0",
                transform: "translateX(-100%)",
            },
            "& .bar:nth-child(3)": {
                transform: "translateY(-7px) rotate(-45deg)",
            },
        },
    },
    mobileMenu: {
        base: {
            position: "fixed",
            top: "3.5rem",
            left: "0",
            right: "0",
            background: "#ffffff",
            backdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(148, 163, 184, 0.3)",
            padding: "1rem 0.75rem",
            transform: "translateY(-100%)",
            opacity: "0",
            visibility: "hidden",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: "999",
            maxHeight: "calc(100vh - 3.5rem)",
            overflowY: "auto",
            "&::before": {
                content: '""',
                position: "fixed",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                background: "rgba(0, 0, 0, 0.5)",
                opacity: "0",
                visibility: "hidden",
                zIndex: "-1",
                transition: "opacity 0.4s ease",
            },
            "@media (min-width: 1025px)": {
                display: "none",
            },
            "@media (max-width: 768px)": {
                top: "3rem",
                maxHeight: "calc(100vh - 3rem)",
                padding: "0.75rem",
            },
        },
        mobileMenuOpen: {
            transform: "translateY(0)",
            opacity: "1",
            visibility: "visible",
            "&::before": {
                opacity: "1",
                visibility: "visible",
            },
        },
        dark: {
            background: "#1f2937",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            "&::before": {
                background: "rgba(0, 0, 0, 0.7)",
            },
        },
    },
    mobileMenuItem: {
        base: {
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem 0.75rem",
            fontSize: "1.125rem",
            fontWeight: "500",
            color: "#1e293b",
            textDecoration: "none",
            borderBottom: "1px solid rgba(148, 163, 184, 0.3)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            overflow: "hidden",
            "&:last-child": {
                borderBottom: "none",
            },
            "&:hover": {
                color: "#3b82f6",
                paddingLeft: "1.25rem",
                background: "#f8fafc",
                dark: {
                    color: "#60a5fa",
                    background: "#374151",
                },
                "&::before": {
                    transform: "translateX(0)",
                },
            },
            "&::before": {
                content: '""',
                position: "absolute",
                left: "0",
                top: "0",
                bottom: "0",
                width: "4px",
                background: "#3b82f6",
                transform: "translateX(-100%)",
                transition: "transform 0.3s ease",
            },
            "@media (max-width: 640px)": {
                fontSize: "1rem",
                padding: "0.875rem 0.75rem",
            },
        },
        dark: {
            color: "#f1f5f9",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            "&:hover": {
                background: "#374151",
            },
        },
    },
    themeToggle: {
        base: {
            background: "none",
            border: "none",
            color: "#1e293b",
            cursor: "pointer",
            padding: "0.5rem",
            borderRadius: "6px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: "500",
            "&:hover": {
                background: "rgba(0, 0, 0, 0.05)",
                dark: { background: "rgba(255, 255, 255, 0.1)" },
                transform: "scale(1.05)",
            },
            "& .icon": {
                transition: "transform 0.3s ease",
            },
            "&.dark .icon": {
                transform: "rotate(180deg)",
            },
        },
        dark: {
            color: "#f1f5f9",
            "&:hover": {
                background: "rgba(255, 255, 255, 0.1)",
            },
        },
    },
    darkToggle: {
        base: {
            position: "fixed",
            top: "0.75rem",
            right: "0.75rem",
            zIndex: "10000",
            padding: "0.375rem 0.875rem",
            background: surfaceDark,
            color: textLight,
            border: "none",
            borderRadius: radiusMd,
            cursor: "pointer",
            fontSize: "0.8125rem",
            transition: standardTransition,
            "&:hover": {
                transform: "scale(1.02)",
                boxShadow: shadowSm,
            },
            "&:focus": {
                outline: "none",
                boxShadow: `0 0 0 2px ${primary}20`,
            },
        },
    },
    darkToggleLight: {
        base: {
            position: "fixed",
            top: "0.75rem",
            right: "0.75rem",
            zIndex: "10000",
            padding: "0.375rem 0.875rem",
            background: surfaceLight,
            color: textDark,
            border: `1px solid ${borderColorLight}`,
            borderRadius: radiusMd,
            cursor: "pointer",
            fontSize: "0.8125rem",
            transition: standardTransition,
            "&:hover": {
                transform: "scale(1.02)",
                boxShadow: shadowSm,
            },
            "&:focus": {
                outline: "none",
                boxShadow: `0 0 0 2px ${primary}20`,
            },
        },
    },
};

const inputs = {
    input: {
        base: inputBase,
    },
    inputSm: {
        base: mergeStyles(inputBase, {
            padding: "0.5rem 0.875rem",
            fontSize: "0.8125rem",
            borderRadius: radiusSm,
        }),
    },
    inputMd: {
        base: mergeStyles(inputBase, {
            padding: "0.75rem 1rem",
            fontSize: "0.9375rem",
        }),
    },
    inputLg: {
        base: mergeStyles(inputBase, {
            padding: "1rem 1.25rem",
            fontSize: "1rem",
            borderRadius: radiusMd,
        }),
    },
    inputXl: {
        base: mergeStyles(inputBase, {
            padding: "1.125rem 1.5rem",
            fontSize: "1.125rem",
            borderRadius: radiusMd,
        }),
    },
    inputDark: {
        base: mergeStyles(inputBase, {
            color: textLight,
            background: surfaceDark,
            border: `1px solid ${borderColorDark}`,
            "&:focus": {
                boxShadow: `0 0 0 2px ${primaryLight}15`,
            },
            "&::placeholder": {
                color: "rgba(255, 255, 255, 0.4)",
            },
        }, 'dark'),
    },
    inputOutline: {
        base: mergeStyles(inputBase, {
            border: `2px solid rgba(59, 130, 246, 0.2)`,
            background: "transparent",
            "&:focus": {
                borderColor: primary,
                boxShadow: `0 0 0 2px ${primary}10`,
            },
        }),
    },
    inputFilled: {
        base: mergeStyles(inputBase, {
            border: "none",
            background: surfaceAltLight,
            "&:focus": {
                background: surfaceLight,
                boxShadow: `0 0 0 2px ${primary}20`,
            },
        }),
    },
    inputGlass: {
        base: mergeStyles(inputBase, {
            border: `1px solid rgba(255, 255, 255, 0.2)`,
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: blurGlassHeavy,
            color: textLight,
            "&:focus": {
                background: "rgba(255, 255, 255, 0.12)",
                borderColor: "rgba(255, 255, 255, 0.3)",
            },
            "&::placeholder": {
                color: "rgba(255, 255, 255, 0.6)",
            },
        }),
    },
    inputSuccess: {
        base: mergeStyles(inputBase, {
            borderColor: success,
            boxShadow: `0 0 0 2px ${success}15`,
            "&:focus": {
                borderColor: success,
                boxShadow: `0 0 0 2px ${success}25`,
            },
        }),
    },
    inputError: {
        base: mergeStyles(inputBase, {
            borderColor: danger,
            boxShadow: `0 0 0 2px ${danger}15`,
            "&:focus": {
                borderColor: danger,
                boxShadow: `0 0 0 2px ${danger}25`,
            },
        }),
    },
    inputWarning: {
        base: mergeStyles(inputBase, {
            borderColor: warning,
            boxShadow: `0 0 0 2px ${warning}15`,
            "&:focus": {
                borderColor: warning,
                boxShadow: `0 0 0 2px ${warning}25`,
            },
        }),
    },
    inputDisabled: {
        base: mergeStyles(inputBase, {
            opacity: "0.6",
            cursor: "not-allowed",
            background: surfaceAltLight,
            "&:focus": {
                transform: "none",
                boxShadow: "none",
                borderColor: borderColorLight,
            },
        }),
    },
};

/**
 * ---------------------------------------------------------------------
 *  GARUR-CSS — Ultra-fast Atomic CSS Engine
 *  Author: Barshan Sarkar
 *  Version: 1.0.0
 *  License: MIT
 * ---------------------------------------------------------------------
 *
 *  This CLI powers the Garur-CSS ecosystem. It handles:
 *    • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 *    • File scanning across HTML / JS / TS / JSX / TSX
 *    • Cache management and orphan-class detection
 *    • Config file creation (garur.config.js)
 *    • Plugin boilerplate generation
 *    • Watch mode for real-time builds ,, (coming soon)
 *
 *  Technologies:
 *    - TypeScript
 *    - Rollup bundling (CJS-compatible output)
 *    - Node.js (CLI execution via shebang)
 *
 *  Notes for contributors:
 *    • Keep the CLI ESM/CJS compatible.
 *    • Avoid dynamic require unless wrapped safely.
 *    • Keep output messages clean, fast, and developer-friendly.
 *
 *  Made in India.
 * ---------------------------------------------------------------------
 */
const formGroups = {
    formGroup: {
        base: {
            marginBottom: "1.5rem",
            position: "relative",
        },
    },
    formLabel: {
        base: {
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "500",
            color: textDark,
            fontSize: "0.875rem",
            transition: standardTransition,
        },
    },
    formLabelDark: {
        base: {
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "500",
            color: textLight,
            fontSize: "0.875rem",
        },
    },
    formHelp: {
        base: {
            display: "block",
            marginTop: "0.25rem",
            fontSize: "0.75rem",
            color: "rgba(0, 0, 0, 0.6)",
        },
    },
    formHelpError: {
        base: {
            display: "block",
            marginTop: "0.25rem",
            fontSize: "0.75rem",
            color: danger,
            fontWeight: "500",
        },
    },
    formHelpSuccess: {
        base: {
            display: "block",
            marginTop: "0.25rem",
            fontSize: "0.75rem",
            color: success,
            fontWeight: "500",
        },
    },
    form: {
        base: {
            width: "100%",
        },
    },
    formCard: {
        base: mergeStyles(cardBase, {
            padding: "2rem",
            "@media (max-width: 640px)": {
                padding: "1.5rem",
            },
        }),
    },
    formInline: {
        base: {
            display: "flex",
            gap: "1rem",
            alignItems: "flex-end",
            "@media (max-width: 640px)": {
                flexDirection: "column",
                alignItems: "stretch",
            },
        },
    },
    formValid: {
        base: {
            "& .formLabel": {
                color: success,
            },
        },
    },
    formInvalid: {
        base: {
            "& .formLabel": {
                color: danger,
            },
        },
    },
};

const inputGroups = {
    inputGroup: {
        base: {
            display: "flex",
            borderRadius: radiusSm,
            overflow: "hidden",
            boxShadow: shadowSm,
        },
    },
    inputGroupPrepend: {
        base: {
            display: "flex",
            alignItems: "center",
            padding: "0 1rem",
            background: surfaceAltLight,
            border: `1px solid ${borderColorLight}`,
            borderRight: "none",
            color: "rgba(0, 0, 0, 0.6)",
            fontSize: "0.875rem",
        },
    },
    inputGroupAppend: {
        base: {
            display: "flex",
            alignItems: "center",
            padding: "0 1rem",
            background: surfaceAltLight,
            border: `1px solid ${borderColorLight}`,
            borderLeft: "none",
            color: "rgba(0, 0, 0, 0.6)",
            fontSize: "0.875rem",
        },
    },
    inputGroupText: {
        base: {
            padding: "0.75rem 1rem",
            background: surfaceAltLight,
            border: `1px solid ${borderColorLight}`,
            fontSize: "0.875rem",
            whiteSpace: "nowrap",
        },
    },
};

/**
 * ---------------------------------------------------------------------
 *  GARUR-CSS — Ultra-fast Atomic CSS Engine
 *  Author: Barshan Sarkar
 *  Version: 1.0.0
 *  License: MIT
 * ---------------------------------------------------------------------
 *
 *  This CLI powers the Garur-CSS ecosystem. It handles:
 *    • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 *    • File scanning across HTML / JS / TS / JSX / TSX
 *    • Cache management and orphan-class detection
 *    • Config file creation (garur.config.js)
 *    • Plugin boilerplate generation
 *    • Watch mode for real-time builds ,, (coming soon)
 *
 *  Technologies:
 *    - TypeScript
 *    - Rollup bundling (CJS-compatible output)
 *    - Node.js (CLI execution via shebang)
 *
 *  Notes for contributors:
 *    • Keep the CLI ESM/CJS compatible.
 *    • Avoid dynamic require unless wrapped safely.
 *    • Keep output messages clean, fast, and developer-friendly.
 *
 *  Made in India.
 * ---------------------------------------------------------------------
 */
const Accordion = {
    accordion: {
        base: {
            width: "100%",
            borderRadius: radiusMd,
            border: `1px solid ${borderColorLight}`,
            overflow: "hidden",
            boxShadow: shadowSm,
            transition: standardTransition,
            background: surfaceLight,
            "&:hover": {
                boxShadow: shadowMd,
            },
            "@media (max-width: 640px)": {
                borderRadius: radiusSm,
            },
        },
    },
    accordionDark: {
        base: mergeStyles({
            width: "100%",
            borderRadius: radiusMd,
            border: `1px solid ${borderColorDark}`,
            overflow: "hidden",
            boxShadow: shadowSm,
            transition: standardTransition,
            background: surfaceDark,
            "&:hover": {
                boxShadow: shadowMd,
            },
            "@media (max-width: 640px)": {
                borderRadius: radiusSm,
            },
        }, {}, 'dark'),
    },
    accordionItem: {
        base: {
            borderBottom: `1px solid ${borderColorLight}`,
            transition: standardTransition,
            "&:last-child": {
                borderBottom: "none",
            },
            "&:hover": {
                background: surfaceAltLight,
            },
            "&.accordionItemActive": {
                background: "rgba(59, 130, 246, 0.03)",
            },
        },
    },
    accordionItemDark: {
        base: mergeStyles({
            borderBottom: `1px solid ${borderColorDark}`,
            transition: standardTransition,
            "&:last-child": {
                borderBottom: "none",
            },
            "&:hover": {
                background: surfaceAltDark,
            },
            "&.accordionItemActive": {
                background: "rgba(96, 165, 250, 0.05)",
            },
        }, {}, 'dark'),
    },
    accordionTrigger: {
        base: {
            width: "100%",
            padding: "1.25rem 1.5rem",
            background: "none",
            border: "none",
            textAlign: "left",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            color: textDark,
            fontWeight: "600",
            fontSize: "1rem",
            transition: standardTransition,
            position: "relative",
            "&:hover": {
                background: "rgba(59, 130, 246, 0.05)",
                color: primary,
            },
            "&:focus": {
                outline: "none",
                boxShadow: `inset 0 0 0 2px ${primary}20`,
            },
            "&.accordionTriggerActive": {
                color: primary,
                background: "rgba(59, 130, 246, 0.08)",
            },
            "@media (max-width: 640px)": {
                padding: "1rem 1.25rem",
                fontSize: "0.9375rem",
            },
        },
    },
    accordionTriggerDark: {
        base: mergeStyles({
            width: "100%",
            padding: "1.25rem 1.5rem",
            background: "none",
            border: "none",
            textAlign: "left",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            color: textLight,
            fontWeight: "600",
            fontSize: "1rem",
            transition: standardTransition,
            position: "relative",
            "&:hover": {
                background: "rgba(96, 165, 250, 0.08)",
                color: primaryLight,
            },
            "&:focus": {
                outline: "none",
                boxShadow: `inset 0 0 0 2px ${primaryLight}20`,
            },
            "&.accordionTriggerActive": {
                color: primaryLight,
                background: "rgba(96, 165, 250, 0.12)",
            },
        }, {}, 'dark'),
    },
    accordionIcon: {
        base: {
            width: "1.25rem",
            height: "1.25rem",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            flexShrink: "0",
            opacity: "0.7",
            "&.accordionIconActive": {
                transform: "rotate(180deg)",
                opacity: "1",
            },
        },
    },
    accordionContent: {
        base: {
            padding: "0 1.5rem",
            maxHeight: "0",
            overflow: "hidden",
            transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease",
            background: surfaceLight,
            "&.accordionContentActive": {
                padding: "0 1.5rem 1.5rem",
                maxHeight: "500px",
            },
            "@media (max-width: 640px)": {
                padding: "0 1.25rem",
                "&.accordionContentActive": {
                    padding: "0 1.25rem 1.25rem",
                },
            },
        },
    },
    accordionContentDark: {
        base: mergeStyles({
            padding: "0 1.5rem",
            maxHeight: "0",
            overflow: "hidden",
            transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease",
            background: surfaceDark,
            "&.accordionContentActive": {
                padding: "0 1.5rem 1.5rem",
                maxHeight: "500px",
            },
        }, {}, 'dark'),
    },
    accordionPrimary: {
        base: mergeStyles({
            width: "100%",
            borderRadius: radiusMd,
            border: `1px solid rgba(59, 130, 246, 0.2)`,
            overflow: "hidden",
            boxShadow: shadowSm,
            transition: standardTransition,
            background: surfaceLight,
            "&:hover": {
                boxShadow: shadowMd,
                borderColor: "rgba(59, 130, 246, 0.4)",
            },
        }, {
            "& .accordionItem": {
                borderBottom: `1px solid rgba(59, 130, 246, 0.1)`,
            },
            "& .accordionTrigger": {
                "&:hover, &.accordionTriggerActive": {
                    background: "rgba(59, 130, 246, 0.08)",
                    color: primary,
                },
            },
        }),
    },
    accordionSuccess: {
        base: mergeStyles({
            width: "100%",
            borderRadius: radiusMd,
            border: `1px solid rgba(16, 185, 129, 0.2)`,
            overflow: "hidden",
            boxShadow: shadowSm,
            transition: standardTransition,
            background: surfaceLight,
            "&:hover": {
                boxShadow: shadowMd,
                borderColor: "rgba(16, 185, 129, 0.4)",
            },
        }, {
            "& .accordionItem": {
                borderBottom: `1px solid rgba(16, 185, 129, 0.1)`,
            },
            "& .accordionTrigger": {
                "&:hover, &.accordionTriggerActive": {
                    background: "rgba(16, 185, 129, 0.08)",
                    color: success,
                },
            },
        }),
    },
    accordionBorderless: {
        base: {
            width: "100%",
            borderRadius: radiusMd,
            border: "none",
            overflow: "hidden",
            boxShadow: "none",
            transition: standardTransition,
            background: "transparent",
            "& .accordionItem": {
                border: "none",
                marginBottom: "0.75rem",
                borderRadius: radiusMd,
                background: surfaceLight,
                boxShadow: shadowSm,
                transition: standardTransition,
                "&:hover": {
                    boxShadow: shadowMd,
                    transform: "translateY(-2px)",
                },
            },
            "& .accordionTrigger": {
                borderRadius: radiusMd,
            },
        },
    },
    accordionGlass: {
        base: {
            width: "100%",
            borderRadius: radiusLg,
            border: `1px solid rgba(255, 255, 255, 0.15)`,
            overflow: "hidden",
            boxShadow: shadowLg,
            transition: standardTransition,
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: blurGlassHeavy,
            "&:hover": {
                background: "rgba(255, 255, 255, 0.15)",
                boxShadow: shadowXl,
            },
            "& .accordionItem": {
                borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
                background: "transparent",
                "&:last-child": {
                    borderBottom: "none",
                },
            },
            "& .accordionTrigger": {
                color: textLight,
                background: "transparent",
                "&:hover": {
                    background: "rgba(255, 255, 255, 0.1)",
                    color: primaryLight,
                },
                "&.accordionTriggerActive": {
                    background: "rgba(255, 255, 255, 0.15)",
                    color: primaryLight,
                },
            },
            "& .accordionContent": {
                background: "transparent",
                color: "rgba(255, 255, 255, 0.9)",
            },
        },
    },
    accordionSm: {
        base: {
            "& .accordionTrigger": {
                padding: "1rem 1.25rem",
                fontSize: "0.875rem",
            },
            "& .accordionContent": {
                padding: "0 1.25rem",
                fontSize: "0.875rem",
                "&.accordionContentActive": {
                    padding: "0 1.25rem 1.25rem",
                },
            },
        },
    },
    accordionLg: {
        base: {
            "& .accordionTrigger": {
                padding: "1.5rem 2rem",
                fontSize: "1.125rem",
            },
            "& .accordionContent": {
                padding: "0 2rem",
                fontSize: "1.0625rem",
                "&.accordionContentActive": {
                    padding: "0 2rem 2rem",
                },
            },
        },
    },
    accordionWithIcons: {
        base: {
            "& .accordionTrigger": {
                "&::before": {
                    content: '""',
                    width: "1.5rem",
                    height: "1.5rem",
                    background: "currentColor",
                    mask: "var(--accordion-icon)",
                    WebkitMask: "var(--accordion-icon)",
                    opacity: "0.6",
                    transition: standardTransition,
                },
                "&:hover::before": {
                    opacity: "1",
                    transform: "scale(1.1)",
                },
                "&.accordionTriggerActive::before": {
                    opacity: "1",
                    transform: "rotate(180deg)",
                },
            },
        },
    },
    accordionWithBadges: {
        base: {
            "& .accordionTrigger": {
                position: "relative",
                "& .accordionBadge": {
                    marginLeft: "auto",
                    marginRight: "2rem",
                    fontSize: "0.75rem",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "1rem",
                    background: surfaceAltLight,
                    color: textDark,
                    fontWeight: "600",
                    transition: standardTransition,
                },
                "&:hover .accordionBadge": {
                    background: primary,
                    color: "#fff",
                },
            },
        },
    },
    accordionAnimated: {
        base: {
            "& .accordionItem": {
                position: "relative",
                overflow: "hidden",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "3px",
                    height: "100%",
                    background: `linear-gradient(180deg, ${primary}, ${success})`,
                    transform: "scaleY(0)",
                    transition: "transform 0.3s ease",
                },
                "&.accordionItemActive::before": {
                    transform: "scaleY(1)",
                },
            },
            "& .accordionContent": {
                transition: "max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), padding 0.4s ease, opacity 0.3s ease",
                opacity: "0",
                "&.accordionContentActive": {
                    opacity: "1",
                },
            },
        },
    },
    accordionGroup: {
        base: {
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
        },
    },
    accordionGroupSm: {
        base: {
            gap: "0.75rem",
        },
    },
    accordionGroupLg: {
        base: {
            gap: "1.5rem",
        },
    },
    accordionSingle: {
        base: {
            "& .accordionItem": {
                "&.accordionItemActive": {
                    background: "rgba(59, 130, 246, 0.05)",
                },
            },
        },
    },
    accordionPrimaryDark: {
        base: mergeStyles({
            width: "100%",
            borderRadius: radiusMd,
            border: `1px solid rgba(96, 165, 250, 0.2)`,
            overflow: "hidden",
            boxShadow: shadowSm,
            transition: standardTransition,
            background: surfaceDark,
            "&:hover": {
                boxShadow: shadowMd,
                borderColor: "rgba(96, 165, 250, 0.4)",
            },
        }, {
            "& .accordionItem": {
                borderBottom: `1px solid rgba(96, 165, 250, 0.1)`,
            },
            "& .accordionTrigger": {
                "&:hover, &.accordionTriggerActive": {
                    background: "rgba(96, 165, 250, 0.08)",
                    color: primaryLight,
                },
            },
        }, 'dark'),
    },
    accordionGlassDark: {
        base: mergeStyles({
            width: "100%",
            borderRadius: radiusLg,
            border: `1px solid rgba(255, 255, 255, 0.1)`,
            overflow: "hidden",
            boxShadow: shadowLg,
            transition: standardTransition,
            background: "rgba(31, 41, 55, 0.1)",
            backdropFilter: blurGlassHeavy,
            "&:hover": {
                background: "rgba(31, 41, 55, 0.15)",
                boxShadow: shadowXl,
            },
        }, {
            "& .accordionItem": {
                borderBottom: `1px solid rgba(255, 255, 255, 0.08)`,
            },
            "& .accordionTrigger": {
                "&:hover, &.accordionTriggerActive": {
                    background: "rgba(255, 255, 255, 0.1)",
                    color: primaryLight,
                },
            },
        }, 'dark'),
    },
};

const textarea = { textarea: {
        base: mergeStyles(inputBase, {
            minHeight: "6rem",
            resize: "vertical",
            lineHeight: "1.5",
        }),
    },
    textareaSm: {
        base: mergeStyles(inputBase, {
            minHeight: "4rem",
            padding: "0.5rem 0.875rem",
            fontSize: "0.8125rem",
        }),
    }, };

/**
 * ---------------------------------------------------------------------
 *  GARUR-CSS — Ultra-fast Atomic CSS Engine
 *  Author: Barshan Sarkar
 *  Version: 1.0.0
 *  License: MIT
 * ---------------------------------------------------------------------
 *
 *  This CLI powers the Garur-CSS ecosystem. It handles:
 *    • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 *    • File scanning across HTML / JS / TS / JSX / TSX
 *    • Cache management and orphan-class detection
 *    • Config file creation (garur.config.js)
 *    • Plugin boilerplate generation
 *    • Watch mode for real-time builds ,, (coming soon)
 *
 *  Technologies:
 *    - TypeScript
 *    - Rollup bundling (CJS-compatible output)
 *    - Node.js (CLI execution via shebang)
 *
 *  Notes for contributors:
 *    • Keep the CLI ESM/CJS compatible.
 *    • Avoid dynamic require unless wrapped safely.
 *    • Keep output messages clean, fast, and developer-friendly.
 *
 *  Made in India.
 * ---------------------------------------------------------------------
 */
const avatar = {
    avatar: {
        base: avatarBase,
    },
    avatarDark: {
        base: mergeStyles(avatarBase, {
            border: `2px solid ${surfaceDark}`,
        }, 'dark'),
    },
    avatarSm: {
        base: mergeStyles(avatarBase, {
            width: "2rem",
            height: "2rem",
        }),
    },
    avatarSmDark: {
        base: mergeStyles(mergeStyles(avatarBase, {
            width: "2rem",
            height: "2rem",
        }), {}, 'dark'),
    },
    avatarLg: {
        base: mergeStyles(avatarBase, {
            width: "4rem",
            height: "4rem",
        }),
    },
    avatarLgDark: {
        base: mergeStyles(mergeStyles(avatarBase, {
            width: "4rem",
            height: "4rem",
        }), {}, 'dark'),
    },
    avatarXl: {
        base: mergeStyles(avatarBase, {
            width: "5.5rem",
            height: "5.5rem",
        }),
    },
    avatarXlDark: {
        base: mergeStyles(mergeStyles(avatarBase, {
            width: "5.5rem",
            height: "5.5rem",
        }), {}, 'dark'),
    },
};

/**
 * ---------------------------------------------------------------------
 *  GARUR-CSS — Ultra-fast Atomic CSS Engine
 *  Author: Barshan Sarkar
 *  Version: 1.0.0
 *  License: MIT
 * ---------------------------------------------------------------------
 *
 *  This CLI powers the Garur-CSS ecosystem. It handles:
 *    • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 *    • File scanning across HTML / JS / TS / JSX / TSX
 *    • Cache management and orphan-class detection
 *    • Config file creation (garur.config.js)
 *    • Plugin boilerplate generation
 *    • Watch mode for real-time builds ,, (coming soon)
 *
 *  Technologies:
 *    - TypeScript
 *    - Rollup bundling (CJS-compatible output)
 *    - Node.js (CLI execution via shebang)
 *
 *  Notes for contributors:
 *    • Keep the CLI ESM/CJS compatible.
 *    • Avoid dynamic require unless wrapped safely.
 *    • Keep output messages clean, fast, and developer-friendly.
 *
 *  Made in India.
 * ---------------------------------------------------------------------
 */
const footer = {
    footer: {
        base: {
            padding: "3rem 1rem", // Reduced
            "text-align": "center",
            background: "linear-gradient(135deg, #0f172a, #1e293b)",
            color: textLight,
            "font-size": "0.9375rem",
            "letter-spacing": "0.25px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
                content: '""',
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                height: "1px",
                background: "linear-gradient(90deg, transparent, primary, transparent)",
            },
            "@media (max-width: 640px)": {
                padding: "2rem 0.75rem",
            },
        },
    },
    footerLight: {
        base: {
            padding: "3rem 1rem",
            "text-align": "center",
            background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
            color: textDark,
            borderTop: `1px solid ${borderColorLight}`,
            "font-size": "0.9375rem",
            "letter-spacing": "0.25px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
                content: '""',
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                height: "1px",
                background: "linear-gradient(90deg, transparent, primary, transparent)",
            },
            "@media (max-width: 640px)": {
                padding: "2rem 0.75rem",
            },
        },
    },
};

const progress = {
    progress: {
        base: mergeStyles(progressBase, {
            height: "0.5rem",
            background: surfaceAltLight,
            border: `1px solid ${borderColorLight}`,
        }),
    },
    progressDark: {
        base: mergeStyles(progressBase, {
            height: "0.5rem",
            background: surfaceAltDark,
            border: `1px solid ${borderColorDark}`,
        }, 'dark'),
    },
    progressSm: {
        base: mergeStyles(progressBase, {
            height: "0.375rem",
            background: surfaceAltLight,
            border: `1px solid ${borderColorLight}`,
        }),
    },
    progressLg: {
        base: mergeStyles(progressBase, {
            height: "0.75rem",
            background: surfaceAltLight,
            border: `1px solid ${borderColorLight}`,
        }),
    },
    progressXl: {
        base: mergeStyles(progressBase, {
            height: "1rem",
            background: surfaceAltLight,
            border: `1px solid ${borderColorLight}`,
        }),
    },
    progressFill: {
        base: {
            height: "100%",
            background: `linear-gradient(90deg, ${primaryDark}, ${primary}, ${primaryLight})`,
            transition: "width 0.6s ease",
            borderRadius: "inherit",
            position: "relative",
            overflow: "hidden",
            "&::after": {
                content: '""',
                position: "absolute",
                top: "0",
                left: "0",
                bottom: "0",
                right: "0",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                animation: "shimmer 2s infinite",
            },
        },
    },
    progressFillSuccess: {
        base: {
            height: "100%",
            background: `linear-gradient(90deg, ${successDark}, ${success}, ${successLight})`,
            transition: "width 0.6s ease",
            borderRadius: "inherit",
            position: "relative",
            overflow: "hidden",
        },
    },
    progressFillError: {
        base: {
            height: "100%",
            background: `linear-gradient(90deg, ${dangerDark}, ${danger}, ${dangerLight})`,
            transition: "width 0.6s ease",
            borderRadius: "inherit",
            position: "relative",
            overflow: "hidden",
        },
    },
    progressFillWarning: {
        base: {
            height: "100%",
            background: `linear-gradient(90deg, ${warningDark}, ${warning}, ${warningLight})`,
            transition: "width 0.6s ease",
            borderRadius: "inherit",
            position: "relative",
            overflow: "hidden",
        },
    },
    progressFillInfo: {
        base: {
            height: "100%",
            background: `linear-gradient(90deg, ${infoDark}, ${info}, ${infoLight})`,
            transition: "width 0.6s ease",
            borderRadius: "inherit",
            position: "relative",
            overflow: "hidden",
        },
    },
    progressGradient: {
        base: {
            height: "100%",
            background: `linear-gradient(90deg, ${primary}, ${success}, ${warning}, ${danger})`,
            transition: "width 0.6s ease",
            borderRadius: "inherit",
            position: "relative",
            overflow: "hidden",
        },
    },
    progressRainbow: {
        base: {
            height: "100%",
            background: `linear-gradient(90deg, #ff6b6b, #ffa726, #ffee58, #66bb6a, #42a5f5, #5c6bc0, #ab47bc)`,
            transition: "width 0.6s ease",
            borderRadius: "inherit",
            position: "relative",
            overflow: "hidden",
        },
    },
    progressLabel: {
        base: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: "500",
        },
    },
    progressValue: {
        base: {
            fontSize: "0.875rem",
            fontWeight: "600",
            color: primary,
        },
    },
    progressValueSuccess: {
        base: {
            fontSize: "0.875rem",
            fontWeight: "600",
            color: success,
        },
    },
    progressValueError: {
        base: {
            fontSize: "0.875rem",
            fontWeight: "600",
            color: danger,
        },
    },
    progressWithIcon: {
        base: {
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
        },
    },
    progressIcon: {
        base: {
            fontSize: "1rem",
            width: "1.5rem",
            height: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: "0",
        },
    },
    progressAnimated: {
        base: {
            height: "100%",
            background: `linear-gradient(90deg, ${primaryDark}, ${primary}, ${primaryLight})`,
            transition: "width 0.6s ease",
            borderRadius: "inherit",
            position: "relative",
            overflow: "hidden",
            animation: "pulse 2s ease-in-out infinite",
        },
    },
    progressStriped: {
        base: {
            height: "100%",
            background: `linear-gradient(45deg, ${primary} 25%, transparent 25%, transparent 50%, ${primary} 50%, ${primary} 75%, transparent 75%, transparent)`,
            backgroundSize: "1rem 1rem",
            transition: "width 0.6s ease",
            borderRadius: "inherit",
            animation: "stripes 1s linear infinite",
        },
    },
    progressStripedSuccess: {
        base: {
            height: "100%",
            background: `linear-gradient(45deg, ${success} 25%, transparent 25%, transparent 50%, ${success} 50%, ${success} 75%, transparent 75%, transparent)`,
            backgroundSize: "1rem 1rem",
            transition: "width 0.6s ease",
            borderRadius: "inherit",
            animation: "stripes 1s linear infinite",
        },
    },
    progressCircle: {
        base: {
            width: "4rem",
            height: "4rem",
            borderRadius: "50%",
            background: `conic-gradient(primary 0%, ${surfaceAltLight} 0%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            "&::before": {
                content: '""',
                position: "absolute",
                width: "3rem",
                height: "3rem",
                borderRadius: "50%",
                background: surfaceLight,
            },
        },
    },
    progressCircleLg: {
        base: {
            width: "6rem",
            height: "6rem",
            borderRadius: "50%",
            background: `conic-gradient(primary 0%, ${surfaceAltLight} 0%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            "&::before": {
                content: '""',
                position: "absolute",
                width: "4.5rem",
                height: "4.5rem",
                borderRadius: "50%",
                background: surfaceLight,
            },
        },
    },
    progressCircleText: {
        base: {
            position: "relative",
            zIndex: "1",
            fontSize: "0.875rem",
            fontWeight: "600",
            color: primary,
        },
    },
    progressStacked: {
        base: {
            display: "flex",
            height: "0.5rem",
            borderRadius: radiusSm,
            overflow: "hidden",
            background: surfaceAltLight,
        },
    },
    progressStackedSegment: {
        base: {
            height: "100%",
            transition: "width 0.6s ease",
            "&:not(:last-child)": {
                borderRight: `2px solid ${surfaceLight}`,
            },
        },
    },
    progressGroup: {
        base: {
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
        },
    },
    progressSteps: {
        base: {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
        },
    },
    progressStep: {
        base: {
            flex: "1",
            height: "0.25rem",
            background: surfaceAltLight,
            borderRadius: radiusSm,
            transition: "all 0.3s ease",
            "&.progressStepActive": {
                background: primary,
            },
            "&.progressStepCompleted": {
                background: success,
            },
        },
    },
    progressFillDark: {
        base: {
            height: "100%",
            background: `linear-gradient(90deg, ${primaryLight}, ${primary})`,
            transition: "width 0.6s ease",
            borderRadius: "inherit",
            position: "relative",
            overflow: "hidden",
        },
    },
    progressCircleDark: {
        base: {
            width: "4rem",
            height: "4rem",
            borderRadius: "50%",
            background: `conic-gradient(${primaryLight} 0%, ${surfaceAltDark} 0%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            "&::before": {
                content: '""',
                position: "absolute",
                width: "3rem",
                height: "3rem",
                borderRadius: "50%",
                background: surfaceDark,
            },
        },
    },
    progressIndeterminate: {
        base: {
            height: "100%",
            background: `linear-gradient(90deg, ${primaryDark}, ${primary}, ${primaryLight})`,
            borderRadius: "inherit",
            position: "relative",
            overflow: "hidden",
            animation: "indeterminate 1.5s ease-in-out infinite",
        },
    },
    progressThreshold: {
        base: {
            position: "relative",
        },
    },
    progressThresholdMarker: {
        base: {
            position: "absolute",
            top: "-0.25rem",
            width: "2px",
            height: "1rem",
            background: danger,
            transform: "translateX(-50%)",
            "&::after": {
                content: 'attr(data-threshold)',
                position: "absolute",
                top: "-1.5rem",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "0.75rem",
                color: danger,
                fontWeight: "600",
                whiteSpace: "nowrap",
            },
        },
    },
    progressGlass: {
        base: mergeStyles(progressBase, {
            height: "0.5rem",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backdropFilter: blurGlassHeavy,
        }),
    },
    progressFillGlass: {
        base: {
            height: "100%",
            background: "linear-gradient(90deg, rgba(59, 130, 246, 0.8), rgba(96, 165, 250, 0.8))",
            transition: "width 0.6s ease",
            borderRadius: "inherit",
            position: "relative",
            overflow: "hidden",
            backdropFilter: blurGlass,
        },
    },
    progressRing: {
        base: {
            width: "3rem",
            height: "3rem",
            borderRadius: "50%",
            background: `conic-gradient(primary 0%, ${surfaceAltLight} 0%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            "&::before": {
                content: '""',
                position: "absolute",
                width: "2.25rem",
                height: "2.25rem",
                borderRadius: "50%",
                background: surfaceLight,
            },
            "& .progressRingText": {
                position: "relative",
                zIndex: "1",
                fontSize: "0.75rem",
                fontWeight: "600",
                color: primary,
            },
        },
    },
};

/**
 * ---------------------------------------------------------------------
 *  GARUR-CSS — Ultra-fast Atomic CSS Engine
 *  Author: Barshan Sarkar
 *  Version: 1.0.0
 *  License: MIT
 * ---------------------------------------------------------------------
 *
 *  This CLI powers the Garur-CSS ecosystem. It handles:
 *    • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 *    • File scanning across HTML / JS / TS / JSX / TSX
 *    • Cache management and orphan-class detection
 *    • Config file creation (garur.config.js)
 *    • Plugin boilerplate generation
 *    • Watch mode for real-time builds ,, (coming soon)
 *
 *  Technologies:
 *    - TypeScript
 *    - Rollup bundling (CJS-compatible output)
 *    - Node.js (CLI execution via shebang)
 *
 *  Notes for contributors:
 *    • Keep the CLI ESM/CJS compatible.
 *    • Avoid dynamic require unless wrapped safely.
 *    • Keep output messages clean, fast, and developer-friendly.
 *
 *  Made in India.
 * ---------------------------------------------------------------------
 */
const badges = {
    badge: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.25rem 0.625rem",
            borderRadius: radiusSm,
            fontSize: "0.75rem",
            fontWeight: "600",
            lineHeight: "1",
            textAlign: "center",
            whiteSpace: "nowrap",
            verticalAlign: "baseline",
            transition: standardTransition,
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
            background: surfaceAltLight,
            color: textDark,
            border: `1px solid ${borderColorLight}`,
            "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: shadowSm,
            },
            "@media (max-width: 640px)": {
                fontSize: "0.6875rem",
                padding: "0.1875rem 0.5rem",
            },
        },
    },
    badgePrimary: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.25rem 0.625rem",
            borderRadius: radiusSm,
            fontSize: "0.75rem",
            fontWeight: "600",
            lineHeight: "1",
            background: `linear-gradient(135deg, ${primaryDark}, ${primary})`,
            color: "#fff",
            border: "none",
            boxShadow: shadowSm,
            "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: shadowMd,
                background: `linear-gradient(135deg, ${primary}, ${primaryLight})`,
            },
        },
    },
    badgeSuccess: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.25rem 0.625rem",
            borderRadius: radiusSm,
            fontSize: "0.75rem",
            fontWeight: "600",
            lineHeight: "1",
            background: `linear-gradient(135deg, ${successDark}, ${success})`,
            color: "#fff",
            border: "none",
            boxShadow: shadowSm,
            "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: shadowMd,
            },
        },
    },
    badgeDanger: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.25rem 0.625rem",
            borderRadius: radiusSm,
            fontSize: "0.75rem",
            fontWeight: "600",
            lineHeight: "1",
            background: `linear-gradient(135deg, ${dangerDark}, ${danger})`,
            color: "#fff",
            border: "none",
            boxShadow: shadowSm,
            "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: shadowMd,
            },
        },
    },
    badgeWarning: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.25rem 0.625rem",
            borderRadius: radiusSm,
            fontSize: "0.75rem",
            fontWeight: "600",
            lineHeight: "1",
            background: `linear-gradient(135deg, ${warningDark}, ${warning})`,
            color: textDark,
            border: "none",
            boxShadow: shadowSm,
            "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: shadowMd,
            },
        },
    },
    badgeInfo: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.25rem 0.625rem",
            borderRadius: radiusSm,
            fontSize: "0.75rem",
            fontWeight: "600",
            lineHeight: "1",
            background: `linear-gradient(135deg, ${infoDark}, ${info})`,
            color: "#fff",
            border: "none",
            boxShadow: shadowSm,
            "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: shadowMd,
            },
        },
    },
    badgeOutline: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.25rem 0.625rem",
            borderRadius: radiusSm,
            fontSize: "0.75rem",
            fontWeight: "600",
            lineHeight: "1",
            background: "transparent",
            color: textDark,
            border: `1px solid ${borderColorLight}`,
            boxShadow: "none",
            "&:hover": {
                background: surfaceAltLight,
                transform: "translateY(-1px)",
                boxShadow: shadowSm,
            },
        },
    },
    badgeOutlinePrimary: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.25rem 0.625rem",
            borderRadius: radiusSm,
            fontSize: "0.75rem",
            fontWeight: "600",
            lineHeight: "1",
            background: "transparent",
            color: primary,
            border: `1px solid ${primary}`,
            boxShadow: "none",
            "&:hover": {
                background: primary,
                color: "#fff",
                transform: "translateY(-1px)",
                boxShadow: shadowSm,
            },
        },
    },
    badgeOutlineSuccess: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.25rem 0.625rem",
            borderRadius: radiusSm,
            fontSize: "0.75rem",
            fontWeight: "600",
            lineHeight: "1",
            background: "transparent",
            color: success,
            border: `1px solid ${success}`,
            boxShadow: "none",
            "&:hover": {
                background: success,
                color: "#fff",
                transform: "translateY(-1px)",
                boxShadow: shadowSm,
            },
        },
    },
    badgeOutlineDanger: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.25rem 0.625rem",
            borderRadius: radiusSm,
            fontSize: "0.75rem",
            fontWeight: "600",
            lineHeight: "1",
            background: "transparent",
            color: danger,
            border: `1px solid ${danger}`,
            boxShadow: "none",
            "&:hover": {
                background: danger,
                color: "#fff",
                transform: "translateY(-1px)",
                boxShadow: shadowSm,
            },
        },
    },
    badgeOutlineWarning: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.25rem 0.625rem",
            borderRadius: radiusSm,
            fontSize: "0.75rem",
            fontWeight: "600",
            lineHeight: "1",
            background: "transparent",
            color: warning,
            border: `1px solid ${warning}`,
            boxShadow: "none",
            "&:hover": {
                background: warning,
                color: textDark,
                transform: "translateY(-1px)",
                boxShadow: shadowSm,
            },
        },
    },
    badgeOutlineInfo: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.25rem 0.625rem",
            borderRadius: radiusSm,
            fontSize: "0.75rem",
            fontWeight: "600",
            lineHeight: "1",
            background: "transparent",
            color: info,
            border: `1px solid ${info}`,
            boxShadow: "none",
            "&:hover": {
                background: info,
                color: "#fff",
                transform: "translateY(-1px)",
                boxShadow: shadowSm,
            },
        },
    },
    badgeXs: {
        base: {
            padding: "0.125rem 0.375rem",
            fontSize: "0.625rem",
            borderRadius: radiusSm,
            lineHeight: "1",
            minWidth: "1rem",
            height: "1rem",
            "@media (max-width: 640px)": {
                padding: "0.0625rem 0.25rem",
                fontSize: "0.5625rem",
                minWidth: "0.875rem",
                height: "0.875rem",
            },
        },
    },
    badgeSm: {
        base: {
            padding: "0.1875rem 0.5rem",
            fontSize: "0.6875rem",
            borderRadius: radiusSm,
            lineHeight: "1",
            minWidth: "1.125rem",
            height: "1.125rem",
        },
    },
    badgeLg: {
        base: {
            padding: "0.375rem 0.75rem",
            fontSize: "0.8125rem",
            borderRadius: radiusMd,
            lineHeight: "1.2",
            minWidth: "1.5rem",
            height: "1.5rem",
        },
    },
    badgeXl: {
        base: {
            padding: "0.5rem 1rem",
            fontSize: "0.875rem",
            borderRadius: radiusMd,
            lineHeight: "1.2",
            minWidth: "1.75rem",
            height: "1.75rem",
        },
    },
    badgePill: {
        base: {
            borderRadius: "50rem",
            padding: "0.25rem 0.75rem",
        },
    },
    badgePillPrimary: {
        base: {
            borderRadius: "50rem",
            padding: "0.25rem 0.75rem",
            background: `linear-gradient(135deg, ${primaryDark}, ${primary})`,
            color: "#fff",
            border: "none",
        },
    },
    badgePillOutline: {
        base: {
            borderRadius: "50rem",
            padding: "0.25rem 0.75rem",
            background: "transparent",
            border: `1px solid ${borderColorLight}`,
        },
    },
    badgeWithIcon: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.375rem",
            padding: "0.25rem 0.625rem 0.25rem 0.5rem",
            "& .badge-icon": {
                fontSize: "0.625rem",
                width: "0.75rem",
                height: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            },
        },
    },
    badgeIconPrimary: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.375rem",
            padding: "0.25rem 0.625rem 0.25rem 0.5rem",
            background: `linear-gradient(135deg, ${primaryDark}, ${primary})`,
            color: "#fff",
            "& .badge-icon": {
                fontSize: "0.625rem",
            },
        },
    },
    badgeIconSuccess: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.375rem",
            padding: "0.25rem 0.625rem 0.25rem 0.5rem",
            background: `linear-gradient(135deg, ${successDark}, ${success})`,
            color: "#fff",
            "& .badge-icon": {
                fontSize: "0.625rem",
            },
        },
    },
    navBadge: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "1.25rem",
            height: "1.25rem",
            padding: "0 0.375rem",
            borderRadius: "0.625rem",
            background: `linear-gradient(135deg, ${dangerDark}, ${danger})`,
            color: "#fff",
            fontSize: "0.75rem",
            fontWeight: "700",
            lineHeight: "1",
            border: "2px solid #fff",
            boxShadow: shadowSm,
            position: "absolute",
            top: "-0.5rem",
            right: "-0.5rem",
            zIndex: "10",
            animation: "pulse 2s infinite",
            ".dark &": {
                border: "2px solid #1f2937",
            },
            "@media (max-width: 640px)": {
                minWidth: "1rem",
                height: "1rem",
                fontSize: "0.625rem",
                top: "-0.375rem",
                right: "-0.375rem",
            },
        },
    },
    navBadgeSuccess: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "1.25rem",
            height: "1.25rem",
            padding: "0 0.375rem",
            borderRadius: "0.625rem",
            background: `linear-gradient(135deg, ${successDark}, ${success})`,
            color: "#fff",
            fontSize: "0.75rem",
            fontWeight: "700",
            lineHeight: "1",
            border: "2px solid #fff",
            boxShadow: shadowSm,
            position: "absolute",
            top: "-0.5rem",
            right: "-0.5rem",
            zIndex: "10",
            ".dark &": {
                border: "2px solid #1f2937",
            },
        },
    },
    navBadgeWarning: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "1.25rem",
            height: "1.25rem",
            padding: "0 0.375rem",
            borderRadius: "0.625rem",
            background: `linear-gradient(135deg, ${warningDark}, ${warning})`,
            color: textDark,
            fontSize: "0.75rem",
            fontWeight: "700",
            lineHeight: "1",
            border: "2px solid #fff",
            boxShadow: shadowSm,
            position: "absolute",
            top: "-0.5rem",
            right: "-0.5rem",
            zIndex: "10",
            ".dark &": {
                border: "2px solid #1f2937",
            },
        },
    },
    badgeStatus: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.375rem",
            padding: "0.375rem 0.75rem",
            borderRadius: radiusMd,
            fontSize: "0.75rem",
            fontWeight: "600",
            "& .status-dot": {
                width: "0.5rem",
                height: "0.5rem",
                borderRadius: "50%",
                backgroundColor: "currentColor",
            },
        },
    },
    badgeStatusOnline: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.375rem",
            padding: "0.375rem 0.75rem",
            borderRadius: radiusMd,
            fontSize: "0.75rem",
            fontWeight: "600",
            background: "rgba(16, 185, 129, 0.1)",
            color: success,
            border: `1px solid rgba(16, 185, 129, 0.2)`,
            "& .status-dot": {
                width: "0.5rem",
                height: "0.5rem",
                borderRadius: "50%",
                backgroundColor: success,
                animation: "pulse 2s infinite",
            },
        },
    },
    badgeStatusAway: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.375rem",
            padding: "0.375rem 0.75rem",
            borderRadius: radiusMd,
            fontSize: "0.75rem",
            fontWeight: "600",
            background: "rgba(245, 158, 11, 0.1)",
            color: warning,
            border: `1px solid rgba(245, 158, 11, 0.2)`,
            "& .status-dot": {
                width: "0.5rem",
                height: "0.5rem",
                borderRadius: "50%",
                backgroundColor: warning,
            },
        },
    },
    badgeStatusOffline: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.375rem",
            padding: "0.375rem 0.75rem",
            borderRadius: radiusMd,
            fontSize: "0.75rem",
            fontWeight: "600",
            background: "rgba(239, 68, 68, 0.1)",
            color: danger,
            border: `1px solid rgba(239, 68, 68, 0.2)`,
            "& .status-dot": {
                width: "0.5rem",
                height: "0.5rem",
                borderRadius: "50%",
                backgroundColor: danger,
            },
        },
    },
    badgeDark: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.25rem 0.625rem",
            borderRadius: radiusSm,
            fontSize: "0.75rem",
            fontWeight: "600",
            lineHeight: "1",
            background: surfaceAltDark,
            color: textLight,
            border: `1px solid ${borderColorDark}`,
            "&:hover": {
                background: surfaceDark,
                transform: "translateY(-1px)",
                boxShadow: shadowSm,
            },
        },
    },
    badgePrimaryDark: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.25rem 0.625rem",
            borderRadius: radiusSm,
            fontSize: "0.75rem",
            fontWeight: "600",
            lineHeight: "1",
            background: `linear-gradient(135deg, ${primaryLight}, ${primary})`,
            color: textDark,
            border: "none",
            "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: shadowMd,
            },
        },
    },
    badgeSuccessDark: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.25rem 0.625rem",
            borderRadius: radiusSm,
            fontSize: "0.75rem",
            fontWeight: "600",
            lineHeight: "1",
            background: `linear-gradient(135deg, ${successLight}, ${success})`,
            color: textDark,
            border: "none",
            "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: shadowMd,
            },
        },
    },
    badgeOutlineDark: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.25rem 0.625rem",
            borderRadius: radiusSm,
            fontSize: "0.75rem",
            fontWeight: "600",
            lineHeight: "1",
            background: "transparent",
            color: textLight,
            border: `1px solid ${borderColorDark}`,
            "&:hover": {
                background: surfaceAltDark,
                transform: "translateY(-1px)",
            },
        },
    },
    badgeOutlinePrimaryDark: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.25rem 0.625rem",
            borderRadius: radiusSm,
            fontSize: "0.75rem",
            fontWeight: "600",
            lineHeight: "1",
            background: "transparent",
            color: primaryLight,
            border: `1px solid ${primaryLight}`,
            "&:hover": {
                background: primaryLight,
                color: textDark,
                transform: "translateY(-1px)",
            },
        },
    },
    badgeGlass: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.25rem 0.625rem",
            borderRadius: radiusSm,
            fontSize: "0.75rem",
            fontWeight: "600",
            lineHeight: "1",
            background: "rgba(255, 255, 255, 0.1)",
            color: textLight,
            border: `1px solid rgba(255, 255, 255, 0.2)`,
            backdropFilter: blurGlass,
            boxShadow: shadowSm,
            "&:hover": {
                background: "rgba(255, 255, 255, 0.15)",
                transform: "translateY(-1px)",
                boxShadow: shadowMd,
            },
        },
    },
    badgeGlassPrimary: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.25rem 0.625rem",
            borderRadius: radiusSm,
            fontSize: "0.75rem",
            fontWeight: "600",
            lineHeight: "1",
            background: "rgba(59, 130, 246, 0.2)",
            color: "#fff",
            border: `1px solid rgba(59, 130, 246, 0.3)`,
            backdropFilter: blurGlass,
            boxShadow: shadowSm,
            "&:hover": {
                background: "rgba(59, 130, 246, 0.3)",
                transform: "translateY(-1px)",
            },
        },
    },
    badgePulse: {
        base: {
            animation: "pulse 2s ease-in-out infinite",
            boxShadow: `0 0 0 0 rgba(59, 130, 246, 0.7)`,
        },
    },
    badgeBounce: {
        base: {
            animation: "float 3s ease-in-out infinite",
        },
    },
    badgeInteractive: {
        base: {
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:active": {
                transform: "translateY(0) scale(0.95)",
            },
            "&:focus": {
                outline: "none",
                boxShadow: `0 0 0 2px ${primary}20, ${shadowSm}`,
            },
        },
    },
    badgeRemovable: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            padding: "0.25rem 0.5rem 0.25rem 0.625rem",
            cursor: "pointer",
            "& .badge-remove": {
                background: "none",
                border: "none",
                color: "inherit",
                opacity: "0.6",
                cursor: "pointer",
                padding: "0.125rem",
                borderRadius: "50%",
                transition: standardTransition,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "0.875rem",
                height: "0.875rem",
                "&:hover": {
                    opacity: "1",
                    background: "rgba(0, 0, 0, 0.1)",
                },
            },
            "&:hover .badge-remove": {
                opacity: "0.8",
            },
        },
    },
    badgeGroup: {
        base: {
            display: "flex",
            flexWrap: "wrap",
            gap: "0.375rem",
            alignItems: "center",
        },
    },
    badgeGroupStacked: {
        base: {
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
            alignItems: "flex-start",
        },
    },
};

const Tooltip = {
    tooltip: {
        base: {
            position: "relative",
            display: "inline-block",
            cursor: "pointer",
        },
    },
    tooltipContent: {
        base: {
            position: "absolute",
            background: `linear-gradient(135deg, ${surfaceDark} 0%, ${surfaceAltDark} 100%)`,
            color: textLight,
            padding: "0.75rem 1rem",
            borderRadius: radiusMd,
            fontSize: "0.875rem",
            fontWeight: "500",
            whiteSpace: "nowrap",
            boxShadow: `${shadowLg}, 0 20px 40px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(99, 102, 241, 0.2)`,
            backdropFilter: `${blurGlass} brightness(1.1)`,
            border: `1px solid ${borderColorDark}`,
            zIndex: "1000",
            opacity: "0",
            visibility: "hidden",
            transform: "scale(0.9)",
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            ".tooltip:hover &": {
                opacity: "1",
                visibility: "visible",
                transform: "scale(1)",
            },
        },
    },
    tooltipLight: {
        base: mergeStyles({
            position: "absolute",
            background: `linear-gradient(135deg, ${surfaceLight} 0%, ${surfaceAltLight} 100%)`,
            color: textDark,
            padding: "0.75rem 1rem",
            borderRadius: radiusMd,
            fontSize: "0.875rem",
            fontWeight: "500",
            whiteSpace: "nowrap",
            boxShadow: `${shadowLg}, 0 20px 40px rgba(0, 0, 0, 0.1)`,
            backdropFilter: `${blurGlass} brightness(1.05)`,
            border: `1px solid ${borderColorLight}`,
            zIndex: "1000",
            opacity: "0",
            visibility: "hidden",
            transform: "scale(0.9)",
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            ".tooltip:hover &": {
                opacity: "1",
                visibility: "visible",
                transform: "scale(1)",
            },
        }, {}, 'light'),
    },
    // hey u listen to me ..... ure my code jano tumi
    tooltipTop: {
        base: {
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%) translateY(-8px) scale(0.9)",
            marginBottom: "12px",
            "&::after": {
                content: '""',
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                border: "6px solid transparent",
                borderTopColor: surfaceDark,
            },
            ".tooltip:hover &": {
                transform: "translateX(-50%) translateY(0) scale(1)",
            },
        },
    },
    tooltipBottom: {
        base: {
            top: "100%",
            left: "50%",
            transform: "translateX(-50%) translateY(8px) scale(0.9)",
            marginTop: "12px",
            "&::after": {
                content: '""',
                position: "absolute",
                bottom: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                border: "6px solid transparent",
                borderBottomColor: surfaceDark,
            },
            ".tooltip:hover &": {
                transform: "translateX(-50%) translateY(0) scale(1)",
            },
        },
    },
    tooltipLeft: {
        base: {
            right: "100%",
            top: "50%",
            transform: "translateY(-50%) translateX(-8px) scale(0.9)",
            marginRight: "12px",
            "&::after": {
                content: '""',
                position: "absolute",
                left: "100%",
                top: "50%",
                transform: "translateY(-50%)",
                border: "6px solid transparent",
                borderLeftColor: surfaceDark,
            },
            ".tooltip:hover &": {
                transform: "translateY(-50%) translateX(0) scale(1)",
            },
        },
    },
    tooltipRight: {
        base: {
            left: "100%",
            top: "50%",
            transform: "translateY(-50%) translateX(8px) scale(0.9)",
            marginLeft: "12px",
            "&::after": {
                content: '""',
                position: "absolute",
                right: "100%",
                top: "50%",
                transform: "translateY(-50%)",
                border: "6px solid transparent",
                borderRightColor: surfaceDark,
            },
            ".tooltip:hover &": {
                transform: "translateY(-50%) translateX(0) scale(1)",
            },
        },
    },
    tooltipPrimary: {
        base: {
            background: `linear-gradient(135deg, ${primary} 0%, #1d4ed8 100%)`,
            border: "none",
            "&::after": {
                borderTopColor: primary,
            },
            "&.tooltipBottom::after": {
                borderBottomColor: primary,
            },
            "&.tooltipLeft::after": {
                borderLeftColor: primary,
            },
            "&.tooltipRight::after": {
                borderRightColor: primary,
            },
        },
    },
    tooltipSuccess: {
        base: {
            background: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
            border: "none",
            "&::after": {
                borderTopColor: "#10b981",
            },
            "&.tooltipBottom::after": {
                borderBottomColor: "#10b981",
            },
            "&.tooltipLeft::after": {
                borderLeftColor: "#10b981",
            },
            "&.tooltipRight::after": {
                borderRightColor: "#10b981",
            },
        },
    },
    tooltipWarning: {
        base: {
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            border: "none",
            "&::after": {
                borderTopColor: "#f59e0b",
            },
            "&.tooltipBottom::after": {
                borderBottomColor: "#f59e0b",
            },
            "&.tooltipLeft::after": {
                borderLeftColor: "#f59e0b",
            },
            "&.tooltipRight::after": {
                borderRightColor: "#f59e0b",
            },
        },
    },
    tooltipDanger: {
        base: {
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            border: "none",
            "&::after": {
                borderTopColor: "#ef4444",
            },
            "&.tooltipBottom::after": {
                borderBottomColor: "#ef4444",
            },
            "&.tooltipLeft::after": {
                borderLeftColor: "#ef4444",
            },
            "&.tooltipRight::after": {
                borderRightColor: "#ef4444",
            },
        },
    },
    tooltipSm: {
        base: {
            padding: "0.5rem 0.75rem",
            fontSize: "0.75rem",
            maxWidth: "12rem",
        },
    },
    tooltipLg: {
        base: {
            padding: "1rem 1.25rem",
            fontSize: "0.875rem",
            maxWidth: "24rem",
        },
    },
    tooltipMultiline: {
        base: {
            whiteSpace: "normal",
            textAlign: "left",
            maxWidth: "16rem",
            lineHeight: "1.5",
        },
    },
    tooltipMultilineLg: {
        base: {
            whiteSpace: "normal",
            textAlign: "left",
            maxWidth: "20rem",
            lineHeight: "1.6",
            padding: "1rem 1.25rem",
        },
    },
    tooltipRich: {
        base: {
            padding: "1rem",
            textAlign: "left",
            whiteSpace: "normal",
            maxWidth: "18rem",
        },
    },
    tooltipHeader: {
        base: {
            fontWeight: "600",
            fontSize: "0.875rem",
            marginBottom: "0.375rem",
            display: "block",
            lineHeight: "1.3",
        },
    },
    tooltipInteractive: {
        base: {
            pointerEvents: "auto",
            cursor: "pointer",
            "&:hover": {
                opacity: "1 !important",
                visibility: "visible !important",
            },
        },
    },
    tooltipRounded: {
        base: {
            borderRadius: radiusLg,
        },
    },
    tooltipGlass: {
        base: {
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(25px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#ffffff",
        },
    },
    tooltipBorderless: {
        base: {
            border: "none",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
        },
    },
    tooltipResponsive: {
        base: {
            "@media (max-width: 640px)": {
                fontSize: "0.75rem",
                padding: "0.5rem 0.75rem",
                maxWidth: "14rem",
                whiteSpace: "normal",
                textAlign: "center",
            },
        },
    },
    tooltipWithIcon: {
        base: {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.625rem 0.875rem",
        },
    },
    tooltipIcon: {
        base: {
            fontSize: "0.875rem",
            flexShrink: "0",
            opacity: "0.9",
            transition: "all 0.3s ease",
            ".tooltip:hover &": {
                opacity: "1",
                transform: "scale(1.1)",
            },
        },
    },
    tooltipGroup: {
        base: {
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            flexWrap: "wrap",
        },
    },
    tooltipDemoElement: {
        base: {
            background: surfaceLight,
            padding: "1rem 1.5rem",
            borderRadius: radiusMd,
            fontWeight: "600",
            color: textDark,
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            transition: standardTransition,
            border: "2px solid transparent",
            "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
            },
        },
    },
    tooltipIconElement: {
        base: {
            width: "48px",
            height: "48px",
            background: surfaceLight,
            borderRadius: radiusMd,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.25rem",
            color: primary,
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            transition: standardTransition,
            "&:hover": {
                transform: "scale(1.1)",
                boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)",
            },
        },
    },
    tooltipAvatarElement: {
        base: {
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: textLight,
            fontWeight: "600",
            fontSize: "1.25rem",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
            transition: standardTransition,
            "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
            },
        },
    },
    tooltipBadgeElement: {
        base: {
            background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
            color: textLight,
            padding: "0.5rem 1rem",
            borderRadius: "2rem",
            fontSize: "0.875rem",
            fontWeight: "600",
            boxShadow: "0 4px 16px rgba(139, 92, 246, 0.3)",
            transition: standardTransition,
            "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 8px 32px rgba(139, 92, 246, 0.5)",
            },
        },
    },
    tooltipBounce: {
        base: {
            animation: "tooltipBounce 0.6s ease-out",
            ".tooltip:hover &": {
                animation: "tooltipBounce 0.6s ease-out",
            },
        },
    },
    tooltipFade: {
        base: {
            animation: "tooltipFade 0.4s ease-out",
            ".tooltip:hover &": {
                animation: "tooltipFade 0.4s ease-out",
            },
        },
    },
    tooltipArrowLight: {
        base: {
            "&::after": {
                borderTopColor: surfaceLight,
            },
            "&.tooltipBottom::after": {
                borderBottomColor: surfaceLight,
            },
            "&.tooltipLeft::after": {
                borderLeftColor: surfaceLight,
            },
            "&.tooltipRight::after": {
                borderRightColor: surfaceLight,
            },
        },
    },
};

const sidebar = {
    sidebar: {
        base: {
            position: "fixed",
            top: "0",
            left: "0",
            bottom: "0",
            width: "16rem",
            background: surfaceLight,
            borderRight: `1px solid ${borderColorLight}`,
            zIndex: "1000",
            transform: "translateX(-100%)",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            "&.sidebarOpen": {
                transform: "translateX(0)",
            },
            "@media (min-width: 1024px)": {
                position: "relative",
                transform: "translateX(0)",
                height: "100vh",
            },
        },
    },
    sidebarDark: {
        base: mergeStyles({
            position: "fixed",
            top: "0",
            left: "0",
            bottom: "0",
            width: "16rem",
            background: surfaceDark,
            borderRight: `1px solid ${borderColorDark}`,
            zIndex: "1000",
            transform: "translateX(-100%)",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            "&.sidebarOpen": {
                transform: "translateX(0)",
            },
            "@media (min-width: 1024px)": {
                position: "relative",
                transform: "translateX(0)",
                height: "100vh",
            },
        }, {}, 'dark'),
    },
    sidebarBackdrop: {
        base: {
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: "999",
            opacity: "0",
            visibility: "hidden",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            backdropFilter: "blur(4px)",
            "&.sidebarBackdropOpen": {
                opacity: "1",
                visibility: "visible",
            },
            "@media (min-width: 1024px)": {
                display: "none",
            },
        },
    },
    sidebarHeader: {
        base: {
            padding: "1.5rem",
            borderBottom: `1px solid ${borderColorLight}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: "0",
            background: surfaceLight,
        },
    },
    sidebarHeaderDark: {
        base: mergeStyles({
            padding: "1.5rem",
            borderBottom: `1px solid ${borderColorDark}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: "0",
            background: surfaceDark,
        }, {}, 'dark'),
    },
    sidebarBrand: {
        base: {
            fontSize: "1.25rem",
            fontWeight: "700",
            color: primary,
            textDecoration: "none",
            transition: standardTransition,
            "&:hover": {
                opacity: "0.8",
            },
        },
    },
    sidebarCloseButton: {
        base: {
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: textDark,
            padding: "0.375rem",
            borderRadius: radiusSm,
            transition: standardTransition,
            width: "2rem",
            height: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
                background: surfaceAltLight,
            },
            "@media (min-width: 1024px)": {
                display: "none",
            },
        },
    },
    sidebarCloseButtonDark: {
        base: mergeStyles({
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: textLight,
            padding: "0.375rem",
            borderRadius: radiusSm,
            transition: standardTransition,
            width: "2rem",
            height: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
                background: surfaceAltDark,
            },
            "@media (min-width: 1024px)": {
                display: "none",
            },
        }, {}, 'dark'),
    },
    sidebarNav: {
        base: {
            padding: "1rem 0",
            flex: "1",
            overflowY: "auto",
            // Custom scrollbar
            "&::-webkit-scrollbar": {
                width: "4px",
            },
            "&::-webkit-scrollbar-track": {
                background: surfaceAltLight,
            },
            "&::-webkit-scrollbar-thumb": {
                background: borderColorLight,
                borderRadius: "2px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
                background: primary,
            },
        },
    },
    sidebarNavDark: {
        base: mergeStyles({
            padding: "1rem 0",
            flex: "1",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
                width: "4px",
            },
            "&::-webkit-scrollbar-track": {
                background: surfaceAltDark,
            },
            "&::-webkit-scrollbar-thumb": {
                background: borderColorDark,
                borderRadius: "2px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
                background: primaryLight,
            },
        }, {}, 'dark'),
    },
    sidebarGroup: {
        base: {
            marginBottom: "1.5rem",
        },
    },
    sidebarGroupLabel: {
        base: {
            padding: "0.5rem 1.5rem",
            fontSize: "0.75rem",
            fontWeight: "600",
            color: "rgba(0, 0, 0, 0.5)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "0.5rem",
        },
    },
    sidebarGroupLabelDark: {
        base: mergeStyles({
            padding: "0.5rem 1.5rem",
            fontSize: "0.75rem",
            fontWeight: "600",
            color: "rgba(255, 255, 255, 0.5)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "0.5rem",
        }, {}, 'dark'),
    },
    sidebarLink: {
        base: {
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1.5rem",
            color: textDark,
            textDecoration: "none",
            transition: standardTransition,
            borderLeft: "3px solid transparent",
            position: "relative",
            "&:hover": {
                background: surfaceAltLight,
                color: primary,
                borderLeftColor: primary,
                paddingLeft: "1.75rem",
            },
            "&.sidebarActive": {
                background: "rgba(59, 130, 246, 0.1)",
                color: primary,
                borderLeftColor: primary,
                fontWeight: "600",
            },
            "& .sidebarIcon": {
                width: "1.25rem",
                height: "1.25rem",
                opacity: "0.7",
                transition: standardTransition,
                flexShrink: "0",
            },
            "&:hover .sidebarIcon, &.sidebarActive .sidebarIcon": {
                opacity: "1",
                transform: "scale(1.1)",
            },
            "& .sidebarBadge": {
                marginLeft: "auto",
                fontSize: "0.75rem",
                padding: "0.125rem 0.5rem",
                borderRadius: "0.75rem",
                background: primary,
                color: "white",
                fontWeight: "600",
            },
        },
    },
    sidebarLinkDark: {
        base: mergeStyles({
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1.5rem",
            color: textLight,
            textDecoration: "none",
            transition: standardTransition,
            borderLeft: "3px solid transparent",
            position: "relative",
            "&:hover": {
                background: surfaceAltDark,
                color: primaryLight,
                borderLeftColor: primaryLight,
                paddingLeft: "1.75rem",
            },
            "&.sidebarActive": {
                background: "rgba(96, 165, 250, 0.1)",
                color: primaryLight,
                borderLeftColor: primaryLight,
                fontWeight: "600",
            },
            "& .sidebarIcon": {
                width: "1.25rem",
                height: "1.25rem",
                opacity: "0.7",
                transition: standardTransition,
                flexShrink: "0",
            },
            "&:hover .sidebarIcon, &.sidebarActive .sidebarIcon": {
                opacity: "1",
                transform: "scale(1.1)",
            },
            "& .sidebarBadge": {
                marginLeft: "auto",
                fontSize: "0.75rem",
                padding: "0.125rem 0.5rem",
                borderRadius: "0.75rem",
                background: primaryLight,
                color: "black",
                fontWeight: "600",
            },
        }, {}, 'dark'),
    },
    sidebarFooter: {
        base: {
            padding: "1rem 1.5rem",
            borderTop: `1px solid ${borderColorLight}`,
            background: surfaceAltLight,
            flexShrink: "0",
        },
    },
    sidebarFooterDark: {
        base: mergeStyles({
            padding: "1rem 1.5rem",
            borderTop: `1px solid ${borderColorDark}`,
            background: surfaceAltDark,
            flexShrink: "0",
        }, {}, 'dark'),
    },
    sidebarCollapsible: {
        base: {
            marginBottom: "0.5rem",
        },
    },
    sidebarCollapsibleHeader: {
        base: {
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1.5rem",
            color: textDark,
            textDecoration: "none",
            transition: standardTransition,
            cursor: "pointer",
            border: "none",
            background: "none",
            width: "100%",
            textAlign: "left",
            "&:hover": {
                background: surfaceAltLight,
                color: primary,
            },
            "& .sidebarCollapsibleIcon": {
                transition: standardTransition,
                marginLeft: "auto",
            },
            "&.sidebarCollapsibleOpen .sidebarCollapsibleIcon": {
                transform: "rotate(180deg)",
            },
        },
    },
    sidebarCollapsibleContent: {
        base: {
            overflow: "hidden",
            maxHeight: "0",
            transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&.sidebarCollapsibleOpen": {
                maxHeight: "500px",
            },
        },
    },
};

const Spinner = {
    spinner: {
        base: mergeStyles(spinnerBase, {
            width: "2rem",
            height: "2rem",
            borderTop: "2px solid currentColor",
        }),
    },
    spinnerSm: {
        base: mergeStyles(spinnerBase, {
            width: "1rem",
            height: "1rem",
            borderTop: "2px solid currentColor",
        }),
    },
    spinnerLg: {
        base: mergeStyles(spinnerBase, {
            width: "3rem",
            height: "3rem",
            borderTop: "3px solid currentColor",
        }),
    },
    spinnerXl: {
        base: mergeStyles(spinnerBase, {
            width: "4rem",
            height: "4rem",
            borderTop: "4px solid currentColor",
        }),
    },
    spinnerPrimary: {
        base: mergeStyles(spinnerBase, {
            width: "2rem",
            height: "2rem",
            border: "2px solid rgba(59, 130, 246, 0.2)",
            borderTop: "2px solid primary",
        }),
    },
    spinnerSuccess: {
        base: mergeStyles(spinnerBase, {
            width: "2rem",
            height: "2rem",
            border: "2px solid rgba(16, 185, 129, 0.2)",
            borderTop: "2px solid success",
        }),
    },
    spinnerDanger: {
        base: mergeStyles(spinnerBase, {
            width: "2rem",
            height: "2rem",
            border: "2px solid rgba(239, 68, 68, 0.2)",
            borderTop: "2px solid danger",
        }),
    },
    spinnerWarning: {
        base: mergeStyles(spinnerBase, {
            width: "2rem",
            height: "2rem",
            border: "2px solid rgba(245, 158, 11, 0.2)",
            borderTop: "2px solid warning",
        }),
    },
    spinnerInfo: {
        base: mergeStyles(spinnerBase, {
            width: "2rem",
            height: "2rem",
            border: "2px solid rgba(6, 182, 212, 0.2)",
            borderTop: "2px solid info",
        }),
    },
    spinnerDark: {
        base: mergeStyles(spinnerBase, {
            width: "2rem",
            height: "2rem",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            borderTop: "2px solid primaryLight",
        }, 'dark'),
    },
    spinnerDots: {
        base: {
            display: "inline-flex",
            gap: "0.25rem",
            alignItems: "center",
            "& span": {
                width: "0.5rem",
                height: "0.5rem",
                borderRadius: "50%",
                background: "currentColor",
                animation: "pulse 1.4s ease-in-out infinite both",
                "&:nth-child(1)": { animationDelay: "-0.32s" },
                "&:nth-child(2)": { animationDelay: "-0.16s" },
                "&:nth-child(3)": { animationDelay: "0s" },
            },
        },
    },
    spinnerDotsSm: {
        base: {
            display: "inline-flex",
            gap: "0.125rem",
            "& span": {
                width: "0.375rem",
                height: "0.375rem",
                borderRadius: "50%",
                background: "currentColor",
                animation: "pulse 1.4s ease-in-out infinite both",
            },
        },
    },
    spinnerDotsLg: {
        base: {
            display: "inline-flex",
            gap: "0.375rem",
            "& span": {
                width: "0.75rem",
                height: "0.75rem",
                borderRadius: "50%",
                background: "currentColor",
                animation: "pulse 1.4s ease-in-out infinite both",
            },
        },
    },
    spinnerBars: {
        base: {
            display: "inline-flex",
            gap: "0.125rem",
            alignItems: "end",
            height: "1rem",
            "& span": {
                width: "0.25rem",
                background: "currentColor",
                borderRadius: "1px",
                animation: "bars 1.2s ease-in-out infinite",
                "&:nth-child(1)": {
                    animationDelay: "-1.2s",
                    height: "0.5rem"
                },
                "&:nth-child(2)": {
                    animationDelay: "-1.1s",
                    height: "0.75rem"
                },
                "&:nth-child(3)": {
                    animationDelay: "-1.0s",
                    height: "1rem"
                },
                "&:nth-child(4)": {
                    animationDelay: "-0.9s",
                    height: "0.75rem"
                },
                "&:nth-child(5)": {
                    animationDelay: "-0.8s",
                    height: "0.5rem"
                },
            },
        },
    },
    spinnerBarsSm: {
        base: {
            display: "inline-flex",
            gap: "0.0625rem",
            alignItems: "end",
            height: "0.75rem",
            "& span": {
                width: "0.1875rem",
                background: "currentColor",
                borderRadius: "1px",
                animation: "bars 1.2s ease-in-out infinite",
                height: "0.375rem",
            },
        },
    },
    spinnerBarsLg: {
        base: {
            display: "inline-flex",
            gap: "0.1875rem",
            alignItems: "end",
            height: "1.5rem",
            "& span": {
                width: "0.375rem",
                background: "currentColor",
                borderRadius: "1px",
                animation: "bars 1.2s ease-in-out infinite",
                height: "0.75rem",
            },
        },
    },
    spinnerCircle: {
        base: {
            width: "2rem",
            height: "2rem",
            borderRadius: "50%",
            background: "conic-gradient(transparent, currentColor)",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white 0)",
            animation: "spin 1s linear infinite",
        },
    },
    loader: {
        base: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            padding: "2rem",
            textAlign: "center",
        },
    },
    loaderInline: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
        },
    },
    loaderText: {
        base: {
            fontSize: "0.875rem",
            color: "rgba(0, 0, 0, 0.6)",
            fontWeight: "500",
            margin: "0",
        },
    },
    loaderTextDark: {
        base: {
            fontSize: "0.875rem",
            color: "rgba(255, 255, 255, 0.7)",
            fontWeight: "500",
            margin: "0",
        },
    },
    spinnerGlow: {
        base: {
            width: "2rem",
            height: "2rem",
            borderRadius: "50%",
            background: primary,
            boxShadow: `0 0 0 0 rgba(59, 130, 246, 0.7)`,
            animation: "glowPulse 1.5s infinite",
        },
    },
    spinnerGlowSuccess: {
        base: {
            width: "2rem",
            height: "2rem",
            borderRadius: "50%",
            background: success,
            boxShadow: `0 0 0 0 rgba(16, 185, 129, 0.7)`,
            animation: "glowPulse 1.5s infinite",
        },
    },
};

/**
 * ---------------------------------------------------------------------
 *  GARUR-CSS — Ultra-fast Atomic CSS Engine
 *  Author: Barshan Sarkar
 *  Version: 1.0.0
 *  License: MIT
 * ---------------------------------------------------------------------
 *
 *  This CLI powers the Garur-CSS ecosystem. It handles:
 *    • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 *    • File scanning across HTML / JS / TS / JSX / TSX
 *    • Cache management and orphan-class detection
 *    • Config file creation (garur.config.js)
 *    • Plugin boilerplate generation
 *    • Watch mode for real-time builds ,, (coming soon)
 *
 *  Technologies:
 *    - TypeScript
 *    - Rollup bundling (CJS-compatible output)
 *    - Node.js (CLI execution via shebang)
 *
 *  Notes for contributors:
 *    • Keep the CLI ESM/CJS compatible.
 *    • Avoid dynamic require unless wrapped safely.
 *    • Keep output messages clean, fast, and developer-friendly.
 *
 *  Made in India.
 * ---------------------------------------------------------------------
 */
const Container = {
    container: {
        base: {
            width: "100%",
            margin: "0 auto",
            "max-width": "1000px",
            padding: "0 1rem",
            display: "block",
            "box-sizing": "border-box",
            "@media (min-width: 1025px)": {
                padding: "0 2rem",
            },
            "@media (max-width: 640px)": {
                padding: "0 0.75rem",
            },
        },
    },
    containerFluid: {
        base: {
            width: "100%",
            padding: "0 1rem",
            "box-sizing": "border-box",
            "@media (min-width: 1025px)": {
                padding: "0 2rem",
            },
            "@media (max-width: 640px)": {
                padding: "0 0.75rem",
            },
        },
    },
};

/**
 * ---------------------------------------------------------------------
 *  GARUR-CSS — Ultra-fast Atomic CSS Engine
 *  Author: Barshan Sarkar
 *  Version: 1.0.0
 *  License: MIT
 * ---------------------------------------------------------------------
 *
 *  This CLI powers the Garur-CSS ecosystem. It handles:
 *    • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 *    • File scanning across HTML / JS / TS / JSX / TSX
 *    • Cache management and orphan-class detection
 *    • Config file creation (garur.config.js)
 *    • Plugin boilerplate generation
 *    • Watch mode for real-time builds ,, (coming soon)
 *
 *  Technologies:
 *    - TypeScript
 *    - Rollup bundling (CJS-compatible output)
 *    - Node.js (CLI execution via shebang)
 *
 *  Notes for contributors:
 *    • Keep the CLI ESM/CJS compatible.
 *    • Avoid dynamic require unless wrapped safely.
 *    • Keep output messages clean, fast, and developer-friendly.
 *
 *  Made in India.
 * ---------------------------------------------------------------------
 */
const Breadcrumb = {
    breadcrumb: {
        base: {
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
            fontSize: "0.875rem",
            color: "rgba(0, 0, 0, 0.6)",
        },
    },
    breadcrumbItem: {
        base: {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            "&:not(:last-child)::after": {
                content: '"›"',
                color: "rgba(0, 0, 0, 0.4)",
            },
        },
    },
    breadcrumbLink: {
        base: {
            color: "rgba(0, 0, 0, 0.6)",
            textDecoration: "none",
            transition: standardTransition,
            padding: "0.25rem 0.5rem",
            borderRadius: radiusSm,
            "&:hover": {
                color: primary,
                background: surfaceAltLight,
            },
            "&.breadcrumbActive": {
                color: primary,
                fontWeight: "500",
            },
        },
    },
    breadcrumbDark: {
        base: mergeStyles({
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
            fontSize: "0.875rem",
            color: "rgba(255, 255, 255, 0.6)",
        }, {}, 'dark'),
    },
    breadcrumbLinkDark: {
        base: mergeStyles({
            color: "rgba(255, 255, 255, 0.6)",
            textDecoration: "none",
            transition: standardTransition,
            padding: "0.25rem 0.5rem",
            borderRadius: radiusSm,
            "&:hover": {
                color: primaryLight,
                background: surfaceAltDark,
            },
            "&.breadcrumbActive": {
                color: primaryLight,
                fontWeight: "500",
            },
        }, {}, 'dark'),
    },
};

/**
 * ---------------------------------------------------------------------
 *  GARUR-CSS — Ultra-fast Atomic CSS Engine
 *  Author: Barshan Sarkar
 *  Version: 1.0.0
 *  License: MIT
 * ---------------------------------------------------------------------
 *
 *  This CLI powers the Garur-CSS ecosystem. It handles:
 *    • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 *    • File scanning across HTML / JS / TS / JSX / TSX
 *    • Cache management and orphan-class detection
 *    • Config file creation (garur.config.js)
 *    • Plugin boilerplate generation
 *    • Watch mode for real-time builds ,, (coming soon)
 *
 *  Technologies:
 *    - TypeScript
 *    - Rollup bundling (CJS-compatible output)
 *    - Node.js (CLI execution via shebang)
 *
 *  Notes for contributors:
 *    • Keep the CLI ESM/CJS compatible.
 *    • Avoid dynamic require unless wrapped safely.
 *    • Keep output messages clean, fast, and developer-friendly.
 *
 *  Made in India.
 * ---------------------------------------------------------------------
 */
const Dropdown = {
    // Dropdown Trigger
    "dropdown-trigger": {
        base: {
            background: surfaceLight,
            border: `1px solid ${borderColorLight}`,
            borderRadius: radiusMd,
            padding: "0.875rem 1.5rem",
            fontSize: "0.875rem",
            fontWeight: "600",
            color: textDark,
            cursor: "pointer",
            transition: standardTransition,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            boxShadow: shadowLg,
            position: "relative",
            overflow: "hidden",
            "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
            },
            "&::after": {
                content: '""',
                width: "8px",
                height: "8px",
                borderRight: "2px solid currentColor",
                borderBottom: "2px solid currentColor",
                transform: "rotate(45deg)",
                transition: "transform 0.3s ease",
                opacity: "0.7",
            },
            "&.active::after": {
                transform: "rotate(-135deg)",
            },
        },
    },
    // Light Theme Dropdown
    "dropdown-light": {
        base: {
            position: "absolute",
            top: "calc(100% + 8px)",
            right: "0",
            background: `linear-gradient(135deg, ${surfaceLight} 0%, ${surfaceAltLight} 100%)`,
            borderRadius: `calc(${radiusMd} * 1.5)`,
            boxShadow: `${shadowLg}, 0 20px 40px rgba(0, 0, 0, 0.1)`,
            border: `1px solid ${borderColorLight}`,
            zIndex: "1000",
            minWidth: "14rem",
            overflow: "hidden",
            backdropFilter: `${blurGlass} brightness(1.05)`,
            opacity: "0",
            visibility: "hidden",
            transform: "translateY(-15px) scale(0.95)",
            transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            padding: "0.5rem",
            "&::before": {
                content: '""',
                position: "absolute",
                top: "-8px",
                right: "20px",
                width: "16px",
                height: "16px",
                background: `linear-gradient(135deg, ${surfaceLight} 0%, ${surfaceAltLight} 100%)`,
                transform: "rotate(45deg)",
                borderTop: `1px solid ${borderColorLight}`,
                borderLeft: `1px solid ${borderColorLight}`,
                zIndex: "-1",
            },
            "&.active": {
                opacity: "1",
                visibility: "visible",
                transform: "translateY(0) scale(1)",
            },
            "@media (max-width: 768px)": {
                position: "fixed",
                top: "auto",
                bottom: "0",
                left: "1rem",
                right: "1rem",
                minWidth: "auto",
                borderRadius: `${radiusLg} ${radiusLg} 0 0`,
                transform: "translateY(100%) scale(1)",
                boxShadow: "0 -20px 60px rgba(0, 0, 0, 0.3)",
                "&::before": {
                    display: "none",
                },
                "&.active": {
                    transform: "translateY(0) scale(1)",
                },
            },
        },
    },
    // Dark Theme Dropdown
    "dropdown-dark": {
        base: mergeStyles({
            position: "absolute",
            top: "calc(100% + 8px)",
            right: "0",
            background: `linear-gradient(135deg, ${surfaceDark} 0%, ${surfaceAltDark} 100%)`,
            borderRadius: `calc(${radiusMd} * 1.5)`,
            boxShadow: `${shadowLg}, 0 20px 40px rgba(0, 0, 0, 0.3)`,
            border: `1px solid ${borderColorDark}`,
            zIndex: "1000",
            minWidth: "14rem",
            overflow: "hidden",
            backdropFilter: `${blurGlass} brightness(1.1)`,
            opacity: "0",
            visibility: "hidden",
            transform: "translateY(-15px) scale(0.95)",
            transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            padding: "0.5rem",
            "&::before": {
                content: '""',
                position: "absolute",
                top: "-8px",
                right: "20px",
                width: "16px",
                height: "16px",
                background: `linear-gradient(135deg, ${surfaceDark} 0%, ${surfaceAltDark} 100%)`,
                transform: "rotate(45deg)",
                borderTop: `1px solid ${borderColorDark}`,
                borderLeft: `1px solid ${borderColorDark}`,
                zIndex: "-1",
            },
            "&.active": {
                opacity: "1",
                visibility: "visible",
                transform: "translateY(0) scale(1)",
            },
            "@media (max-width: 768px)": {
                position: "fixed",
                top: "auto",
                bottom: "0",
                left: "1rem",
                right: "1rem",
                minWidth: "auto",
                borderRadius: `${radiusLg} ${radiusLg} 0 0`,
                transform: "translateY(100%) scale(1)",
                boxShadow: "0 -20px 60px rgba(0, 0, 0, 0.3)",
                "&::before": {
                    display: "none",
                },
                "&.active": {
                    transform: "translateY(0) scale(1)",
                },
            },
        }, {}, 'dark'),
    },
    // Dropdown Items
    "dropdown-item": {
        base: {
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.875rem 1rem",
            color: textDark,
            textDecoration: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            borderRadius: radiusMd,
            fontSize: "0.875rem",
            fontWeight: "500",
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
            "&::before": {
                content: '""',
                position: "absolute",
                left: "0",
                top: "0",
                height: "100%",
                width: "3px",
                background: `linear-gradient(to bottom, ${primary}, transparent)`,
                transform: "translateX(-100%)",
                transition: "transform 0.3s ease",
            },
            "&:hover": {
                background: `linear-gradient(135deg, ${surfaceAltLight} 0%, rgba(255,255,255,0.8) 100%)`,
                color: primary,
                transform: "translateX(4px)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                "&::before": {
                    transform: "translateX(0)",
                },
            },
            "&.active": {
                background: `linear-gradient(135deg, ${primary}15 0%, ${primary}08 100%)`,
                color: primary,
                fontWeight: "600",
                "&::before": {
                    transform: "translateX(0)",
                    background: primary,
                },
            },
        },
    },
    // Dropdown Icon
    "dropdown-icon": {
        base: {
            width: "1.25rem",
            height: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.875rem",
            opacity: "0.7",
            transition: "all 0.3s ease",
            ".dropdown-item:hover &": {
                opacity: "1",
                transform: "scale(1.1)",
            },
        },
    },
    // Dropdown Badge
    "dropdown-badge": {
        base: {
            marginLeft: "auto",
            padding: "0.25rem 0.5rem",
            fontSize: "0.7rem",
            fontWeight: "600",
            background: primary,
            color: "white",
            borderRadius: "1rem",
            lineHeight: "1",
        },
    },
    // Dropdown Header
    "dropdown-header": {
        base: {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "1rem 1rem 0.5rem",
            fontSize: "0.7rem",
            fontWeight: "700",
            color: "rgba(0, 0, 0, 0.4)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            "&::after": {
                content: '""',
                flex: "1",
                height: "1px",
                background: `linear-gradient(to right, ${borderColorLight}, transparent)`,
                marginLeft: "0.5rem",
            },
        },
    },
    // Dropdown Divider
    "dropdown-divider": {
        base: {
            height: "1px",
            background: `linear-gradient(to right, transparent, ${borderColorLight}, transparent)`,
            margin: "0.5rem 1rem",
            opacity: "0.6",
        },
    },
    // Dark theme variants for nested selectors
    "dropdown-dark-dropdown-item": {
        base: mergeStyles({
            color: textLight,
            "&::before": {
                background: `linear-gradient(to bottom, ${primaryLight}, transparent)`,
            },
            "&:hover": {
                background: `linear-gradient(135deg, ${surfaceAltDark} 0%, rgba(255,255,255,0.05) 100%)`,
                color: primaryLight,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            },
            "&.active": {
                background: `linear-gradient(135deg, ${primaryLight}15 0%, ${primaryLight}08 100%)`,
                color: primaryLight,
                "&::before": {
                    background: primaryLight,
                },
            },
        }, {}, 'dark'),
    },
    "dropdown-dark-dropdown-header": {
        base: mergeStyles({
            color: "rgba(255, 255, 255, 0.4)",
            "&::after": {
                background: `linear-gradient(to right, ${borderColorDark}, transparent)`,
            },
        }, {}, 'dark'),
    },
    "dropdown-dark-dropdown-divider": {
        base: mergeStyles({
            background: `linear-gradient(to right, transparent, ${borderColorDark}, transparent)`,
        }, {}, 'dark'),
    },
};

const Toast = {
    toastSuccess: {
        base: mergeStyles(toastBase, {
            border: `1px solid rgba(16, 185, 129, 0.2)`,
            background: `rgba(16, 185, 129, 0.1)`,
            color: success,
        }),
    },
    toastError: {
        base: mergeStyles(toastBase, {
            border: `1px solid rgba(239, 68, 68, 0.2)`,
            background: `rgba(239, 68, 68, 0.1)`,
            color: danger,
        }),
    },
    toastWarning: {
        base: mergeStyles(toastBase, {
            border: `1px solid rgba(245, 158, 11, 0.2)`,
            background: `rgba(245, 158, 11, 0.1)`,
            color: warning,
        }),
    },
    toastInfo: {
        base: mergeStyles(toastBase, {
            border: `1px solid rgba(6, 182, 212, 0.2)`,
            background: `rgba(6, 182, 212, 0.1)`,
            color: info,
        }),
    },
    toastDark: {
        base: mergeStyles(toastBase, {
            background: surfaceDark,
            color: textLight,
            border: `1px solid ${borderColorDark}`,
        }, 'dark'),
    },
    toastHeader: {
        base: {
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
            gap: "0.5rem",
        },
    },
    toastTitle: {
        base: {
            fontWeight: "600",
            fontSize: "0.875rem",
            margin: "0",
            flex: "1",
        },
    },
    toastBody: {
        base: {
            fontSize: "0.875rem",
            opacity: "0.9",
            lineHeight: "1.4",
        },
    },
    toastProgress: {
        base: {
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "2px",
            background: "rgba(0, 0, 0, 0.1)",
            borderRadius: "0 0 0.5rem 0.5rem",
            overflow: "hidden",
            "&::after": {
                content: '""',
                position: "absolute",
                top: "0",
                left: "0",
                bottom: "0",
                background: "currentColor",
                opacity: "0.3",
                animation: "toastProgress 5s linear forwards",
            },
        },
    },
    toastContainer: {
        base: {
            position: "fixed",
            top: "1rem",
            right: "1rem",
            zIndex: "10000",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            maxWidth: "24rem",
            "@media (max-width: 640px)": {
                right: "0.5rem",
                left: "0.5rem",
                top: "0.5rem",
                maxWidth: "none",
            },
        },
    },
};

const Skeleton = {
    skeleton: {
        base: skeletonBase,
    },
    skeletonDark: {
        base: {
            background: "linear-gradient(90deg, #334155 25%, #475569 50%, #334155 75%)",
            "background-size": "200% 100%",
            "border-radius": radiusSm,
            animation: "shimmer 1.5s infinite",
        },
    },
    skeletonText: {
        base: {
            height: "1rem",
            marginBottom: "0.5rem",
            "&:last-child": {
                marginBottom: "0",
                width: "80%",
            },
        },
    },
    skeletonTitle: {
        base: {
            height: "1.5rem",
            marginBottom: "1rem",
            width: "60%",
        },
    },
    skeletonAvatar: {
        base: {
            width: "3rem",
            height: "3rem",
            borderRadius: "50%",
        },
    },
    skeletonButton: {
        base: {
            height: "2.5rem",
            width: "6rem",
            borderRadius: radiusSm,
        },
    },
    skeletonCard: {
        base: {
            padding: "1.5rem",
            borderRadius: radiusMd,
            background: surfaceLight,
            border: `1px solid ${borderColorLight}`,
        },
    },
    skeletonImage: {
        base: {
            width: "100%",
            height: "12rem",
            borderRadius: radiusSm,
            marginBottom: "1rem",
        },
    },
};

const TABS = {
    tabs: {
        base: {
            display: "flex",
            "border-bottom": `1px solid ${borderColorLight}`,
            gap: "0.5rem", // Reduced
            "@media (max-width: 640px)": {
                flexDirection: "column",
                gap: "0",
            },
        },
    },
    tabsDark: {
        base: {
            display: "flex",
            "border-bottom": `1px solid ${borderColorDark}`,
            gap: "0.5rem",
            "@media (max-width: 640px)": {
                flexDirection: "column",
                gap: "0",
            },
        },
    },
    tab: {
        base: tabBase,
    },
    tabDark: {
        base: mergeStyles(tabBase, {
            color: textLight,
        }, 'dark'),
    },
    tabActive: {
        base: mergeStyles(tabBase, {
            "border-bottom": `2px solid ${primary}`,
            color: primary,
            "font-weight": "600",
            background: "rgba(59, 130, 246, 0.03)",
        }),
    },
    tabActiveDark: {
        base: mergeStyles(mergeStyles(tabBase, {
            "border-bottom": `2px solid ${primaryLight}`,
            color: primaryLight,
            "font-weight": "600",
            background: "rgba(96, 165, 250, 0.03)",
        }), {}, 'dark'),
    },
};

const pricingCard = {
    pricingCard: {
        base: {
            padding: "2rem 1.25rem",
            "border-radius": radiusLg,
            background: surfaceLight,
            "box-shadow": shadowSm,
            border: `1px solid ${borderColorLight}`,
            transition: standardTransition,
            "&:hover": {
                transform: "translateY(-4px)",
                "box-shadow": shadowLg,
            },
            "backdrop-filter": blurGlass,
            "@media (max-width: 640px)": {
                padding: "1.5rem 1rem",
            },
        },
    },
    pricingCardDark: {
        base: mergeStyles({
            padding: "2rem 1.25rem",
            "border-radius": radiusLg,
            background: surfaceDark,
            "box-shadow": shadowSm,
            border: `1px solid ${borderColorDark}`,
            transition: standardTransition,
            "&:hover": {
                transform: "translateY(-4px)",
                "box-shadow": shadowLg,
            },
            "backdrop-filter": blurGlass,
            "@media (max-width: 640px)": {
                padding: "1.5rem 1rem",
            },
        }, {}, 'dark'),
    },
};

const Modal = {
    modal: {
        base: modalBase,
    },
    modalDark: {
        base: mergeStyles(modalBase, {
            background: surfaceDark,
            color: textLight,
            border: `1px solid ${borderColorDark}`,
        }, 'dark'),
    },
    modalLg: {
        base: mergeStyles(modalBase, {
            "max-width": "600px",
            padding: "2rem",
        }),
    },
    modalLgDark: {
        base: mergeStyles(mergeStyles(modalBase, {
            "max-width": "600px",
            padding: "2rem",
        }), {}, 'dark'),
    },
};

const components = {
    ...navbar,
    ...Container,
    ...buttons,
    ...card,
    ...hero,
    ...inputs,
    ...textarea,
    areaLg: {
        base: mergeStyles(inputBase, {
            minHeight: "8rem",
            padding: "1rem 1.25rem",
            fontSize: "1rem",
        }),
    },
    select: {
        base: mergeStyles(inputBase, {
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "1rem",
            paddingRight: "2.5rem",
        }),
    },
    selectMultiple: {
        base: mergeStyles(inputBase, {
            padding: "0.75rem",
            height: "auto",
            minHeight: "6rem",
            backgroundImage: "none",
        }),
    },
    checkbox: {
        base: {
            width: "1.25rem",
            height: "1.25rem",
            borderRadius: radiusSm,
            border: `1px solid ${borderColorLight}`,
            backgroundColor: surfaceLight,
            appearance: "none",
            cursor: "pointer",
            transition: standardTransition,
            position: "relative",
            "&:checked": {
                backgroundColor: primary,
                borderColor: primary,
                backgroundImage: `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "0.75rem",
            },
            "&:focus": {
                outline: "none",
                boxShadow: `0 0 0 2px ${primary}20`,
                borderColor: primary,
            },
        },
    },
    radio: {
        base: {
            width: "1.25rem",
            height: "1.25rem",
            borderRadius: "50%",
            border: `1px solid ${borderColorLight}`,
            backgroundColor: surfaceLight,
            appearance: "none",
            cursor: "pointer",
            transition: standardTransition,
            "&:checked": {
                backgroundColor: primary,
                borderColor: primary,
                backgroundImage: `radial-gradient(circle, white 30%, transparent 30%)`,
            },
            "&:focus": {
                outline: "none",
                boxShadow: `0 0 0 2px ${primary}20`,
                borderColor: primary,
            },
        },
    },
    searchInput: {
        base: mergeStyles(inputBase, {
            paddingLeft: "2.5rem",
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' /%3e%3c/svg%3e")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left 0.75rem center",
            backgroundSize: "1rem",
        }),
    },
    fileUpload: {
        base: mergeStyles(inputBase, {
            padding: "0.75rem",
            border: `2px dashed ${borderColorLight}`,
            background: surfaceAltLight,
            textAlign: "center",
            cursor: "pointer",
            "&:hover": {
                borderColor: primary,
                background: "rgba(59, 130, 246, 0.05)",
            },
            "&::file-selector-button": {
                display: "none",
            },
        }),
    },
    fileUploadActive: {
        base: mergeStyles(inputBase, {
            padding: "0.75rem",
            border: `2px dashed ${primary}`,
            background: "rgba(59, 130, 246, 0.05)",
            textAlign: "center",
        }),
    },
    rangeSlider: {
        base: {
            width: "100%",
            height: "0.375rem",
            borderRadius: radiusSm,
            background: surfaceAltLight,
            outline: "none",
            appearance: "none",
            backdropFilter: blurGlass,
            transition: standardTransition,
            "&::-webkit-slider-thumb": {
                appearance: "none",
                height: "1.25rem",
                width: "1.25rem",
                borderRadius: "50%",
                background: primary,
                cursor: "pointer",
                boxShadow: shadowSm,
                transition: standardTransition,
                "&:hover": {
                    transform: "scale(1.1)",
                    boxShadow: shadowMd,
                },
            },
            "&::-moz-range-thumb": {
                height: "1.25rem",
                width: "1.25rem",
                borderRadius: "50%",
                background: primary,
                cursor: "pointer",
                border: "none",
                boxShadow: shadowSm,
            },
        },
    },
    ...formGroups,
    ...inputGroups,
    checkboxDark: {
        base: {
            width: "1.25rem",
            height: "1.25rem",
            borderRadius: radiusSm,
            border: `1px solid ${borderColorDark}`,
            backgroundColor: surfaceDark,
            appearance: "none",
            cursor: "pointer",
            transition: standardTransition,
            position: "relative",
            "&:checked": {
                backgroundColor: primaryLight,
                borderColor: primaryLight,
                backgroundImage: `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "0.75rem",
            },
        },
    },
    switch: {
        base: {
            width: "3rem",
            height: "1.5rem",
            borderRadius: "0.75rem",
            backgroundColor: surfaceAltLight,
            border: `1px solid ${borderColorLight}`,
            appearance: "none",
            cursor: "pointer",
            position: "relative",
            transition: "all 0.3s ease",
            "&::before": {
                content: '""',
                position: "absolute",
                width: "1.25rem",
                height: "1.25rem",
                borderRadius: "50%",
                backgroundColor: surfaceLight,
                top: "0.125rem",
                left: "0.125rem",
                transition: "all 0.3s ease",
                boxShadow: shadowSm,
            },
            "&:checked": {
                backgroundColor: primary,
                borderColor: primary,
                "&::before": {
                    transform: "translateX(1.5rem)",
                    backgroundColor: surfaceLight,
                },
            },
        },
    },
    ...Modal,
    ...alert,
    ...footer,
    ...avatar,
    ...progress,
    ...TABS,
    slider: {
        base: {
            width: "100%",
            height: "0.375rem",
            "border-radius": radiusSm,
            background: surfaceAltLight,
            outline: "none",
            appearance: "none",
            "backdrop-filter": blurGlass,
            transition: standardTransition,
            "&::-webkit-slider-thumb": {
                height: "1rem",
                width: "1rem",
                "border-radius": "50%",
                background: primary,
                cursor: "pointer",
            },
        },
    },
    sliderDark: {
        base: mergeStyles({
            width: "100%",
            height: "0.375rem",
            "border-radius": radiusSm,
            background: surfaceAltDark,
            outline: "none",
            appearance: "none",
            "backdrop-filter": blurGlass,
            transition: standardTransition,
            "&::-webkit-slider-thumb": {
                height: "1rem",
                width: "1rem",
                "border-radius": "50%",
                background: primaryLight,
                cursor: "pointer",
            },
        }, {}, 'dark'),
    },
    ...Accordion,
    textGradient: {
        base: {
            background: `linear-gradient(135deg, ${primaryDark}, primary, ${primaryLight})`,
            "background-clip": "text",
            "-webkit-background-clip": "text",
            "-webkit-text-fill-color": "transparent",
            "font-weight": "700",
        },
    },
    textGradientDark: {
        base: {
            background: `linear-gradient(135deg, ${primaryLight}, primary)`,
            "background-clip": "text",
            "-webkit-background-clip": "text",
            "-webkit-text-fill-color": "transparent",
            "font-weight": "700",
        },
    },
    chip: {
        base: {
            display: "inline-flex",
            "align-items": "center",
            gap: "0.375rem",
            padding: "0.375rem 0.75rem",
            "border-radius": radiusMd,
            background: surfaceAltLight,
            color: textDark,
            "font-size": "0.8125rem",
            "font-weight": "500",
            border: `1px solid ${borderColorLight}`,
            "backdrop-filter": blurGlass,
            transition: standardTransition,
        },
    },
    chipDark: {
        base: mergeStyles({
            display: "inline-flex",
            "align-items": "center",
            gap: "0.375rem",
            padding: "0.375rem 0.75rem",
            "border-radius": radiusMd,
            background: surfaceAltDark,
            color: textLight,
            "font-size": "0.8125rem",
            "font-weight": "500",
            border: `1px solid ${borderColorDark}`,
            "backdrop-filter": blurGlass,
            transition: standardTransition,
        }, {}, 'dark'),
    },
    ...badges,
    ...Tooltip,
    tipSuccess: {
        base: {
            padding: "1rem",
            borderLeft: " 4px solid #10b981",
            background: "#f0fdf4",
            margin: "1.5rem 0",
            borderRadius: "0 0.5rem 0.5rem 0",
        }
    },
    tipWarning: {
        base: {
            padding: "1rem",
            borderLeft: "4px solid #ef4444",
            background: "#fef2f2",
            margin: "1.5rem 0",
            borderRadius: "0 0.5rem 0.5rem 0",
        }
    },
    tipInfo: {
        base: {
            padding: "1rem",
            borderLeft: " 4px solid rgb(15, 69, 141)",
            background: "#ADD8E6",
            margin: "1.5rem 0",
            borderRadius: "0 0.5rem 0.5rem 0",
        }
    },
    tipSuccessDark: {
        base: {
            background: " #166534", borderLeftColor: "#22c55e"
        }
    },
    ...Dropdown,
    ...Breadcrumb,
    pagination: {
        base: {
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            flexWrap: "wrap",
        },
    },
    paginationItem: {
        base: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "2.5rem",
            height: "2.5rem",
            padding: "0 0.75rem",
            borderRadius: radiusSm,
            border: `1px solid ${borderColorLight}`,
            background: surfaceLight,
            color: textDark,
            textDecoration: "none",
            fontSize: "0.875rem",
            fontWeight: "500",
            transition: standardTransition,
            "&:hover": {
                background: surfaceAltLight,
                borderColor: primary,
                color: primary,
            },
            "&.paginationActive": {
                background: primary,
                borderColor: primary,
                color: "#fff",
            },
            "&.paginationDisabled": {
                opacity: "0.5",
                cursor: "not-allowed",
                "&:hover": {
                    background: surfaceLight,
                    borderColor: borderColorLight,
                    color: textDark,
                },
            },
        },
    },
    paginationDark: {
        base: mergeStyles({
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            flexWrap: "wrap",
        }, {}, 'dark'),
    },
    paginationItemDark: {
        base: mergeStyles({
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "2.5rem",
            height: "2.5rem",
            padding: "0 0.75rem",
            borderRadius: radiusSm,
            border: `1px solid ${borderColorDark}`,
            background: surfaceDark,
            color: textLight,
            textDecoration: "none",
            fontSize: "0.875rem",
            fontWeight: "500",
            transition: standardTransition,
            "&:hover": {
                background: surfaceAltDark,
                borderColor: primaryLight,
                color: primaryLight,
            },
            "&.paginationActive": {
                background: primaryLight,
                borderColor: primaryLight,
                color: "#000",
            },
        }, {}, 'dark'),
    },
    ...sidebar,
    mobileMenuEnhanced: {
        base: {
            position: "fixed",
            top: "var(--navbar-height, 3.5rem)",
            left: "0",
            right: "0",
            background: surfaceLight,
            backdropFilter: "blur(16px)",
            borderTop: `1px solid ${borderColorLight}`,
            padding: "1rem 0.75rem",
            paddingBottom: "env(safe-area-inset-bottom, 1.5rem)",
            transform: "translateY(-100%)",
            opacity: "0",
            visibility: "hidden",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: "999",
            maxHeight: "calc(100vh - var(--navbar-height, 3.5rem))",
            overflowY: "auto",
            "&.mobileMenuOpen": {
                transform: "translateY(0)",
                opacity: "1",
                visibility: "visible",
            },
            "@media (max-width: 768px)": {
                top: "var(--navbar-height-mobile, 3rem)",
            },
            "@media (max-width: 640px)": {
                padding: "0.875rem 0.5rem",
            },
        },
    },
    mobileMenuEnhancedDark: {
        base: mergeStyles({
            position: "fixed",
            top: "var(--navbar-height, 3.5rem)",
            left: "0",
            right: "0",
            background: surfaceDark,
            backdropFilter: "blur(16px)",
            borderTop: `1px solid ${borderColorDark}`,
            padding: "1rem 0.75rem",
            paddingBottom: "env(safe-area-inset-bottom, 1.5rem)",
            transform: "translateY(-100%)",
            opacity: "0",
            visibility: "hidden",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: "999",
            maxHeight: "calc(100vh - var(--navbar-height, 3.5rem))",
            overflowY: "auto",
        }, {}, 'dark'),
    },
    mobileMenuItemEnhanced: {
        base: {
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem 0.75rem",
            fontSize: "1.125rem",
            fontWeight: "500",
            color: textDark,
            textDecoration: "none",
            borderBottom: `1px solid ${borderColorLight}`,
            transition: standardTransition,
            "&:last-child": {
                borderBottom: "none",
            },
            "&:hover": {
                color: primary,
                paddingLeft: "1rem",
                background: surfaceAltLight,
            },
            "& .mobileMenuIcon": {
                width: "1.5rem",
                height: "1.5rem",
                opacity: "0.7",
            },
            "@media (max-width: 640px)": {
                fontSize: "1rem",
                padding: "0.875rem 0.75rem",
            },
        },
    },
    mobileMenuItemEnhancedDark: {
        base: mergeStyles({
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem 0.75rem",
            fontSize: "1.125rem",
            fontWeight: "500",
            color: textLight,
            textDecoration: "none",
            borderBottom: `1px solid ${borderColorDark}`,
            transition: standardTransition,
            "&:last-child": {
                borderBottom: "none",
            },
            "&:hover": {
                color: primaryLight,
                paddingLeft: "1rem",
                background: surfaceAltDark,
            },
        }, {}, 'dark'),
    },
    steps: {
        base: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            counterReset: "step",
            "&::before": {
                content: '""',
                position: "absolute",
                top: "50%",
                left: "0",
                right: "0",
                height: "2px",
                background: surfaceAltLight,
                transform: "translateY(-50%)",
                zIndex: "1",
            },
        },
    },
    step: {
        base: {
            position: "relative",
            zIndex: "2",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            flex: "1",
        },
    },
    stepIndicator: {
        base: {
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "50%",
            background: surfaceLight,
            border: `2px solid ${borderColorLight}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "600",
            fontSize: "0.875rem",
            color: textDark,
            transition: standardTransition,
            "&.stepActive": {
                background: primary,
                borderColor: primary,
                color: "#fff",
            },
            "&.stepCompleted": {
                background: success,
                borderColor: success,
                color: "#fff",
            },
        },
    },
    stepLabel: {
        base: {
            fontSize: "0.875rem",
            fontWeight: "500",
            textAlign: "center",
            color: textDark,
            "&.stepActive": {
                color: primary,
                fontWeight: "600",
            },
        },
    },
    tabsVertical: {
        base: {
            display: "flex",
            flexDirection: "column",
            borderRight: `1px solid ${borderColorLight}`,
            gap: "0.25rem",
            minWidth: "12rem",
        },
    },
    tabVertical: {
        base: {
            padding: "0.75rem 1rem",
            background: "transparent",
            border: "none",
            borderRight: "2px solid transparent",
            color: textDark,
            cursor: "pointer",
            transition: standardTransition,
            fontWeight: "500",
            textAlign: "left",
            "&:hover": {
                background: surfaceAltLight,
                color: primary,
            },
            "&.tabActive": {
                borderRightColor: primary,
                color: primary,
                fontWeight: "600",
                background: "rgba(59, 130, 246, 0.05)",
            },
        },
    },
    megaMenu: {
        base: {
            position: "absolute",
            top: "100%",
            left: "0",
            right: "0",
            background: surfaceLight,
            borderRadius: radiusMd,
            boxShadow: shadowXl,
            border: `1px solid ${borderColorLight}`,
            zIndex: "1000",
            opacity: "0",
            visibility: "hidden",
            transform: "translateY(-10px)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            padding: "2rem",
            "&.megaMenuOpen": {
                opacity: "1",
                visibility: "visible",
                transform: "translateY(0)",
            },
        },
    },
    megaMenuGrid: {
        base: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
        },
    },
    megaMenuColumn: {
        base: {
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
        },
    },
    megaMenuTitle: {
        base: {
            fontSize: "0.875rem",
            fontWeight: "600",
            color: "rgba(0, 0, 0, 0.5)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "0.5rem",
        },
    },
    ...Toast,
    panelGlass: {
        base: {
            padding: "1.5rem",
            "border-radius": radiusLg,
            background: "rgba(255, 255, 255, 0.08)",
            "backdrop-filter": blurGlassHeavy,
            border: `1px solid rgba(255, 255, 255, 0.12)`,
            "box-shadow": shadowLg,
            transition: standardTransition,
            "@media (max-width: 640px)": {
                padding: "1.25rem",
            },
        },
    },
    panelGlassDark: {
        base: mergeStyles({
            padding: "1.5rem",
            "border-radius": radiusLg,
            background: "rgba(31, 41, 55, 0.08)",
            "backdrop-filter": blurGlassHeavy,
            border: `1px solid ${borderColorDark}`,
            "box-shadow": shadowLg,
            transition: standardTransition,
            "@media (max-width: 640px)": {
                padding: "1.25rem",
            },
        }, {}, 'dark'),
    },
    stepper: {
        base: {
            display: "flex",
            "align-items": "center",
            "justify-content": "space-between",
            position: "relative",
            "&::before": {
                content: '""',
                position: "absolute",
                top: "50%",
                left: "0",
                right: "0",
                height: "1px",
                background: "rgba(59, 130, 246, 0.15)",
                transform: "translateY(-50%)",
            },
            "@media (max-width: 640px)": {
                flexDirection: "column",
                gap: "1rem",
                "&::before": {
                    display: "none",
                },
            },
        },
    },
    stepperDark: {
        base: mergeStyles({
            display: "flex",
            "align-items": "center",
            "justify-content": "space-between",
            position: "relative",
            "&::before": {
                content: '""',
                position: "absolute",
                top: "50%",
                left: "0",
                right: "0",
                height: "1px",
                background: "rgba(96, 165, 250, 0.15)",
                transform: "translateY(-50%)",
            },
            "@media (max-width: 640px)": {
                flexDirection: "column",
                gap: "1rem",
                "&::before": {
                    display: "none",
                },
            },
        }, {}, 'dark'),
    },
    ...Spinner,
    ...Skeleton,
    loading: {
        base: {
            position: "relative",
            "&::after": {
                content: '""',
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(2px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "inherit",
            },
        },
    },
    loadingContent: {
        base: {
            opacity: "0.6",
            filter: "blur(1px)",
            pointerEvents: "none",
        },
    },
    pulse: {
        base: {
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        },
    },
    loaderXs: {
        base: {
            padding: "1rem",
            gap: "0.5rem",
            "& .spinnerSm": {
                width: "0.75rem",
                height: "0.75rem",
            },
        },
    },
    loaderSm: {
        base: {
            padding: "1.5rem",
            gap: "0.75rem",
        },
    },
    loaderLg: {
        base: {
            padding: "3rem",
            gap: "1.5rem",
        },
    },
    timeline: {
        base: {
            position: "relative",
            padding: "1.5rem 0",
            "&::before": {
                content: '""',
                position: "absolute",
                left: "0.5rem",
                top: "0",
                bottom: "0",
                width: "1px",
                background: `linear-gradient(180deg, ${primary}, success)`,
            },
            "@media (max-width: 640px)": {
                padding: "1rem 0",
                "&::before": {
                    left: "0.25rem",
                },
            },
        },
    },
    timelineDark: {
        base: mergeStyles({
            position: "relative",
            padding: "1.5rem 0",
            "&::before": {
                content: '""',
                position: "absolute",
                left: "0.5rem",
                top: "0",
                bottom: "0",
                width: "1px",
                background: `linear-gradient(180deg, ${primaryLight}, successLight)`,
            },
            "@media (max-width: 640px)": {
                padding: "1rem 0",
                "&::before": {
                    left: "0.25rem",
                },
            },
        }, {}, 'dark'),
    },
    ...pricingCard,
    hideOnMobile: {
        base: {
            "@media (max-width: 768px)": {
                display: "none !important",
            },
        },
    },
    showOnMobile: {
        base: {
            display: "none",
            "@media (max-width: 768px)": {
                display: "block !important",
            },
        },
    },
    hideOnSm: {
        base: {
            "@media (max-width: 640px)": {
                display: "none !important",
            },
        },
    },
    showOnSm: {
        base: {
            display: "none",
            "@media (max-width: 640px)": {
                display: "block !important",
            },
        },
    },
    hideOnMd: {
        base: {
            "@media (max-width: 768px)": {
                display: "none !important",
            },
        },
    },
    showOnMd: {
        base: {
            display: "none",
            "@media (min-width: 769px)": {
                display: "block !important",
            },
        },
    },
};
function generateComponentVariants(baseComponents, count = 20) {
    const dynamicComponents = {};
    Object.entries(baseComponents).forEach(([name, comp]) => {
        for (let i = 1; i <= count; i++) {
            dynamicComponents[`${name}-${i}`] = {
                base: {
                    ...comp.base,
                    transform: `translateY(${i * 0.25}px)`,
                    "z-index": i,
                    "&:hover": {
                        transform: `translateY(${i * 0.25 - 1}px) scale(1.01)`,
                    },
                },
            };
            if (!name.endsWith('Dark')) {
                dynamicComponents[`${name}-${i}-dark`] = {
                    base: mergeStyles(comp.base, {}, 'dark'),
                };
            }
        }
    });
    return dynamicComponents;
}
const allComponents = {
    ...components,
    ...generateComponentVariants(components, 20),
};
const enhancedAnimations = String.raw `
:root {
  --primary: ${primary};
  --primary-dark: ${primaryDark};
  --primary-light: ${primaryLight};
  --success: ${success};
  --success-dark: ${successDark};
  --success-light: ${successLight};
  --danger: ${danger};
  --danger-dark: ${dangerDark};
  --danger-light: ${dangerLight};
  --warning: ${warning};
  --warning-dark: ${warningDark};
  --warning-light: ${warningLight};
  --info: ${info};
  --info-dark: ${infoDark};
  --info-light: ${infoLight};
  --text-dark: ${textDark};
  --text-light: ${textLight};
  --surface-light: ${surfaceLight};
  --surface-dark: ${surfaceDark};
  --surface-alt-light: ${surfaceAltLight};
  --surface-alt-dark: ${surfaceAltDark};
  --border-light: ${borderColorLight};
  --border-dark: ${borderColorDark};
  --radius-sm: ${radiusSm};
  --radius-md: ${radiusMd};
  --radius-lg: ${radiusLg};
  --radius-xl: ${radiusXl};
  --shadow-sm: ${shadowSm};
  --shadow-md: ${shadowMd};
  --shadow-lg: ${shadowLg};
  --shadow-xl: ${shadowXl};
  --blur-glass: ${blurGlass};
  --blur-glass-heavy: ${blurGlassHeavy};
  --transition: ${standardTransition};
  --navbar-height: 3.5rem;
  --navbar-height-mobile: 3rem;
  --nav-surface-light: rgba(255, 255, 255, 0.85);
  --nav-surface-dark: rgba(15, 23, 42, 0.85);
  --nav-text-dark: #1e293b;
  --nav-text-light: #f8fafc;
  --nav-primary: #3b82f6;
  --nav-primary-light: #60a5fa;
  --nav-primary-dark: #2563eb;
  --nav-border-light: rgba(148, 163, 184, 0.3);
  --nav-border-dark: rgba(71, 85, 105, 0.3);
  --nav-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --nav-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --nav-transition-standard: all 0.3s ease;
}

.dark {
  --text-dark: ${textLight};
  --text-light: ${textDark};
  --surface-light: ${surfaceDark};
  --surface-dark: ${surfaceLight};
  --surface-alt-light: ${surfaceAltDark};
  --surface-alt-dark: ${surfaceAltLight};
  --border-light: ${borderColorDark};
  --border-dark: ${borderColorLight};
  --nav-surface-light: rgba(15, 23, 42, 0.85);
  --nav-surface-dark: rgba(15, 23, 42, 0.95);
  --nav-text-dark: #f8fafc;
  --nav-text-light: #f8fafc;
  --nav-border-light: rgba(71, 85, 105, 0.3);
  --nav-border-dark: rgba(71, 85, 105, 0.5);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--surface-light);
  color: var(--text-dark);
  line-height: 1.6;
  padding-top: var(--navbar-height);
  transition: var(--transition);
}

.dark body {
  background: var(--surface-dark);
  color: var(--text-light);
}

ul, ol {
  list-style: none;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.2); }
  50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }
}

@keyframes slideIn {
  0% { transform: translateY(-100%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes gridScroll {
  0% { transform: translateY(0); }
  100% { transform: translateY(60px); }
}

@keyframes meshPulse {
  0% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
  100% { opacity: 0.3; transform: scale(1); }
}

@keyframes titleFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes borderRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes cardPulse {
  0%, 100% { box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1); }
  50% { box-shadow: 0 8px 32px rgba(59, 130, 246, 0.2); }
}

@keyframes tooltipSlideIn {
  0% {
    opacity: 0;
    transform: translate(var(--tx, -50%), var(--ty, -8px)) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translate(var(--tx, -50%), var(--ty, -4px)) scale(1);
  }
}

@keyframes tooltipSlideOut {
  0% {
    opacity: 1;
    transform: translate(var(--tx, -50%), var(--ty, -4px)) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(var(--tx, -50%), var(--ty, -8px)) scale(0.9);
  }
}

@keyframes tooltipBounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(var(--tx, -50%), var(--ty, -4px), 0) scale(1);
  }
  40%, 43% {
    transform: translate3d(var(--tx, -50%), calc(var(--ty, -4px) - 8px), 0) scale(1.02);
  }
  70% {
    transform: translate3d(var(--tx, -50%), calc(var(--ty, -4px) - 4px), 0) scale(1.01);
  }
}

@keyframes tooltipFade {
  0% {
    opacity: 0;
    transform: translate(var(--tx, -50%), var(--ty, -4px)) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translate(var(--tx, -50%), var(--ty, -4px)) scale(1);
  }
}

@keyframes tooltipPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes bars {
  0%, 40%, 100% { transform: scaleY(0.4); }
  20% { transform: scaleY(1); }
}

@keyframes indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes stripes {
  0% { background-position: 1rem 0; }
  100% { background-position: 0 0; }
}

@keyframes glowPulse {
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}

@keyframes toastProgress {
  0% { width: 100%; }
  100% { width: 0%; }
}

@keyframes navLinkUnderline {
  0% { width: 0; }
  100% { width: 100%; }
}

@keyframes mobileMenuSlide {
  0% { transform: translateY(-100%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes hamburgerToX1 {
  0% { transform: translateY(0) rotate(0); }
  100% { transform: translateY(6px) rotate(45deg); }
}

@keyframes hamburgerToX2 {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes hamburgerToX3 {
  0% { transform: translateY(0) rotate(0); }
  100% { transform: translateY(-6px) rotate(-45deg); }
}

.float-animation {
  animation: float 3s ease-in-out infinite;
}

.glow-animation {
  animation: glow 2s ease-in-out infinite;
}

.slide-in {
  animation: slideIn 0.4s ease-out;
}

.fade-in {
  animation: fadeIn 0.5s ease-in;
}

.pulse-animation {
  animation: pulse 2s ease-in-out infinite;
}

.tooltipTop { --tx: -50%; --ty: -8px; }
.tooltipBottom { --tx: -50%; --ty: 8px; }
.tooltipLeft { --tx: 8px; --ty: -50%; }
.tooltipRight { --tx: -8px; --ty: -50%; }

@media (max-width: 768px) {
  :root {
    --navbar-height: 3rem;
  }
}

@media (hover: none) and (pointer: coarse) {
  .tooltipContainer {
    cursor: default;
  }

  .tooltip {
    font-size: 0.875rem;
    padding: 1rem;
    max-width: 16rem;
  }
}

.tooltipContainer:focus-visible .tooltip {
  opacity: 1;
  visibility: visible;
  transform: translate(0, 0) scale(1);
}

.tooltip {
  will-change: transform, opacity;
  backface-visibility: hidden;
  transform: translateZ(0);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .hero-title,
  .hero-subtitle {
    animation: none !important;
  }

  .navbar,
  .nav-link,
  .menu-button,
  .mobile-menu {
    transition: none !important;
  }

  .btn, .btnPrimary, .btnSuccess, .btnDanger, .btnWarning, .btnInfo {
    transition: none !important;
    &::before {
      display: none !important;
    }
    &:hover {
      transform: none !important;
    }
  }

  .card, .cardHover, .cardClickable, .cardWithImage {
    transition: none !important;
    &:hover {
      transform: none !important;
    }
  }

  .cardBorderAnimated::before {
    animation: none !important;
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
  }
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: var(--nav-surface-light);
  box-shadow: var(--nav-shadow-sm);
  backdrop-filter: blur(16px);
  transition: var(--nav-transition-standard);
}

.dark .navbar {
  background: var(--nav-surface-dark);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  max-width: 1280px;
  height: var(--navbar-height);
  padding: 0 1rem;
}

.nav-brand {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--nav-primary-light), var(--nav-primary), var(--nav-primary-dark));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
  transition: var(--nav-transition-standard);
}

.nav-link {
  color: var(--nav-text-dark);
  font-weight: 500;
  text-decoration: none;
  padding: 0.375rem 0;
  position: relative;
  transition: var(--nav-transition-standard);
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 1.5px;
  background: var(--nav-primary);
  transform: translateX(-50%);
  transition: var(--nav-transition-standard);
}

.nav-link:hover::after {
  width: 100%;
}

.mobile-menu {
  position: fixed;
  top: var(--navbar-height);
  left: 0;
  right: 0;
  background: var(--nav-surface-light);
  backdrop-filter: blur(16px);
  border-top: 1px solid var(--nav-border-light);
  padding: 1rem 0.75rem;
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: var(--nav-transition-standard);
  z-index: 999;
}

.mobile-menu.mobile-menu-open {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

@media (min-width: 1025px) {
  .nav-container {
    height: 4rem;
    padding: 0 2rem;
  }
}

@media (max-width: 768px) {
  .nav-container {
    height: var(--navbar-height-mobile);
    padding: 0 0.75rem;
  }

  .nav-brand {
    font-size: 1.125rem;
  }

  .mobile-menu {
    top: var(--navbar-height-mobile);
  }
}
`;

/**
 * ---------------------------------------------------------------------
 *  GARUR-CSS — Ultra-fast Atomic CSS Engine
 *  Author: Barshan Sarkar
 *  Version: 1.0.0
 *  License: MIT
 * ---------------------------------------------------------------------
 *
 *  This CLI powers the Garur-CSS ecosystem. It handles:
 *    • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 *    • File scanning across HTML / JS / TS / JSX / TSX
 *    • Cache management and orphan-class detection
 *    • Config file creation (garur.config.js)
 *    • Plugin boilerplate generation
 *    • Watch mode for real-time builds ,, (coming soon)
 *
 *  Technologies:
 *    - TypeScript
 *    - Rollup bundling (CJS-compatible output)
 *    - Node.js (CLI execution via shebang)
 *
 *  Notes for contributors:
 *    • Keep the CLI ESM/CJS compatible.
 *    • Avoid dynamic require unless wrapped safely.
 *    • Keep output messages clean, fast, and developer-friendly.
 *
 *  Made in India.
 * ---------------------------------------------------------------------
 */
function unwrapBrackets(s) {
    if (!s)
        return s;
    if (s.startsWith("[") && s.endsWith("]"))
        return s.slice(1, -1);
    return s;
}
/**
 * Find matching closing bracket for the first '[' encountered.
 * This is robust against nested brackets and quotes.
 * this took me 2 hours to debug pls dont touch
 */
function findMatchingBracketIndex(s, openIndex) {
    let depth = 0;
    let inSingle = false;
    let inDouble = false;
    let inBacktick = false; // wait do we even have backticks in css values???
    for (let i = openIndex; i < s.length; i++) {
        const ch = s[i];
        const prev = i > 0 ? s[i - 1] : "";
        if (ch === "'" && !inDouble && !inBacktick && prev !== "\\")
            inSingle = !inSingle;
        else if (ch === '"' && !inSingle && !inBacktick && prev !== "\\")
            inDouble = !inDouble;
        else if (ch === "`" && !inSingle && !inDouble && prev !== "\\")
            inBacktick = !inBacktick;
        if (inSingle || inDouble || inBacktick)
            continue;
        if (ch === "[")
            depth++;
        else if (ch === "]") {
            depth--;
            if (depth === 0)
                return i;
        }
    }
    return -1; // bracket hell
}
function parse(token) {
    if (!token || typeof token !== "string") {
        throw new Error("parse: token must be a non-empty string");
    }
    let raw = token.trim();
    let negative = false;
    let important = false;
    // wait what if they do "!!p-4"?? idk
    while (raw.startsWith("!")) {
        important = true;
        raw = raw.slice(1);
    }
    // Negative prefix
    if (raw.startsWith("-")) {
        negative = true;
        raw = raw.slice(1);
    }
    // Bracketed arbitrary value: key-[...]
    const bracketIndex = raw.indexOf("[");
    if (bracketIndex !== -1) {
        const closing = findMatchingBracketIndex(raw, bracketIndex);
        if (closing !== -1) {
            let keyPart = raw.slice(0, bracketIndex);
            if (keyPart.endsWith("-"))
                keyPart = keyPart.slice(0, -1); // cleanup trailing hyphen
            const valuePart = raw.slice(bracketIndex, closing + 1);
            const value = unwrapBrackets(valuePart);
            if (!keyPart)
                throw new Error(`parse: empty key in bracket token "${token}"`);
            return { raw: token, key: keyPart, value, negative, important };
        }
        // if bracket present but no matching close, fallthrough to normal parsing to produce helpful error later
        // this feels wrong but it works???
    }
    // Non-bracketed: split on LAST hyphen so keys like "grid-cols-3" -> key=grid-cols, value=3
    const idx = raw.lastIndexOf("-");
    if (idx === -1) {
        // no value part; treat as flag-like utility (e.g., d-flex)
        return { raw: token, key: raw, value: "", negative, important };
    }
    const key = raw.slice(0, idx);
    const value = raw.slice(idx + 1);
    if (!key)
        throw new Error(`parse: empty key in token "${token}"`);
    if (value === undefined || value === null)
        throw new Error(`parse: missing value in token "${token}"`);
    return { raw: token, key, value, negative, important };
} // finally

/**
 * ---------------------------------------------------------------------
 *  GARUR-CSS — Ultra-fast Atomic CSS Engine
 *  Author: Barshan Sarkar
 *  Version: 1.0.0
 *  License: MIT
 * ---------------------------------------------------------------------
 *
 *  This CLI powers the Garur-CSS ecosystem. It handles:
 *    • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 *    • File scanning across HTML / JS / TS / JSX / TSX
 *    • Cache management and orphan-class detection
 *    • Config file creation (garur.config.js)
 *    • Plugin boilerplate generation
 *    • Watch mode for real-time builds ,, (coming soon)
 *
 *  Technologies:
 *    - TypeScript
 *    - Rollup bundling (CJS-compatible output)
 *    - Node.js (CLI execution via shebang)
 *
 *  Notes for contributors:
 *    • Keep the CLI ESM/CJS compatible.
 *    • Avoid dynamic require unless wrapped safely.
 *    • Keep output messages clean, fast, and developer-friendly.
 *
 *  Made in India.
 * ---------------------------------------------------------------------
 */
const defaultConfig = {
    breakpoints: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
    },
    darkMode: "class",
    darkSelector: ".dark",
    jit: {
        dynamicOnly: true,
        ignore: ["node_modules", "dist", ".git"],
    },
    stats: {
        topN: 25,
    },
    palette: {
        gray: { "50": "#f9fafb", "100": "#f3f4f6", "200": "#e5e7eb", "300": "#d1d5db", "400": "#9ca3af", "500": "#6b7280", "600": "#4b5563", "700": "#374151", "800": "#1f2937", "900": "#111827" },
        red: { "50": "#fff1f2", "100": "#ffe4e6", "200": "#fecdd3", "300": "#fda4af", "400": "#fb7185", "500": "#ef4444", "600": "#dc2626", "700": "#b91c1c", "800": "#991b1b", "900": "#7f1d1d" },
        yellow: { "50": "#fffbeb", "100": "#fef3c7", "200": "#fde68a", "300": "#fcd34d", "400": "#fbbf24", "500": "#f59e0b", "600": "#d97706", "700": "#b45309", "800": "#92400e", "900": "#78350f" },
        green: { "50": "#f0fdf4", "100": "#dcfce7", "200": "#bbf7d0", "300": "#86efac", "400": "#4ade80", "500": "#22c55e", "600": "#16a34a", "700": "#15803d", "800": "#166534", "900": "#14532d" },
        blue: { "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd", "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8", "800": "#1e40af", "900": "#1e3a8a" },
        indigo: { "50": "#eef2ff", "100": "#e0e7ff", "200": "#c7d2fe", "300": "#a5b4fc", "400": "#818cf8", "500": "#6366f1", "600": "#4f46e5", "700": "#4338ca", "800": "#3730a3", "900": "#312e81" },
        purple: { "50": "#faf5ff", "100": "#f3e8ff", "200": "#e9d5ff", "300": "#d8b4fe", "400": "#c084fc", "500": "#a855f7", "600": "#9333ea", "700": "#7e22ce", "800": "#6b21a8", "900": "#581c87" },
        pink: { "50": "#fff1f2", "100": "#ffe4e6", "200": "#fecdd3", "300": "#fda4af", "400": "#fb7185", "500": "#f43f5e", "600": "#e11d48", "700": "#be123c", "800": "#9f1239", "900": "#881337" },
        teal: { "50": "#f0fdfa", "100": "#ccfbf1", "200": "#99f6e4", "300": "#5eead4", "400": "#2dd4bf", "500": "#14b8a6", "600": "#0d9488", "700": "#0f766e", "800": "#115e59", "900": "#134e4a" },
        orange: { "50": "#fff7ed", "100": "#ffedd5", "200": "#fed7aa", "300": "#fdba74", "400": "#fb923c", "500": "#f97316", "600": "#ea580c", "700": "#c2410c", "800": "#9a3412", "900": "#7c2d12" },
    },
};
module.exports = {
    theme: {
        colors: {
            brand: { DEFAULT: "#6366f1", 300: "#a5b4fc", 500: "#6366f1", 600: "#4f46e5" },
            success: { DEFAULT: "#22c55e", 300: "#86efac", 500: "#22c55e", 600: "#16a34a" },
            danger: { DEFAULT: "#ef4444", 300: "#fda4af", 500: "#ef4444", 600: "#dc2626" },
            warning: { DEFAULT: "#f59e0b", 300: "#fcd34d", 500: "#f59e0b", 600: "#d97706" },
            dark: { DEFAULT: "#1f2937", strong: "#111827" },
            body: "#374151", // gray-700
            heading: "#111827", // gray-900
            neutral: {
                primary: { soft: "#f3f4f6" }, // gray-100
                secondary: { medium: "#e5e7eb" }, // gray-200
                tertiary: { medium: "#d1d5db", soft: "#f3f4f6" }, // gray-300 / gray-100
            },
            default: { medium: "#6b7280" }, // gray-500
        },
        borderRadius: {
            base: "0.5rem", // or keep your current value
        },
    },
};
// Deep merge helper (simple)
function deepMerge(target, source) {
    if (!source)
        return target;
    for (const k of Object.keys(source)) {
        const sv = source[k];
        const tv = target[k];
        if (Array.isArray(sv))
            target[k] = sv.slice();
        else if (sv && typeof sv === "object" && !(sv instanceof RegExp)) {
            target[k] = deepMerge(tv && typeof tv === "object" ? tv : {}, sv);
        }
        else {
            target[k] = sv;
        }
    }
    return target;
}
// Load optional project-level config: garur.config.js at project root
let userConfig = {};
try {
    // require from cwd - project root
    const path = require("path");
    const cfgPath = path.resolve(process.cwd(), "garur.config.js");
    // Node require will throw if not found
    userConfig = require(cfgPath);
    if (userConfig && typeof userConfig === "object") {
        // OK
    }
    else {
        userConfig = {};
    }
}
catch {
    userConfig = {};
}
const config$1 = deepMerge(JSON.parse(JSON.stringify(defaultConfig)), userConfig);

/**
 * ---------------------------------------------------------------------
 * GARUR-CSS — Ultra-fast Atomic CSS Engine
 * Author: Barshan Sarkar
  hey wait, i think i forgot to update the version last time lol
 * Version: 1.0.0
 * License: MIT
 * ---------------------------------------------------------------------
 *
 * This CLI powers the Garur-CSS ecosystem. It handles:
 * • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 * • File scanning across HTML / JS / TS / JSX / TSX
 * • Cache management and orphan-class detection
 * • Config file creation (garur.config.js)
 * • Plugin boilerplate generation
 * • Watch mode for real-time builds ,, (coming soon)
 * oh man, watch mode is gonna be epic when i get to it
 *
 * Technologies:
 * - TypeScript
 * - Rollup bundling (CJS-compatible output)
 * - Node.js (CLI execution via shebang)
 *
 * Notes for contributors:
 * • Keep the CLI ESM/CJS compatible.
 * • Avoid dynamic require unless wrapped safely.
 * • Keep output messages clean, fast, and developer-friendly.
 *
 * Made in India.
 * ---------------------------------------------------------------------
 */
// src/utils/sanitizer.ts
// i hate this file with every atom of my body
//  i'm crying, here's the mess
function normalizeColorToken(val) {
    if (!val)
        return null;
    const raw = val.trim();
    // just let css functions live their life pls
    if (/^var\(/.test(raw) || /linear-gradient|radial-gradient|conic-gradient|rgba?\(|hsla?\(/i.test(raw))
        return raw;
    // oklch and color-mix showed up one day and now i have to deal with them
    if (/^oklch\(/i.test(raw))
        return raw;
    if (/^color-mix\(/i.test(raw))
        return raw;
    if (/^hsl\(/i.test(raw))
        return raw;
    // someone keeps writing url('/img.png') no-repeat center and expects it to work
    // i hate everything
    if (raw.startsWith('url(') && raw.endsWith(')')) {
        if (/^url\(['"]?([^'")]+)['"]?\)$/.test(raw))
            return raw;
        return null;
    }
    // this is the most cursed arbitrary background crap i've ever seen in my life
    if (raw.includes('url(') && (raw.includes('no-repeat') || raw.includes('repeat') || raw.includes('center') || raw.includes('top') || raw.includes('left') || raw.includes('right') || raw.includes('bottom'))) {
        return raw; // i'm not validating this anymore i give up
    }
    // hex without #
    const hexOnly = /^[0-9a-fA-F]{3,8}$/;
    if (hexOnly.test(raw))
        return `#${raw}`;
    if (/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(raw))
        return raw;
    // keywords that are safe i guess
    if (/^(transparent|currentColor|inherit|initial|revert)$/.test(raw))
        return raw;
    // named colors... probably fine???
    if (/^[a-zA-Z-]+$/.test(raw))
        return raw;
    // anything with space or comma = gradient or multiple values, just let it through i'm tired
    if (raw.includes(" ") || raw.includes(","))
        return raw;
    return null; // die
}
function ensureUnitForLength(val) {
    if (!val)
        return val;
    const s = val.trim();
    if (s === "0")
        return "0";
    if (/^calc\(/.test(s))
        return s;
    // already has unit, good for you
    if (/^-?\d+(\.\d+)?(px|rem|em|vw|vh|ch|%)$/.test(s))
        return s;
    // naked number → slap px because that's what everyone expects anyway
    if (/^-?\d+(\.\d+)?$/.test(s))
        return `${s}px`;
    // fractions like 1/2, 3/4, 5/6 etc.
    const frac = s.match(/^(-?\d+)\/(\d+)$/);
    if (frac) {
        const a = Number(frac[1]), b = Number(frac[2]);
        if (b !== 0)
            return `${(a / b) * 100}%`;
    }
    return s; // idk anymore
}

// src/plugin.ts
// Simple plugin API for Garur-CSS. Plugins can register:#########
// - sanitisers: additional sanitizer hooks (not used directly here, but provided for extension)<<>>
//
// Plugins should call register* functions during startup. The JIT/handler will invoke the hooks.<<<<<<<
const handlerHooks = [];
const variantHooks = {};
function registerHandlerHook(fn) {
    handlerHooks.push(fn);
}
function getHandlerHooks() {
    return [...handlerHooks];
}
function registerVariant(name, fn) {
    variantHooks[name] = fn;
}
function getVariantHook(name) {
    return variantHooks[name];
}
var plugin = {
    registerHandlerHook,
    getHandlerHooks,
    registerVariant,
    getVariantHook,
};

var _a, _b, _c, _d, _e, _f, _g, _h, _j;
// ''''''''''''''''''''''''''''''''''''''
// CONSTANTS & CONFIGARETIONS ..YEAH <<<<<<<<<<<<<<<<<<<<<
// ''''''''''''''''''''''''''''''''''''''
const config = config$1;
// Keyframes definitions
const KEYFRAMES = { spin: `@keyframes garur-spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`,
    bounce: `@keyframes garur-bounce{0%,20%,53%,80%,100%{transform:translate3d(0,0,0)}40%,43%{transform:translate3d(0,-30px,0)}70%{transform:translate3d(0,-15px,0)}90%{transform:translate3d(0,-4px,0)}}`,
    ping: `@keyframes garur-ping{75%,100%{transform:scale(2);opacity:0}}`,
    pulse: `@keyframes garur-pulse{50%{opacity:.5}}`,
    'fade-in': `@keyframes garur-fade-in{from{opacity:0}to{opacity:1}}`,
};
// Regular expressions
const ARBITRARY_PROPERTY_RE = /^\[([a-zA-Z0-9\-_]+):\s*([^\]]+)\]$/;
const COLOR_SHADE_PATTERN = /^([a-zA-Z]+)-(\d{2,3})$/;
const logger = {
    warn: (message, token) => {
        if (process.env.NODE_ENV !== 'production') {
            console.warn(`[Garur Handler] ${message}`, token || '');
        }
    },
    error: (message, token) => {
        if (process.env.NODE_ENV !== 'production') {
            console.error(`[Garur Handler] ${message}`, token || '');
        }
    }
};
// -------------------------------
// CORE UTILITY FUNCTIONS
// --------------------------
/**
 * Safely convert hex color to rgba
 */
function hexToRgba(hex, alpha = 1) {
    try {
        if (!hex || typeof hex !== 'string')
            return null;
        let h = hex.replace("#", "").trim();
        if (!h)
            return null;
        // Handle alpha in hex (4 or 8 characters)
        if (h.length === 4 || h.length === 8) {
            const chars = h.split("");
            if (h.length === 4) {
                h = chars[0] + chars[0] + chars[1] + chars[1] + chars[2] + chars[2];
                const aHex = chars[3] + chars[3];
                const hexAlpha = parseInt(aHex, 16) / 255;
                alpha = alpha * hexAlpha;
            }
            else if (h.length === 8) {
                const aHex = h.slice(6, 8);
                h = h.slice(0, 6);
                const hexAlpha = parseInt(aHex, 16) / 255;
                alpha = alpha * hexAlpha;
            }
        }
        else if (h.length === 3) {
            h = h.split("").map(c => c + c).join("");
        }
        if (h.length !== 6)
            return null;
        const rr = parseInt(h.slice(0, 2), 16);
        const gg = parseInt(h.slice(2, 4), 16);
        const bb = parseInt(h.slice(4, 6), 16);
        if (isNaN(rr) || isNaN(gg) || isNaN(bb))
            return null;
        return `rgba(${rr}, ${gg}, ${bb}, ${Math.max(0, Math.min(1, alpha))})`;
    }
    catch (error) {
        logger.error(`Failed to convert hex to rgba: ${hex}`, undefined);
        return null;
    }
}
/**
 * Apply alpha to a color string
 */
function applyAlphaToColor(color, alphaStr) {
    if (!alphaStr)
        return color;
    let alphaNum = parseFloat(alphaStr);
    if (isNaN(alphaNum))
        return color;
    let alpha = alphaNum;
    if (alpha > 1)
        alpha = alpha / 100;
    if (alpha < 0 || alpha > 1)
        return color;
    // Apply alpha based on color type
    if (color.startsWith('#')) {
        const rgba = hexToRgba(color, alpha);
        return rgba || color;
    }
    else if (color.startsWith('rgb(')) {
        const match = color.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:\/\s*([\d.]+)\s*)?\)/);
        if (match) {
            const [, r, g, b, oldAlphaStr = '1'] = match;
            const oldAlpha = parseFloat(oldAlphaStr);
            const finalAlpha = Math.max(0, Math.min(1, oldAlpha * alpha));
            return `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
        }
    }
    else if (color.startsWith('hsl(')) {
        const match = color.match(/hsl\s*\(\s*(\d+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:\/\s*([\d.]+)\s*)?\)/);
        if (match) {
            const [, h, s, l, oldAlphaStr = '1'] = match;
            const oldAlpha = parseFloat(oldAlphaStr);
            const finalAlpha = Math.max(0, Math.min(1, oldAlpha * alpha));
            return `hsla(${h}, ${s}%, ${l}%, ${finalAlpha})`;
        }
    }
    else if (color.startsWith('rgba(') || color.startsWith('hsla(')) {
        // Already has alpha, multiply it
        if (color.includes('/')) {
            return color.replace(/\/(\s*[\d.]+)/, `/${alpha}`);
        }
    }
    return color;
}
/**
 * Resolve palette color with priority
 */
function resolvePaletteColor(value) {
    var _a, _b, _c;
    if (!value || typeof value !== 'string')
        return null;
    try {
        const parts = value.split("/");
        const colorPart = (_a = parts[0]) === null || _a === void 0 ? void 0 : _a.trim();
        const alphaPart = (_b = parts[1]) === null || _b === void 0 ? void 0 : _b.trim();
        if (!colorPart)
            return null;
        const palette = config.palette || ((_c = config.theme) === null || _c === void 0 ? void 0 : _c.colors) || {};
        // Direct color match
        if (palette[colorPart]) {
            if (typeof palette[colorPart] === 'string') {
                return applyAlphaToColor(palette[colorPart], alphaPart);
            }
            // Object with shades - default to 500
            if (typeof palette[colorPart] === 'object' && palette[colorPart]['500']) {
                return applyAlphaToColor(palette[colorPart]['500'], alphaPart);
            }
        }
        // Color-shade pattern
        const match = colorPart.match(COLOR_SHADE_PATTERN);
        if (match) {
            const [_, colorName, shade] = match;
            if (palette[colorName] &&
                typeof palette[colorName] === 'object' &&
                palette[colorName][shade]) {
                return applyAlphaToColor(palette[colorName][shade], alphaPart);
            }
        }
        return null;
    }
    catch (error) {
        logger.error(`Failed to resolve palette color: ${value}`, undefined);
        return null;
    }
}
/**
 * Check if value is arbitrary
 */
function isArbitrary(value) {
    if (!value || typeof value !== 'string')
        return false;
    return /[\s()\[\]$#]|calc\(|var\(|url\(|gradient\(/i.test(value);
}
/**
 * Get arbitrary value from bracket notation
 */
function getArbitraryValue(value, negative) {
    if (!value)
        return null;
    try {
        const match = value.match(/\[([^\[\]]+)\]/);
        if (!match)
            return null;
        let v = match[1].replace(/_/g, ' ').trim();
        if (negative && v && !v.startsWith('-')) {
            v = '-' + v;
        }
        return v || null;
    }
    catch (error) {
        return null;
    }
}
/**
 * Flatten color palette for utility generation
 */
function flattenColorPalette(palette) {
    const flat = {};
    try {
        for (const [color, shades] of Object.entries(palette)) {
            if (!shades)
                continue;
            if (typeof shades === "object" && !Array.isArray(shades)) {
                for (const [shade, value] of Object.entries(shades)) {
                    if (typeof value === "string" && value) {
                        flat[`${color}-${shade}`] = value;
                    }
                }
            }
            else if (typeof shades === "string") {
                flat[color] = shades;
            }
        }
    }
    catch (error) {
        logger.error('Failed to flatten color palette', undefined);
    }
    return flat;
}
/**
 * Add !important to declarations
 * ummm ..
 *
 */
function addImportant(decl, important) {
    if (!important || !decl)
        return decl;
    return decl
        .split(';')
        .filter(part => part.trim())
        .map(part => {
        const trimmed = part.trim();
        if (!trimmed || trimmed.includes('!important'))
            return trimmed;
        return trimmed + ' !important';
    })
        .join(';') + (decl.endsWith(';') ? '' : ';');
}
// =========================================
// CONFIGURATION SCALES
// ============================================
const SCALES = {
    spacing: {
        px: "1px", 0: "0", 0.5: "0.125rem", 1: "0.25rem", 1.5: "0.375rem",
        2: "0.5rem", 2.5: "0.625rem", 3: "0.75rem", 3.5: "0.875rem", 4: "1rem",
        5: "1.25rem", 6: "1.5rem", 7: "1.75rem", 8: "2rem", 9: "2.25rem",
        10: "2.5rem", 11: "2.75rem", 12: "3rem", 14: "3.5rem", 16: "4rem",
        20: "5rem", 24: "6rem", 28: "7rem", 32: "8rem", 36: "9rem",
        40: "10rem", 44: "11rem", 48: "12rem", 52: "13rem", 56: "14rem",
        60: "15rem", 64: "16rem", 72: "18rem", 80: "20rem", 96: "24rem",
        ...(_a = config.theme) === null || _a === void 0 ? void 0 : _a.spacing
    },
    borderRadius: {
        none: "0px", sm: "0.125rem", DEFAULT: "0.25rem", md: "0.375rem",
        lg: "0.5rem", xl: "0.75rem", "2xl": "1rem", "3xl": "1.5rem",
        full: "9999px", ...(_b = config.theme) === null || _b === void 0 ? void 0 : _b.borderRadius
    },
    borderWidth: {
        0: "0px", 1: "1px", 2: "2px", 4: "4px", 8: "8px",
        DEFAULT: "1px", ...(_c = config.theme) === null || _c === void 0 ? void 0 : _c.borderWidth
    },
    boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
        none: "none", ...(_d = config.theme) === null || _d === void 0 ? void 0 : _d.boxShadow
    },
    opacity: {
        0: "0", 5: "0.05", 10: "0.1", 15: "0.15", 20: "0.2", 25: "0.25",
        30: "0.3", 35: "0.35", 40: "0.4", 45: "0.45", 50: "0.5", 55: "0.55",
        60: "0.6", 65: "0.65", 70: "0.7", 75: "0.75", 80: "0.8", 85: "0.85",
        90: "0.9", 95: "0.95", 100: "1"
    },
    zIndex: {
        0: "0", 10: "10", 20: "20", 30: "30", 40: "40", 50: "50",
        auto: "auto", ...(_e = config.theme) === null || _e === void 0 ? void 0 : _e.zIndex
    },
    transitionDuration: {
        75: "75ms", 100: "100ms", 150: "150ms", 200: "200ms",
        300: "300ms", 500: "500ms", 700: "700ms", 1000: "1000ms",
        ...(_f = config.theme) === null || _f === void 0 ? void 0 : _f.transitionDuration
    },
    transitionDelay: {
        75: "75ms", 100: "100ms", 150: "150ms", 200: "200ms",
        300: "300ms", 500: "500ms", 700: "700ms", 1000: "1000ms",
        ...(_g = config.theme) === null || _g === void 0 ? void 0 : _g.transitionDelay
    },
    letterSpacing: {
        tighter: "-0.05em", tight: "-0.025em", snug: "0.025em",
        normal: "0em", wide: "0.1em", wider: "0.15em", widest: "0.25em",
        ...(_h = config.theme) === null || _h === void 0 ? void 0 : _h.letterSpacing
    },
    fontFamily: {
        sans: "ui-sans-serif, system-ui, sans-serif",
        serif: "ui-serif, Georgia, serif",
        mono: "ui-monospace, Monaco, monospace",
        ...(_j = config.theme) === null || _j === void 0 ? void 0 : _j.fontFamily
    }
};
// .................................................
// SPECIAL HANDLERS
// ............................................
const specialHandlers = {
    rotate: (v) => `transform: rotate(${v})`,
    scale: (v) => `transform: scale(${v})`,
    'translate-x': (v) => `transform: translateX(${v})`,
    'translate-y': (v) => `transform: translateY(${v})`,
    skew: (v) => `transform: skew(${v})`,
    'skew-x': (v) => `transform: skewX(${v})`,
    'skew-y': (v) => `transform: skewY(${v})`,
    blur: (v) => `filter: blur(${v})`,
    brightness: (v) => `filter: brightness(${v})`,
    contrast: (v) => `filter: contrast(${v})`,
    saturate: (v) => `filter: saturate(${v})`,
    'hue-rotate': (v) => `filter: hue-rotate(${v})`,
    'drop-shadow': (v) => `filter: drop-shadow(${v})`,
    'grid-cols': (v) => `grid-template-columns: ${v}`,
    'grid-rows': (v) => `grid-template-rows: ${v}`,
    'space-x': (v) => `& > :not([hidden]) ~ :not([hidden]) { --garur-space-x-reverse: 0; margin-left: calc(${v} * calc(1 - var(--garur-space-x-reverse))); margin-right: calc(${v} * var(--garur-space-x-reverse)) }`,
    'space-y': (v) => `& > :not([hidden]) ~ :not([hidden]) { --garur-space-y-reverse: 0; margin-top: calc(${v} * calc(1 - var(--garur-space-y-reverse))); margin-bottom: calc(${v} * var(--garur-space-y-reverse)) }`,
    'backdrop-blur': (v) => `backdrop-filter: blur(${v})`,
    grayscale: (v) => `filter: grayscale(${v})`,
    sepia: (v) => `filter: sepia(${v})`,
    invert: (v) => `filter: invert(${v})`,
};
function getSpecialHandler(key) {
    return specialHandlers[key];
}
// Layout utilities
function generateLayoutUtilities() {
    const map = {};
    // Display
    const displays = {
        block: "block", "inline-block": "inline-block", inline: "inline",
        flex: "flex", "inline-flex": "inline-flex", grid: "grid",
        "inline-grid": "inline-grid", table: "table",
        "table-cell": "table-cell", "table-row": "table-row",
        "table-caption": "table-caption", hidden: "none"
    };
    Object.entries(displays).forEach(([key, value]) => {
        map[key === 'hidden' ? 'hidden' : key] = `display:${value}`;
    });
    // Position
    const positions = {
        static: "static", relative: "relative", absolute: "absolute",
        fixed: "fixed", sticky: "sticky"
    };
    Object.entries(positions).forEach(([key, value]) => {
        map[key] = `position:${value}`;
    });
    // Container
    map.container = "width:100%;margin-left:auto;margin-right:auto;padding-left:1rem;padding-right:1rem;max-width:1280px";
    // Box Sizing
    map['box-border'] = 'box-sizing:border-box';
    map['box-content'] = 'box-sizing:content-box';
    // Place items
    const placeItems = { start: 'start', end: 'end', center: 'center', stretch: 'stretch' };
    Object.entries(placeItems).forEach(([key, value]) => {
        map[`place-items-${key}`] = `place-items:${value}`;
    });
    // Place content
    const placeContent = { start: 'start', end: 'end', center: 'center', stretch: 'stretch' };
    Object.entries(placeContent).forEach(([key, value]) => {
        map[`place-content-${key}`] = `place-content:${value}`;
    });
    // Order
    const orders = {
        0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6',
        7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12',
        first: '-9999', last: '9999'
    };
    Object.entries(orders).forEach(([key, value]) => {
        map[`order-${key}`] = `order:${value}`;
    });
    // Content
    map['content-none'] = 'content:none';
    return map;
}
// Spacing utilities
function generateSpacingUtilities() {
    const map = {};
    const spacing = SCALES.spacing;
    // Padding
    Object.entries(spacing).forEach(([key, value]) => {
        map[`p-${key}`] = `padding:${value}`;
        map[`pt-${key}`] = `padding-top:${value}`;
        map[`pr-${key}`] = `padding-right:${value}`;
        map[`pb-${key}`] = `padding-bottom:${value}`;
        map[`pl-${key}`] = `padding-left:${value}`;
        map[`px-${key}`] = `padding-left:${value};padding-right:${value}`;
        map[`py-${key}`] = `padding-top:${value};padding-bottom:${value}`;
    });
    // Margin
    Object.entries(spacing).forEach(([key, value]) => {
        map[`m-${key}`] = `margin:${value}`;
        map[`mt-${key}`] = `margin-top:${value}`;
        map[`mr-${key}`] = `margin-right:${value}`;
        map[`mb-${key}`] = `margin-bottom:${value}`;
        map[`ml-${key}`] = `margin-left:${value}`;
        map[`mx-${key}`] = `margin-left:${value};margin-right:${value}`;
        map[`my-${key}`] = `margin-top:${value};margin-bottom:${value}`;
    });
    // Auto margins
    map['m-auto'] = 'margin:auto';
    map['mx-auto'] = 'margin-left:auto;margin-right:auto';
    map['my-auto'] = 'margin-top:auto;margin-bottom:auto';
    map['mt-auto'] = 'margin-top:auto';
    map['mr-auto'] = 'margin-right:auto';
    map['mb-auto'] = 'margin-bottom:auto';
    map['ml-auto'] = 'margin-left:auto';
    // Space between
    Object.entries(spacing).forEach(([key, value]) => {
        map[`space-x-${key}`] = `& > :not([hidden]) ~ :not([hidden]) { --garur-space-x-reverse: 0; margin-left: calc(${value} * calc(1 - var(--garur-space-x-reverse))); margin-right: calc(${value} * var(--garur-space-x-reverse)) }`;
        map[`space-y-${key}`] = `& > :not([hidden]) ~ :not([hidden]) { --garur-space-y-reverse: 0; margin-top: calc(${value} * calc(1 - var(--garur-space-y-reverse))); margin-bottom: calc(${value} * var(--garur-space-y-reverse)) }`;
    });
    // Divide
    Object.entries(spacing).forEach(([key, value]) => {
        const borderWidth = SCALES.borderWidth[key] || value;
        map[`divide-x-${key}`] = `& > :not([hidden]) ~ :not([hidden]) { --garur-divide-x-reverse: 0; border-right-width: calc(${borderWidth} * var(--garur-divide-x-reverse)); border-left-width: calc(${borderWidth} * calc(1 - var(--garur-divide-x-reverse))) }`;
        map[`divide-y-${key}`] = `& > :not([hidden]) ~ :not([hidden]) { --garur-divide-y-reverse: 0; border-bottom-width: calc(${borderWidth} * var(--garur-divide-y-reverse)); border-top-width: calc(${borderWidth} * calc(1 - var(--garur-divide-y-reverse))) }`;
    });
    return map;
}
// Sizing utilities
function generateSizingUtilities() {
    const map = {};
    const spacing = SCALES.spacing;
    // Width & Height from spacing scale
    Object.entries(spacing).forEach(([key, value]) => {
        map[`w-${key}`] = `width:${value}`;
        map[`h-${key}`] = `height:${value}`;
        map[`min-w-${key}`] = `min-width:${value}`;
        map[`min-h-${key}`] = `min-height:${value}`;
        map[`max-w-${key}`] = `max-width:${value}`;
        map[`max-h-${key}`] = `max-height:${value}`;
    });
    // Special sizes
    map['w-full'] = 'width:100%';
    map['w-screen'] = 'width:100vw';
    map['w-auto'] = 'width:auto';
    map['w-min'] = 'width:min-content';
    map['w-max'] = 'width:max-content';
    map['w-fit'] = 'width:fit-content';
    map['h-full'] = 'height:100%';
    map['h-screen'] = 'height:100vh';
    map['h-auto'] = 'height:auto';
    map['h-min'] = 'height:min-content';
    map['h-max'] = 'height:max-content';
    map['h-fit'] = 'height:fit-content';
    // Fractional widths and heights
    const fractions = {
        '1/2': '50%', '1/3': '33.333333%', '2/3': '66.666667%',
        '1/4': '25%', '2/4': '50%', '3/4': '75%',
        '1/5': '20%', '2/5': '40%', '3/5': '60%', '4/5': '80%',
        '1/6': '16.666667%', '2/6': '33.333333%', '3/6': '50%',
        '4/6': '66.666667%', '5/6': '83.333333%',
        '1/12': '8.333333%', '2/12': '16.666667%', '3/12': '25%',
        '4/12': '33.333333%', '5/12': '41.666667%', '6/12': '50%',
        '7/12': '58.333333%', '8/12': '66.666667%', '9/12': '75%',
        '10/12': '83.333333%', '11/12': '91.666667%'
    };
    Object.entries(fractions).forEach(([key, value]) => {
        map[`w-${key}`] = `width:${value}`;
        map[`h-${key}`] = `height:${value}`;
    });
    // Square sizing
    Object.entries(spacing).forEach(([key, value]) => {
        map[`size-${key}`] = `width:${value};height:${value}`;
    });
    // Aspect ratio
    const aspects = {
        square: '1', video: '16/9', '2/3': '2/3', '3/2': '3/2',
        '4/3': '4/3', '3/4': '3/4', '16/9': '16/9', '9/16': '9/16'
    };
    Object.entries(aspects).forEach(([key, value]) => {
        map[`aspect-${key}`] = `aspect-ratio:${value}`;
    });
    // Object fit
    const objectFit = {
        contain: 'contain', cover: 'cover', fill: 'fill',
        none: 'none', 'scale-down': 'scale-down'
    };
    Object.entries(objectFit).forEach(([key, value]) => {
        map[`object-${key}`] = `object-fit:${value}`;
    });
    return map;
}
// Color utilities
function generateColorUtilities() {
    var _a;
    const map = {};
    const palette = config.palette || ((_a = config.theme) === null || _a === void 0 ? void 0 : _a.colors) || {};
    const flatColors = flattenColorPalette(palette);
    const opacitySteps = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
    // Background colors
    Object.entries(flatColors).forEach(([colorToken, color]) => {
        map[`bg-${colorToken}`] = `background-color:${color}`;
        // Opacity variants
        opacitySteps.forEach(opacity => {
            const rgbaColor = applyAlphaToColor(color, opacity.toString());
            map[`bg-${colorToken}/${opacity}`] = `background-color:${rgbaColor}`;
        });
    });
    // Text colors
    Object.entries(flatColors).forEach(([colorToken, color]) => {
        map[`text-${colorToken}`] = `color:${color}`;
        opacitySteps.forEach(opacity => {
            const rgbaColor = applyAlphaToColor(color, opacity.toString());
            map[`text-${colorToken}/${opacity}`] = `color:${rgbaColor}`;
        });
    });
    // Border colors
    Object.entries(flatColors).forEach(([colorToken, color]) => {
        map[`border-${colorToken}`] = `border-color:${color}`;
        opacitySteps.forEach(opacity => {
            const rgbaColor = applyAlphaToColor(color, opacity.toString());
            map[`border-${colorToken}/${opacity}`] = `border-color:${rgbaColor}`;
        });
    });
    // Fill/Stroke for SVG
    Object.entries(flatColors).forEach(([colorToken, color]) => {
        map[`fill-${colorToken}`] = `fill:${color}`;
        map[`stroke-${colorToken}`] = `stroke:${color}`;
        opacitySteps.forEach(opacity => {
            const rgbaColor = applyAlphaToColor(color, opacity.toString());
            map[`fill-${colorToken}/${opacity}`] = `fill:${rgbaColor}`;
            map[`stroke-${colorToken}/${opacity}`] = `stroke:${rgbaColor}`;
        });
    });
    // Special colors
    map['bg-transparent'] = 'background-color:transparent';
    map['bg-current'] = 'background-color:currentColor';
    map['text-transparent'] = 'color:transparent';
    map['text-current'] = 'color:currentColor';
    map['border-transparent'] = 'border-color:transparent';
    map['border-current'] = 'border-color:currentColor';
    map['fill-transparent'] = 'fill:transparent';
    map['fill-current'] = 'fill:currentColor';
    map['stroke-transparent'] = 'stroke:transparent';
    map['stroke-current'] = 'stroke:currentColor';
    return map;
}
// Typography utilities
function generateTypographyUtilities() {
    const map = {};
    const theme = config.theme || {};
    // Font Size
    const fontSize = theme.fontSize || {
        xs: ['0.75rem', '1rem'], sm: ['0.875rem', '1.25rem'],
        base: ['1rem', '1.5rem'], lg: ['1.125rem', '1.75rem'],
        xl: ['1.25rem', '1.75rem'], '2xl': ['1.5rem', '2rem'],
        '3xl': ['1.875rem', '2.25rem'], '4xl': ['2.25rem', '2.5rem'],
        '5xl': ['3rem', '1'], '6xl': ['3.75rem', '1'], '7xl': ['4.5rem', '1'],
        '8xl': ['6rem', '1'], '9xl': ['8rem', '1']
    };
    Object.entries(fontSize).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            map[`text-${key}`] = `font-size:${value[0]};line-height:${value[1]}`;
        }
        else {
            map[`text-${key}`] = `font-size:${value}`;
        }
    });
    // Font Weight
    const fontWeight = theme.fontWeight || {
        thin: '100', extralight: '200', light: '300', normal: '400',
        medium: '500', semibold: '600', bold: '700', extrabold: '800',
        black: '900'
    };
    Object.entries(fontWeight).forEach(([key, value]) => {
        map[`font-${key}`] = `font-weight:${value}`;
    });
    // Font Family
    const fontFamily = SCALES.fontFamily;
    Object.entries(fontFamily).forEach(([key, value]) => {
        map[`font-${key}`] = `font-family:${value}`;
    });
    // Text Alignment
    const textAlign = {
        left: 'left', center: 'center', right: 'right', justify: 'justify',
        start: 'start', end: 'end'
    };
    Object.entries(textAlign).forEach(([key, value]) => {
        map[`text-${key}`] = `text-align:${value}`;
    });
    // Text Transform
    map.uppercase = 'text-transform:uppercase';
    map.lowercase = 'text-transform:lowercase';
    map.capitalize = 'text-transform:capitalize';
    map['normal-case'] = 'text-transform:none';
    // Text Decoration
    map.underline = 'text-decoration-line:underline';
    map['line-through'] = 'text-decoration-line:line-through';
    map['no-underline'] = 'text-decoration-line:none';
    map['overline'] = 'text-decoration-line:overline';
    // Text Decoration Style
    const decStyles = {
        solid: 'solid', double: 'double', dotted: 'dotted',
        dashed: 'dashed', wavy: 'wavy'
    };
    Object.entries(decStyles).forEach(([key, value]) => {
        map[`decoration-${key}`] = `text-decoration-style:${value}`;
    });
    // Text Decoration Thickness
    const thicknesses = SCALES.borderWidth;
    Object.entries(thicknesses).forEach(([key, value]) => {
        map[`decoration-${key}`] = `text-decoration-thickness:${value}`;
    });
    map['decoration-auto'] = 'text-decoration-thickness:auto';
    map['decoration-from-font'] = 'text-decoration-thickness:from-font';
    // Whitespace
    const whitespace = {
        normal: 'normal', nowrap: 'nowrap', pre: 'pre',
        'pre-line': 'pre-line', 'pre-wrap': 'pre-wrap'
    };
    Object.entries(whitespace).forEach(([key, value]) => {
        map[`whitespace-${key}`] = `white-space:${value}`;
    });
    // Line Height
    const lineHeight = theme.lineHeight || {
        none: '1', tight: '1.25', snug: '1.375', normal: '1.5',
        relaxed: '1.625', loose: '2'
    };
    Object.entries(lineHeight).forEach(([key, value]) => {
        map[`leading-${key}`] = `line-height:${value}`;
    });
    // Letter spacing
    const letterSpacing = SCALES.letterSpacing;
    Object.entries(letterSpacing).forEach(([key, value]) => {
        map[`tracking-${key}`] = `letter-spacing:${value}`;
    });
    // List style
    const listStyle = {
        none: 'none', disc: 'disc', decimal: 'decimal',
        circle: 'circle', square: 'square', roman: 'upper-roman'
    };
    Object.entries(listStyle).forEach(([key, value]) => {
        map[`list-${key}`] = `list-style-type:${value}`;
    });
    // Text indent
    Object.entries(SCALES.spacing).forEach(([key, value]) => {
        map[`indent-${key}`] = `text-indent:${value}`;
    });
    // Text overflow
    map['truncate'] = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
    map['overflow-ellipsis'] = 'text-overflow:ellipsis';
    map['overflow-clip'] = 'text-overflow:clip';
    // Vertical align
    const verticalAligns = {
        baseline: 'baseline', top: 'top', middle: 'middle',
        bottom: 'bottom', 'text-top': 'text-top', 'text-bottom': 'text-bottom'
    };
    Object.entries(verticalAligns).forEach(([key, value]) => {
        map[`align-${key}`] = `vertical-align:${value}`;
    });
    return map;
}
// Border utilities
function generateBorderUtilities() {
    const map = {};
    const borderRadius = SCALES.borderRadius;
    const borderWidth = SCALES.borderWidth;
    // Border Radius
    Object.entries(borderRadius).forEach(([key, value]) => {
        if (key === 'DEFAULT') {
            map.rounded = `border-radius:${value}`;
        }
        else {
            map[`rounded-${key}`] = `border-radius:${value}`;
            map[`rounded-t-${key}`] = `border-top-left-radius:${value};border-top-right-radius:${value}`;
            map[`rounded-r-${key}`] = `border-top-right-radius:${value};border-bottom-right-radius:${value}`;
            map[`rounded-b-${key}`] = `border-bottom-left-radius:${value};border-bottom-right-radius:${value}`;
            map[`rounded-l-${key}`] = `border-top-left-radius:${value};border-bottom-left-radius:${value}`;
            map[`rounded-tl-${key}`] = `border-top-left-radius:${value}`;
            map[`rounded-tr-${key}`] = `border-top-right-radius:${value}`;
            map[`rounded-br-${key}`] = `border-bottom-right-radius:${value}`;
            map[`rounded-bl-${key}`] = `border-bottom-left-radius:${value}`;
        }
    });
    // Border Width
    Object.entries(borderWidth).forEach(([key, value]) => {
        if (key === 'DEFAULT') {
            map.border = `border-width:${value}`;
        }
        else {
            map[`border-${key}`] = `border-width:${value}`;
            map[`border-t-${key}`] = `border-top-width:${value}`;
            map[`border-r-${key}`] = `border-right-width:${value}`;
            map[`border-b-${key}`] = `border-bottom-width:${value}`;
            map[`border-l-${key}`] = `border-left-width:${value}`;
            map[`border-x-${key}`] = `border-left-width:${value};border-right-width:${value}`;
            map[`border-y-${key}`] = `border-top-width:${value};border-bottom-width:${value}`;
        }
    });
    // Border Style
    const borderStyles = {
        solid: 'solid', dashed: 'dashed', dotted: 'dotted',
        double: 'double', none: 'none', hidden: 'hidden'
    };
    Object.entries(borderStyles).forEach(([key, value]) => {
        map[`border-${key}`] = `border-style:${value}`;
    });
    // Border collapse
    map['border-collapse'] = 'border-collapse:collapse';
    map['border-separate'] = 'border-collapse:separate';
    // Border spacing
    Object.entries(SCALES.spacing).forEach(([key, value]) => {
        map[`border-spacing-${key}`] = `border-spacing:${value}`;
        map[`border-spacing-x-${key}`] = `border-spacing:${value} 0`;
        map[`border-spacing-y-${key}`] = `border-spacing:0 ${value}`;
    });
    return map;
}
// Effect utilities
function generateEffectUtilities() {
    const map = {};
    const opacity = SCALES.opacity;
    const boxShadow = SCALES.boxShadow;
    const zIndex = SCALES.zIndex;
    // Opacity
    Object.entries(opacity).forEach(([key, value]) => {
        map[`opacity-${key}`] = `opacity:${value}`;
    });
    // Box Shadow
    Object.entries(boxShadow).forEach(([key, value]) => {
        if (key === 'DEFAULT') {
            map.shadow = `box-shadow:${value}`;
        }
        else {
            map[`shadow-${key}`] = `box-shadow:${value}`;
        }
    });
    // Z-Index
    Object.entries(zIndex).forEach(([key, value]) => {
        map[`z-${key}`] = `z-index:${value}`;
    });
    // Ring offset
    Object.entries(SCALES.spacing).forEach(([key, value]) => {
        map[`ring-offset-${key}`] = `--garur-ring-offset-width:${value}`;
    });
    // Outline
    map['outline-none'] = 'outline:2px solid transparent;outline-offset:2px';
    map['outline'] = 'outline:1px solid';
    map['outline-dashed'] = 'outline:1px dashed';
    map['outline-dotted'] = 'outline:1px dotted';
    map['outline-double'] = 'outline:2px double';
    // Outline offset
    Object.entries(SCALES.spacing).forEach(([key, value]) => {
        map[`outline-offset-${key}`] = `outline-offset:${value}`;
    });
    return map;
}
// Flex/Grid utilities
function generateFlexGridUtilities() {
    const map = {};
    const spacing = SCALES.spacing;
    // Flex
    map.flex = 'display:flex';
    map['inline-flex'] = 'display:inline-flex';
    // Flex Direction
    map['flex-row'] = 'flex-direction:row';
    map['flex-row-reverse'] = 'flex-direction:row-reverse';
    map['flex-col'] = 'flex-direction:column';
    map['flex-col-reverse'] = 'flex-direction:column-reverse';
    // Flex Wrap
    map['flex-wrap'] = 'flex-wrap:wrap';
    map['flex-wrap-reverse'] = 'flex-wrap:wrap-reverse';
    map['flex-nowrap'] = 'flex-wrap:nowrap';
    // Flex Properties
    map['flex-1'] = 'flex:1 1 0%';
    map['flex-auto'] = 'flex:1 1 auto';
    map['flex-initial'] = 'flex:0 1 auto';
    map['flex-none'] = 'flex:none';
    // Flex Grow/Shrink
    map.grow = 'flex-grow:1';
    map['grow-0'] = 'flex-grow:0';
    map.shrink = 'flex-shrink:1';
    map['shrink-0'] = 'flex-shrink:0';
    // Grid
    map.grid = 'display:grid';
    map['inline-grid'] = 'display:inline-grid';
    // Grid Template Columns
    const gridCols = {
        1: 'repeat(1, minmax(0, 1fr))', 2: 'repeat(2, minmax(0, 1fr))',
        3: 'repeat(3, minmax(0, 1fr))', 4: 'repeat(4, minmax(0, 1fr))',
        5: 'repeat(5, minmax(0, 1fr))', 6: 'repeat(6, minmax(0, 1fr))',
        7: 'repeat(7, minmax(0, 1fr))', 8: 'repeat(8, minmax(0, 1fr))',
        9: 'repeat(9, minmax(0, 1fr))', 10: 'repeat(10, minmax(0, 1fr))',
        11: 'repeat(11, minmax(0, 1fr))', 12: 'repeat(12, minmax(0, 1fr))',
        none: 'none'
    };
    Object.entries(gridCols).forEach(([key, value]) => {
        map[`grid-cols-${key}`] = `grid-template-columns:${value}`;
    });
    // Grid Template Rows
    const gridRows = {
        1: 'repeat(1, minmax(0, 1fr))', 2: 'repeat(2, minmax(0, 1fr))',
        3: 'repeat(3, minmax(0, 1fr))', 4: 'repeat(4, minmax(0, 1fr))',
        5: 'repeat(5, minmax(0, 1fr))', 6: 'repeat(6, minmax(0, 1fr))',
        none: 'none'
    };
    Object.entries(gridRows).forEach(([key, value]) => {
        map[`grid-rows-${key}`] = `grid-template-rows:${value}`;
    });
    // Gap
    Object.entries(spacing).forEach(([key, value]) => {
        map[`gap-${key}`] = `gap:${value}`;
        map[`gap-x-${key}`] = `column-gap:${value}`;
        map[`gap-y-${key}`] = `row-gap:${value}`;
    });
    // Flex Justify
    const justify = {
        start: 'flex-start', end: 'flex-end', center: 'center',
        between: 'space-between', around: 'space-around', evenly: 'space-evenly'
    };
    Object.entries(justify).forEach(([key, value]) => {
        map[`justify-${key}`] = `justify-content:${value}`;
        map[`justify-items-${key}`] = `justify-items:${value}`;
        map[`justify-self-${key}`] = `justify-self:${value}`;
    });
    // Flex Align
    const align = {
        start: 'flex-start', end: 'flex-end', center: 'center',
        baseline: 'baseline', stretch: 'stretch'
    };
    Object.entries(align).forEach(([key, value]) => {
        map[`items-${key}`] = `align-items:${value}`;
        map[`content-${key}`] = `align-content:${value}`;
        map[`self-${key}`] = `align-self:${value}`;
    });
    // Place items/content
    const placeItems = { start: 'start', end: 'end', center: 'center', stretch: 'stretch' };
    Object.entries(placeItems).forEach(([key, value]) => {
        map[`place-items-${key}`] = `place-items:${value}`;
        map[`place-content-${key}`] = `place-content:${value}`;
        map[`place-self-${key}`] = `place-self:${value}`;
    });
    // Grid auto flow
    const autoFlows = {
        row: 'row', col: 'column', dense: 'dense',
        'row-dense': 'row dense', 'col-dense': 'column dense'
    };
    Object.entries(autoFlows).forEach(([key, value]) => {
        map[`grid-auto-flow-${key}`] = `grid-auto-flow:${value}`;
    });
    // Grid auto columns/rows
    const autoSizes = {
        auto: 'auto', min: 'min-content', max: 'max-content',
        fr: 'minmax(0, 1fr)'
    };
    Object.entries(autoSizes).forEach(([key, value]) => {
        map[`grid-auto-cols-${key}`] = `grid-auto-columns:${value}`;
        map[`grid-auto-rows-${key}`] = `grid-auto-rows:${value}`;
    });
    return map;
}
// Interaction utilities
function generateInteractionUtilities() {
    var _a;
    const map = {};
    // Cursor
    const cursors = {
        auto: 'auto', default: 'default', pointer: 'pointer',
        wait: 'wait', text: 'text', move: 'move', 'not-allowed': 'not-allowed',
        none: 'none', help: 'help', progress: 'progress', 'col-resize': 'col-resize',
        'row-resize': 'row-resize', 'n-resize': 'n-resize', 'e-resize': 'e-resize',
        's-resize': 's-resize', 'w-resize': 'w-resize', 'ne-resize': 'ne-resize',
        'nw-resize': 'nw-resize', 'se-resize': 'se-resize', 'sw-resize': 'sw-resize',
        'ew-resize': 'ew-resize', 'ns-resize': 'ns-resize', 'nesw-resize': 'nesw-resize',
        'nwse-resize': 'nwse-resize', 'zoom-in': 'zoom-in', 'zoom-out': 'zoom-out'
    };
    Object.entries(cursors).forEach(([key, value]) => {
        map[`cursor-${key}`] = `cursor:${value}`;
    });
    // User Select
    const userSelect = {
        none: 'none', text: 'text', all: 'all', auto: 'auto'
    };
    Object.entries(userSelect).forEach(([key, value]) => {
        map[`select-${key}`] = `user-select:${value}`;
    });
    // Pointer Events
    map['pointer-events-none'] = 'pointer-events:none';
    map['pointer-events-auto'] = 'pointer-events:auto';
    // Appearance
    map['appearance-none'] = 'appearance:none';
    map['appearance-auto'] = 'appearance:auto';
    // Resize
    const resizes = { none: 'none', y: 'vertical', x: 'horizontal', both: 'both' };
    Object.entries(resizes).forEach(([key, value]) => {
        map[`resize-${key}`] = `resize:${value}`;
    });
    // Accent color
    const palette = config.palette || ((_a = config.theme) === null || _a === void 0 ? void 0 : _a.colors) || {};
    const flatColors = flattenColorPalette(palette);
    Object.entries(flatColors).forEach(([colorToken, color]) => {
        map[`accent-${colorToken}`] = `accent-color:${color}`;
    });
    // Caret color
    Object.entries(flatColors).forEach(([colorToken, color]) => {
        map[`caret-${colorToken}`] = `caret-color:${color}`;
    });
    return map;
}
// Animation utilities
function generateAnimationUtilities() {
    const map = {};
    // Animations
    const animations = {
        none: 'none',
        spin: 'garur-spin 1s linear infinite',
        ping: 'garur-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        pulse: 'garur-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounce: 'garur-bounce 1s infinite',
        'fade-in': 'garur-fade-in 150ms ease-out',
        'fade-out': 'garur-fade-in 150ms ease-out reverse',
        'slide-in-up': 'garur-slide-in-up 150ms ease-out',
        'slide-in-down': 'garur-slide-in-down 150ms ease-out'
    };
    Object.entries(animations).forEach(([key, value]) => {
        map[`animate-${key}`] = `animation:${value}`;
    });
    // Transitions
    map.transition = 'transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms';
    map['transition-none'] = 'transition-property:none';
    map['transition-all'] = 'transition-property:all;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms';
    map['transition-colors'] = 'transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms';
    map['transition-opacity'] = 'transition-property:opacity;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms';
    map['transition-shadow'] = 'transition-property:box-shadow;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms';
    map['transition-transform'] = 'transition-property:transform;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms';
    // Delay
    const delays = SCALES.transitionDelay;
    Object.entries(delays).forEach(([key, value]) => {
        map[`delay-${key}`] = `transition-delay:${value}`;
    });
    // Duration
    const durations = SCALES.transitionDuration;
    Object.entries(durations).forEach(([key, value]) => {
        map[`duration-${key}`] = `transition-duration:${value}`;
    });
    // Timing functions
    const timingFunctions = {
        linear: 'linear', ease: 'ease', 'ease-in': 'ease-in',
        'ease-out': 'ease-out', 'ease-in-out': 'ease-in-out'
    };
    Object.entries(timingFunctions).forEach(([key, value]) => {
        map[`ease-${key}`] = `transition-timing-function:${value}`;
    });
    return map;
}
// Transform utilities
function generateTransformUtilities() {
    const map = {};
    // Rotate
    const rotates = {
        0: '0deg', 1: '1deg', 2: '2deg', 3: '3deg', 6: '6deg',
        12: '12deg', 45: '45deg', 90: '90deg', 180: '180deg'
    };
    Object.entries(rotates).forEach(([key, value]) => {
        map[`rotate-${key}`] = `transform:rotate(${value})`;
    });
    // Scale
    const scales = {
        0: '0', 50: '0.5', 75: '0.75', 90: '0.9', 95: '0.95',
        100: '1', 105: '1.05', 110: '1.1', 125: '1.25', 150: '1.5'
    };
    Object.entries(scales).forEach(([key, value]) => {
        map[`scale-${key}`] = `transform:scale(${value})`;
        map[`scale-x-${key}`] = `transform:scaleX(${value})`;
        map[`scale-y-${key}`] = `transform:scaleY(${value})`;
    });
    // Translate from spacing
    const spacing = SCALES.spacing;
    Object.entries(spacing).forEach(([key, value]) => {
        map[`translate-x-${key}`] = `transform:translateX(${value})`;
        map[`translate-y-${key}`] = `transform:translateY(${value})`;
    });
    // Skew
    const skews = { 0: '0deg', 1: '1deg', 2: '2deg', 3: '3deg', 6: '6deg', 12: '12deg' };
    Object.entries(skews).forEach(([key, value]) => {
        map[`skew-x-${key}`] = `transform:skewX(${value})`;
        map[`skew-y-${key}`] = `transform:skewY(${value})`;
    });
    // Origin
    const origins = {
        center: 'center', top: 'top', 'top-right': 'top right', right: 'right',
        'bottom-right': 'bottom right', bottom: 'bottom', 'bottom-left': 'bottom left',
        left: 'left', 'top-left': 'top left'
    };
    Object.entries(origins).forEach(([key, value]) => {
        map[`origin-${key}`] = `transform-origin:${value}`;
    });
    // Transform style
    map['transform-gpu'] = 'transform:translate3d(0,0,0)';
    map['transform-cpu'] = 'transform:none';
    return map;
}
// Filter utilities
function generateFilterUtilities() {
    const map = {};
    const theme = config.theme || {};
    // Blur
    const blur = theme.blur || {
        0: '0',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
    };
    Object.entries(blur).forEach(([key, value]) => {
        if (key === 'DEFAULT') {
            map.blur = `filter:blur(${value})`;
        }
        else {
            map[`blur-${key}`] = `filter:blur(${value})`;
        }
        map[`backdrop-blur-${key}`] = `backdrop-filter:blur(${value})`;
    });
    // Brightness
    const brightness = theme.brightness || {
        0: '0',
        50: '.5',
        75: '.75',
        90: '.9',
        95: '.95',
        100: '1',
        105: '1.05',
        110: '1.1',
        125: '1.25',
        150: '1.5',
        200: '2',
    };
    Object.entries(brightness).forEach(([key, value]) => {
        map[`brightness-${key}`] = `filter:brightness(${value})`;
        map[`backdrop-brightness-${key}`] = `backdrop-filter:brightness(${value})`;
    });
    // Contrast
    const contrast = theme.contrast || brightness;
    Object.entries(contrast).forEach(([key, value]) => {
        map[`contrast-${key}`] = `filter:contrast(${value})`;
        map[`backdrop-contrast-${key}`] = `backdrop-filter:contrast(${value})`;
    });
    // Grayscale
    const grayscale = {
        0: '0',
        DEFAULT: '100%'
    };
    Object.entries(grayscale).forEach(([key, value]) => {
        if (key === 'DEFAULT') {
            map.grayscale = `filter:grayscale(${value})`;
            map['backdrop-grayscale'] = `backdrop-filter:grayscale(${value})`;
        }
        else {
            map[`grayscale-${key}`] = `filter:grayscale(${value})`;
            map[`backdrop-grayscale-${key}`] = `backdrop-filter:grayscale(${value})`;
        }
    });
    // Hue rotate
    const hueRotate = theme.hueRotate || {
        0: '0deg',
        15: '15deg',
        30: '30deg',
        60: '60deg',
        90: '90deg',
        180: '180deg',
    };
    Object.entries(hueRotate).forEach(([key, value]) => {
        map[`hue-rotate-${key}`] = `filter:hue-rotate(${value})`;
    });
    // Invert
    const invert = {
        0: '0',
        DEFAULT: '100%'
    };
    Object.entries(invert).forEach(([key, value]) => {
        if (key === 'DEFAULT') {
            map.invert = `filter:invert(${value})`;
            map['backdrop-invert'] = `backdrop-filter:invert(${value})`;
        }
        else {
            map[`invert-${key}`] = `filter:invert(${value})`;
            map[`backdrop-invert-${key}`] = `backdrop-filter:invert(${value})`;
        }
    });
    // Saturate
    const saturate = theme.saturate || brightness;
    Object.entries(saturate).forEach(([key, value]) => {
        map[`saturate-${key}`] = `filter:saturate(${value})`;
        map[`backdrop-saturate-${key}`] = `backdrop-filter:saturate(${value})`;
    });
    // Sepia
    const sepia = {
        0: '0',
        DEFAULT: '100%'
    };
    Object.entries(sepia).forEach(([key, value]) => {
        if (key === 'DEFAULT') {
            map.sepia = `filter:sepia(${value})`;
            map['backdrop-sepia'] = `backdrop-filter:sepia(${value})`;
        }
        else {
            map[`sepia-${key}`] = `filter:sepia(${value})`;
            map[`backdrop-sepia-${key}`] = `backdrop-filter:sepia(${value})`;
        }
    });
    // Drop shadow
    const dropShadow = theme.dropShadow || {
        sm: '0 1px 1px rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 2px rgb(0 0 0 / 0.1)',
        md: '0 4px 3px rgb(0 0 0 / 0.07)',
        lg: '0 10px 8px rgb(0 0 0 / 0.04)',
        xl: '0 20px 13px rgb(0 0 0 / 0.03)',
        '2xl': '0 25px 25px rgb(0 0 0 / 0.15)',
        none: '0 0 #0000',
    };
    Object.entries(dropShadow).forEach(([key, value]) => {
        if (key === 'DEFAULT') {
            map['drop-shadow'] = `filter:drop-shadow(${value})`;
        }
        else {
            map[`drop-shadow-${key}`] = `filter:drop-shadow(${value})`;
        }
    });
    // Filter none
    map['filter-none'] = 'filter:none';
    map['backdrop-filter-none'] = 'backdrop-filter:none';
    return map;
}
// Gradient utilities
function generateGradientUtilities() {
    var _a;
    const map = {};
    // Gradient directions
    const directions = {
        'bg-gradient-to-t': 'to top',
        'bg-gradient-to-tr': 'to top right',
        'bg-gradient-to-r': 'to right',
        'bg-gradient-to-br': 'to bottom right',
        'bg-gradient-to-b': 'to bottom',
        'bg-gradient-to-bl': 'to bottom left',
        'bg-gradient-to-l': 'to left',
        'bg-gradient-to-tl': 'to top left',
    };
    Object.entries(directions).forEach(([key, value]) => {
        map[key] = `background-image:linear-gradient(${value},var(--gr-gradient-stops))`;
    });
    // Gradient stops
    const palette = config.palette || ((_a = config.theme) === null || _a === void 0 ? void 0 : _a.colors) || {};
    const flatColors = flattenColorPalette(palette);
    Object.entries(flatColors).forEach(([colorToken, color]) => {
        map[`from-${colorToken}`] = `--gr-gradient-from:${color};--gr-gradient-to:${color}00;--gr-gradient-stops:var(--gr-gradient-from),var(--gr-gradient-to)`;
        map[`via-${colorToken}`] = `--gr-gradient-via:${color};--gr-gradient-stops:var(--gr-gradient-from,${color}),var(--gr-gradient-via,${color}),var(--gr-gradient-to,${color}00)`;
        map[`to-${colorToken}`] = `--gr-gradient-to:${color};--gr-gradient-stops:var(--gr-gradient-from,${color}00),var(--gr-gradient-via,${color}),var(--gr-gradient-to,${color})`;
    });
    // Via opacity
    [0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100].forEach(opacity => {
        map[`via-opacity-${opacity}`] = `--gr-gradient-via-opacity:${opacity / 100}`;
    });
    // Gradient types
    map['bg-gradient-radial'] = 'background-image:radial-gradient(var(--gr-gradient-stops))';
    map['bg-gradient-conic'] = 'background-image:conic-gradient(var(--gr-gradient-stops))';
    return map;
}
// Overflow utilities
function generateOverflowUtilities() {
    const map = {};
    // Overflow
    const overflows = {
        auto: 'auto', hidden: 'hidden', visible: 'visible',
        scroll: 'scroll', clip: 'clip'
    };
    Object.entries(overflows).forEach(([key, value]) => {
        map[`overflow-${key}`] = `overflow:${value}`;
        map[`overflow-x-${key}`] = `overflow-x:${value}`;
        map[`overflow-y-${key}`] = `overflow-y:${value}`;
    });
    // Overscroll
    const overscrolls = { auto: 'auto', contain: 'contain', none: 'none' };
    Object.entries(overscrolls).forEach(([key, value]) => {
        map[`overscroll-${key}`] = `overscroll-behavior:${value}`;
        map[`overscroll-x-${key}`] = `overscroll-behavior-x:${value}`;
        map[`overscroll-y-${key}`] = `overscroll-behavior-y:${value}`;
    });
    // Scroll behavior
    map['scroll-smooth'] = 'scroll-behavior:smooth';
    map['scroll-auto'] = 'scroll-behavior:auto';
    return map;
}
// Additional utilities
function generateAdditionalUtilities() {
    const map = {};
    // Visibility
    map.visible = 'visibility:visible';
    map.invisible = 'visibility:hidden';
    map.collapse = 'visibility:collapse';
    // Backface visibility
    map['backface-visible'] = 'backface-visibility:visible';
    map['backface-hidden'] = 'backface-visibility:hidden';
    // Isolation
    map.isolate = 'isolation:isolate';
    map['isolation-auto'] = 'isolation:auto';
    // Mix blend mode
    const blendModes = {
        normal: 'normal', multiply: 'multiply', screen: 'screen',
        overlay: 'overlay', darken: 'darken', lighten: 'lighten',
        'color-dodge': 'color-dodge', 'color-burn': 'color-burn',
        'hard-light': 'hard-light', 'soft-light': 'soft-light',
        difference: 'difference', exclusion: 'exclusion',
        hue: 'hue', saturation: 'saturation', color: 'color',
        luminosity: 'luminosity'
    };
    Object.entries(blendModes).forEach(([key, value]) => {
        map[`mix-blend-${key}`] = `mix-blend-mode:${value}`;
        map[`bg-blend-${key}`] = `background-blend-mode:${value}`;
    });
    // Table
    map['table-auto'] = 'table-layout:auto';
    map['table-fixed'] = 'table-layout:fixed';
    // Caption side
    map['caption-top'] = 'caption-side:top';
    map['caption-bottom'] = 'caption-side:bottom';
    // Empty cells
    map['empty-cells-show'] = 'empty-cells:show';
    map['empty-cells-hide'] = 'empty-cells:hide';
    return map;
}
// ----------------------
// COMPLEX BUILDERS
// --------------------
function buildRing(color, width = "3px", inset = false, offset, offsetColor) {
    const vars = [
        `--garur-ring-color:${color}`,
        `--garur-ring-width:${width}`
    ];
    if (offset)
        vars.push(`--garur-ring-offset-width:${offset}`);
    if (inset)
        vars.push(`--garur-ring-inset:1`);
    const offsetShadow = "";
    const ringShadow = `0 0 0 calc(var(--garur-ring-width)) var(--garur-ring-color)`;
    const insetShadow = inset ? `, inset 0 0 0 calc(var(--garur-ring-width)) var(--garur-ring-color)` : "";
    const shadows = [offsetShadow, ringShadow + insetShadow].filter(Boolean).join(", ");
    return `${vars.join(";")};box-shadow:${shadows}`;
}
function buildGradient(value) {
    if (!value)
        return "";
    const v = value.trim();
    // Handle explicit gradient definitions
    if (v.startsWith('linear-gradient(') || v.startsWith('radial-gradient(') || v.startsWith('conic-gradient(')) {
        return `background-image: ${v}`;
    }
    // Handle gradient direction tokens
    const directionMap = {
        't': 'to top',
        'tr': 'to top right',
        'r': 'to right',
        'br': 'to bottom right',
        'b': 'to bottom',
        'bl': 'to bottom left',
        'l': 'to left',
        'tl': 'to top left',
    };
    // If it's a simple direction
    if (directionMap[v]) {
        return `background-image: linear-gradient(${directionMap[v]}, var(--gr-gradient-stops))`;
    }
    // Handle from/via/to syntax
    const fromMatch = v.match(/from-([^\/]+)(?:\/(\d+))?/);
    const toMatch = v.match(/to-([^\/]+)(?:\/(\d+))?/);
    const viaMatch = v.match(/via-([^\/]+)(?:\/(\d+))?/);
    if (fromMatch || toMatch || viaMatch) {
        let stops = [];
        let viaOpacity = 1;
        if (fromMatch) {
            const [, color, opacity] = fromMatch;
            const resolvedColor = resolvePaletteColor(color) || normalizeColorToken(color) || color;
            const alpha = opacity ? ` / ${parseInt(opacity) / 100}` : '';
            stops.push(`${resolvedColor}${alpha} 0%`);
        }
        if (viaMatch) {
            const [, color, opacity] = viaMatch;
            const resolvedColor = resolvePaletteColor(color) || normalizeColorToken(color) || color;
            viaOpacity = opacity ? parseInt(opacity) / 100 : 1;
            stops.push(`${resolvedColor} / ${viaOpacity} 50%`);
        }
        if (toMatch) {
            const [, color, opacity] = toMatch;
            const resolvedColor = resolvePaletteColor(color) || normalizeColorToken(color) || color;
            const alpha = opacity ? ` / ${parseInt(opacity) / 100}` : '';
            stops.push(`${resolvedColor}${alpha} 100%`);
        }
        return `background-image: linear-gradient(to right, ${stops.join(', ')})`;
    }
    // Fallback to simple gradient
    const color = resolvePaletteColor(v) || normalizeColorToken(v) || v;
    return `background-image: linear-gradient(to right, ${color}, transparent)`;
}
// ----------------------------------------------------------------
// MAIN UTILITY GENERATOR
// --------------------------------------------------------
function generateSimpleUtilities() {
    try {
        return {
            ...generateLayoutUtilities(),
            ...generateSpacingUtilities(),
            ...generateSizingUtilities(),
            ...generateColorUtilities(),
            ...generateTypographyUtilities(),
            ...generateBorderUtilities(),
            ...generateEffectUtilities(),
            ...generateFlexGridUtilities(),
            ...generateInteractionUtilities(),
            ...generateAnimationUtilities(),
            ...generateTransformUtilities(),
            ...generateFilterUtilities(),
            ...generateGradientUtilities(),
            ...generateOverflowUtilities(),
            ...generateAdditionalUtilities(),
            // Common utilities
            'sr-only': 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0',
            'not-sr-only': 'position:static;width:auto;height:auto;padding:0;margin:0;overflow:visible;clip:auto;white-space:normal',
            'truncate': 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap',
            'overflow-ellipsis': 'text-overflow:ellipsis',
            'overflow-clip': 'text-overflow:clip',
        };
    }
    catch (error) {
        logger.error('Failed to generate utilities', undefined);
        return {};
    }
}
// Cache generated utilities
const SIMPLE_UTILS = generateSimpleUtilities();
// ============================================
// UTILITY DOCUMENTATION
// ============================================
const UTIL_DOCS = [
    // Layout
    { id: "container", desc: "Container width helper", example: "container", category: "layout" },
    { id: "flex", desc: "Display flex", example: "flex", category: "layout" },
    { id: "grid", desc: "Display grid", example: "grid", category: "layout" },
    { id: "hidden", desc: "Display none", example: "hidden", category: "layout" },
    // Spacing
    { id: "p-4", desc: "Padding", example: "p-4", category: "spacing" },
    { id: "m-2", desc: "Margin", example: "m-2", category: "spacing" },
    { id: "mx-auto", desc: "Horizontal auto margin", example: "mx-auto", category: "spacing" },
    // Sizing
    { id: "w-full", desc: "Width 100%", example: "w-full", category: "sizing" },
    { id: "h-screen", desc: "Height 100vh", example: "h-screen", category: "sizing" },
    // Colors
    { id: "bg-red-500", desc: "Background color from palette", example: "bg-red-500", category: "colors" },
    { id: "text-gray-700", desc: "Text color from palette", example: "text-gray-700", category: "colors" },
    { id: "border-blue-300", desc: "Border color from palette", example: "border-blue-300", category: "colors" },
    { id: "bg-red-500/50", desc: "Background with 50% opacity", example: "bg-red-500/50", category: "colors" },
    // Typography
    { id: "text-lg", desc: "Large text", example: "text-lg", category: "typography" },
    { id: "font-bold", desc: "Bold font weight", example: "font-bold", category: "typography" },
    { id: "text-center", desc: "Text align center", example: "text-center", category: "typography" },
    // Effects
    { id: "shadow-lg", desc: "Large shadow", example: "shadow-lg", category: "effects" },
    { id: "blur-sm", desc: "Small blur", example: "blur-sm", category: "effects" },
    { id: "opacity-50", desc: "50% opacity", example: "opacity-50", category: "effects" },
    // Transforms
    { id: "rotate-45", desc: "45 degree rotation", example: "rotate-45", category: "transforms" },
    { id: "scale-110", desc: "110% scale", example: "scale-110", category: "transforms" },
    { id: "translate-x-4", desc: "Horizontal translation", example: "translate-x-4", category: "transforms" },
    // Interactivity
    { id: "hover:bg-blue-500", desc: "Hover background color", example: "hover:bg-blue-500", category: "interactivity" },
    { id: "focus:ring-2", desc: "Focus ring", example: "focus:ring-2", category: "interactivity" },
    { id: "cursor-pointer", desc: "Pointer cursor", example: "cursor-pointer", category: "interactivity" },
    // Animation
    { id: "animate-spin", desc: "Spin animation", example: "animate-spin", category: "animation" },
    { id: "transition-all", desc: "Transition all properties", example: "transition-all", category: "animation" },
    // Additional categories
    { id: "aspect-video", desc: "Aspect ratio 16:9", example: "aspect-video", category: "sizing" },
    { id: "grid-cols-3", desc: "3 column grid", example: "grid-cols-3", category: "layout" },
    { id: "grow", desc: "Flex grow", example: "grow", category: "layout" },
    { id: "whitespace-nowrap", desc: "No wrap whitespace", example: "whitespace-nowrap", category: "typography" },
    { id: "place-items-center", desc: "Place items center", example: "place-items-center", category: "layout" },
    { id: "divide-x-2", desc: "Divide x with 2px border", example: "divide-x-2", category: "layout" },
    { id: "fill-red-500", desc: "SVG fill color", example: "fill-red-500", category: "colors" },
    { id: "object-cover", desc: "Object fit cover", example: "object-cover", category: "sizing" },
    { id: "origin-center", desc: "Transform origin center", example: "origin-center", category: "transforms" },
    { id: "resize-none", desc: "No resize", example: "resize-none", category: "interactivity" },
    { id: "appearance-none", desc: "No appearance", example: "appearance-none", category: "interactivity" },
    { id: "outline-none", desc: "No outline", example: "outline-none", category: "effects" },
    { id: "grayscale", desc: "Grayscale filter", example: "grayscale", category: "effects" },
    { id: "delay-150", desc: "Transition delay 150ms", example: "delay-150", category: "animation" },
    { id: "duration-200", desc: "Transition duration 200ms", example: "duration-200", category: "animation" },
    { id: "size-4", desc: "Square size 1rem", example: "size-4", category: "sizing" },
    { id: "order-1", desc: "Flex order 1", example: "order-1", category: "layout" },
    { id: "ring-offset-2", desc: "Ring offset 2px", example: "ring-offset-2", category: "effects" },
];
// ============================================
// HANDLER FUNCTIONS
// ============================================
function handleArbitraryValue(token, arbVal, important) {
    const propMap = {
        w: "width", h: "height",
        "min-w": "min-width", "max-w": "max-width",
        "min-h": "min-height", "max-h": "max-height",
        m: "margin", p: "padding",
        rounded: "border-radius", border: "border-width",
        shadow: "box-shadow", opacity: "opacity",
        "m-block": "margin-block", "m-inline": "margin-inline",
        "p-block": "padding-block", "p-inline": "padding-inline",
        inset: "inset", "inset-block": "inset-block",
        "inset-inline": "inset-inline",
        "grid-cols": "grid-template-columns",
        "grid-rows": "grid-template-rows",
    };
    const axisMap = {
        px: { prop: "padding", sides: ["left", "right"] },
        py: { prop: "padding", sides: ["top", "bottom"] },
        mx: { prop: "margin", sides: ["left", "right"] },
        my: { prop: "margin", sides: ["top", "bottom"] },
        pt: { prop: "padding", sides: ["top"] },
        pr: { prop: "padding", sides: ["right"] },
        pb: { prop: "padding", sides: ["bottom"] },
        pl: { prop: "padding", sides: ["left"] },
        mt: { prop: "margin", sides: ["top"] },
        mr: { prop: "margin", sides: ["right"] },
        mb: { prop: "margin", sides: ["bottom"] },
        ml: { prop: "margin", sides: ["left"] },
    };
    let result = null;
    const prop = propMap[token.key];
    if (prop) {
        result = `${prop}:${arbVal}`;
    }
    else {
        const axisEntry = axisMap[token.key];
        if (axisEntry) {
            const { prop: axProp, sides } = axisEntry;
            const decl = sides.map(side => `${axProp}-${side}:${arbVal}`).join(";");
            result = decl;
        }
        else {
            const special = getSpecialHandler(token.key);
            if (special) {
                result = special(arbVal);
            }
        }
    }
    return result ? addImportant(result, important) : null;
}
function handleColorProperty(property, value, important) {
    const paletteColor = resolvePaletteColor(value);
    if (paletteColor) {
        return addImportant(`${property}:${paletteColor}`, important);
    }
    const normalizedColor = normalizeColorToken(value);
    if (normalizedColor) {
        return addImportant(`${property}:${normalizedColor}`, important);
    }
    if (isArbitrary(value)) {
        return addImportant(`${property}:${value}`, important);
    }
    return null;
}
function handleBorderProperty(value, important) {
    const paletteColor = resolvePaletteColor(value);
    if (paletteColor) {
        return addImportant(`border-color:${paletteColor}`, important);
    }
    const normalizedColor = normalizeColorToken(value);
    if (normalizedColor) {
        return addImportant(`border-color:${normalizedColor}`, important);
    }
    if (/^\d|\[/.test(value)) {
        const width = ensureUnitForLength(value);
        return addImportant(`border-width:${width};border-style:solid`, important);
    }
    if (isArbitrary(value)) {
        return addImportant(`border-color:${value}`, important);
    }
    return null;
}
function handleRingProperty(value, important) {
    let inset = false;
    let colorPart = value;
    let widthPart = "3px";
    let offsetPart = undefined;
    if (value.startsWith("inset-")) {
        inset = true;
        colorPart = value.slice(6);
    }
    // Handle ring-{width} or ring-offset-{width}
    if (colorPart.includes("/")) {
        const parts = colorPart.split("/");
        colorPart = parts[0];
        if (parts[1]) {
            if (parts[1].startsWith('offset-')) {
                offsetPart = parts[1].replace('offset-', '');
            }
            else {
                widthPart = ensureUnitForLength(parts[1]) || "3px";
            }
        }
    }
    const arbWidth = getArbitraryValue(widthPart, false);
    if (arbWidth)
        widthPart = arbWidth;
    const color = resolvePaletteColor(colorPart) ||
        normalizeColorToken(colorPart) ||
        (isArbitrary(colorPart) ? colorPart : "#3b82f6");
    const offsetWidth = ensureUnitForLength(offsetPart || '') || undefined;
    const decl = buildRing(color, widthPart, inset, offsetWidth);
    return addImportant(decl, important);
}
function handlePseudoElement(pseudo, property, value, important, extraDecl) {
    const color = resolvePaletteColor(value) ||
        normalizeColorToken(value) ||
        (isArbitrary(value) ? value : null);
    if (!color)
        return null;
    let decl = `${property}:${color}`;
    if (extraDecl) {
        decl += `;${extraDecl}`;
    }
    return {
        decl: addImportant(decl, important),
        selectorSuffix: pseudo
    };
}
function handlePluginFallback(token, important) {
    try {
        const hooks = plugin.getHandlerHooks();
        for (const hook of hooks) {
            const result = hook(token);
            if (result) {
                if (typeof result === "string") {
                    return addImportant(result, important);
                }
                const handlerResult = result;
                if (handlerResult.decl) {
                    handlerResult.decl = addImportant(handlerResult.decl, important);
                }
                return handlerResult;
            }
        }
    }
    catch (error) {
        logger.error(`Plugin hook error for token: ${token.raw}`, token);
    }
    return null;
}
function handleComplexCases(token, important, negative) {
    const key = token.key;
    let value = token.value || "";
    if (negative && value && !value.startsWith("-")) {
        value = `-${value}`;
    }
    // Color handlers
    if (key === "bg" || key === "background") {
        return handleColorProperty("background-color", value, important);
    }
    if (key === "text" || key === "tc" || key === "fg") {
        return handleColorProperty("color", value, important);
    }
    if (key === "border" || key === "bd") {
        return handleBorderProperty(value, important);
    }
    // Ring utilities
    if (key === "rg" || key === "ring") {
        return handleRingProperty(value, important);
    }
    // Gradient
    if (key === "gd" || key === "gradient") {
        const gradient = buildGradient(value);
        return gradient ? addImportant(gradient, important) : null;
    }
    // Pseudo-elements
    if (key === "ph" || key === "placeholder") {
        return handlePseudoElement("::placeholder", "color", value, important);
    }
    if (key === "sel" || key === "selection") {
        return handlePseudoElement("::selection", "background-color", value, important, "color:#fff");
    }
    // Plugin fallback
    return handlePluginFallback(token, important);
}
// ============================================
// MAIN HANDLER EXPORT
// ============================================
function handle(token) {
    if (!token || !token.key) {
        return null;
    }
    const important = token.important || false;
    const negative = token.negative || false;
    try {
        // Universal arbitrary [property:value] utility support
        if (token.raw && ARBITRARY_PROPERTY_RE.test(token.raw)) {
            const match = token.raw.match(ARBITRARY_PROPERTY_RE);
            if (match) {
                const prop = match[1].trim().replace(/_/g, "-");
                let value = match[2].trim().replace(/_/g, " ");
                if (negative && value && !value.startsWith("-")) {
                    value = "-" + value;
                }
                const decl = `${prop}:${value}`;
                return addImportant(decl, important);
            }
        }
        // Fast-path lookup in pre-generated utilities
        if (token.raw && SIMPLE_UTILS[token.raw]) {
            const result = SIMPLE_UTILS[token.raw];
            // Handle animations that need keyframes
            if (token.raw.startsWith('animate-')) {
                const animationType = token.raw.replace('animate-', '');
                const extra = KEYFRAMES[animationType];
                if (extra) {
                    return {
                        decl: addImportant(result, important),
                        extra
                    };
                }
            }
            return addImportant(result, important);
        }
        // Arbitrary value support
        const arbVal = getArbitraryValue(token.value || "", negative);
        if (arbVal !== null) {
            return handleArbitraryValue(token, arbVal, important);
        }
        // Complex handlers for dynamic values
        return handleComplexCases(token, important, negative);
    }
    catch (error) {
        logger.error(`Error handling token: ${token.raw}`, token);
        return null;
    }
}

/**
 * ---------------------------------------------------------------------
 * GARUR-CSS — Ultra-fast Atomic CSS Engine
 * Author: Barshan Sarkar
  hey wait, i think i forgot to update the version last time lol
 * Version: 1.0.0
 * License: MIT
 * ---------------------------------------------------------------------
 *
 * This CLI powers the Garur-CSS ecosystem. It handles:
 * • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 * • File scanning across HTML / JS / TS / JSX / TSX
 * • Cache management and orphan-class detection
 * • Config file creation (garur.config.js)
 * • Plugin boilerplate generation
 * • Watch mode for real-time builds ,, (coming soon)
 * oh man, watch mode is gonna be epic when i get to it
 *
 * Technologies:
 * - TypeScript
 * - Rollup bundling (CJS-compatible output)
 * - Node.js (CLI execution via shebang)
 *
 * Notes for contributors:
 * • Keep the CLI ESM/CJS compatible.
 * • Avoid dynamic require unless wrapped safely.
 * • Keep output messages clean, fast, and developer-friendly.
 *
 * Made in India.
 * ---------------------------------------------------------------------
 */
// it's 11:47 pm and this file is the reason i now drink coffee with chai also  with redbull
// why does "group-hover:focus:[&>div]:nth-child(2)" even exist. who hurt you.
// this function took me 4 hours and 2 mental breakdowns
// it has to split on ':' but NOT inside quotes, parens, brackets, or backticks
// yes i'm manually tracking depth like it's 2009. yes i'm ashamed. no i won't change it.
function splitPrefixesFromRaw(token) {
    if (!token)
        return { prefixes: [], raw: token };
    let parts = [];
    let buf = "";
    let depthParen = 0;
    let depthBracket = 0;
    let depthBrace = 0;
    let inSingle = false;
    let inDouble = false;
    let inBacktick = false;
    for (let i = 0; i < token.length; i++) {
        const ch = token[i];
        const prev = i > 0 ? token[i - 1] : "";
        // toggle quotes (only if not escaped)
        if (ch === "'" && !inDouble && !inBacktick && prev !== "\\")
            inSingle = !inSingle;
        else if (ch === '"' && !inSingle && !inBacktick && prev !== "\\")
            inDouble = !inDouble;
        else if (ch === "`" && !inSingle && !inDouble && prev !== "\\")
            inBacktick = !inBacktick;
        // track depth only when NOT inside quotes
        if (!inSingle && !inDouble && !inBacktick) {
            if (ch === "(")
                depthParen++;
            else if (ch === ")")
                depthParen = Math.max(0, depthParen - 1);
            else if (ch === "[")
                depthBracket++;
            else if (ch === "]")
                depthBracket = Math.max(0, depthBracket - 1);
            else if (ch === "{")
                depthBrace++;
            else if (ch === "}")
                depthBrace = Math.max(0, depthBrace - 1);
        }
        // SPLIT ONLY WHEN EVERYTHING IS FLAT AND NOT IN QUOTES
        if (ch === ":" &&
            !inSingle && !inDouble && !inBacktick &&
            depthParen === 0 && depthBracket === 0 && depthBrace === 0) {
            parts.push(buf);
            buf = "";
            continue;
        }
        buf += ch;
    }
    if (buf)
        parts.push(buf);
    parts = parts.filter(Boolean);
    const raw = parts.length ? parts[parts.length - 1] : "";
    const prefixes = parts.length > 1 ? parts.slice(0, -1) : [];
    return { prefixes, raw };
}
// yes i'm doing (configDefault as any) everywhere fight me
function isBreakpoint(prefix) {
    const bps = (config$1 === null || config$1 === void 0 ? void 0 : config$1.breakpoints) || {};
    return !!bps[prefix];
}
// this function is where my soul went to die
// someone wrote "sm:md:lg:hover:dark:group-hover:[&_*]:first" and expected it to work
function applyVariantSelectors(baseSelector, variantParts) {
    let selector = baseSelector;
    for (const v of variantParts) {
        const hook = getVariantHook(v);
        if (hook) {
            try {
                selector = hook(selector);
                continue;
            }
            catch {
                // plugin threw?? lol ok just ignore it
            }
        }
        // the classics
        if (v === "hover")
            selector = `${selector}:hover`;
        else if (v === "focus")
            selector = `${selector}:focus`;
        else if (v === "active")
            selector = `${selector}:active`;
        else if (v === "visited")
            selector = `${selector}:visited`;
        else if (v === "focus-visible")
            selector = `${selector}:focus-visible`;
        else if (v === "first")
            selector = `${selector}:first-child`;
        else if (v === "last")
            selector = `${selector}:last-child`;
        else if (v === "odd")
            selector = `${selector}:nth-child(odd)`;
        else if (v === "even")
            selector = `${selector}:nth-child(even)`;
        else if (v === "group-hover")
            selector = `.group:hover ${selector}`;
        else if (v === "group-focus")
            selector = `.group:focus ${selector}`;
        else if (v === "peer-hover")
            selector = `.peer:hover ~ ${selector}`;
        else if (v === "peer-focus")
            selector = `.peer:focus ~ ${selector}`;
        else if (v === "dark") {
            if (config$1.darkMode === "media") {
                // do nothing here, builder will wrap it later
                selector = `${selector}`;
            }
            else {
                const darkSel = config$1.darkSelector || ".dark";
                selector = `${darkSel} ${selector}`;
            }
        }
        // if we don't know what it is... just pretend we do
        else {
            // literally do nothing lmao
            selector = selector;
        }
    }
    return selector;
}
// wraps media queries from left to right (sm:md:lg → lg inside md inside sm)
// yes the order feels backwards
function wrapWithBreakpoints(rule, bps) {
    const bpsConfig = (config$1 === null || config$1 === void 0 ? void 0 : config$1.breakpoints) || {};
    let out = rule;
    for (const bp of bps) {
        const val = bpsConfig[bp];
        if (val) {
            out = `@media (min-width: ${val}) { ${out} }`;
        }
    }
    return out;
}

var css_escape$1 = {exports: {}};

/*! https://mths.be/cssescape v1.5.1 by @mathias | MIT license */
var css_escape = css_escape$1.exports;

var hasRequiredCss_escape;

function requireCss_escape () {
	if (hasRequiredCss_escape) return css_escape$1.exports;
	hasRequiredCss_escape = 1;
	(function (module, exports$1) {
(function(root, factory) {
			// https://github.com/umdjs/umd/blob/master/returnExports.js
			{
				// For Node.js.
				module.exports = factory(root);
			}
		}(typeof commonjsGlobal != 'undefined' ? commonjsGlobal : css_escape, function(root) {

			if (root.CSS && root.CSS.escape) {
				return root.CSS.escape;
			}

			// https://drafts.csswg.org/cssom/#serialize-an-identifier
			var cssEscape = function(value) {
				if (arguments.length == 0) {
					throw new TypeError('`CSS.escape` requires an argument.');
				}
				var string = String(value);
				var length = string.length;
				var index = -1;
				var codeUnit;
				var result = '';
				var firstCodeUnit = string.charCodeAt(0);
				while (++index < length) {
					codeUnit = string.charCodeAt(index);
					// Note: there’s no need to special-case astral symbols, surrogate
					// pairs, or lone surrogates.

					// If the character is NULL (U+0000), then the REPLACEMENT CHARACTER
					// (U+FFFD).
					if (codeUnit == 0x0000) {
						result += '\uFFFD';
						continue;
					}

					if (
						// If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
						// U+007F, […]
						(codeUnit >= 0x0001 && codeUnit <= 0x001F) || codeUnit == 0x007F ||
						// If the character is the first character and is in the range [0-9]
						// (U+0030 to U+0039), […]
						(index == 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
						// If the character is the second character and is in the range [0-9]
						// (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
						(
							index == 1 &&
							codeUnit >= 0x0030 && codeUnit <= 0x0039 &&
							firstCodeUnit == 0x002D
						)
					) {
						// https://drafts.csswg.org/cssom/#escape-a-character-as-code-point
						result += '\\' + codeUnit.toString(16) + ' ';
						continue;
					}

					if (
						// If the character is the first character and is a `-` (U+002D), and
						// there is no second character, […]
						index == 0 &&
						length == 1 &&
						codeUnit == 0x002D
					) {
						result += '\\' + string.charAt(index);
						continue;
					}

					// If the character is not handled by one of the above rules and is
					// greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
					// is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
					// U+005A), or [a-z] (U+0061 to U+007A), […]
					if (
						codeUnit >= 0x0080 ||
						codeUnit == 0x002D ||
						codeUnit == 0x005F ||
						codeUnit >= 0x0030 && codeUnit <= 0x0039 ||
						codeUnit >= 0x0041 && codeUnit <= 0x005A ||
						codeUnit >= 0x0061 && codeUnit <= 0x007A
					) {
						// the character itself
						result += string.charAt(index);
						continue;
					}

					// Otherwise, the escaped character.
					// https://drafts.csswg.org/cssom/#escape-a-character
					result += '\\' + string.charAt(index);

				}
				return result;
			};

			if (!root.CSS) {
				root.CSS = {};
			}

			root.CSS.escape = cssEscape;
			return cssEscape;

		})); 
	} (css_escape$1));
	return css_escape$1.exports;
}

var css_escapeExports = requireCss_escape();
var cssEscape = /*@__PURE__*/getDefaultExportFromCjs(css_escapeExports);

/**
 * ---------------------------------------------------------------------
 *  GARUR-CSS — Ultra-fast Atomic CSS Engine
 *  Author: Barshan Sarkar
 *  Version: 1.0.0
 *  License: MIT
 * ---------------------------------------------------------------------
 *
 *  This CLI powers the Garur-CSS ecosystem. It handles:
 *    • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 *    • File scanning across HTML / JS / TS / JSX / TSX
 *    • Cache management and orphan-class detection
 *    • Config file creation (garur.config.js)
 *    • Plugin boilerplate generation
 *    • Watch mode for real-time builds ,, (coming soon)
 *
 *  Technologies:
 *    - TypeScript
 *    - Rollup bundling (CJS-compatible output)
 *    - Node.js (CLI execution via shebang)
 *
 *  Notes for contributors:
 *    • Keep the CLI ESM/CJS compatible.
 *    • Avoid dynamic require unless wrapped safely.
 *    • Keep output messages clean, fast, and developer-friendly.
 *
 *  Made in India.
 * ---------------------------------------------------------------------
 */
// ==================== ENHANCED PRE-COMPUTED CONSTANTS ====================
const CONFIG_BREAKPOINTS = config$1.breakpoints || {};
const BREAKPOINT_SET = new Set(Object.keys(CONFIG_BREAKPOINTS));
const DARK_MODE = config$1.darkMode;
const IMPORTANT_MODE = config$1.important === true;
// ==================== ENHANCED CACHES ====================
const buildCache = new Map();
const MAX_BUILD_CACHE = 5000;
const escapeCache = new Map();
const MAX_ESCAPE_CACHE = 10000;
const parseCache = new Map();
const MAX_PARSE_CACHE = 3000;
const handlerCache = new Map();
const MAX_HANDLER_CACHE = 5000;
const prefixCache = new Map();
const MAX_PREFIX_CACHE = 3000;
const variantCache = new Map();
const MAX_VARIANT_CACHE = 3000;
// NEW: Cache for color utility patterns - FIXED TYPE
const colorPatternCache = new Map();
const MAX_COLOR_PATTERN_CACHE = 2000;
// ==================== ENHANCED ESCAPING ====================
function escapeClassName(cls) {
    if (!cls)
        return cls;
    const cached = escapeCache.get(cls);
    if (cached !== undefined)
        return cached;
    let result;
    // Try native CSS.escape first
    if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
        try {
            result = CSS.escape(cls);
        }
        catch {
            result = cls; // Fallback on error
        }
    }
    else {
        // Manual escaping with optimization
        let needsEscape = false;
        // Fast path for common patterns
        if (cls.includes(':') || cls.includes('/') || cls.includes('[')) {
            needsEscape = true;
        }
        else {
            // Check each character efficiently
            for (let i = 0; i < cls.length; i++) {
                const code = cls.charCodeAt(i);
                if (!(code >= 48 && code <= 57) && // 0-9
                    !(code >= 65 && code <= 90) && // A-Z
                    !(code >= 97 && code <= 122) && // a-z
                    code !== 45 && // -
                    code !== 95 // _
                ) {
                    needsEscape = true;
                    break;
                }
            }
        }
        if (!needsEscape) {
            result = cls;
        }
        else {
            try {
                if (typeof cssEscape === "function") {
                    result = cssEscape(cls);
                }
                else {
                    // Optimized regex escape
                    result = cls.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
                }
            }
            catch {
                // Ultimate fallback
                result = cls.replace(/[^a-zA-Z0-9_-]/g, (ch) => `\\${ch}`);
            }
        }
    }
    // Cache management
    if (escapeCache.size >= MAX_ESCAPE_CACHE) {
        const firstKey = escapeCache.keys().next().value;
        if (firstKey)
            escapeCache.delete(firstKey);
    }
    escapeCache.set(cls, result);
    return result;
}
// ==================== ENHANCED PREFIX SPLITTING ====================
function cachedSplitPrefixesFromRaw(cls) {
    const cached = prefixCache.get(cls);
    if (cached)
        return cached;
    // Special handling for color utilities to prevent misparsing
    const colorPatterns = [
        /^(text|bg|border|divide|ring|outline|fill|stroke|accent|caret|decoration)-[a-z]+-\d+$/,
        /^(text|bg|border|divide|ring|outline|fill|stroke|accent|caret|decoration)-[a-z]+$/,
    ];
    let result;
    // Check if it's a color utility
    const isColorUtility = colorPatterns.some(pattern => pattern.test(cls));
    if (isColorUtility) {
        // For color utilities, try to keep them together
        const colorCached = colorPatternCache.get(cls);
        if (colorCached) {
            result = colorCached;
        }
        else {
            // Try to parse as single unit first
            const parsed = splitPrefixesFromRaw(cls);
            // If parsing split a color (e.g., "text-indigo-500" -> "text-indigo", "500")
            // Recombine and try without prefix splitting
            if (parsed.raw.includes('-') && /^\d+$/.test(parsed.raw)) {
                // This might be a misparsed color utility
                // Try parsing the class as a whole
                result = { prefixes: [], raw: cls };
            }
            else {
                result = parsed;
            }
            // Cache color pattern
            if (colorPatternCache.size >= MAX_COLOR_PATTERN_CACHE) {
                const firstKey = colorPatternCache.keys().next().value;
                if (firstKey)
                    colorPatternCache.delete(firstKey);
            }
            colorPatternCache.set(cls, result);
        }
    }
    else {
        result = splitPrefixesFromRaw(cls);
    }
    // Cache management
    if (prefixCache.size >= MAX_PREFIX_CACHE) {
        const firstKey = prefixCache.keys().next().value;
        if (firstKey)
            prefixCache.delete(firstKey);
    }
    prefixCache.set(cls, result);
    return result;
}
// ==================== ENHANCED VARIANT APPLICATION ====================
function cachedApplyVariantsToSelector(baseSelector, variantParts) {
    const cacheKey = baseSelector + '|' + variantParts.join(':');
    const cached = variantCache.get(cacheKey);
    if (cached)
        return cached;
    let result = baseSelector;
    // Apply variants in reverse order (most specific last)
    for (let i = variantParts.length - 1; i >= 0; i--) {
        const variant = variantParts[i];
        // Special handling for common variants
        switch (variant) {
            case 'hover':
                result = `${result}:hover`;
                break;
            case 'focus':
                result = `${result}:focus`;
                break;
            case 'active':
                result = `${result}:active`;
                break;
            case 'disabled':
                result = `${result}:disabled`;
                break;
            case 'checked':
                result = `${result}:checked`;
                break;
            case 'first':
                result = `${result}:first-child`;
                break;
            case 'last':
                result = `${result}:last-child`;
                break;
            case 'odd':
                result = `${result}:nth-child(odd)`;
                break;
            case 'even':
                result = `${result}:nth-child(even)`;
                break;
            case 'group-hover':
                result = `.group:hover ${result}`;
                break;
            case 'group-focus':
                result = `.group:focus ${result}`;
                break;
            case 'dark':
                if (DARK_MODE === 'class') {
                    result = `.dark ${result}`;
                }
                break;
            default:
                // Use the utility function for complex variants
                result = applyVariantSelectors(result, [variant]);
        }
    }
    // Cache management
    if (variantCache.size >= MAX_VARIANT_CACHE) {
        const firstKey = variantCache.keys().next().value;
        if (firstKey)
            variantCache.delete(firstKey);
    }
    variantCache.set(cacheKey, result);
    return result;
}
// ==================== ENHANCED PARSING ====================
function cachedParse(raw) {
    const cached = parseCache.get(raw);
    if (cached !== undefined)
        return cached;
    let result;
    try {
        // Special handling for color utilities
        const isColorLike = raw.includes('-') && (raw.startsWith('text-') ||
            raw.startsWith('bg-') ||
            raw.startsWith('border-') ||
            raw.startsWith('ring-') ||
            raw.startsWith('fill-') ||
            raw.startsWith('stroke-'));
        if (isColorLike) {
            // For color utilities, parse as single token
            // This prevents "text-indigo-500" from being parsed as "text-indigo" with value "500"
            const lastDash = raw.lastIndexOf('-');
            if (lastDash !== -1) {
                const potentialValue = raw.substring(lastDash + 1);
                // Check if the part after last dash looks like a color value (number or hex)
                if (/^\d+$/.test(potentialValue) || /^[a-fA-F0-9]+$/.test(potentialValue)) {
                    // This is likely a color utility like "text-indigo-500"
                    // Parse it as a single key
                    result = {
                        key: raw,
                        raw: raw,
                        important: false,
                        negative: false
                    };
                }
                else {
                    // Use normal parsing
                    result = parse(raw);
                }
            }
            else {
                result = parse(raw);
            }
        }
        else {
            result = parse(raw);
        }
    }
    catch (error) {
        console.warn(`Parse error for "${raw}":`, error);
        result = null;
    }
    // Cache management
    if (parseCache.size >= MAX_PARSE_CACHE) {
        const firstKey = parseCache.keys().next().value;
        if (firstKey)
            parseCache.delete(firstKey);
    }
    parseCache.set(raw, result);
    return result;
}
// ==================== ENHANCED HANDLING ====================
function cachedHandle(token) {
    const cacheKey = JSON.stringify(token);
    const cached = handlerCache.get(cacheKey);
    if (cached !== undefined)
        return cached;
    let result;
    try {
        result = handle(token);
        // If handler returned null, check if it's a known utility
        if (!result && token && token.key) {
            // Try to see if it's a documented utility
            const isDocumented = UTIL_DOCS.some(doc => {
                if (doc.example) {
                    return doc.example.includes(token.key) ||
                        token.key.includes(doc.id.replace(/[\[\]]/g, ''));
                }
                return false;
            });
            if (isDocumented) {
                // This is a known utility but handler didn't produce output
                // Try plugins as fallback
                const hooks = plugin.getHandlerHooks();
                for (const hook of hooks) {
                    try {
                        const hookResult = hook(token);
                        if (hookResult) {
                            result = hookResult;
                            break;
                        }
                    }
                    catch {
                        // Ignore plugin errors
                    }
                }
            }
        }
    }
    catch (error) {
        console.warn(`Handler error for token:`, token, error);
        result = null;
    }
    // Cache management
    if (handlerCache.size >= MAX_HANDLER_CACHE) {
        const firstKey = handlerCache.keys().next().value;
        if (firstKey)
            handlerCache.delete(firstKey);
    }
    handlerCache.set(cacheKey, result);
    return result;
}
// ==================== ENHANCED HELPER FUNCTIONS ====================
function applyImportantToDecl(decl, important) {
    if (!decl || IMPORTANT_MODE)
        return decl;
    // Fast path for simple declarations
    if (!decl.includes(';') && !decl.includes('!important')) {
        return decl.trim().endsWith(';')
            ? decl.trim().slice(0, -1) + ' !important;'
            : decl + ' !important;';
    }
    // Parse multiple declarations
    const parts = [];
    let current = '';
    let inParen = 0;
    let inQuote = false;
    let quoteChar = '';
    for (let i = 0; i < decl.length; i++) {
        const char = decl[i];
        const prevChar = i > 0 ? decl[i - 1] : '';
        // Handle quotes
        if ((char === '"' || char === "'") && prevChar !== '\\') {
            if (!inQuote) {
                inQuote = true;
                quoteChar = char;
            }
            else if (quoteChar === char) {
                inQuote = false;
            }
        }
        // Handle parentheses
        if (!inQuote) {
            if (char === '(')
                inParen++;
            if (char === ')')
                inParen--;
        }
        // Handle semicolons (only when not in quotes or parens)
        if (char === ';' && !inQuote && inParen === 0) {
            const trimmed = current.trim();
            if (trimmed && !trimmed.includes('!important')) {
                parts.push(trimmed + ' !important');
            }
            else if (trimmed) {
                parts.push(trimmed);
            }
            current = '';
        }
        else {
            current += char;
        }
    }
    // Handle last part
    const last = current.trim();
    if (last && !last.includes('!important')) {
        parts.push(last + ' !important');
    }
    else if (last) {
        parts.push(last);
    }
    return parts.join('; ') + (parts.length ? ';' : '');
}
function wrapWithBps(rule, bps) {
    if (bps.length === 0)
        return rule;
    let result = rule;
    // Apply breakpoints in descending order (largest first)
    const sortedBps = [...bps].sort((a, b) => {
        const widthA = parseInt(CONFIG_BREAKPOINTS[a] || '0');
        const widthB = parseInt(CONFIG_BREAKPOINTS[b] || '0');
        return widthB - widthA;
    });
    for (const bp of sortedBps) {
        const width = CONFIG_BREAKPOINTS[bp];
        if (width) {
            result = `@media (min-width: ${width}) { ${result} }`;
        }
    }
    return result;
}
// ==================== ENHANCED MAIN BUILD FUNCTION ====================
function build(cls, inline = false) {
    if (!cls || typeof cls !== "string")
        return null;
    const cacheKey = inline ? `inline:${cls}` : cls;
    const cached = buildCache.get(cacheKey);
    if (cached !== undefined)
        return cached;
    if (cls.length === 0) {
        buildCache.set(cacheKey, null);
        return null;
    }
    // FIX: Apply color utility fix before parsing
    const { prefixes, raw } = cachedSplitPrefixesFromRaw(cls);
    const fixedRaw = fixColorUtilityParsing(raw);
    const token = cachedParse(fixedRaw);
    if (!token) {
        buildCache.set(cacheKey, null);
        return null;
    }
    // REST OF YOUR ORIGINAL CODE STAYS THE SAME...
    // (I'll show the rest, but it's your original code with minimal changes)
    const result = cachedHandle(token);
    if (!result) {
        buildCache.set(cacheKey, null);
        return null;
    }
    let declaration = null;
    let selectorSuffix;
    let extra;
    if (typeof result === "string") {
        declaration = result.endsWith(";") ? result : `${result};`;
    }
    else if (result && typeof result === "object") {
        declaration = result.decl
            ? (result.decl.endsWith(";") ? result.decl : `${result.decl};`)
            : null;
        selectorSuffix = result.selectorSuffix;
        extra = result.extra;
    }
    if (!declaration && !extra) {
        buildCache.set(cacheKey, null);
        return null;
    }
    if (token.important && declaration) {
        declaration = applyImportantToDecl(declaration);
    }
    if (inline) {
        buildCache.set(cacheKey, declaration);
        return declaration;
    }
    const escaped = `.${escapeClassName(cls)}`;
    const breakpointParts = [];
    const variantParts = [];
    for (let i = 0; i < prefixes.length; i++) {
        const p = prefixes[i];
        if (BREAKPOINT_SET.has(p)) {
            breakpointParts.push(p);
        }
        else {
            variantParts.push(p);
        }
    }
    let variantSelector = cachedApplyVariantsToSelector(escaped, variantParts);
    if (selectorSuffix) {
        if (!selectorSuffix.startsWith(":") &&
            !selectorSuffix.startsWith("::") &&
            !selectorSuffix.startsWith(" ")) {
            selectorSuffix = ` ${selectorSuffix}`;
        }
        variantSelector = `${variantSelector}${selectorSuffix}`;
    }
    let rule = "";
    let finalResult = null;
    if (declaration) {
        rule = `${variantSelector} { ${declaration} }`;
        if (variantParts.includes("dark") && DARK_MODE === "media") {
            rule = wrapWithBps(rule, breakpointParts);
            rule = `@media (prefers-color-scheme: dark) { ${rule} }`;
            finalResult = rule;
        }
        else {
            finalResult = wrapWithBps(rule, breakpointParts);
        }
    }
    if (extra) {
        const substituted = extra.replace(/__SELF__/g, variantSelector);
        const extraWrapped = wrapWithBps(substituted, breakpointParts);
        if (finalResult) {
            finalResult = `${finalResult}\n${extraWrapped}`;
        }
        else {
            finalResult = extraWrapped;
        }
    }
    if (buildCache.size >= MAX_BUILD_CACHE) {
        const keys = Array.from(buildCache.keys());
        const toRemove = Math.floor(MAX_BUILD_CACHE * 0.2);
        for (let i = 0; i < toRemove && i < keys.length; i++) {
            buildCache.delete(keys[i]);
        }
    }
    buildCache.set(cacheKey, finalResult);
    return finalResult;
}
function fixColorUtilityParsing(raw) {
    // If it looks like a color utility (text-red-500, bg-blue-300, etc.)
    const colorPrefixes = ['text-', 'bg-', 'border-', 'ring-', 'fill-', 'stroke-', 'accent-', 'caret-', 'decoration-'];
    for (const prefix of colorPrefixes) {
        if (raw.startsWith(prefix) && raw.includes('-', prefix.length)) {
            // Don't modify - let the parser handle it
            return raw;
        }
    }
    return raw;
}

/**
 * ---------------------------------------------------------------------
 *  GARUR-CSS — Ultra-fast Atomic CSS Engine
 *  Author: Barshan Sarkar
 *  Version: 1.0.0
 *  License: MIT
 * ---------------------------------------------------------------------
 *
 *  This CLI powers the Garur-CSS ecosystem. It handles:
 *    • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 *    • File scanning across HTML / JS / TS / JSX / TSX
 *    • Cache management and orphan-class detection
 *    • Config file creation (garur.config.js)
 *    • Plugin boilerplate generation
 *    • Watch mode for real-time builds ,, (coming soon)
 *
 *  Technologies:
 *    - TypeScript
 *    - Rollup bundling (CJS-compatible output)
 *    - Node.js (CLI execution via shebang)
 *
 *  Notes for contributors:
 *    • Keep the CLI ESM/CJS compatible.
 *    • Avoid dynamic require unless wrapped safely.
 *    • Keep output messages clean, fast, and developer-friendly.
 *
 *  Made in India.
 * ---------------------------------------------------------------------
 */
// src/marge.ts
// mergeComponent: collect component base styles + instance utilities into final CSS rules.
// Called by the JIT per file/element to generate scoped CSS for component instances.
// god this file is too big i hate css
/** Parse a single declaration string like "padding:1rem;color:#fff;" into prop -> value map */
function declToMap(decl) {
    const map = {};
    if (!decl)
        return map;
    const parts = decl.split(";").map(p => p.trim()).filter(Boolean);
    for (const p of parts) {
        const idx = p.indexOf(":");
        if (idx === -1)
            continue; // wtf is this line even
        const prop = p.slice(0, idx).trim();
        const val = p.slice(idx + 1).trim();
        map[prop] = val;
    }
    return map;
}
/** Helper: convert JS/camelCase property names to CSS kebab-case (e.g., fontSize -> font-size) */
function propToCSS(prop) {
    if (!prop)
        return prop;
    // already kebab-case?
    if (prop.indexOf("-") !== -1)
        return prop;
    return prop.replace(/([A-Z])/g, "-$1").toLowerCase();
}
/** Convert map -> declaration string (ensures kebab-case props) */
function mapToDecl(map) {
    return Object.entries(map)
        .map(([k, v]) => `${propToCSS(k)}:${v};`)
        .join("");
}
/**
 * Convert a plain JS object of properties into a CSS declaration string.
 * Handles nested primitives reliably. Example:
 *  { content: '""', position: 'absolute' } -> 'content:"";position:absolute;'
 * Skips nested objects (these are handled elsewhere).
 */
function objectToDecl(obj) {
    if (!obj)
        return "";
    const parts = [];
    for (const [k, v] of Object.entries(obj)) {
        if (v && typeof v === "object")
            continue; // skip nested objects for now
        if (k === "content") {
            // normalize content values to ensure proper quoting
            // css is such a pain
            let vv = String(v !== null && v !== void 0 ? v : "");
            // if already quoted, keep; if empty string, make it ""
            if (vv === "" || vv === "''" || vv === '""')
                vv = '""';
            parts.push(`${propToCSS(k)}:${vv}`);
        }
        else {
            parts.push(`${propToCSS(k)}:${v}`);
        }
    }
    return parts.join(";") + (parts.length ? ";" : "");
}
/**
 * Main mergeComponent function
 * - clsList: classes found on a single element (array of tokens)
 * Returns combined CSS for any component instances present on this element.
 * This function is a mess but it works... mostly
 */
function mergeComponent(clsList) {
    if (!Array.isArray(clsList) || clsList.length === 0)
        return null;
    const present = new Set(clsList);
    const producedRules = [];
    // Find which component instances are present (match keys from allComponents)
    const instanceKeys = Object.keys(allComponents).filter(k => present.has(k));
    if (instanceKeys.length === 0) {
        // also allow dynamic detection: if any token matches pattern base-N where base is component key
        // TODO: clean this up later maybe
        for (const token of clsList) {
            const m = token.match(/^([a-zA-Z0-9_-]+-\d+)$/);
            if (m && allComponents[m[1]])
                instanceKeys.push(m[1]);
        }
    }
    if (instanceKeys.length === 0)
        return null;
    // For each instance, collect utilities and build rules
    for (const instance of instanceKeys) {
        const comp = allComponents[instance];
        if (!comp)
            continue; // shouldnt happen but who knows
        // base props -> initial property map (normalize keys to kebab)
        const baseMap = {};
        // collect nested objects (pseudo, variants, at-rules) to emit after we know the selector
        const nestedBaseEntries = [];
        if (comp.base) {
            for (const [k, v] of Object.entries(comp.base)) {
                if (v && typeof v === "object") {
                    nestedBaseEntries.push([k, v]);
                }
                else {
                    baseMap[propToCSS(k)] = String(v);
                }
            }
        }
        const groups = new Map();
        // helper to get or create group (should this be outside? idk)
        function groupFor(bps, vars, suffix) {
            const key = JSON.stringify({ bps, vars, suffix });
            if (!groups.has(key)) {
                groups.set(key, {
                    breakpoints: bps,
                    variants: vars,
                    selectorSuffix: suffix,
                    propMap: {},
                    extras: [],
                });
            }
            return groups.get(key);
        }
        // Utility detection: this part sucks
        for (const token of clsList) {
            if (token === instance)
                continue;
            // Case 1: token prefixed with instance- => card-1-p-6
            if (token.startsWith(`${instance}-`)) {
                const remainder = token.slice(instance.length + 1);
                const { prefixes, raw } = splitPrefixesFromRaw(remainder);
                const breakpointParts = [];
                const variantParts = [];
                for (const p of prefixes) {
                    if (isBreakpoint(p))
                        breakpointParts.push(p);
                    else
                        variantParts.push(p);
                }
                let parsed;
                try {
                    parsed = parse(raw);
                }
                catch {
                    continue; // bad parse oh well
                }
                const res = handle(parsed);
                if (!res)
                    continue;
                let declStr = typeof res === "string" ? res : res.decl;
                const suffix = typeof res === "object" ? res.selectorSuffix : undefined;
                const extra = typeof res === "object" ? res.extra : undefined;
                if (!declStr)
                    continue;
                const g = groupFor(breakpointParts, variantParts, suffix);
                const dmap = declToMap(declStr);
                for (const [k, v] of Object.entries(dmap))
                    g.propMap[propToCSS(k)] = v;
                if (extra)
                    g.extras.push(extra);
                continue;
            }
            // Case 2: grouped shorthand expanded: instance present and token looks like a utility (p-4, bg-#fff)
            // FIXME: this is basically copy-pasted from above but idc anymore
            if (present.has(instance)) {
                // avoid picking other component tokens (like nav-1) as utilities
                if (/^[a-zA-Z0-9_-]+(-\d+)?$/.test(token) && allComponents[token]) {
                    continue;
                }
                const { prefixes, raw } = splitPrefixesFromRaw(token);
                const breakpointParts = [];
                const variantParts = [];
                for (const p of prefixes) {
                    if (isBreakpoint(p))
                        breakpointParts.push(p);
                    else
                        variantParts.push(p);
                }
                let parsed;
                try {
                    parsed = parse(raw);
                }
                catch {
                    continue;
                }
                const res = handle(parsed);
                if (!res)
                    continue;
                let declStr = typeof res === "string" ? res : res.decl;
                const suffix = typeof res === "object" ? res.selectorSuffix : undefined;
                const extra = typeof res === "object" ? res.extra : undefined;
                if (!declStr)
                    continue;
                const g = groupFor(breakpointParts, variantParts, suffix);
                const dmap = declToMap(declStr);
                for (const [k, v] of Object.entries(dmap))
                    g.propMap[propToCSS(k)] = v;
                if (extra)
                    g.extras.push(extra);
                continue;
            }
        } // end for tokens thank god
        // Component selector (scoped)
        const compSelector = `.${escapeClassName(instance)}`;
        // Emit nested base entries (pseudo selectors, at-rules, .dark &, etc.)
        for (const [rawKey, rawObj] of nestedBaseEntries) {
            let selectorStr = rawKey;
            // Replace & tokens with component selector
            if (selectorStr.includes("&")) {
                selectorStr = selectorStr.replace(/&/g, compSelector);
            }
            // If at-rule (e.g., @media)
            if (selectorStr.trim().startsWith("@")) {
                // Wrap the component rule inside the at-rule
                const decl = objectToDecl(rawObj);
                // Emit: @media (...) { .component { ... } }
                producedRules.push(`${selectorStr} { ${compSelector} { ${decl} } }`);
            }
            else {
                // Plain selector or pseudo (e.g., ":hover", "::after", ".dark &" already replaced)
                let finalSelector;
                if (rawKey.includes("&")) {
                    // already replaced
                    finalSelector = selectorStr;
                }
                else if (rawKey.startsWith(":") || rawKey.startsWith("::")) {
                    finalSelector = `${compSelector}${rawKey}`;
                }
                else {
                    // descendant selector fallback
                    finalSelector = `${compSelector} ${rawKey}`;
                }
                const decl = objectToDecl(rawObj);
                producedRules.push(`${finalSelector} { ${decl} }`);
            }
        }
        // Now produce CSS rules for each group
        for (const g of groups.values()) {
            let sel = applyVariantSelectors(compSelector, g.variants);
            if (g.selectorSuffix) {
                if (!g.selectorSuffix.startsWith(":") && !g.selectorSuffix.startsWith("::") && !g.selectorSuffix.startsWith(" "))
                    g.selectorSuffix = ` ${g.selectorSuffix}`;
                sel = `${sel}${g.selectorSuffix}`;
            }
            const decl = mapToDecl({ ...baseMap, ...g.propMap }); // utilities override base
            let rule = `${sel} { ${decl} }`;
            rule = wrapWithBreakpoints(rule, g.breakpoints);
            producedRules.push(rule);
            for (const ex of g.extras) {
                if (ex)
                    producedRules.push(ex);
            }
        }
        // If there were groups but no group covered base (no utilities assigned), still emit base component rule
        // edge cases man i hate them
        if (groups.size === 0) {
            const decl = mapToDecl(baseMap);
            producedRules.push(`${compSelector} { ${decl} }`);
        }
    } // end for each instance finally
    if (producedRules.length === 0)
        return null;
    return producedRules.join("\n");
} // done fuck

/**
 * ---------------------------------------------------------------------
 * GARUR-CSS — Ultra-fast Atomic CSS Engine
 * Author: Barshan Sarkar
  hey wait, i think i forgot to update the version last time lol
 * Version: 1.0.0
 * License: MIT
 * ---------------------------------------------------------------------
 *
 * This CLI powers the Garur-CSS ecosystem. It handles:
 * • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 * • File scanning across HTML / JS / TS / JSX / TSX
 * • Cache management and orphan-class detection
 * • Config file creation (garur.config.js)
 * • Plugin boilerplate generation
 * • Watch mode for real-time builds ,, (coming soon)
 * oh man, watch mode is gonna be epic when i get to it
 *
 * Technologies:
 * - TypeScript
 * - Rollup bundling (CJS-compatible output)
 * - Node.js (CLI execution via shebang)
 *
 * Notes for contributors:
 * • Keep the CLI ESM/CJS compatible.
 * • Avoid dynamic require unless wrapped safely.
 * • Keep output messages clean, fast, and developer-friendly.
 *
 * Made in India.
 * ---------------------------------------------------------------------
 */
// ---------- constants (I swear this is fine) -----------
const CURRENT_VERSION = 1;
// idk why there are 3 cache paths but apparently "we need them"
const CACHE_PATHS = [
    path__namespace.resolve(process.cwd(), "dist", ".garur-cache.json"),
    path__namespace.resolve(process.cwd(), ".garur-cache.json"),
    path__namespace.resolve(process.cwd(), "node_modules", ".cache", "garur", "cache.json"),
];
// fresh start fallback thing
const DEFAULT_CACHE = {
    version: CURRENT_VERSION,
    files: {},
    classes: {},
    meta: {
        lastBuild: 0,
        totalClasses: 0,
        totalFiles: 0,
    },
};
// ------------------------------------------------------
// normalizePathForCache
// ------------------------------------------------------
// ok so this tries to make file paths not explode
// this thing broke like 4 times so DO NOT touch any of it I beg you
// ------------------------------------------------------
function normalizePathForCache(filePath) {
    if (!filePath || filePath.trim() === "") {
        // returning empty feels wrong but removing it broke everything sooo
        return "";
    }
    try {
        // absolute? idk, this resolves it anyway
        let absPath = path__namespace.isAbsolute(filePath)
            ? path__namespace.resolve(filePath)
            : path__namespace.resolve(process.cwd(), filePath);
        let posixPath = absPath.split(path__namespace.sep).join("/");
        // trailing slashes caused pain
        posixPath = posixPath.replace(/\/+$/, "");
        if (process.platform === "win32") {
            posixPath = posixPath.toLowerCase();
        }
        return posixPath;
    }
    catch (err) {
        console.warn("path normalization blew up but I'm just gonna cope:", filePath, err);
        return filePath.replace(/\\/g, "/").replace(/\/+$/, "");
    }
}
// ------------------------------------------------------
// findCacheFile
// tries all the paths and picks first that exists
// (kind of like choosing the least broken one at 3am)
// ------------------------------------------------------
function findCacheFile() {
    for (const p of CACHE_PATHS) {
        try {
            if (fs__namespace.existsSync(p))
                return p;
        }
        catch { }
    }
    return null;
}
// ------------------------------------------------------
// getWriteCachePath
// I *think* this chooses the "best" place to store the cache
// do not "clean this up" — it WILL break
// ------------------------------------------------------
function getWriteCachePath() {
    const p = CACHE_PATHS[0];
    const dir = path__namespace.dirname(p);
    try {
        if (!fs__namespace.existsSync(dir)) {
            fs__namespace.mkdirSync(dir, { recursive: true });
        }
        return p;
    }
    catch {
        // welp fallback time
        return CACHE_PATHS[1];
    }
}
// ------------------------------------------------------
// loadCache
// loads + migrates + validates + prays
// I added try/catch because I got tired of things exploding
// ------------------------------------------------------
function loadCache() {
    var _a, _b;
    const fp = findCacheFile();
    if (!fp) {
        return { ...DEFAULT_CACHE };
    }
    try {
        const raw = JSON.parse(fs__namespace.readFileSync(fp, "utf-8"));
        const migrated = migrateCache(raw);
        const valid = validateCache(migrated);
        // refreshing metadata because someone said it's "helpful"??
        valid.meta = {
            lastBuild: ((_a = valid.meta) === null || _a === void 0 ? void 0 : _a.lastBuild) || Date.now(),
            totalClasses: Object.keys(valid.classes).length,
            totalFiles: Object.keys(valid.files).length,
            buildTime: (_b = valid.meta) === null || _b === void 0 ? void 0 : _b.buildTime
        };
        return valid;
    }
    catch (err) {
        console.warn("cache corrupted AGAIN great. starting fresh:", err);
        return { ...DEFAULT_CACHE };
    }
}
// ------------------------------------------------------
// saveCache
// This is the scariest function in the entire file.
// Every time I touched it, something broke elsewhere.
// So if you think “oh I can clean this” → NO YOU CAN’T.
// ------------------------------------------------------
function saveCache(cache) {
    try {
        const valid = validateCache(cache);
        valid.version = CURRENT_VERSION;
        valid.meta = {
            ...valid.meta,
            lastBuild: Date.now(),
            totalClasses: Object.keys(valid.classes).length,
            totalFiles: Object.keys(valid.files).length,
        };
        const dest = getWriteCachePath();
        const tmp = dest + ".tmp";
        const bak = dest + ".bak";
        const dir = path__namespace.dirname(dest);
        if (!fs__namespace.existsSync(dir))
            fs__namespace.mkdirSync(dir, { recursive: true });
        fs__namespace.writeFileSync(tmp, JSON.stringify(valid, null, 2), "utf8");
        if (fs__namespace.existsSync(dest)) {
            try {
                fs__namespace.copyFileSync(dest, bak);
            }
            catch { }
        }
        fs__namespace.renameSync(tmp, dest);
        if (fs__namespace.existsSync(bak)) {
            try {
                fs__namespace.unlinkSync(bak);
            }
            catch { }
        }
    }
    catch (err) {
        console.error("saveCache literally fell apart:", err);
        try {
            fs__namespace.writeFileSync(CACHE_PATHS[1], JSON.stringify(cache, null, 2), "utf8");
        }
        catch {
            console.error("okay idk what to do anymore cache can't be saved anywhere goodbye");
        }
    }
}
// ------------------------------------------------------
// validateCache
// this thing ended up way too long but I’m scared to touch it now
// ------------------------------------------------------
function validateCache(cache) {
    const out = {
        version: typeof cache.version === "number" ? cache.version : CURRENT_VERSION,
        files: {},
        classes: {},
        meta: cache.meta || DEFAULT_CACHE.meta
    };
    // ok validating files…
    if (cache.files && typeof cache.files === "object") {
        for (const [fp, raw] of Object.entries(cache.files)) {
            const norm = normalizePathForCache(fp);
            if (typeof raw === "string") {
                // legacy thing
                out.files[norm] = {
                    hash: raw,
                    classes: [],
                    timestamp: Date.now(),
                };
            }
            else if (raw && typeof raw === "object") {
                const d = raw;
                out.files[norm] = {
                    hash: typeof d.hash === "string" ? d.hash : "",
                    classes: Array.isArray(d.classes)
                        ? d.classes.filter((x) => typeof x === "string")
                        : [],
                    timestamp: typeof d.timestamp === "number" ? d.timestamp : Date.now(),
                    size: typeof d.size === "number" ? d.size : undefined,
                };
            }
        }
    }
    // validating classes…
    if (cache.classes && typeof cache.classes === "object") {
        for (const [cls, css] of Object.entries(cache.classes)) {
            if (typeof css === "string" && cls.trim()) {
                out.classes[cls.trim()] = css;
            }
        }
    }
    return out;
}
// ------------------------------------------------------
// migrateCache
// I don't fully understand versioning but this works so DO NOT TOUCH.
// ------------------------------------------------------
function migrateCache(raw) {
    const v = raw.version || 1;
    if (v >= CURRENT_VERSION)
        return raw;
    console.log("migrating cache from version", v, "to", CURRENT_VERSION);
    if (v < 2) {
        if (raw.files) {
            const newFiles = {};
            for (const [fp, data] of Object.entries(raw.files)) {
                newFiles[normalizePathForCache(fp)] = data;
            }
            raw.files = newFiles;
        }
    }
    if (v < 3) {
        if (raw.files) {
            for (const d of Object.values(raw.files)) {
                const dd = d;
                if (!dd.timestamp)
                    dd.timestamp = Date.now();
            }
        }
        if (!raw.meta) {
            raw.meta = {
                lastBuild: Date.now(),
                totalClasses: Object.keys(raw.classes || {}).length,
                totalFiles: Object.keys(raw.files || {}).length,
            };
        }
    }
    raw.version = CURRENT_VERSION;
    return raw;
}
// ------------------------------------------------------
// removeFileFromCache
// removes file + any orphan classes
// this part once wiped my whole cache by accident
// pls double check if modifying anything here
// ------------------------------------------------------
function removeFileFromCache(cache, filePath) {
    const p = normalizePathForCache(filePath);
    if (!cache.files[p])
        return;
    const removed = new Set(cache.files[p].classes);
    delete cache.files[p];
    if (removed.size > 0) {
        const refs = getAllReferencedClasses(cache);
        for (const cls of removed) {
            if (!refs.has(cls) && cache.classes[cls]) {
                delete cache.classes[cls];
            }
        }
    }
}
// ------------------------------------------------------
// getAllReferencedClasses
// returns all classes that are still used
// I messed this up once and everything got deleted so be careful
// ------------------------------------------------------
function getAllReferencedClasses(cache) {
    const s = new Set();
    for (const f of Object.values(cache.files)) {
        for (const c of f.classes)
            s.add(c);
    }
    return s;
}
// ------------------------------------------------------
// pruneCache
// deletes stale file entries + orphan classes
// broke on me like 3 times so I’m scared of this one
// ------------------------------------------------------
function pruneCache(cache, currentFiles) {
    let pruned = 0;
    const keep = {};
    const current = new Set();
    if (Array.isArray(currentFiles)) {
        for (const f of currentFiles)
            current.add(normalizePathForCache(f));
    }
    for (const [fp, data] of Object.entries(cache.files)) {
        try {
            const real = path__namespace.isAbsolute(fp) ? fp : path__namespace.resolve(process.cwd(), fp);
            if (fs__namespace.existsSync(real)) {
                if (currentFiles && !current.has(fp)) ;
                keep[fp] = data;
            }
            else {
                pruned++;
            }
        }
        catch {
            pruned++;
        }
    }
    cache.files = keep;
    const refs = getAllReferencedClasses(cache);
    const clsOut = {};
    for (const [cls, css] of Object.entries(cache.classes)) {
        if (refs.has(cls))
            clsOut[cls] = css;
        else
            pruned++;
    }
    cache.classes = clsOut;
    return pruned;
}

/**
 * ---------------------------------------------------------------------
 *  GARUR-CSS — Ultra-fast Atomic CSS Engine
 *  Author: Barshan Sarkar
 *  Version: 1.0.0
 *  License: MIT
 * ---------------------------------------------------------------------
 *
 *  This CLI powers the Garur-CSS ecosystem. It handles:
 *    • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 *    • File scanning across HTML / JS / TS / JSX / TSX
 *    • Cache management and orphan-class detection
 *    • Config file creation (garur.config.js)
 *    • Plugin boilerplate generation
 *    • Watch mode for real-time builds ,, (coming soon)
 *
 *  Technologies:
 *    - TypeScript
 *    - Rollup bundling (CJS-compatible output)
 *    - Node.js (CLI execution via shebang)
 *
 *  Notes for contributors:
 *    • Keep the CLI ESM/CJS compatible.
 *    • Avoid dynamic require unless wrapped safely.
 *    • Keep output messages clean, fast, and developer-friendly.
 *
 *  Made in India.
 * ---------------------------------------------------------------------
 */
// constants - output stuff
const DIST = path$1.resolve(process.cwd(), "dist");
const OUT = path$1.join(DIST, "garur.css");
const OUT_MIN = path$1.join(DIST, "garur.min.css");
// extractor caching. naive but works.
const extractorCache = new Map();
const MAX_EXTRACTOR_CACHE_SIZE = 500;
function extractClassesFromContent(content) {
    // quick bail out for tiny files
    if (!content || content.length < 10)
        return [];
    // key for caching - md5 for huge content
    const cacheKey = content.length > 10000
        ? crypto.createHash("md5").update(content).digest("hex").slice(0, 12)
        : content;
    const cached = extractorCache.get(cacheKey);
    if (cached)
        return cached;
    const results = new Set();
    // this regex tries to capture class, className, data-garur, and some template cases
    const classPattern = /(?:class|className|data-garur)\s*=\s*(?:"([^"]+)"|'([^']+)'|`([^`]+)`|\{["']([^"']+)["']\}|\{`([^`]+)`\})/g;
    let match;
    while ((match = classPattern.exec(content)) !== null) {
        let classString = "";
        for (let i = 1; i <= 5; i++) {
            if (match[i]) {
                classString = match[i];
                break;
            }
        }
        if (!classString)
            continue;
        // manual split by whitespace to avoid weird template tokens
        let start = 0;
        let inClass = false;
        for (let i = 0; i <= classString.length; i++) {
            const char = classString[i];
            const isWhitespace = char === " " || char === "\t" || char === "\n" || i === classString.length;
            if (isWhitespace && inClass) {
                const cls = classString.slice(start, i).trim();
                if (cls && cls.length > 0) {
                    results.add(cls);
                }
                inClass = false;
            }
            else if (!isWhitespace && !inClass) {
                start = i;
                inClass = true;
            }
        }
    }
    // handle template literal with ${} interpolation - remove interpolations then split
    const templatePattern = /(?:class|className)=\{`([^`]+)`\}/g;
    while ((match = templatePattern.exec(content)) !== null) {
        const classString = match[1];
        const cleaned = classString.replace(/\$\{[^}]*\}/g, " ");
        if (cleaned.trim()) {
            const classes = cleaned.split(/\s+/).filter(Boolean);
            for (const cls of classes) {
                results.add(cls);
            }
        }
    }
    const result = Array.from(results);
    // simple LRU-ish eviction
    if (extractorCache.size >= MAX_EXTRACTOR_CACHE_SIZE) {
        const keys = Array.from(extractorCache.keys());
        const toRemove = Math.floor(MAX_EXTRACTOR_CACHE_SIZE * 0.3);
        for (let i = 0; i < toRemove && i < keys.length; i++) {
            extractorCache.delete(keys[i]);
        }
    }
    extractorCache.set(cacheKey, result);
    return result;
}
// rule parsing cache
const rulePartsCache = new Map();
const MAX_RULE_CACHE_SIZE = 800;
function extractRuleParts(rule) {
    const cached = rulePartsCache.get(rule);
    if (cached)
        return cached;
    const r = rule.trim();
    let media = null;
    let inner = r;
    if (r.startsWith("@media")) {
        const openBrace = r.indexOf("{");
        if (openBrace !== -1) {
            media = r.slice(6, openBrace).trim().replace(/^\(|\)$/g, "");
            inner = r.slice(openBrace + 1, -1).trim();
        }
    }
    // we need to find the selector (before first brace-level)
    let braceCount = 0;
    let mainSelectorEnd = -1;
    for (let i = 0; i < inner.length; i++) {
        const char = inner[i];
        if (char === "{") {
            braceCount++;
            if (braceCount === 1 && mainSelectorEnd === -1) {
                mainSelectorEnd = i;
            }
        }
        else if (char === "}") {
            braceCount--;
        }
    }
    let selector = "";
    let decl = "";
    if (mainSelectorEnd !== -1) {
        selector = inner.slice(0, mainSelectorEnd).trim();
        let declStart = mainSelectorEnd + 1;
        let declEnd = inner.length;
        braceCount = 0;
        for (let i = declStart; i < inner.length; i++) {
            const char = inner[i];
            if (char === "{")
                braceCount++;
            else if (char === "}") {
                if (braceCount === 0) {
                    declEnd = i;
                    break;
                }
                braceCount--;
            }
        }
        decl = inner.slice(declStart, declEnd).trim();
    }
    const result = { media, selector, decl };
    if (rulePartsCache.size >= MAX_RULE_CACHE_SIZE) {
        const firstKey = rulePartsCache.keys().next().value;
        if (firstKey)
            rulePartsCache.delete(firstKey);
    }
    rulePartsCache.set(rule, result);
    return result;
}
// breakpoints from config, may be empty
const breakpointConfig = config$1.breakpoints || {};
const breakpointKeys = Object.keys(breakpointConfig);
const variantParserCache = new Map();
const MAX_VARIANT_CACHE_SIZE = 1500;
// main build from cache + files
async function buildCssFromCacheAndFiles(files, cache, stats) {
    // referenced set
    const referencedClasses = new Set();
    const BATCH_SIZE = 200;
    const fileCount = files.length;
    for (let batchStart = 0; batchStart < fileCount; batchStart += BATCH_SIZE) {
        const batchEnd = Math.min(batchStart + BATCH_SIZE, fileCount);
        const batchPromises = [];
        for (let i = batchStart; i < batchEnd; i++) {
            const file = files[i];
            batchPromises.push(Promise.resolve().then(() => {
                try {
                    const content = fs$4.readFileSync(file, "utf-8");
                    const classes = extractClassesFromContent(content);
                    for (const cls of classes) {
                        referencedClasses.add(cls);
                    }
                }
                catch (error) {
                    // ignore read errors, 3am fallback
                }
            }));
        }
        await Promise.all(batchPromises);
    }
    if (referencedClasses.size === 0) {
        return "";
    }
    // dedupe map key: media + decl OR just decl
    const dedupeMap = new Map();
    const order = [];
    const componentClasses = Object.keys(allComponents);
    const isComponent = new Set(componentClasses);
    const referencedArray = Array.from(referencedClasses);
    const cacheClasses = cache.classes || {};
    const utilities = [];
    const components = [];
    for (const cls of referencedArray) {
        if (isComponent.has(cls)) {
            components.push(cls);
        }
        else {
            utilities.push(cls);
        }
    }
    // process utilities in chunks to avoid blocking event loop
    const UTILITY_CHUNK_SIZE = 500;
    for (let i = 0; i < utilities.length; i += UTILITY_CHUNK_SIZE) {
        const chunk = utilities.slice(i, i + UTILITY_CHUNK_SIZE);
        const chunkPromises = chunk.map((cls) => Promise.resolve().then(() => {
            let rule = null;
            if (cacheClasses[cls]) {
                rule = cacheClasses[cls];
                if (stats)
                    stats.cacheHits++;
                return { cls, rule };
            }
            else {
                try {
                    rule = build(cls);
                    if (rule) {
                        cacheClasses[cls] = rule;
                        if (stats)
                            stats.cacheMisses++;
                    }
                }
                catch {
                    rule = null;
                }
                return { cls, rule };
            }
        }));
        const chunkResults = await Promise.all(chunkPromises);
        for (const { rule } of chunkResults) {
            if (!rule)
                continue;
            const { media, selector, decl } = extractRuleParts(rule);
            if (!decl)
                continue;
            const key = media ? `${media}::${decl}` : `::${decl}`;
            let entry = dedupeMap.get(key);
            if (!entry) {
                entry = { selectors: [selector], decl, media };
                dedupeMap.set(key, entry);
                order.push(key);
            }
            else if (!entry.selectors.includes(selector)) {
                entry.selectors.push(selector);
            }
        }
    }
    // components: mergeComponent -> parse rules, same dedupe logic
    for (const cls of components) {
        try {
            const compCSS = mergeComponent([cls]);
            if (!compCSS)
                continue;
            const rules = [];
            let currentRule = "";
            let braceCount = 0;
            for (let i = 0; i < compCSS.length; i++) {
                const char = compCSS[i];
                currentRule += char;
                if (char === "{")
                    braceCount++;
                else if (char === "}") {
                    braceCount--;
                    if (braceCount === 0) {
                        rules.push(currentRule.trim());
                        currentRule = "";
                    }
                }
            }
            for (const rule of rules) {
                if (!rule)
                    continue;
                const { media, selector, decl } = extractRuleParts(rule);
                if (!decl)
                    continue;
                const key = media ? `${media}::${decl}` : `::${decl}`;
                let entry = dedupeMap.get(key);
                if (!entry) {
                    entry = { selectors: [selector], decl, media };
                    dedupeMap.set(key, entry);
                    order.push(key);
                }
                else if (!entry.selectors.includes(selector)) {
                    entry.selectors.push(selector);
                }
            }
        }
        catch {
            continue;
        }
    }
    // update cache classes
    cache.classes = cacheClasses;
    // now format blocks grouped by media and base
    const mediaBlocks = new Map();
    const baseBlocks = [];
    for (const key of order) {
        const entry = dedupeMap.get(key);
        if (!entry || entry.selectors.length === 0)
            continue;
        const formattedDecl = entry.decl
            .split(";")
            .filter(Boolean)
            .map((line) => `  ${line.trim()};`)
            .join("\n");
        const block = `${entry.selectors.join(",\n")} {\n${formattedDecl}\n}`;
        if (entry.media) {
            let blocks = mediaBlocks.get(entry.media);
            if (!blocks) {
                blocks = [];
                mediaBlocks.set(entry.media, blocks);
            }
            blocks.push(block);
        }
        else {
            baseBlocks.push(block);
        }
    }
    // free memory-ish
    dedupeMap.clear();
    const cssParts = [];
    if (baseBlocks.length > 0) {
        cssParts.push(baseBlocks.join("\n\n"));
    }
    for (const bp of breakpointKeys) {
        const blocks = mediaBlocks.get(bp);
        if (blocks && blocks.length > 0) {
            cssParts.push(`@media (min-width: ${breakpointConfig[bp]}) {`);
            cssParts.push(blocks.join("\n\n"));
            cssParts.push("}");
            mediaBlocks.delete(bp);
        }
    }
    for (const [media, blocks] of mediaBlocks.entries()) {
        if (blocks.length > 0) {
            cssParts.push(`@media (${media}) {`);
            cssParts.push(blocks.join("\n\n"));
            cssParts.push("}");
        }
    }
    return cssParts.join("\n\n");
}
// super naive minifier, but solid enough
function minifyCss(css) {
    let result = "";
    let inComment = false;
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let lastChar = "";
    for (let i = 0; i < css.length; i++) {
        const char = css[i];
        const nextChar = i + 1 < css.length ? css[i + 1] : "";
        if (!inSingleQuote && !inDoubleQuote && char === "/" && nextChar === "*") {
            inComment = true;
            i++;
            continue;
        }
        if (inComment && char === "*" && nextChar === "/") {
            inComment = false;
            i++;
            continue;
        }
        if (inComment)
            continue;
        if (char === "'" && !inDoubleQuote && lastChar !== "\\") {
            inSingleQuote = !inSingleQuote;
        }
        else if (char === '"' && !inSingleQuote && lastChar !== "\\") {
            inDoubleQuote = !inDoubleQuote;
        }
        if (!inSingleQuote && !inDoubleQuote) {
            if (char === " " || char === "\t" || char === "\n" || char === "\r") {
                if (lastChar &&
                    lastChar !== " " &&
                    lastChar !== "{" &&
                    lastChar !== ";" &&
                    lastChar !== ":") {
                    if (nextChar && nextChar !== " " && nextChar !== "}" && nextChar !== ";" && nextChar !== ":") {
                        result += " ";
                        lastChar = " ";
                    }
                }
                continue;
            }
            if (char === ";" && (nextChar === "}" || nextChar === " ")) {
                result += ";";
                lastChar = ";";
                continue;
            }
        }
        result += char;
        lastChar = char;
    }
    return result.trim();
}
let preflightCache = null;
function loadPreflightFile() {
    if (preflightCache !== null)
        return preflightCache;
    try {
        const PREFLIGHT_PATH = path$1.resolve(__dirname, "preflight.css");
        if (fs$4.existsSync(PREFLIGHT_PATH)) {
            preflightCache = fs$4.readFileSync(PREFLIGHT_PATH, "utf-8").trim() + "\n\n";
        }
        else {
            preflightCache = "";
        }
    }
    catch {
        preflightCache = "";
    }
    return preflightCache;
}
async function runJIT(globPattern = ["**/*.{html,ts,js,jsx,tsx}"]) {
    var _a;
    const startTime = performance.now();
    const startMemory = process.memoryUsage().heapUsed;
    const stats = {
        cacheHits: 0,
        cacheMisses: 0,
    };
    const cache = loadCache();
    const pruned = pruneCache(cache);
    if (pruned > 0) {
        console.log(`Pruned ${pruned} stale cache entries`);
    }
    cleanupMemoryCaches();
    const filesRelative = await index(globPattern, {
        ignore: [
            "node_modules/**",
            "dist/**",
            ".git/**",
            "**/.next/**",
            "**/.nuxt/**",
            "**/build/**",
            "**/out/**",
            "**/.output/**",
            "**/*.test.*",
            "**/*.spec.*",
            "**/__tests__/**",
            "**/__mocks__/**",
            "**/*.test",
            "**/*.spec",
            "**/*.snap",
            "**/coverage/**",
            "**/*.map",
            "**/*.d.ts",
            "**/*.min.*",
            "**/*.bundle.*",
            "**/docs/**",
            "**/*.md",
            "**/*.mdx",
            "**/config/**",
            "**/*.config.*",
            "**/*.conf",
            "**/*.log",
            "**/.tmp/**",
            "**/tmp/**",
            "**/.cache/**",
            "**/.vercel/**",
            "**/.netlify/**",
            "**/.github/**",
            "**/.vscode/**",
            "**/.idea/**",
            "**/public/**/*.{jpg,jpeg,png,gif,svg,ico,webp,mp4,webm,mp3,wav}",
            "**/static/**/*.{jpg,jpeg,png,gif,svg,ico,webp,mp4,webm,mp3,wav}",
            "**/assets/**/*.{jpg,jpeg,png,gif,svg,ico,webp,mp4,webm,mp3,wav}",
            "**/package-lock.json",
            "**/yarn.lock",
            "**/pnpm-lock.yaml",
            ...(((_a = config$1.jit) === null || _a === void 0 ? void 0 : _a.ignore) || []),
        ],
        caseSensitiveMatch: false,
        followSymbolicLinks: false,
        onlyFiles: true,
        deep: 5,
        absolute: false,
    });
    console.log(`Found ${filesRelative.length} files`);
    let files = filesRelative.map((f) => path$1.resolve(process.cwd(), f));
    if (files.length > 1500) {
        console.log("Applying size filtering...");
        const filteredFiles = [];
        for (const file of files) {
            try {
                const stats = fs$4.statSync(file);
                if (stats.size < 300 * 1024) {
                    filteredFiles.push(file);
                }
            }
            catch {
                // ignore
            }
        }
        files = filteredFiles;
        console.log(`Filtered to ${files.length} files`);
    }
    const counts = new Map();
    const allCurrentClasses = new Set();
    const componentKeys = Object.keys(allComponents);
    const BATCH_SIZE = Math.min(200, files.length);
    let processedFiles = 0;
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
        const batch = files.slice(i, i + BATCH_SIZE);
        const batchPromises = batch.map((file) => Promise.resolve().then(() => {
            try {
                if (!fs$4.existsSync(file)) {
                    removeFileFromCache(cache, file);
                    return;
                }
                const content = fs$4.readFileSync(file, "utf-8");
                const classes = extractClassesFromContent(content);
                for (const cls of classes) {
                    allCurrentClasses.add(cls);
                    counts.set(cls, (counts.get(cls) || 0) + 1);
                }
                const norm = normalizePathForCache(file);
                cache.files = cache.files || {};
                cache.files[norm] = {
                    hash: crypto.createHash("md5").update(content).digest("hex"),
                    classes: Array.from(new Set(classes)),
                    timestamp: Date.now(),
                };
                processedFiles++;
            }
            catch {
                // whatever
            }
        }));
        await Promise.all(batchPromises);
        if (processedFiles % 1000 === 0) {
            cleanupMemoryCaches();
        }
    }
    if (cache.classes) {
        const cacheClassKeys = Object.keys(cache.classes);
        let removedCount = 0;
        for (const cls of cacheClassKeys) {
            if (!allCurrentClasses.has(cls) && !componentKeys.includes(cls)) {
                delete cache.classes[cls];
                removedCount++;
            }
        }
        if (removedCount > 0) {
            console.log(`Removed ${removedCount} orphaned classes`);
        }
    }
    let css = await buildCssFromCacheAndFiles(files, cache, stats);
    if (enhancedAnimations && typeof enhancedAnimations === "string") {
        const animTrimmed = enhancedAnimations.trim();
        if (animTrimmed) {
            css = `${css}\n\n${animTrimmed}`;
        }
    }
    const preflightFile = loadPreflightFile();
    if (preflightFile) {
        css = `${preflightFile}${css}`;
    }
    const finalMin = minifyCss(css);
    if (!fs$4.existsSync(DIST)) {
        fs$4.mkdirSync(DIST, { recursive: true });
    }
    try {
        await Promise.all([fs$4.promises.writeFile(OUT, css, "utf-8"), fs$4.promises.writeFile(OUT_MIN, finalMin, "utf-8")]);
    }
    catch (error) {
        console.error("Failed to write CSS files:", error);
        throw error;
    }
    saveCache(cache);
    cleanupMemory();
    const endTime = performance.now();
    const endMemory = process.memoryUsage().heapUsed;
    const uniqueClasses = counts.size;
    const uniqueUtilities = Array.from(counts.keys()).filter((c) => !componentKeys.includes(c)).length;
    const classOccurrences = Array.from(counts.values()).reduce((a, b) => a + b, 0);
    const cssBytes = Buffer.byteLength(css, "utf-8");
    const top = Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([cls, count]) => ({ cls, count }));
    const memoryDelta = (endMemory - startMemory) / 1024 / 1024;
    const resultStats = {
        filesScanned: files.length,
        classOccurrences,
        uniqueClasses,
        uniqueUtilities,
        cssBytes,
        topClasses: top,
        buildTimeMs: Math.round(endTime - startTime),
        memoryUsageMB: Math.round(memoryDelta * 100) / 100,
        cacheHits: stats.cacheHits,
        cacheMisses: stats.cacheMisses,
        cacheSize: Object.keys(cache.classes || {}).length,
    };
    console.log(`\nBuild completed in ${resultStats.buildTimeMs}ms`);
    console.log(`${files.length} files, ${uniqueClasses} classes, ${(cssBytes / 1024).toFixed(1)}KB CSS`);
    console.log(`Memory: ${resultStats.memoryUsageMB}MB`);
    console.log(`Cache: ${stats.cacheHits} hits, ${stats.cacheMisses} misses`);
    return resultStats;
}
function cleanupMemoryCaches() {
    if (extractorCache.size > MAX_EXTRACTOR_CACHE_SIZE * 0.5) {
        const keys = Array.from(extractorCache.keys());
        const toRemove = Math.floor(keys.length * 0.3);
        for (let i = 0; i < toRemove && i < keys.length; i++) {
            extractorCache.delete(keys[i]);
        }
    }
    if (rulePartsCache.size > MAX_RULE_CACHE_SIZE * 0.5) {
        const firstKey = rulePartsCache.keys().next().value;
        if (firstKey)
            rulePartsCache.delete(firstKey);
    }
    if (variantParserCache.size > MAX_VARIANT_CACHE_SIZE * 0.5) {
        const firstKey = variantParserCache.keys().next().value;
        if (firstKey)
            variantParserCache.delete(firstKey);
    }
}
function cleanupMemory() {
    extractorCache.clear();
    rulePartsCache.clear();
    variantParserCache.clear();
    preflightCache = null;
    if (global.gc) {
        global.gc();
    }
}

/**
 * ---------------------------------------------------------------------
 *  GARUR-CSS — Ultra-fast Atomic CSS Engine
 *  Author: Barshan Sarkar
 *  Version: 1.0.0
 *  License: MIT
 * ---------------------------------------------------------------------
 *
 *  This CLI powers the Garur-CSS ecosystem. It handles:
 *    • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 *    • File scanning across HTML / JS / TS / JSX / TSX
 *    • Cache management and orphan-class detection
 *    • Config file creation (garur.config.js)
 *    • Plugin boilerplate generation
 *    • Vite integration for modern web development
 *    • Watch mode for real-time builds
 *
 *  Technologies:
 *    - TypeScript
 *    - Rollup bundling (CJS-compatible output)
 *    - Node.js (CLI execution via shebang)
 *
 *  Notes for contributors:
 *    • Keep the CLI ESM/CJS compatible.
 *    • Avoid dynamic require unless wrapped safely.
 *    • Keep output messages clean, fast, and developer-friendly.
 *
 *  Made in India.
 * ---------------------------------------------------------------------
 */
let ora = null;
// esm dirname hack because node is stupid sometimes
const __filename$1 = url.fileURLToPath((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('cli.cjs', document.baseURI).href)));
const __dirname$1 = path$1.dirname(__filename$1);
// read package.json or die trying
let pkg = { version: "0.0.0" };
try {
    const pkgPath = path$1.resolve(__dirname$1, "../package.json");
    if (fs$4.existsSync(pkgPath)) {
        pkg = JSON.parse(fs$4.readFileSync(pkgPath, "utf-8"));
    }
}
catch (e) {
    // fallback to default because everything breaks
}
const banner = pc.cyan(`v${pkg.version}
`);
const tagline = pc.gray("Ultra-fast atomic CSS engine • Built for speed & joy\n");
const AUT = ("INDIAN 1ST CSS FRAMEWORK MADE BY BARSHAN SARKAR\n");
const funMessages = [
    "CSS so fast, it finishes before you type the class.",
    "Atomic CSS delivered hotter than a fresh GPU.",
    "Garur-CSS: Because bloat belongs in 2015.",
    "Blink and you'll miss how fast this compiled.",
    "This CSS is smaller than your ego.",
    "Powered by Vite ⚡ + Garur 🦅 = Lightning fast dev"
];
function debugCache(cache) {
    console.log(pc.bold(pc.cyan("\n=== CACHE DEBUG ===\n")));
    console.log("Files in cache: ", Object.keys(cache.files || {}).length);
    console.log("Classes in cache: ", Object.keys(cache.classes || {}).length);
    const fileClasses = new Set();
    Object.values(cache.files || {}).forEach((fileData) => {
        if (fileData === null || fileData === void 0 ? void 0 : fileData.classes) {
            fileData.classes.forEach((cls) => fileClasses.add(cls));
        }
    });
    console.log("Classes in files: ", fileClasses.size);
    const orphanedClasses = Object.keys(cache.classes || {}).filter((cls) => !fileClasses.has(cls));
    console.log("Orphaned classes: ", orphanedClasses.length);
    console.log(""); // empty line because why not
}
// ==================== AUTO-CREATION FUNCTIONS ====================
function createConfigFile() {
    const configPath = path$1.resolve(process.cwd(), "garur.config.js");
    if (fs$4.existsSync(configPath)) {
        console.log(pc.yellow(` Config already exists at ${configPath}`));
        return false;
    }
    // Use ESM format for better compatibility
    const configContent = `// Garur-CSS Configuration (ESM format)
export default {
  // Breakpoints (responsive design)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  // Color palette (Tailwind-like colors)
  palette: {
    // Primary colors
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a'
    },
    // Gray scale
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    },
    // Semantic colors
    red: {
      500: '#ef4444',
      600: '#dc2626'
    },
    green: {
      500: '#10b981',
      600: '#059669'
    },
    yellow: {
      500: '#f59e0b',
      600: '#d97706'
    }
  },
  // Dark mode (media or class)
  darkMode: 'media', // or 'class'
  // JIT settings
  jit: {
    // Files to ignore during scanning
    ignore: [
      'node_modules/**',
      'dist/**',
      '.git/**',
      '**/.next/**',
      '**/.nuxt/**',
      '**/build/**',
      '**/coverage/**',
      '**/*.test.*',
      '**/*.spec.*'
    ],
    // Maximum files to scan (0 = unlimited)
    maxFiles: 0,
    // File size limit in bytes (files larger than this will be skipped)
    maxFileSize: 500 * 1024 // 500KB
  },
  // Component definitions (if you have a components system)
  components: {},
  // Custom utilities (add your own)
  utilities: {
    // Example: 'my-utility': 'color: red'
  }
};
`;
    fs$4.writeFileSync(configPath, configContent, "utf-8");
    console.log(pc.green(` Created config file: ${configPath}`));
    return true;
}
function createPluginDemo() {
    const pluginPath = path$1.resolve(process.cwd(), "garur.plugin.js");
    if (fs$4.existsSync(pluginPath)) {
        console.log(pc.yellow(` Plugin already exists at ${pluginPath}`));
        return false;
    }
    const pluginContent = `// Garur-CSS Plugin Example
// Add custom utilities, variants, or components
module.exports = {
  // Add custom utilities
  utilities: {
    // Simple utility
    'my-gradient': 'background: linear-gradient(45deg, #3b82f6, #8b5cf6)',
    // Dynamic utility with value
    'my-border-{value}': (value) => \`border: \${value}px solid #3b82f6\`,
    // Complex utility with multiple declarations
    'glass-card': \`
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
\`
  },
  // Add custom variants
  variants: {
    // Add a custom variant 'rtl' for right-to-left support
    rtl: (selector) => \`[dir="rtl"] \${selector}\`,
    // Add a custom variant 'print' for print styles
    print: (selector) => \`@media print { \${selector} }\`,
    // Add a custom breakpoint variant
    'custom-bp': (selector) => \`@media (min-width: 900px) { \${selector} }\`
  },
  // Add custom components
  components: {
    // Button component with variants
    'btn': \`
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 150ms;
\`,
    'btn-primary': \`
      background-color: #3b82f6;
      color: white;
      &:hover { background-color: #2563eb; }
\`,
    'btn-secondary': \`
      background-color: #6b7280;
      color: white;
      &:hover { background-color: #4b5563; }
\`
  },
  // Modify existing utilities
  extend: {
    // Extend spacing scale
    spacing: {
      '128': '32rem',
      '144': '36rem'
    },
    // Extend colors
    colors: {
      'brand': '#ff6b35',
      'accent': '#00d4aa'
    }
  }
};
`;
    fs$4.writeFileSync(pluginPath, pluginContent, "utf-8");
    console.log(pc.green(` Created plugin demo: ${pluginPath}`));
    return true;
}
function createExampleHTML() {
    const htmlPath = path$1.resolve(process.cwd(), "example.html");
    if (fs$4.existsSync(htmlPath)) {
        console.log(pc.yellow(` Example already exists at ${htmlPath}`));
        return false;
    }
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Garur-CSS Example</title>
  <link rel="stylesheet" href="dist/garur.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; padding: 2rem; }
  </style>
</head>
<body>
  <div class="container mx-auto">
    <h1 class="text-4xl font-bold text-gray-900 mb-8">
       Garur-CSS Demo
    </h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Card 1 -->
      <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
          <span class="text-white text-2xl">⚡</span>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Ultra Fast</h3>
        <p class="text-gray-600">
          Generates CSS in milliseconds with JIT compilation.
        </p>
        <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
          Learn More
        </button>
      </div>
      <!-- Card 2 -->
      <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
          <span class="text-white text-2xl">🦅</span>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Atomic CSS</h3>
        <p class="text-gray-600">
          Only the CSS you actually use. No bloat, no unused styles.
        </p>
        <button class="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
          Get Started
        </button>
      </div>
      <!-- Card 3 -->
      <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
          <span class="text-white text-2xl">🔧</span>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Fully Customizable</h3>
        <p class="text-gray-600">
          Extend with plugins, custom utilities, and your own design system.
        </p>
        <button class="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">
          Customize
        </button>
      </div>
    </div>
    <!-- Vite Integration Card -->
    <div class="mt-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-6 text-white">
      <div class="flex items-center mb-4">
        <span class="text-3xl mr-3">⚡</span>
        <h2 class="text-2xl font-bold">Vite + Garur = Lightning Fast Dev</h2>
      </div>
      <p class="mb-4">
        Use <code class="bg-white/20 px-2 py-1 rounded">garur --vite</code> to setup Vite integration.
        Get instant HMR, hot reload, and optimized builds.
      </p>
      <div class="flex flex-wrap gap-2">
        <span class="px-3 py-1 bg-white/20 rounded-full">Instant HMR</span>
        <span class="px-3 py-1 bg-white/20 rounded-full">Hot CSS Reload</span>
        <span class="px-3 py-1 bg-white/20 rounded-full">Optimized Builds</span>
        <span class="px-3 py-1 bg-white/20 rounded-full">TypeScript Support</span>
      </div>
    </div>
    <!-- Responsive Demo -->
    <div class="mt-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white">
      <h2 class="text-2xl font-bold mb-4">Responsive Design</h2>
      <p class="mb-4">
        This text is <span class="font-bold">large on desktop</span> but
        <span class="font-bold sm:hidden"> hidden on mobile</span>
        <span class="hidden sm:inline"> adjusts on smaller screens</span>.
      </p>
      <div class="flex flex-wrap gap-2">
        <span class="px-3 py-1 bg-white/20 rounded-full">Mobile First</span>
        <span class="px-3 py-1 bg-white/20 rounded-full">Dark Mode</span>
        <span class="px-3 py-1 bg-white/20 rounded-full">Hover States</span>
        <span class="px-3 py-1 bg-white/20 rounded-full">Animations</span>
      </div>
    </div>
    <!-- Quick Start -->
    <div class="mt-8 p-6 bg-gray-50 rounded-xl">
      <h3 class="text-lg font-semibold text-gray-800 mb-3">Quick Start:</h3>
      <pre class="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
<code>npm install garur-css
npx garur init # Create config
npx garur build # Generate CSS
npx garur --vite # Setup Vite integration
npx garur --watch # Watch for changes</code>
      </pre>
    </div>
  </div>
  <footer class="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
    <p>Made using Garur-CSS - The Indian CSS Framework</p>
    <p class="mt-1">Run <code class="bg-gray-100 px-2 py-1 rounded">npx garur build</code> to generate CSS from this file!</p>
  </footer>
</body>
</html>`;
    fs$4.writeFileSync(htmlPath, htmlContent, "utf-8");
    console.log(pc.green(` Created example HTML: ${htmlPath}`));
    return true;
}
// ==================== VITE INTEGRATION FUNCTIONS ====================
function createViteConfig() {
    const viteConfigPath = path$1.resolve(process.cwd(), "vite.config.ts");
    if (fs$4.existsSync(viteConfigPath)) {
        console.log(pc.yellow(` Vite config already exists at ${viteConfigPath}`));
        return false;
    }
    const viteConfigContent = `import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
`;
    fs$4.writeFileSync(viteConfigPath, viteConfigContent, "utf-8");
    console.log(pc.green(` Created Vite config: ${viteConfigPath}`));
    // Update package.json with Vite scripts
    const pkgPath = path$1.resolve(process.cwd(), "package.json");
    if (fs$4.existsSync(pkgPath)) {
        try {
            const pkg = JSON.parse(fs$4.readFileSync(pkgPath, "utf-8"));
            if (!pkg.scripts)
                pkg.scripts = {};
            // Add Vite scripts if they don't exist
            if (!pkg.scripts.dev) {
                pkg.scripts.dev = "vite";
            }
            if (!pkg.scripts.build) {
                pkg.scripts.build = "vite build";
            }
            if (!pkg.scripts.preview) {
                pkg.scripts.preview = "vite preview";
            }
            fs$4.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), "utf-8");
            console.log(pc.green(` Added Vite scripts to package.json`));
        }
        catch (e) {
            // Silent fail - package.json might be malformed
        }
    }
    // Create a basic index.html for Vite if it doesn't exist
    const indexPath = path$1.resolve(process.cwd(), "index.html");
    if (!fs$4.existsSync(indexPath)) {
        const indexContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Garur + Vite App</title>
  <link rel="stylesheet" href="/dist/garur.css">
</head>
<body>
  <div id="app" class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-900 mb-6">
        ⚡ Garur-CSS + Vite
      </h1>
      <p class="text-gray-600 mb-8">
        Your Garur-CSS is now integrated with Vite! Hot reload is enabled.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-xl shadow">
          <h2 class="text-xl font-semibold mb-3">Development</h2>
          <p class="text-gray-600 mb-4">Run: <code class="bg-gray-100 px-2 py-1 rounded">npm run dev</code></p>
          <p>Changes to your HTML/JSX will trigger instant CSS regeneration.</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow">
          <h2 class="text-xl font-semibold mb-3">Production</h2>
          <p class="text-gray-600 mb-4">Run: <code class="bg-gray-100 px-2 py-1 rounded">npm run build</code></p>
          <p>Get optimized, minified CSS for production deployment.</p>
        </div>
      </div>
      <div class="mt-8 p-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl text-white">
        <h3 class="text-lg font-bold mb-2">Try it out!</h3>
        <p class="mb-4">Edit this file and see changes instantly:</p>
        <div class="flex flex-wrap gap-2">
          <span class="px-3 py-1 bg-white/20 rounded-full">text-red-500</span>
          <span class="px-3 py-1 bg-white/20 rounded-full">p-8</span>
          <span class="px-3 py-1 bg-white/20 rounded-full">hover:scale-105</span>
          <span class="px-3 py-1 bg-white/20 rounded-full">md:flex-row</span>
        </div>
      </div>
    </div>
  </div>
  <script type="module">
    // Your app code here
    console.log('Garur + Vite = ');
  </script>
</body>
</html>`;
        fs$4.writeFileSync(indexPath, indexContent, "utf-8");
        console.log(pc.green(` Created index.html for Vite`));
    }
    return true;
}
// ==================== WATCH MODE FUNCTION ====================// ==================== SIMPLE POLLING WATCH MODE ====================
async function startWatchMode(patterns = []) {
    console.log(pc.cyan("🚀 Garur-CSS Watch Mode Starting..."));
    console.log(pc.gray("Using polling-based watch mode...\n"));
    const watchPatterns = patterns.length ? patterns : [
        "**/*.{html,js,jsx,ts,tsx,vue,svelte}",
        "src/**/*.{html,js,jsx,ts,tsx,vue,svelte}",
        "app/**/*.{html,js,jsx,ts,tsx}",
        "components/**/*.{js,jsx,ts,tsx,vue,svelte}",
        "pages/**/*.{html,js,jsx,ts,tsx}",
        "*.html",
        "index.html"
    ];
    console.log(pc.dim(`Watching: ${watchPatterns.join(", ")}`));
    // Initial build
    try {
        console.log(pc.cyan("⚡ Running initial build..."));
        const stats = await runJIT(watchPatterns);
        console.log(pc.green(`Initial build complete (${stats.buildTimeMs}ms)`));
        console.log(pc.dim(`   ${stats.filesScanned} files, ${stats.uniqueClasses} classes, ${(stats.cssBytes / 1024).toFixed(1)}KB CSS`));
    }
    catch (error) {
        console.error(pc.red("Initial build failed:"), error.message);
    }
    console.log(pc.green("\n Watch mode is now ACTIVE!"));
    console.log(pc.cyan("========================================"));
    console.log(pc.white("Polling for changes every 2 seconds"));
    console.log(pc.dim("Edit and save any file to see CSS rebuild"));
    console.log(pc.cyan("========================================"));
    console.log(pc.gray("\nPress Ctrl+C to stop\n"));
    // Track file timestamps
    const fileTimestamps = new Map();
    let buildCount = 0;
    let isBuilding = false;
    let pendingBuild = false;
    // Function to get all watched files
    const getWatchedFiles = async () => {
        try {
            const { default: glob } = await Promise.resolve().then(function () { return index$1; });
            return await glob(watchPatterns, {
                ignore: [
                    "**/node_modules/**",
                    "**/dist/**",
                    "**/.git/**",
                    "**/.next/**",
                    "**/.nuxt/**",
                    "**/build/**",
                    "**/coverage/**",
                    "**/*.test.*",
                    "**/*.spec.*"
                ],
                absolute: true,
                cwd: process.cwd()
            });
        }
        catch (error) {
            console.error(pc.red("Error finding files:"), error);
            return [];
        }
    };
    // Function to check for changes
    const checkForChanges = async () => {
        try {
            const files = await getWatchedFiles();
            let hasChanges = false;
            const changedFiles = [];
            for (const file of files) {
                try {
                    const stats = fs$4.statSync(file);
                    const lastMtime = fileTimestamps.get(file);
                    const currentMtime = stats.mtimeMs;
                    if (!lastMtime) {
                        // First time seeing this file
                        fileTimestamps.set(file, currentMtime);
                    }
                    else if (currentMtime > lastMtime) {
                        // File has changed
                        hasChanges = true;
                        changedFiles.push(path$1.relative(process.cwd(), file));
                        fileTimestamps.set(file, currentMtime);
                    }
                }
                catch (error) {
                    // File might have been deleted
                    if (fileTimestamps.has(file)) {
                        fileTimestamps.delete(file);
                        hasChanges = true;
                        changedFiles.push(`${path$1.relative(process.cwd(), file)} (deleted)`);
                    }
                }
            }
            // Clean up timestamps for files that no longer exist
            for (const [file] of fileTimestamps) {
                if (!files.includes(file)) {
                    fileTimestamps.delete(file);
                }
            }
            if (hasChanges && changedFiles.length > 0) {
                console.log(pc.gray(` Detected changes in: ${changedFiles.slice(0, 3).join(", ")}${changedFiles.length > 3 ? "..." : ""}`));
            }
            return hasChanges;
        }
        catch (error) {
            console.error(pc.red("Error checking for changes:"), error);
            return false;
        }
    };
    // Function to run build
    const runBuild = async (reason) => {
        if (isBuilding) {
            pendingBuild = true;
            console.log(pc.yellow("Build in progress, queuing..."));
            return;
        }
        isBuilding = true;
        buildCount++;
        console.log(pc.cyan(`\n Build #${buildCount}: ${reason}...`));
        const startTime = Date.now();
        try {
            const stats = await runJIT(watchPatterns);
            const buildTime = Date.now() - startTime;
            console.log(pc.green(` CSS rebuilt successfully (${buildTime}ms)`));
            console.log(pc.dim(` ${stats.filesScanned} files, ${stats.uniqueClasses} classes, ${(stats.cssBytes / 1024).toFixed(1)}KB`));
            if (stats.topClasses && stats.topClasses.length > 0) {
                const newClasses = stats.topClasses.slice(0, 3).map(c => c.cls).join(", ");
                console.log(pc.dim(`   Latest classes: ${newClasses}`));
            }
        }
        catch (error) {
            console.error(pc.red("❌ Build failed:"), error.message);
        }
        finally {
            isBuilding = false;
            if (pendingBuild) {
                pendingBuild = false;
                console.log(pc.yellow("📦 Processing queued build..."));
                setTimeout(() => runBuild("queued build"), 100);
            }
        }
    };
    console.log(pc.dim("Initializing file watcher..."));
    try {
        const initialFiles = await getWatchedFiles();
        for (const file of initialFiles) {
            try {
                const stats = fs$4.statSync(file);
                fileTimestamps.set(file, stats.mtimeMs);
            }
            catch {
            }
        }
        console.log(pc.dim(`Tracking ${fileTimestamps.size} files for changes`));
    }
    catch (error) {
        console.error(pc.red("Error initializing watcher:"), error);
    }
    let pollCount = 0;
    const pollInterval = 2000;
    const pollLoop = async () => {
        try {
            pollCount++;
            if (pollCount % 10 === 0) {
                console.log(pc.dim(`\n Still watching... (poll #${pollCount})`));
            }
            const hasChanges = await checkForChanges();
            if (hasChanges) {
                await runBuild("file changes detected");
            }
        }
        catch (error) {
            console.error(pc.red("Polling error:"), error);
        }
        setTimeout(pollLoop, pollInterval);
    };
    const safetyBuild = async () => {
        await runBuild("periodic safety build");
        setTimeout(safetyBuild, 30000);
    };
    pollLoop();
    setTimeout(safetyBuild, 30000);
    // Handle shutdown
    process.on("SIGINT", () => {
        console.log(pc.yellow("\nStopping watch mode..."));
        console.log(pc.green(` Completed ${buildCount} builds`));
        process.exit(0);
    });
    await new Promise(() => { });
}
async function main() {
    console.clear();
    console.log(banner);
    console.log(tagline);
    console.log(AUT);
    const args = minimist(process.argv.slice(2), {
        boolean: ['init', 'example', 'plugin', 'all', 'vite', 'clean', 'watch', 'help', 'version'],
        alias: {
            i: 'init',
            e: 'example',
            p: 'plugin',
            a: 'all',
            v: 'version',
            h: 'help',
            w: 'watch'
        },
        string: ['output']
    });
    if (args.v || args.version) {
        console.log(pc.bold(pc.cyan(`Garur-CSS v${pkg.version}`)));
        console.log(pc.dim(`⚡ With Vite integration & Watch mode`));
        return;
    }
    if (args.h || args.help) {
        console.log(pc.bold(pc.cyan("\nGarur-CSS CLI Commands:\n")));
        console.log(pc.gray(" garur -v, --version        ") + "Show version");
        console.log(pc.gray(" garur -h, --help          ") + "Show this help");
        console.log(pc.gray(" garur --clean             ") + "Clear cache");
        console.log(pc.gray(" garur --init              ") + "Create config file");
        console.log(pc.gray(" garur --plugin            ") + "Create plugin demo");
        console.log(pc.gray(" garur --example           ") + "Create example HTML");
        console.log(pc.gray(" garur --vite              ") + "Setup Vite integration");
        console.log(pc.gray(" garur --all               ") + "Create all starter files");
        console.log(pc.gray(" garur [patterns...]       ") + "Run JIT (default: **/*.{html,ts,js,jsx,tsx})");
        console.log(pc.gray(" garur --output <file>     ") + "Output CSS file (default: dist/garur.css)");
        console.log(pc.gray(" garur --watch [patterns]  ") + "Watch mode for real-time builds\n");
        console.log(pc.yellow(" Examples:"));
        console.log(" garur                          # Build CSS");
        console.log(" garur --init                   # Create config");
        console.log(" garur --vite                   # Setup Vite + Garur");
        console.log(" garur --all                    # Setup everything");
        console.log(" garur --watch                  # Watch all files");
        console.log(" garur src/**/*.tsx --watch     # Watch specific files");
        console.log(" garur --output custom.css      # Output to custom file\n");
        return;
    }
    if (args.vite) {
        console.log(pc.cyan(" Setting up Vite integration...\n"));
        console.log(pc.dim(" This will:"));
        console.log(" • Create vite.config.ts");
        console.log(" • Add Vite scripts to package.json");
        console.log(" • Create index.html (if missing)");
        console.log(" • Show next steps\n");
        let created = 0;
        if (createViteConfig())
            created++;
        if (created > 0) {
            console.log(pc.green(`\n Vite integration setup complete!`));
            console.log(pc.bold(pc.cyan("\nNext steps:\n")));
            console.log(" 1. Install Vite:");
            console.log(pc.gray("    npm install vite --save-dev"));
            console.log(" 2. Install Garur CSS:");
            console.log(pc.gray("    npm install garur-css --save-dev"));
            console.log(" 3. Run Garur in watch mode:");
            console.log(pc.gray("    npx garur --watch"));
            console.log(" 4. Start Vite dev server:");
            console.log(pc.gray("    npm run dev"));
            console.log(" 5. Edit your HTML/JSX files");
            console.log(" 6. Watch CSS update instantly! ⚡\n");
        }
        return;
    }
    if (args.watch || args.w) {
        await startWatchMode(args._);
        return;
    }
    if (args.init || args.i) {
        console.log(pc.cyan(" Setting up Garur-CSS...\n"));
        createConfigFile();
        console.log(pc.dim("\nEdit garur.config.js to customize your setup."));
        return;
    }
    if (args.plugin || args.p) {
        console.log(pc.cyan(" Creating plugin demo...\n"));
        createPluginDemo();
        console.log(pc.dim("\nEdit garur.plugin.js to add custom utilities."));
        return;
    }
    if (args.example || args.e) {
        console.log(pc.cyan(" Creating example HTML...\n"));
        createExampleHTML();
        console.log(pc.dim("\nOpen example.html in browser to see Garur in action."));
        return;
    }
    if (args.all || args.a) {
        console.log(pc.cyan(" Setting up complete Garur-CSS project...\n"));
        let created = 0;
        if (createConfigFile())
            created++;
        if (createPluginDemo())
            created++;
        if (createExampleHTML())
            created++;
        if (created > 0) {
            console.log(pc.green(`\n Created ${created} starter files!`));
            console.log(pc.dim("\nNext steps:"));
            console.log(" 1. Edit garur.config.js to customize");
            console.log(" 2. Run: npx garur build");
            console.log(" 3. Open example.html in browser");
            console.log(pc.dim("\nFor Vite integration, run: npx garur --vite"));
        }
        return;
    }
    if (args.clean) {
        console.log(pc.yellow("Cleaning cache..."));
        const cacheFiles = [
            path$1.resolve(process.cwd(), "dist/.garur-cache.json"),
            path$1.resolve(process.cwd(), ".garur-cache.json"),
        ];
        let deleted = 0;
        for (const file of cacheFiles) {
            if (fs$4.existsSync(file)) {
                fs$4.unlinkSync(file);
                console.log(pc.dim(` Deleted: ${file}`));
                deleted++;
            }
        }
        if (deleted === 0) {
            console.log(pc.gray(" No cache files found."));
        }
        else {
            console.log(pc.green(`\nCache cleaned! ${deleted} file(s) removed.\n`));
        }
        return;
    }
    let patterns = args._.length
        ? args._
        : [
            "**/*.{html,htm,js,jsx,ts,tsx,vue,svelte,astro,php}",
            "!node_modules/**",
            "!dist/**",
            "!.*/**"
        ];
    patterns = patterns.map((p) => path$1.isAbsolute(p) ? p : path$1.resolve(process.cwd(), p));
    const outputFile = args.output || args.o || path$1.resolve(process.cwd(), "dist/garur.css");
    const defaultOutput = path$1.resolve(process.cwd(), "dist/garur.css");
    console.log(pc.dim(`Scanning patterns: ${patterns.join(", ")}`));
    console.log(pc.dim(`Output file: ${outputFile}\n`));
    const before = loadCache();
    debugCache(before);
    if (!ora) {
        const oraPkg = require("ora");
        ora = typeof oraPkg === "function" ? oraPkg : oraPkg.default;
    }
    const spinner = ora({
        text: "Running Garur-CSS JIT engine...",
        spinner: "dots12",
        color: "cyan",
    }).start();
    let stats;
    try {
        stats = await runJIT(patterns);
    }
    catch (err) {
        spinner.fail(pc.red("JIT failed!"));
        console.error(pc.red("\n" +
            (err && typeof err === "object" && "message" in err
                ? err.message
                : String(err))));
        process.exit(1);
    }
    const after = loadCache();
    debugCache(after);
    if (!fs$4.existsSync(path$1.dirname(outputFile))) {
        fs$4.mkdirSync(path$1.dirname(outputFile), { recursive: true });
    }
    if (fs$4.existsSync(defaultOutput)) {
        if (outputFile !== defaultOutput) {
            fs$4.copyFileSync(defaultOutput, outputFile);
        }
    }
    else {
        spinner.warn(pc.yellow("Default CSS not found — nothing generated?"));
    }
    spinner.succeed(pc.green("Generated CSS"));
    console.log(pc.bold(pc.cyan("\n=== Garur-CSS JIT Report ===\n")));
    const format = (n) => n.toLocaleString();
    console.log(`${pc.cyan("Files scanned")} ${format(stats.filesScanned)}`);
    console.log(`${pc.yellow("Class occurrences")} ${format(stats.classOccurrences)}`);
    console.log(`${pc.green("Unique classes")} ${format(stats.uniqueClasses)}`);
    console.log(`${pc.blue("Utilities generated")} ${format(stats.uniqueUtilities)}`);
    console.log(`${pc.magenta("CSS size")} ${pc.bold((stats.cssBytes / 1024).toFixed(2) + " KB")}`);
    if (stats.cssBytes < 10000) {
        console.log(pc.green("\nUnder 10KB — Lightning fast & production-ready!"));
    }
    else if (stats.cssBytes < 50000) {
        console.log(pc.cyan("\nSolid size. You're doing great!"));
    }
    console.log(pc.magenta(`\nOutput written to → ${pc.bold(path$1.relative(process.cwd(), outputFile))}`));
    console.log(pc.dim("\n Tip: Run ") + pc.cyan("garur --watch") + pc.dim(" to automatically rebuild on file changes!"));
    const randomFun = funMessages[Math.floor(Math.random() * funMessages.length)];
    console.log(pc.dim(`\n${randomFun}\n`));
}
main().catch((err) => {
    console.error(pc.red("\nUnexpected error:"), err);
    process.exit(1);
});

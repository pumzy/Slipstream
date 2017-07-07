/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 20);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Collection of math functions
//
// 1. Combine components together
// 2. Has async init to load wasm modules
//



const base64decode     = __webpack_require__(3).base64decode;
const math_wasm_base64 = __webpack_require__(14);


function MathLib(requested_features, preload) {
  this.__requested_features = requested_features || [];
  this.__initialized = false;
  this.__initCallbacks = [];
  this.__wasm_module = preload && preload.wasm_module ? preload : null;

  // List of supported features, according to options & browser/node.js
  this.features = {
    js:   false, // pure JS implementation, can be disabled for testing
    wasm: false  // webassembly implementation for heavy functions
  };
}


MathLib.prototype.__init__ = function __init__(callback) {
  if (this.__initCallbacks.length > 0) {
    this.__initCallbacks.push(callback);
    return;
  }

  this.__initCallbacks = [ callback ];

  let finish = () => {
    let callbacks = this.__initCallbacks;
    this.__initCallbacks = [];
    this.__initialized = true;
    callbacks.forEach(fn => fn());
  };

  // Map supported implementations
  this.unsharp = this.unsharp_js; // That's in JS only for a while

  if (this.__requested_features.indexOf('js') >= 0) {
    this.features.js = true;
    this.resize  = this.resize_js;
  }

  if ((typeof WebAssembly !== 'undefined') &&
      (this.__requested_features.indexOf('wasm') >= 0)) {

    if (this.__wasm_module) {
      this.features.wasm = true;
      this.resize  = this.resize_wasm;
      finish();
      return;
    }

    WebAssembly.compile(base64decode(math_wasm_base64))
      .then(wasm_module => {
        this.__wasm_module = wasm_module;
        this.features.wasm = true;
        this.resize  = this.resize_wasm;
        finish();
      })
      .catch(() => {
        // Suppress init errors
        finish();
      });

    return;
  }

  finish();
};


// Returns either promise or callback; callback interface is intended only for
// WebWorkers in IE11 (which doesn't support promises).
//
/* eslint-disable consistent-return */
MathLib.prototype.init = function init(callback) {
  if (typeof callback !== 'function') {
    if (this.__initialized) return Promise.resolve(this);

    return new Promise((resolve, reject) => {
      this.__init__(err => {
        if (err) {
          reject(err);
          return;
        }

        if (!this.features.wasm && !this.features.js) {
          reject(new Error('Pica mathlib: no supported methods found'));
          return;
        }

        resolve(this);
      });
    });
  }

  if (this.__initialized) {
    callback(null, this);
    return;
  }

  this.__init__(err => {
    if (err) {
      callback(err);
      return;
    }

    if (!this.features.wasm && !this.features.js) {
      callback(new Error('Pica mathlib: no supported methods found'));
      return;
    }

    callback(null, this);
  });

  return;
};


MathLib.prototype.resizeAndUnsharp = function resizeAndUnsharp(options, cache) {
  let result = this.resize(options, cache);

  if (options.unsharpAmount) {
    this.unsharp(
      result,
      options.toWidth,
      options.toHeight,
      options.unsharpAmount,
      options.unsharpRadius,
      options.unsharpThreshold
    );
  }

  return result;
};


// Pin implementations
MathLib.prototype.unsharp_js = __webpack_require__(13);
MathLib.prototype.resize_js  = __webpack_require__(12);


////////////////////////////////////////////////////////////////////////////////
// WebAssembly wrappers & helpers
//

const createFilters = __webpack_require__(2);

function resetAlpha(dst, width, height) {
  let ptr = 3, len = (width * height * 4)|0;
  while (ptr < len) { dst[ptr] = 0xFF; ptr = (ptr + 4)|0; }
}

function asUint8Array(src) {
  return new Uint8Array(src.buffer, 0, src.byteLength);
}



let IS_LE = true;
// should not crash everything on module load in old browsers
try {
  IS_LE = ((new Uint32Array((new Uint8Array([ 1, 0, 0, 0 ])).buffer))[0] === 1);
} catch (__) {}


function copyInt16asLE(src, target, target_offset) {
  if (IS_LE) {
    target.set(asUint8Array(src), target_offset);
    return;
  }

  for (let ptr = target_offset, i = 0; i < src.length; i++) {
    let data = src[i];
    target[ptr++] = data & 0xFF;
    target[ptr++] = (data >> 8) & 0xFF;
  }
}


MathLib.prototype.resize_wasm = function resize_wasm(options, cache) {
  const src     = options.src;
  const srcW    = options.width;
  const srcH    = options.height;
  const destW   = options.toWidth;
  const destH   = options.toHeight;
  const scaleX  = options.scaleX || options.toWidth / options.width;
  const scaleY  = options.scaleY || options.toHeight / options.height;
  const offsetX = options.offsetX || 0.0;
  const offsetY = options.offsetY || 0.0;
  const dest    = options.dest || new Uint8Array(destW * destH * 4);
  const quality = typeof options.quality === 'undefined' ? 3 : options.quality;
  const alpha   = options.alpha || false;

  if (!cache) cache = {};

  const fx_key = `filter_${quality}|${srcW}|${destW}|${scaleX}|${offsetX}`;
  const fy_key = `filter_${quality}|${srcH}|${destH}|${scaleY}|${offsetY}`;

  const filtersX = cache[fx_key] || createFilters(quality, srcW, destW, scaleX, offsetX),
        filtersY = cache[fy_key] || createFilters(quality, srcH, destH, scaleY, offsetY);

  //if (!cache[fx_key]) cache[fx_key] = filtersX;
  //if (!cache[fy_key]) cache[fy_key] = filtersY;

  const alloc_bytes = Math.max(src.byteLength, dest.byteLength) +
                    filtersX.byteLength +
                    filtersY.byteLength +
                    srcH * destW * 4; // Buffer between convolve passes

  const alloc_pages = Math.ceil(alloc_bytes / (64 * 1024));

  const wasm_imports = cache.wasm_imports || {
    env: {
      memory: new WebAssembly.Memory({ initial: alloc_pages })
      // emsdk requires more import vars
      /*memoryBase: 0,
      tableBase:  0,
      memory: new WebAssembly.Memory({
        // Compiled wasm has 256 min memory value limit.
        // Atempt to provide less memory size will cause linking error
        initial: Math.max(256, alloc_pages)
      }),
      table: new WebAssembly.Table({
        initial:100,
        element: 'anyfunc'
      })*/
    }
  };

  // Increase memory size if needed
  const memory    = wasm_imports.env.memory,
        mem_pages = memory.buffer.byteLength / (64 * 1024);

  if (alloc_pages > mem_pages) {
    // increase to delta + 1MB
    memory.grow(alloc_pages - mem_pages + 16);
  }

  const wasm_instance = cache.wasm_instance || new WebAssembly.Instance(this.__wasm_module, wasm_imports);

  if (!cache.wasm_imports)  cache.wasm_imports  = wasm_imports;
  if (!cache.wasm_instance) cache.wasm_instance = wasm_instance;

  //
  // Fill memory block with data to process
  //

  const mem   = new Uint8Array(wasm_imports.env.memory.buffer);
  const mem32 = new Uint32Array(wasm_imports.env.memory.buffer);

  // mem.set(src)
  // 32-bit copy is much faster in chrome
  const src32 = new Uint32Array(src.buffer);
  mem32.set(src32);

  // Place tmp buffer after src to have 4x byte align.
  // That doesn't seems to make sence but costs nothing.
  const tmp_offset = Math.max(src.byteLength, dest.byteLength);

  const filtersX_offset = tmp_offset + srcH * destW * 4;
  const filtersY_offset = filtersX_offset + filtersX.byteLength;

  // We should guarantee LE bytes order. Filters are not big, so
  // speed difference is not significant vs direct .set()
  copyInt16asLE(filtersX, mem, filtersX_offset);
  copyInt16asLE(filtersY, mem, filtersY_offset);

  //
  // Now call webassembly method
  //

  wasm_instance.exports.convolveHV(
  // emsdk does method names with '_'
  //wasm_instance.exports._convolveHV(
    filtersX_offset,
    filtersY_offset,
    tmp_offset,
    srcW, srcH, destW, destH
  );

  //
  // Copy data back to typed array
  //

  // 32-bit copy is much faster in chrome
  const dest32 = new Uint32Array(dest.buffer);
  dest32.set(mem32.subarray(0, dest32.length));

  // That's faster than doing checks in convolver.
  // !!! Note, canvas data is not premultipled. We don't need other
  // alpha corrections.

  if (!alpha) resetAlpha(dest, destW, destH);

  return dest;
};


module.exports = MathLib;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Resize convolvers, pure JS implementation
//



// Precision of fixed FP values
//var FIXED_FRAC_BITS = 14;


function clampTo8(i) { return i < 0 ? 0 : (i > 255 ? 255 : i); }


// Convolve image in horizontal directions and transpose output. In theory,
// transpose allow:
//
// - use the same convolver for both passes (this fails due different
//   types of input array and temporary buffer)
// - making vertical pass by horisonltal lines inprove CPU cache use.
//
// But in real life this doesn't work :)
//
function convolveHorizontally(src, dest, srcW, srcH, destW, filters) {

  var r, g, b, a;
  var filterPtr, filterShift, filterSize;
  var srcPtr, srcY, destX, filterVal;
  var srcOffset = 0, destOffset = 0;

  // For each row
  for (srcY = 0; srcY < srcH; srcY++) {
    filterPtr  = 0;

    // Apply precomputed filters to each destination row point
    for (destX = 0; destX < destW; destX++) {
      // Get the filter that determines the current output pixel.
      filterShift = filters[filterPtr++];
      filterSize  = filters[filterPtr++];

      srcPtr = (srcOffset + (filterShift * 4))|0;

      r = g = b = a = 0;

      // Apply the filter to the row to get the destination pixel r, g, b, a
      for (; filterSize > 0; filterSize--) {
        filterVal = filters[filterPtr++];

        // Use reverse order to workaround deopts in old v8 (node v.10)
        // Big thanks to @mraleph (Vyacheslav Egorov) for the tip.
        a = (a + filterVal * src[srcPtr + 3])|0;
        b = (b + filterVal * src[srcPtr + 2])|0;
        g = (g + filterVal * src[srcPtr + 1])|0;
        r = (r + filterVal * src[srcPtr])|0;
        srcPtr = (srcPtr + 4)|0;
      }

      // Bring this value back in range. All of the filter scaling factors
      // are in fixed point with FIXED_FRAC_BITS bits of fractional part.
      //
      // (!) Add 1/2 of value before clamping to get proper rounding. In other
      // case brightness loss will be noticeable if you resize image with white
      // border and place it on white background.
      //
      dest[destOffset + 3] = clampTo8((a + (1 << 13)) >> 14/*FIXED_FRAC_BITS*/);
      dest[destOffset + 2] = clampTo8((b + (1 << 13)) >> 14/*FIXED_FRAC_BITS*/);
      dest[destOffset + 1] = clampTo8((g + (1 << 13)) >> 14/*FIXED_FRAC_BITS*/);
      dest[destOffset]     = clampTo8((r + (1 << 13)) >> 14/*FIXED_FRAC_BITS*/);
      destOffset = (destOffset + srcH * 4)|0;
    }

    destOffset = ((srcY + 1) * 4)|0;
    srcOffset  = ((srcY + 1) * srcW * 4)|0;
  }
}

// Technically, convolvers are the same. But input array and temporary
// buffer can be of different type (especially, in old browsers). So,
// keep code in separate functions to avoid deoptimizations & speed loss.

function convolveVertically(src, dest, srcW, srcH, destW, filters) {

  var r, g, b, a;
  var filterPtr, filterShift, filterSize;
  var srcPtr, srcY, destX, filterVal;
  var srcOffset = 0, destOffset = 0;

  // For each row
  for (srcY = 0; srcY < srcH; srcY++) {
    filterPtr  = 0;

    // Apply precomputed filters to each destination row point
    for (destX = 0; destX < destW; destX++) {
      // Get the filter that determines the current output pixel.
      filterShift = filters[filterPtr++];
      filterSize  = filters[filterPtr++];

      srcPtr = (srcOffset + (filterShift * 4))|0;

      r = g = b = a = 0;

      // Apply the filter to the row to get the destination pixel r, g, b, a
      for (; filterSize > 0; filterSize--) {
        filterVal = filters[filterPtr++];

        // Use reverse order to workaround deopts in old v8 (node v.10)
        // Big thanks to @mraleph (Vyacheslav Egorov) for the tip.
        a = (a + filterVal * src[srcPtr + 3])|0;
        b = (b + filterVal * src[srcPtr + 2])|0;
        g = (g + filterVal * src[srcPtr + 1])|0;
        r = (r + filterVal * src[srcPtr])|0;
        srcPtr = (srcPtr + 4)|0;
      }

      // Bring this value back in range. All of the filter scaling factors
      // are in fixed point with FIXED_FRAC_BITS bits of fractional part.
      //
      // (!) Add 1/2 of value before clamping to get proper rounding. In other
      // case brightness loss will be noticeable if you resize image with white
      // border and place it on white background.
      //
      dest[destOffset + 3] = clampTo8((a + (1 << 13)) >> 14/*FIXED_FRAC_BITS*/);
      dest[destOffset + 2] = clampTo8((b + (1 << 13)) >> 14/*FIXED_FRAC_BITS*/);
      dest[destOffset + 1] = clampTo8((g + (1 << 13)) >> 14/*FIXED_FRAC_BITS*/);
      dest[destOffset]     = clampTo8((r + (1 << 13)) >> 14/*FIXED_FRAC_BITS*/);
      destOffset = (destOffset + srcH * 4)|0;
    }

    destOffset = ((srcY + 1) * 4)|0;
    srcOffset  = ((srcY + 1) * srcW * 4)|0;
  }
}


module.exports = {
  convolveHorizontally,
  convolveVertically
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Calculate convolution filters for each destination point,
// and pack data to Int16Array:
//
// [ shift, length, data..., shift2, length2, data..., ... ]
//
// - shift - offset in src image
// - length - filter length (in src points)
// - data - filter values sequence
//



var FILTER_INFO = __webpack_require__(11);

// Precision of fixed FP values
var FIXED_FRAC_BITS = 14;


function toFixedPoint(num) {
  return Math.round(num * ((1 << FIXED_FRAC_BITS) - 1));
}


module.exports = function resizeFilterGen(quality, srcSize, destSize, scale, offset) {

  var filterFunction = FILTER_INFO[quality].filter;

  var scaleInverted = 1.0 / scale;
  var scaleClamped  = Math.min(1.0, scale); // For upscale

  // Filter window (averaging interval), scaled to src image
  var srcWindow = FILTER_INFO[quality].win / scaleClamped;

  var destPixel, srcPixel, srcFirst, srcLast, filterElementSize,
      floatFilter, fxpFilter, total, pxl, idx, floatVal, filterTotal, filterVal;
  var leftNotEmpty, rightNotEmpty, filterShift, filterSize;

  var maxFilterElementSize = Math.floor((srcWindow + 1) * 2);
  var packedFilter    = new Int16Array((maxFilterElementSize + 2) * destSize);
  var packedFilterPtr = 0;

  var slowCopy = !packedFilter.subarray || !packedFilter.set;

  // For each destination pixel calculate source range and built filter values
  for (destPixel = 0; destPixel < destSize; destPixel++) {

    // Scaling should be done relative to central pixel point
    srcPixel = (destPixel + 0.5) * scaleInverted + offset;

    srcFirst = Math.max(0, Math.floor(srcPixel - srcWindow));
    srcLast  = Math.min(srcSize - 1, Math.ceil(srcPixel + srcWindow));

    filterElementSize = srcLast - srcFirst + 1;
    floatFilter = new Float32Array(filterElementSize);
    fxpFilter = new Int16Array(filterElementSize);

    total = 0.0;

    // Fill filter values for calculated range
    for (pxl = srcFirst, idx = 0; pxl <= srcLast; pxl++, idx++) {
      floatVal = filterFunction(((pxl + 0.5) - srcPixel) * scaleClamped);
      total += floatVal;
      floatFilter[idx] = floatVal;
    }

    // Normalize filter, convert to fixed point and accumulate conversion error
    filterTotal = 0;

    for (idx = 0; idx < floatFilter.length; idx++) {
      filterVal = floatFilter[idx] / total;
      filterTotal += filterVal;
      fxpFilter[idx] = toFixedPoint(filterVal);
    }

    // Compensate normalization error, to minimize brightness drift
    fxpFilter[destSize >> 1] += toFixedPoint(1.0 - filterTotal);

    //
    // Now pack filter to useable form
    //
    // 1. Trim heading and tailing zero values, and compensate shitf/length
    // 2. Put all to single array in this format:
    //
    //    [ pos shift, data length, value1, value2, value3, ... ]
    //

    leftNotEmpty = 0;
    while (leftNotEmpty < fxpFilter.length && fxpFilter[leftNotEmpty] === 0) {
      leftNotEmpty++;
    }

    if (leftNotEmpty < fxpFilter.length) {
      rightNotEmpty = fxpFilter.length - 1;
      while (rightNotEmpty > 0 && fxpFilter[rightNotEmpty] === 0) {
        rightNotEmpty--;
      }

      filterShift = srcFirst + leftNotEmpty;
      filterSize = rightNotEmpty - leftNotEmpty + 1;

      packedFilter[packedFilterPtr++] = filterShift; // shift
      packedFilter[packedFilterPtr++] = filterSize; // size

      if (!slowCopy) {
        packedFilter.set(fxpFilter.subarray(leftNotEmpty, rightNotEmpty + 1), packedFilterPtr);
        packedFilterPtr += filterSize;
      } else {
        // fallback for old IE < 11, without subarray/set methods
        for (idx = leftNotEmpty; idx <= rightNotEmpty; idx++) {
          packedFilter[packedFilterPtr++] = fxpFilter[idx];
        }
      }
    } else {
      // zero data, write header only
      packedFilter[packedFilterPtr++] = 0; // shift
      packedFilter[packedFilterPtr++] = 0; // size
    }
  }
  return packedFilter;
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



function objClass(obj) { return Object.prototype.toString.call(obj); }


module.exports.isCanvas = function isCanvas(element) {
  //return (element.nodeName && element.nodeName.toLowerCase() === 'canvas') ||
  let cname = objClass(element);

  return cname === '[object HTMLCanvasElement]'/* browser */ ||
         cname === '[object Canvas]'/* node-canvas */;
};


module.exports.isImage = function isImage(element) {
  //return element.nodeName && element.nodeName.toLowerCase() === 'img';
  return objClass(element) === '[object HTMLImageElement]';
};


module.exports.limiter = function limiter(concurrency) {
  let active = 0,
      queue  = [];

  function roll() {
    if (active < concurrency && queue.length) {
      active++;
      queue.shift()();
    }
  }

  return function limit(fn) {
    return new Promise((resolve, reject) => {
      queue.push(() => {
        fn().then(
          result => {
            resolve(result);
            active--;
            roll();
          },
          err => {
            reject(err);
            active--;
            roll();
          }
        );
      });

      roll();
    });
  };
};


module.exports.cib_quality_name = function cib_quality_name(num) {
  switch (num) {
    case 0: return 'pixelated';
    case 1: return 'low';
    case 2: return 'medium';
  }
  return 'high';
};


module.exports.cib_support = function cib_support() {
  return Promise.resolve().then(() => {
    if (typeof createImageBitmap === 'undefined' ||
        typeof document === 'undefined') {
      return false;
    }

    let c = document.createElement('canvas');
    c.width = 100;
    c.height = 100;

    return createImageBitmap(c, 0, 0, 100, 100, {
      resizeWidth: 10,
      resizeHeight: 10,
      resizeQuality: 'high'
    })
    .then(bitmap => {
      let status = (bitmap.width === 10);
      bitmap.close();
      c = null;
      return status;
    });
  })
  .catch(() => false);
};


// [ 64, 65, 66 ] -> [ padding, CR, LF ]
var BASE64_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r';

module.exports.base64decode = function base64decode(str) {
  const input = str.replace(/[\r\n=]/g, ''), // remove CR/LF & padding to simplify scan
        max   = input.length;
  const result = [];

  // Collect by 6*4 bits (3 bytes)

  let bits  = 0;

  for (let idx = 0; idx < max; idx++) {
    if ((idx % 4 === 0) && idx) {
      result.push((bits >> 16) & 0xFF);
      result.push((bits >> 8) & 0xFF);
      result.push(bits & 0xFF);
    }

    bits = (bits << 6) | BASE64_MAP.indexOf(input.charAt(idx));
  }

  // Dump tail

  let tailbits = (max % 4) * 6;

  if (tailbits === 0) {
    result.push((bits >> 16) & 0xFF);
    result.push((bits >> 8) & 0xFF);
    result.push(bits & 0xFF);
  } else if (tailbits === 18) {
    result.push((bits >> 10) & 0xFF);
    result.push((bits >> 2) & 0xFF);
  } else if (tailbits === 12) {
    result.push((bits >> 4) & 0xFF);
  }

  return new Uint8Array(result);
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

var bundleFn = arguments[3];
var sources = arguments[4];
var cache = arguments[5];

var stringify = JSON.stringify;

module.exports = function (fn, options) {
    var wkey;
    var cacheKeys = Object.keys(cache);

    for (var i = 0, l = cacheKeys.length; i < l; i++) {
        var key = cacheKeys[i];
        var exp = cache[key].exports;
        // Using babel as a transpiler to use esmodule, the export will always
        // be an object with the default export as a property of it. To ensure
        // the existing api and babel esmodule exports are both supported we
        // check for both
        if (exp === fn || exp && exp.default === fn) {
            wkey = key;
            break;
        }
    }

    if (!wkey) {
        wkey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
        var wcache = {};
        for (var i = 0, l = cacheKeys.length; i < l; i++) {
            var key = cacheKeys[i];
            wcache[key] = key;
        }
        sources[wkey] = [
            Function(['require','module','exports'], '(' + fn + ')(self)'),
            wcache
        ];
    }
    var skey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);

    var scache = {}; scache[wkey] = wkey;
    sources[skey] = [
        Function(['require'], (
            // try to call default if defined to also support babel esmodule
            // exports
            'var f = require(' + stringify(wkey) + ');' +
            '(f.default ? f.default : f)(self);'
        )),
        scache
    ];

    var workerSources = {};
    resolveSources(skey);

    function resolveSources(key) {
        workerSources[key] = true;

        for (var depPath in sources[key][1]) {
            var depKey = sources[key][1][depPath];
            if (!workerSources[depKey]) {
                resolveSources(depKey);
            }
        }
    }

    var src = '(' + bundleFn + ')({'
        + Object.keys(workerSources).map(function (key) {
            return stringify(key) + ':['
                + sources[key][0]
                + ',' + stringify(sources[key][1]) + ']'
            ;
        }).join(',')
        + '},{},[' + stringify(skey) + '])'
    ;

    var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

    var blob = new Blob([src], { type: 'text/javascript' });
    if (options && options.bare) { return blob; }
    var workerUrl = URL.createObjectURL(blob);
    var worker = new Worker(workerUrl);
    worker.objectURL = workerUrl;
    return worker;
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearPlatforms = exports.generatePlatforms = exports.move = exports.init = exports.platforms = undefined;

var _obstacle = __webpack_require__(18);

var Obstacle = _interopRequireWildcard(_obstacle);

var _powerup = __webpack_require__(19);

var PowerCube = _interopRequireWildcard(_powerup);

var _platformArrays = __webpack_require__(21);

var PlatformArrays = _interopRequireWildcard(_platformArrays);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var platforms = exports.platforms = PlatformArrays.initialPlatforms;

var init = exports.init = function init(context) {

  if (platforms.length === 4) {
    exports.platforms = platforms = PlatformArrays.initialPlatforms;
  }

  Obstacle.clearObstacles();
  PowerCube.clearpowercubes();
  context.fillStyle = "darkgray";

  for (var i = 0; i < platforms.length; i++) {
    context.strokeStyle = "#01a502";
    context.lineWidth = 5;
    context.strokeRect(platforms[i].x, platforms[i].y, 800, 50);
    platforms[i].obstacles = Obstacle.init(context, platforms[i]);
    platforms[i].powercuber = PowerCube.init(context, platforms[i]);
  }

  return platforms;
};

var move = exports.move = function move(context) {
  for (var i = 0; i < platforms.length; i++) {
    // context.fillStyle = "darkgray"
    // context.fillRect(platforms[i].x,platforms[i].y,800,50)
    context.strokeStyle = "#01a502";
    context.lineWidth = 3;
    context.strokeRect(platforms[i].x, platforms[i].y, 800, 50);
    platforms[i].x -= platforms[i].speed;
    platforms[i].obstacles = Obstacle.move(context, platforms[i], i, platforms[i].popped);
    platforms[i].powercubes = PowerCube.move(context, platforms[i], i, platforms[i].popped);
  }

  return platforms;
};

var generatePlatforms = exports.generatePlatforms = function generatePlatforms(context) {
  var endoflast = platforms[platforms.length - 1].x + 800;
  var newplatforms = [platforms[platforms.length - 3], platforms[platforms.length - 2], platforms[platforms.length - 1]].concat(PlatformArrays.platformGenerator(endoflast));
  exports.platforms = platforms = newplatforms;
  for (var i = 0; i < platforms.length; i++) {
    platforms[i].obstacles = Obstacle.init(context, platforms[i]);
    platforms[i].powercubes = PowerCube.init(context, platforms[i]);
  }

  init(context);
  return platforms;
};

var clearPlatforms = exports.clearPlatforms = function clearPlatforms() {
  exports.platforms = platforms = [];
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var player = exports.player = { x: 400, y: 0, jumping: true, direction: null, token: "start", doublejumping: false, falling: false };
var vehicleimg = exports.vehicleimg = new Image();
vehicleimg.src = "assets/images/vehicle.png";
var platform;
var doublejumpstart;
var doublejumped = false;
var falljumpstart;
var startpos;

var resetVehicle = exports.resetVehicle = function resetVehicle() {
  exports.player = player = {};
  return player;
};

var init = exports.init = function init(context) {

  exports.player = player = { x: 400, y: 0, jumping: true, direction: null, token: "start", doublejumping: false, falling: false };
  context.drawImage(vehicleimg, player.x, player.y, 60, 30);

  return player;
};

var move = exports.move = function move(plat, token) {

  if (player.token === "start") {
    startpos = plat.y - 20;
    player.jumping = false;
  } else if (token === "falling") {
    player.token = "falling";
  } else {
    player.token = null;
  }

  platform = plat;
  var canvas = $("canvas")[0];
  var context = canvas.getContext("2d");

  if (startpos && player.y === startpos) {
    player.token = null;
    startpos = null;
    doublejumped = false;
    doublejumpstart = null;
    player.token = null;
    falljumpstart = null;
  } else if (startpos && player.y < startpos) {
    player.y += 5;
  } else if (player.y < doublejumpstart - 70 && player.doublejumping === true) {
    player.doublejumping = false;
    player.jumping = false;
    player.y += 5;
  } else if (player.y <= doublejumpstart && player.doublejumping === true) {
    player.y -= 5;
  } else if (player.y < doublejumpstart && player.doublejumping === false) {
    player.y += 5;
  } else if (player.token === "falling" && player.jumping === false) {
    player.y += 5;
  } else if (falljumpstart && player.jumping === true && player.y > falljumpstart - 70) {
    player.y -= 5;
  } else if (falljumpstart && player.jumping === true && player.y === falljumpstart - 70) {
    // player.jumping = false
    falljumpstart = null;
  } else if (player.y <= platform.y - 90 && player.jumping === true) {
    player.y -= 5;
    player.jumping = false;
  } else if (player.y < platform.y - 20 && player.jumping === false) {
    player.y += 5;
  } else if (player.y === platform.y - 20 && player.jumping === false) {
    doublejumped = false;
    doublejumpstart = null;
    player.token = null;
    falljumpstart = null;
  } else if (player.y <= platform.y - 20 && player.jumping === true) {
    player.y -= 5;
  } else if (player.y > platform.y - 20 && player.jumping === false) {
    player.token = "falling";
  } else if (player.y > platform.y - 20 && player.jumping === true) {
    player.y -= 5;
  }

  context.drawImage(vehicleimg, player.x, player.y, 60, 30);

  return player;
};

$(window).keypress(function (e) {

  if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && player.token === "start") {
    e.preventDefault();
    player.jumping = false;
  } else if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && player.token === "falling" && player.jumping === false) {
    e.preventDefault();
    player.jumping = true;
    falljumpstart = player.y;
  } else if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && player.token === "falling" && player.jumping === true && doublejumped === false) {
    e.preventDefault();
    player.doublejumping = true;
    doublejumped = true;
    doublejumpstart = player.y;
  } else if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && player.y === platform.y - 20) {
    e.preventDefault();
    player.jumping = true;
  } else if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && doublejumped === false) {
    e.preventDefault();
    player.doublejumping = true;
    doublejumped = true;
    doublejumpstart = player.y;
  }
});

$(window).keyup(function (e) {
  e.preventDefault();
  player.direction = null;
});

/***/ }),
/* 7 */
/***/ (function(module, exports) {

// Calculate Gaussian blur of an image using IIR filter
// The method is taken from Intel's white paper and code example attached to it:
// https://software.intel.com/en-us/articles/iir-gaussian-blur-filter
// -implementation-using-intel-advanced-vector-extensions

var a0, a1, a2, a3, b1, b2, left_corner, right_corner;

function gaussCoef(sigma) {
  if (sigma < 0.5) {
    sigma = 0.5;
  }

  var a = Math.exp(0.726 * 0.726) / sigma,
      g1 = Math.exp(-a),
      g2 = Math.exp(-2 * a),
      k = (1 - g1) * (1 - g1) / (1 + 2 * a * g1 - g2);

  a0 = k;
  a1 = k * (a - 1) * g1;
  a2 = k * (a + 1) * g1;
  a3 = -k * g2;
  b1 = 2 * g1;
  b2 = -g2;
  left_corner = (a0 + a1) / (1 - b1 - b2);
  right_corner = (a2 + a3) / (1 - b1 - b2);

  // Attempt to force type to FP32.
  return new Float32Array([ a0, a1, a2, a3, b1, b2, left_corner, right_corner ]);
}

function convolveMono16(src, out, line, coeff, width, height) {
  // takes src image and writes the blurred and transposed result into out

  var prev_src, curr_src, curr_out, prev_out, prev_prev_out;
  var src_index, out_index, line_index;
  var i, j;
  var coeff_a0, coeff_a1, coeff_b1, coeff_b2;

  for (i = 0; i < height; i++) {
    src_index = i * width;
    out_index = i;
    line_index = 0;

    // left to right
    prev_src = src[src_index];
    prev_prev_out = prev_src * coeff[6];
    prev_out = prev_prev_out;

    coeff_a0 = coeff[0];
    coeff_a1 = coeff[1];
    coeff_b1 = coeff[4];
    coeff_b2 = coeff[5];

    for (j = 0; j < width; j++) {
      curr_src = src[src_index];

      curr_out = curr_src * coeff_a0 +
                 prev_src * coeff_a1 +
                 prev_out * coeff_b1 +
                 prev_prev_out * coeff_b2;

      prev_prev_out = prev_out;
      prev_out = curr_out;
      prev_src = curr_src;

      line[line_index] = prev_out;
      line_index++;
      src_index++;
    }

    src_index--;
    line_index--;
    out_index += height * (width - 1);

    // right to left
    prev_src = src[src_index];
    prev_prev_out = prev_src * coeff[7];
    prev_out = prev_prev_out;
    curr_src = prev_src;

    coeff_a0 = coeff[2];
    coeff_a1 = coeff[3];

    for (j = width - 1; j >= 0; j--) {
      curr_out = curr_src * coeff_a0 +
                 prev_src * coeff_a1 +
                 prev_out * coeff_b1 +
                 prev_prev_out * coeff_b2;

      prev_prev_out = prev_out;
      prev_out = curr_out;

      prev_src = curr_src;
      curr_src = src[src_index];

      out[out_index] = line[line_index] + prev_out;

      src_index--;
      line_index--;
      out_index -= height;
    }
  }
}


function blurMono16(src, width, height, radius) {
  // Quick exit on zero radius
  if (!radius) { return; }

  var out      = new Uint16Array(src.length),
      tmp_line = new Float32Array(Math.max(width, height));

  var coeff = gaussCoef(radius);

  convolveMono16(src, out, tmp_line, coeff, width, height, radius);
  convolveMono16(out, src, tmp_line, coeff, height, width, radius);
}

module.exports = blurMono16;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const assign        = __webpack_require__(8);
const webworkify    = __webpack_require__(4);


const MathLib       = __webpack_require__(0);
const Pool          = __webpack_require__(15);
const utils         = __webpack_require__(3);
const worker        = __webpack_require__(17);
const createRegions = __webpack_require__(16);


// Deduplicate pools & limiters with the same configs
// when user creates multiple pica instances.
const singletones = {};


let NEED_SAFARI_FIX = false;
try {
  if (typeof navigator !== 'undefined' && navigator.userAgent) {
    NEED_SAFARI_FIX = navigator.userAgent.indexOf('Safari') >= 0;
  }
} catch (e) {}


let concurrency = 1;
if (typeof navigator !== 'undefined') {
  concurrency = Math.min(navigator.hardwareConcurrency || 1, 4);
}


const DEFAULT_PICA_OPTS = {
  tile: 1024,
  concurrency,
  features: [ 'js', 'wasm', 'ww' ],
  idle: 2000
};


const DEFAULT_RESIZE_OPTS = {
  quality:          3,
  alpha:            false,
  unsharpAmount:    0,
  unsharpRadius:    0.0,
  unsharpThreshold: 0
};

let CAN_NEW_IMAGE_DATA;


function workerFabric() {
  return {
    value: webworkify(worker),
    destroy: function () {
      this.value.terminate();

      if (typeof window !== 'undefined') {
        let url = window.URL || window.webkitURL || window.mozURL || window.msURL;
        if (url && url.revokeObjectURL && this.value.objectURL) {
          url.revokeObjectURL(this.value.objectURL);
        }
      }
    }
  };
}


////////////////////////////////////////////////////////////////////////////////
// API methods

function Pica(options) {
  if (!(this instanceof Pica)) return new Pica(options);

  this.options = assign(DEFAULT_PICA_OPTS, options || {});

  let limiter_key = `lk_${this.options.concurrency}`;

  // Share limiters to avoid multiple parallel workers when user creates
  // multiple pica instances.
  this.__limit = singletones[limiter_key] || utils.limiter(this.options.concurrency);

  if (!singletones[limiter_key]) singletones[limiter_key] = this.__limit;

  // List of supported features, according to options & browser/node.js
  this.features = {
    js:   false, // pure JS implementation, can be disabled for testing
    wasm: false, // webassembly implementation for heavy functions
    cib:  false, // resize via createImageBitmap (only FF at this moment)
    ww:   false  // webworkers
  };

  this.__workersPool = null;

  // Store requested features for webworkers
  this.__requested_features = [];

  this.__mathlib = null;
}


Pica.prototype.init = function () {
  if (this.__initPromise) return this.__initPromise;

  // Test if we can create ImageData without canvas and memory copy
  if (CAN_NEW_IMAGE_DATA !== false && CAN_NEW_IMAGE_DATA !== true) {
    CAN_NEW_IMAGE_DATA = false;
    if (typeof ImageData !== 'undefined' && typeof Uint8ClampedArray !== 'undefined') {
      try {
        /* eslint-disable no-new */
        new ImageData(new Uint8ClampedArray(400), 10, 10);
        CAN_NEW_IMAGE_DATA = true;
      } catch (__) {}
    }
  }


  let features = this.options.features.slice();

  if (features.indexOf('all') >= 0) {
    features = [ 'cib', 'wasm', 'js', 'ww' ];
  }

  this.__requested_features = features;

  this.__mathlib = new MathLib(features);

  // Check WebWorker support if requested
  if (features.indexOf('ww') >= 0) {
    if ((typeof window !== 'undefined') && ('Worker' in window)) {
      // IE <= 11 don't allow to create webworkers from string. We should check it.
      // https://connect.microsoft.com/IE/feedback/details/801810/web-workers-from-blob-urls-in-ie-10-and-11
      try {
        let wkr = __webpack_require__(4)(function () {});
        wkr.terminate();
        this.features.ww   = true;

        // pool uniqueness depends on pool config + webworker config
        let wpool_key = `wp_${JSON.stringify(this.options)}`;

        if (singletones[wpool_key]) {
          this.__workersPool = singletones[wpool_key];
        } else {
          this.__workersPool = new Pool(workerFabric, this.options.idle);
          singletones[wpool_key] = this.__workersPool;
        }
      } catch (__) {}
    }
  }

  let initMath = this.__mathlib.init().then(mathlib => {
    // Copy detected features
    assign(this.features, mathlib.features);
  });

  let checkCib = utils.cib_support().then(status => {
    if (this.features.cib && features.indexOf('cib') < 0) {
      this.debug('createImageBitmap() resize supported, but disabled by config');
      return;
    }

    if (features.indexOf('cib') >= 0) this.features.cib = status;
  });

  // Init math lib. That's async because can load some
  this.__initPromise = Promise.all([ initMath, checkCib ]).then(() => this);

  return this.__initPromise;
};


Pica.prototype.resize = function (from, to, options) {
  this.debug('Start resize...');


  let opts = DEFAULT_RESIZE_OPTS;

  if (!isNaN(options)) {
    opts = assign(opts, { quality: options });
  } else if (options) {
    opts = assign(opts, options);
  }

  opts.toWidth  = to.width;
  opts.toHeigth = to.height;
  opts.width    = from.naturalWidth || from.width;
  opts.height   = from.naturalHeight || from.height;

  let canceled    = false;
  let cancelToken = null;

  if (opts.cancelToken) {
    // Wrap cancelToken to avoid successive resolve & set flag
    cancelToken = opts.cancelToken.then(
      data => { canceled = true; throw data; },
      err  => { canceled = true; throw err; }
    );
  }

  let toCtx = to.getContext('2d', { alpha: Boolean(opts.alpha) });

  return this.init().then(() => {
    if (canceled) return cancelToken;

    // if createImageBitmap supports resize, just do it and return
    if (this.features.cib) {
      this.debug('Resize via createImageBitmap()');

      return createImageBitmap(from, {
        resizeWidth:   opts.toWidth,
        resizeHeight:  opts.toHeigth,
        resizeQuality: utils.cib_quality_name(opts.quality)
      })
      .then(imageBitmap => {
        if (canceled) return cancelToken;

        // if no unsharp - draw directly to output canvas
        if (!opts.unsharpAmount) {
          toCtx.drawImage(imageBitmap, 0, 0);
          imageBitmap.close();
          toCtx = null;

          this.debug('Finished!');

          return to;
        }

        this.debug('Unsharp result');

        let tmpCanvas = document.createElement('canvas');

        tmpCanvas.width  = opts.toWidth;
        tmpCanvas.height = opts.toHeigth;

        let tmpCtx = tmpCanvas.getContext('2d', { alpha: Boolean(opts.alpha) });

        tmpCtx.drawImage(imageBitmap, 0, 0);
        imageBitmap.close();

        let iData = tmpCtx.getImageData(0, 0, opts.toWidth, opts.toHeigth);

        this.__mathlib.unsharp(
          iData.data,
          opts.toWidth,
          opts.toHeigth,
          opts.unsharpAmount,
          opts.unsharpRadius,
          opts.unsharpThreshold
        );

        toCtx.putImageData(iData, 0, 0);
        iData = tmpCtx = tmpCanvas = toCtx = null;

        this.debug('Finished!');

        return to;
      });
    }

    //
    // No easy way, let's resize manually via arrays
    //

    let srcCtx;
    let srcImageBitmap;

    // Share cache between calls:
    //
    // - wasm instance
    // - wasm memory object
    //
    let cache = {};

    // Call resizer in webworker or locally, depending on config
    const invokeResize = opts => {
      return Promise.resolve().then(() => {
        if (!this.features.ww) return this.__mathlib.resizeAndUnsharp(opts, cache);

        return new Promise((resolve, reject) => {
          let w = this.__workersPool.acquire();

          if (cancelToken) cancelToken.catch(err => reject(err));

          w.value.onmessage = ev => {
            w.release();

            if (ev.data.err) reject(ev.data.err);
            else resolve(ev.data.result);
          };

          w.value.postMessage({
            opts,
            features: this.__requested_features,
            preload: {
              wasm_nodule: this.__mathlib.__
            }
          }, [ opts.src.buffer ]);
        });
      });
    };


    const processTile = (tile => this.__limit(() => {
      if (canceled) return cancelToken;

      let srcImageData;

      // Extract tile RGBA buffer, depending on input type
      if (utils.isCanvas(from)) {
        this.debug('Get tile pixel data');

        // If input is Canvas - extract region data directly
        srcImageData = srcCtx.getImageData(tile.x, tile.y, tile.width, tile.height);
      } else {
        // If input is Image or decoded to ImageBitmap,
        // draw region to temporary canvas and extract data from it
        //
        // Note! Attempt to reuse this canvas causes significant slowdown in chrome
        //
        this.debug('Draw tile imageBitmap/image to temporary canvas');

        let tmpCanvas = document.createElement('canvas');
        tmpCanvas.width  = tile.width;
        tmpCanvas.height = tile.height;

        let tmpCtx = tmpCanvas.getContext('2d', { alpha: Boolean(opts.alpha) });
        tmpCtx.globalCompositeOperation = 'copy';
        tmpCtx.drawImage(srcImageBitmap || from,
          tile.x, tile.y, tile.width, tile.height,
          0, 0, tile.width, tile.height);

        this.debug('Get tile pixel data');

        srcImageData = tmpCtx.getImageData(0, 0, tile.width, tile.height);
        tmpCtx = tmpCanvas = null;
      }

      let o = {
        src:              srcImageData.data,
        width:            tile.width,
        height:           tile.height,
        toWidth:          tile.toWidth,
        toHeight:         tile.toHeight,
        scaleX:           tile.scaleX,
        scaleY:           tile.scaleY,
        offsetX:          tile.offsetX,
        offsetY:          tile.offsetY,
        quality:          opts.quality,
        alpha:            opts.alpha,
        unsharpAmount:    opts.unsharpAmount,
        unsharpRadius:    opts.unsharpRadius,
        unsharpThreshold: opts.unsharpThreshold
      };

      this.debug('Invoke resize math');

      return Promise.resolve()
        .then(() => invokeResize(o))
        .then(result => {
          if (canceled) return cancelToken;

          srcImageData = null;

          let toImageData;

          this.debug('Convert raw rgba tile result to ImageData');

          if (CAN_NEW_IMAGE_DATA) {
            // this branch is for modern browsers
            // If `new ImageData()` & Uint8ClampedArray suported
            toImageData = new ImageData(new Uint8ClampedArray(result), tile.toWidth, tile.toHeight);
          } else {
            // fallback for `node-canvas` and old browsers
            // (IE11 has ImageData but does not support `new ImageData()`)
            toImageData = toCtx.createImageData(tile.toWidth, tile.toHeight);

            if (toImageData.data.set) {
              toImageData.data.set(result);
            } else {
              // IE9 don't have `.set()`
              for (let i = toImageData.data.length - 1; i >= 0; i--) {
                toImageData.data[i] = result[i];
              }
            }
          }

          this.debug('Draw tile');

          if (NEED_SAFARI_FIX) {
            // Safari draws thin white stripes between tiles without this fix
            toCtx.putImageData(toImageData, tile.toX, tile.toY,
              tile.toInnerX - tile.toX, tile.toInnerY - tile.toY,
              tile.toInnerWidth + 1e-5, tile.toInnerHeight + 1e-5);
          } else {
            toCtx.putImageData(toImageData, tile.toX, tile.toY,
              tile.toInnerX - tile.toX, tile.toInnerY - tile.toY,
              tile.toInnerWidth, tile.toInnerHeight);
          }

          return null;
        });
    }));


    // Need normalize data source first. It can be canvas or image.
    // If image - try to decode in background if possible
    return Promise.resolve().then(() => {
      if (utils.isCanvas(from)) {
        srcCtx = from.getContext('2d', { alpha: Boolean(opts.alpha) });
        return null;
      }

      if (utils.isImage(from)) {
        // try do decode image in background for faster next operations
        if (typeof createImageBitmap === 'undefined') return null;

        this.debug('Decode image via createImageBitmap');

        return createImageBitmap(from)
          .then(imageBitmap => {
            srcImageBitmap = imageBitmap;
          });
      }

      throw new Error('".from" should be image or canvas');
    })
    .then(() => {
      if (canceled) return cancelToken;

      this.debug('Calculate tiles');

      //
      // Here we are with "normalized" source,
      // follow to tiling
      //

      let DEST_TILE_BORDER = 3; // Max possible filter window size

      let regions = createRegions({
        width:        opts.width,
        height:       opts.height,
        srcTileSize:  this.options.tile,
        toWidth:      opts.toWidth,
        toHeight:     opts.toHeigth,
        destTileBorder: Math.ceil(Math.max(DEST_TILE_BORDER, 2.5 * opts.unsharpRadius|0))
      });

      let jobs = regions.map(tile => processTile(tile));

      function cleanup() {
        if (srcImageBitmap) {
          srcImageBitmap.close();
          srcImageBitmap = null;
        }
      }

      this.debug('Process tiles');

      return Promise.all(jobs).then(
        () =>  {
          this.debug('Finished!');
          cleanup(); return to;
        },
        err => { cleanup(); throw err; }
      );
    });
  });
};

// RGBA buffer resize
//
Pica.prototype.resizeBuffer = function (options) {
  const opts = assign(DEFAULT_RESIZE_OPTS, options);

  return this.init()
    .then(() => this.__mathlib.resizeAndUnsharp(opts));
};


Pica.prototype.toBlob = function (canvas, mimeType, quality) {
  mimeType = mimeType || 'image/png';

  return new Promise(resolve => {
    if (canvas.toBlob) {
      canvas.toBlob(blob => resolve(blob), mimeType, quality);
      return;
    }

    // Fallback for old browsers
    const asString = atob(canvas.toDataURL(mimeType, quality).split(',')[1]);
    const len      = asString.length;
    const asBuffer = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      asBuffer[i] = asString.charCodeAt(i);
    }

    resolve(new Blob([ asBuffer ], { type: mimeType }));
  });
};


Pica.prototype.debug = function () {};


module.exports = Pica;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Calculates 16-bit precision lightness from 8-bit rgba buffer
//



module.exports = function lightness16_js(img, width, height) {
  var size = width * height;
  var out = new Uint16Array(size);
  var r, g, b, min, max;
  for (var i = 0; i < size; i++) {
    r = img[4 * i];
    g = img[4 * i + 1];
    b = img[4 * i + 2];
    max = (r >= g && r >= b) ? r : (g >= b && g >= r) ? g : b;
    min = (r <= g && r <= b) ? r : (g <= b && g <= r) ? g : b;
    out[i] = (max + min) * 257 >> 1;
  }
  return out;
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Filter definitions to build tables for
// resizing convolvers.
//
// Presets for quality 0..3. Filter functions + window size
//



module.exports = [
  { // Nearest neibor (Box)
    win: 0.5,
    filter: function (x) {
      return (x >= -0.5 && x < 0.5) ? 1.0 : 0.0;
    }
  },
  { // Hamming
    win: 1.0,
    filter: function (x) {
      if (x <= -1.0 || x >= 1.0) { return 0.0; }
      if (x > -1.19209290E-07 && x < 1.19209290E-07) { return 1.0; }
      var xpi = x * Math.PI;
      return ((Math.sin(xpi) / xpi) *  (0.54 + 0.46 * Math.cos(xpi / 1.0)));
    }
  },
  { // Lanczos, win = 2
    win: 2.0,
    filter: function (x) {
      if (x <= -2.0 || x >= 2.0) { return 0.0; }
      if (x > -1.19209290E-07 && x < 1.19209290E-07) { return 1.0; }
      var xpi = x * Math.PI;
      return (Math.sin(xpi) / xpi) * Math.sin(xpi / 2.0) / (xpi / 2.0);
    }
  },
  { // Lanczos, win = 3
    win: 3.0,
    filter: function (x) {
      if (x <= -3.0 || x >= 3.0) { return 0.0; }
      if (x > -1.19209290E-07 && x < 1.19209290E-07) { return 1.0; }
      var xpi = x * Math.PI;
      return (Math.sin(xpi) / xpi) * Math.sin(xpi / 3.0) / (xpi / 3.0);
    }
  }
];


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const createFilters        = __webpack_require__(2);
const convolveHorizontally = __webpack_require__(1).convolveHorizontally;
const convolveVertically   = __webpack_require__(1).convolveVertically;


function resetAlpha(dst, width, height) {
  let ptr = 3, len = (width * height * 4)|0;
  while (ptr < len) { dst[ptr] = 0xFF; ptr = (ptr + 4)|0; }
}


function resize(options, cache) {
  const src   = options.src;
  const srcW  = options.width;
  const srcH  = options.height;
  const destW = options.toWidth;
  const destH = options.toHeight;
  const scaleX = options.scaleX || options.toWidth / options.width;
  const scaleY = options.scaleY || options.toHeight / options.height;
  const offsetX = options.offsetX || 0;
  const offsetY = options.offsetY || 0;
  const dest  = options.dest || new Uint8Array(destW * destH * 4);
  const quality = typeof options.quality === 'undefined' ? 3 : options.quality;
  const alpha = options.alpha || false;

  if (srcW < 1 || srcH < 1 || destW < 1 || destH < 1) { return []; }

  if (!cache) cache = {};

  const fx_key = `filter_${quality}|${srcW}|${destW}|${scaleX}|${offsetX}`;
  const fy_key = `filter_${quality}|${srcH}|${destH}|${scaleY}|${offsetY}`;

  const filtersX = cache[fx_key] || createFilters(quality, srcW, destW, scaleX, offsetX),
        filtersY = cache[fy_key] || createFilters(quality, srcH, destH, scaleY, offsetY);

  //if (!cache[fx_key]) cache[fx_key] = filtersX;
  //if (!cache[fy_key]) cache[fy_key] = filtersY;

  const tmp  = new Uint8Array(destW * srcH * 4);

  // To use single function we need src & tmp of the same type.
  // But src can be CanvasPixelArray, and tmp - Uint8Array. So, keep
  // vertical and horizontal passes separately to avoid deoptimization.

  convolveHorizontally(src, tmp, srcW, srcH, destW, filtersX);
  convolveVertically(tmp, dest, srcH, destW, destH, filtersY);

  // That's faster than doing checks in convolver.
  // !!! Note, canvas data is not premultipled. We don't need other
  // alpha corrections.

  if (!alpha) resetAlpha(dest, destW, destH);

  return dest;
}


module.exports = resize;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Unsharp mask filter
//
// http://stackoverflow.com/a/23322820/1031804
// USM(O) = O + (2 * (Amount / 100) * (O - GB))
// GB - gaussian blur.
//
// Image is converted from RGB to HSL, unsharp mask is applied to the
// lightness channel and then image is converted back to RGB.
//



var glurMono16   = __webpack_require__(7);
var getLightness = __webpack_require__(10);


module.exports = function unsharp(img, width, height, amount, radius, threshold) {
  var r, g, b;
  var h, s, l;
  var min, max;
  var m1, m2, hShifted;
  var diff, iTimes4;

  if (amount === 0 || radius < 0.5) {
    return;
  }
  if (radius > 2.0) {
    radius = 2.0;
  }

  var lightness = getLightness(img, width, height);

  var blured = new Uint16Array(lightness); // copy, because blur modify src

  glurMono16(blured, width, height, radius);

  var amountFp = (amount / 100 * 0x1000 + 0.5)|0;
  var thresholdFp = (threshold * 257)|0;

  var size = width * height;

  for (var i = 0; i < size; i++) {
    diff = 2 * (lightness[i] - blured[i]);

    if (Math.abs(diff) >= thresholdFp) {
      iTimes4 = i * 4;
      r = img[iTimes4];
      g = img[iTimes4 + 1];
      b = img[iTimes4 + 2];

      // convert RGB to HSL
      // take RGB, 8-bit unsigned integer per each channel
      // save HSL, H and L are 16-bit unsigned integers, S is 12-bit unsigned integer
      // math is taken from here: http://www.easyrgb.com/index.php?X=MATH&H=18
      // and adopted to be integer (fixed point in fact) for sake of performance
      max = (r >= g && r >= b) ? r : (g >= r && g >= b) ? g : b; // min and max are in [0..0xff]
      min = (r <= g && r <= b) ? r : (g <= r && g <= b) ? g : b;
      l = (max + min) * 257 >> 1; // l is in [0..0xffff] that is caused by multiplication by 257

      if (min === max) {
        h = s = 0;
      } else {
        s = (l <= 0x7fff) ?
          (((max - min) * 0xfff) / (max + min))|0 :
          (((max - min) * 0xfff) / (2 * 0xff - max - min))|0; // s is in [0..0xfff]
        // h could be less 0, it will be fixed in backward conversion to RGB, |h| <= 0xffff / 6
        h = (r === max) ? (((g - b) * 0xffff) / (6 * (max - min)))|0
          : (g === max) ? 0x5555 + ((((b - r) * 0xffff) / (6 * (max - min)))|0) // 0x5555 == 0xffff / 3
          : 0xaaaa + ((((r - g) * 0xffff) / (6 * (max - min)))|0); // 0xaaaa == 0xffff * 2 / 3
      }

      // add unsharp mask mask to the lightness channel
      l += (amountFp * diff + 0x800) >> 12;
      if (l > 0xffff) {
        l = 0xffff;
      } else if (l < 0) {
        l = 0;
      }

      // convert HSL back to RGB
      // for information about math look above
      if (s === 0) {
        r = g = b = l >> 8;
      } else {
        m2 = (l <= 0x7fff) ? (l * (0x1000 + s) + 0x800) >> 12 :
          l  + (((0xffff - l) * s + 0x800) >>  12);
        m1 = 2 * l - m2 >> 8;
        m2 >>= 8;
        // save result to RGB channels
        // R channel
        hShifted = (h + 0x5555) & 0xffff; // 0x5555 == 0xffff / 3
        r = (hShifted >= 0xaaaa) ? m1 // 0xaaaa == 0xffff * 2 / 3
          : (hShifted >= 0x7fff) ?  m1 + ((m2 - m1) * 6 * (0xaaaa - hShifted) + 0x8000 >> 16)
          : (hShifted >= 0x2aaa) ? m2 // 0x2aaa == 0xffff / 6
          : m1 + ((m2 - m1) * 6 * hShifted + 0x8000 >> 16);
        // G channel
        hShifted = h & 0xffff;
        g = (hShifted >= 0xaaaa) ? m1 // 0xaaaa == 0xffff * 2 / 3
          : (hShifted >= 0x7fff) ?  m1 + ((m2 - m1) * 6 * (0xaaaa - hShifted) + 0x8000 >> 16)
          : (hShifted >= 0x2aaa) ? m2 // 0x2aaa == 0xffff / 6
          : m1 + ((m2 - m1) * 6 * hShifted + 0x8000 >> 16);
        // B channel
        hShifted = (h - 0x5555) & 0xffff;
        b = (hShifted >= 0xaaaa) ? m1 // 0xaaaa == 0xffff * 2 / 3
          : (hShifted >= 0x7fff) ?  m1 + ((m2 - m1) * 6 * (0xaaaa - hShifted) + 0x8000 >> 16)
          : (hShifted >= 0x2aaa) ? m2 // 0x2aaa == 0xffff / 6
          : m1 + ((m2 - m1) * 6 * hShifted + 0x8000 >> 16);
      }

      img[iTimes4] = r;
      img[iTimes4 + 1] = g;
      img[iTimes4 + 2] = b;
    }
  }
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// This is autogenerated file from math.wasm, don't edit.
//


/* eslint-disable max-len */
module.exports = 'AGFzbQEAAAABlICAgAACYAZ/f39/f38AYAd/f39/f39/AAKPgICAAAEDZW52Bm1lbW9yeQIAAQODgICAAAIAAQSEgICAAAFwAAAHmYCAgAACCGNvbnZvbHZlAAAKY29udm9sdmVIVgABCYGAgIAAAArtg4CAAALBg4CAAAEQfwJAIANFDQAgBEUNACAFQQRqIRVBACEMQQAhDQNAIA0hDkEAIRFBACEHA0AgB0ECaiESAn8gBSAHQQF0IgdqIgZBAmouAQAiEwRAQQAhCEEAIBNrIRQgFSAHaiEPIAAgDCAGLgEAakECdGohEEEAIQlBACEKQQAhCwNAIBAoAgAiB0EYdiAPLgEAIgZsIAtqIQsgB0H/AXEgBmwgCGohCCAHQRB2Qf8BcSAGbCAKaiEKIAdBCHZB/wFxIAZsIAlqIQkgD0ECaiEPIBBBBGohECAUQQFqIhQNAAsgEiATagwBC0EAIQtBACEKQQAhCUEAIQggEgshByABIA5BAnRqIApBgMAAakEOdSIGQf8BIAZB/wFIG0EQdEGAgPwHcUEAIAZBAEobIAtBgMAAakEOdSIGQf8BIAZB/wFIG0EYdEEAIAZBAEobciAJQYDAAGpBDnUiBkH/ASAGQf8BSBtBCHRBgP4DcUEAIAZBAEobciAIQYDAAGpBDnUiBkH/ASAGQf8BSBtB/wFxQQAgBkEAShtyNgIAIA4gA2ohDiARQQFqIhEgBEcNAAsgDCACaiEMIA1BAWoiDSADRw0ACwsLoYCAgAAAAkBBACACIAMgBCAFIAAQACACQQAgBCAFIAYgARAACws=';


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



const GC_INTERVAL = 100;


function Pool(create, idle) {
  this.create = create;

  this.available = [];
  this.acquired = {};
  this.lastId = 1;

  this.timeoutId = 0;
  this.idle = idle || 2000;
}


Pool.prototype.acquire = function () {
  let resource;

  if (this.available.length !== 0) {
    resource = this.available.pop();
  } else {
    resource = this.create();
    resource.id = this.lastId++;
    resource.release = () => this.release(resource);
  }
  this.acquired[resource.id] = resource;
  return resource;
};


Pool.prototype.release = function (resource) {
  delete this.acquired[resource.id];

  resource.lastUsed = Date.now();
  this.available.push(resource);

  if (this.timeoutId === 0) {
    this.timeoutId = setTimeout(() => this.gc(), GC_INTERVAL);
  }
};


Pool.prototype.gc = function () {
  const now = Date.now();

  this.available = this.available.filter(resource => {
    if (now - resource.lastUsed > this.idle) {
      resource.destroy();
      return false;
    }
    return true;
  });

  if (this.available.length !== 0) {
    this.timeoutId = setTimeout(() => this.gc(), GC_INTERVAL);
  } else {
    this.timeoutId = 0;
  }
};


module.exports = Pool;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 * pixelFloor and pixelCeil are modified versions of Math.floor and Math.ceil
 * functions which take into account floating point arithmetic errors.
 * Those errors can cause undesired increments/decrements of sizes and offsets:
 * Math.ceil(36 / (36 / 500)) = 501
 * pixelCeil(36 / (36 / 500)) = 500
 */

var PIXEL_EPSILON = 1e-5;

function pixelFloor(x) {
  var nearest = Math.round(x);

  if (Math.abs(x - nearest) < PIXEL_EPSILON) { return nearest; }
  return Math.floor(x);
}

function pixelCeil(x) {
  var nearest = Math.round(x);

  if (Math.abs(x - nearest) < PIXEL_EPSILON) { return nearest; }
  return Math.ceil(x);
}


module.exports = function createRegions(options) {
  var scaleX = options.toWidth / options.width;
  var scaleY = options.toHeight / options.height;

  var innerTileWidth = pixelFloor(options.srcTileSize * scaleX) - 2 * options.destTileBorder;
  var innerTileHeight = pixelFloor(options.srcTileSize * scaleY) - 2 * options.destTileBorder;

  var x, y;
  var innerX, innerY, toTileWidth, toTileHeight;
  var tiles = [];
  var tile;

  // we go top-to-down instead of left-to-right to make image displayed from top to
  // doesn in the browser
  for (innerY = 0; innerY < options.toHeight; innerY += innerTileHeight) {
    for (innerX = 0; innerX < options.toWidth; innerX += innerTileWidth) {
      x = innerX - options.destTileBorder;
      if (x < 0) { x = 0; }
      toTileWidth = innerX + innerTileWidth + options.destTileBorder - x;
      if (x + toTileWidth >= options.toWidth) {
        toTileWidth = options.toWidth - x;
      }

      y = innerY - options.destTileBorder;
      if (y < 0) { y = 0; }
      toTileHeight = innerY + innerTileHeight + options.destTileBorder - y;
      if (y + toTileHeight >= options.toHeight) {
        toTileHeight = options.toHeight - y;
      }

      tile = {
        toX: x,
        toY: y,
        toWidth: toTileWidth,
        toHeight: toTileHeight,

        toInnerX: innerX,
        toInnerY: innerY,
        toInnerWidth: innerTileWidth,
        toInnerHeight: innerTileHeight,

        offsetX: x / scaleX - pixelFloor(x / scaleX),
        offsetY: y / scaleY - pixelFloor(y / scaleY),
        scaleX: scaleX,
        scaleY: scaleY,

        x: pixelFloor(x / scaleX),
        y: pixelFloor(y / scaleY),
        width: pixelCeil(toTileWidth / scaleX),
        height: pixelCeil(toTileHeight / scaleY)
      };

      tiles.push(tile);
    }
  }

  return tiles;
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Web Worker wrapper for image resize function



module.exports = function () {
  const MathLib = __webpack_require__(0);

  let mathLib;
  let cache = {};

  /* eslint-disable no-undef */
  onmessage = function (ev) {
    let opts = ev.data.opts;

    if (!mathLib) mathLib = new MathLib(ev.data.features, ev.data.preload);

    mathLib.init(function (err) {
      if (err) {
        postMessage({ err });
        return;
      }

      let result = mathLib.resizeAndUnsharp(opts, cache);
      postMessage({ result }, [ result.buffer ]);
    });
  };
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearObstacles = exports.move = exports.init = exports.obstacles = exports.obstacleimage = undefined;

var _pica = __webpack_require__(9);

var _pica2 = _interopRequireDefault(_pica);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var obstacleimage = exports.obstacleimage = new Image();
obstacleimage.src = "assets/images/obstacle.png";

var obstacles = exports.obstacles = [];

// const canvas = $("canvas")[0]
// const context = canvas.getContext("2d")


var init = exports.init = function init(context, platform, id) {
  // const canvas = $("canvas")[0]
  // const context = canvas.getContext("2d")

  if (!obstacles[id]) {
    obstacles.push({ x: platform.x + 400, y: platform.y - 35 });
  }

  for (var i = 0; i < obstacles.length; i++) {
    context.drawImage(obstacleimage, obstacles[i].x, obstacles[i].y, 30, 40);
  }

  return obstacles[id];
};

var move = exports.move = function move(context, platform, id) {
  for (var i = 0; i < obstacles.length; i++) {
    if (i === id) obstacles[i].x = platform.x + 400;
    context.drawImage(obstacleimage, obstacles[i].x, obstacles[i].y, 30, 40);
  }
  return obstacles[id];
};

var clearObstacles = exports.clearObstacles = function clearObstacles() {
  exports.obstacles = obstacles = [];
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// export var powercubeimage = new Image()


var powercubes = exports.powercubes = [];

// const canvas = $("canvas")[0]
// const context = canvas.getContext("2d")


var init = exports.init = function init(context, platform, id) {
  // const canvas = $("canvas")[0]
  // const context = canvas.getContext("2d")

  if (!powercubes[id]) {
    powercubes.push({ x: platform.x + 600, y: platform.y - 15, image: new Image() });
  }

  for (var i = 0; i < powercubes.length; i++) {
    var randomno = Math.floor(Math.random() * 3 + 1);
    randomno === 1 ? powercubes[i].image.src = "assets/images/powercube_purple.png" : randomno === 2 ? powercubes[i].image.src = "assets/images/powercube_green.png" : powercubes[i].image.src = "assets/images/powercube_white.png";
    context.drawImage(powercubes[i].image, powercubes[i].x, powercubes[i].y, 15, 15);
  }

  return powercubes[id];
};

var move = exports.move = function move(context, platform, id, popped) {
  for (var i = 0; i < powercubes.length; i++) {
    if (i === id && popped !== "popped") {
      powercubes[i].x = platform.x + 600;
      context.drawImage(powercubes[i].image, powercubes[i].x, powercubes[i].y, 15, 15);
    } else if (i === id && popped === "popped") {
      powercubes[i].x = 0;
    }
  }
  return powercubes[id];
};

var clearpowercubes = exports.clearpowercubes = function clearpowercubes() {
  exports.powercubes = powercubes = [];
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _vehicle = __webpack_require__(6);

var Vehicle = _interopRequireWildcard(_vehicle);

var _platform = __webpack_require__(5);

var Platform = _interopRequireWildcard(_platform);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

document.addEventListener("DOMContentLoaded", function () {
  var canvas = $("canvas")[0];
  var context = canvas.getContext("2d");
  var width = 800;
  var height = 400;

  context.fillStyle = "white";
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "black";
  context.strokeRect(0, 0, width, height);

  var pausebutton = new Image();
  pausebutton.src = "assets/images/pause_button.png";

  var gamebackground = new Image();
  gamebackground.src = "assets/images/starbackground.jpg";

  var interval_id;
  var player;
  var platforms;
  var previousplatform;
  var score = 0;
  var pause = { clicked: false, gamePaused: false };
  var token;
  var lives = 5;

  var init = function init() {

    if (lives > 0) {
      context.drawImage(gamebackground, 0, 0, width, height);
      player = Vehicle.init(context);
      platforms = Platform.init(context);
      interval_id = setInterval(move, 1000 / 60);
    } else {
      context.clearRect(0, 0, width, height);
      context.fillText('You Lose', 200, 200);
    }
  };

  var onPlatform = function onPlatform(array) {
    for (var i = 0; i < array.length; i++) {
      if (player.x + 60 > array[i].x && player.x < array[i].x + 775 && player.y < array[i].y) return true;
    }
    return false;
  };

  var move = function move() {
    context.clearRect(0, 0, width, height);
    context.drawImage(gamebackground, 0, 0, width, height);

    context.drawImage(pausebutton, 740, 10, 50, 50);

    var currentPlatform = void 0;

    if (onPlatform(platforms)) {
      var cp = void 0;
      for (var i = 0; i < platforms.length; i++) {
        if (player.x + 60 > platforms[i].x && player.x < platforms[i].x + 775 && player.y <= platforms[i].y - 20) {
          if (!cp || platforms[i].y < cp.y) {
            cp = platforms[i];
          }
        }
      }
      if (cp) {
        currentPlatform = cp;
      }
    }

    if (currentPlatform) {
      previousplatform = currentPlatform;
    }

    if (currentPlatform && player.token === "start") {
      player = Vehicle.move(currentPlatform);
      platforms = Platform.move(context);
    } else if (currentPlatform) {
      platforms = Platform.move(context);
      player = Vehicle.move(currentPlatform);
    } else if (!currentPlatform && player.jumping === true) {
      player = Vehicle.move(previousplatform);
      platforms = Platform.move(context);
    } else if (!currentPlatform) {
      token = "falling";
      player = Vehicle.move(previousplatform, "falling");
      platforms = Platform.move(context);
    }

    // loseconditions

    if (player.y === 400) {
      clearInterval(interval_id);
      player = Vehicle.resetVehicle();
      lives -= 1;
      init();
    }
    for (var i = 0; i < platforms.length; i++) {
      if (onPlatform(platforms) && player.x > platforms[i].obstacles.x - 30 && player.x < platforms[i].obstacles.x - 10 && player.y > platforms[i].obstacles.y - 30 && player.y < platforms[i].obstacles.y + 30) {
        console.log("you lose");
        clearInterval(interval_id);
        player = Vehicle.resetVehicle();
        lives -= 1;
        init();
        break;
      } else if (player.x === platforms[i].powercubes.x - 30 && player.y > platforms[i].powercubes.y - 30 && onPlatform(platforms) && player.y < platforms[i].powercubes.y) {
        score += 5;
        platforms[i].popped = "popped";
      }
    }

    context.fillText('Score: ' + score, 5, 20);
    if (currentPlatform === platforms[platforms.length - 1]) {
      platforms = Platform.generatePlatforms(context);
      clearInterval(interval_id);
      interval_id = setInterval(move, 1000 / 60);
    }
  };

  // End of move function

  init();

  var handlePause = function handlePause() {
    if (pause.clicked === true && pause.gamePaused === false) {
      clearInterval(interval_id);
      pause.gamePaused = true;
      pause.clicked = false;
    } else if (pause.clicked === true && pause.gamePaused === true) {

      interval_id = setInterval(move, 1000 / 60);
      pause.clicked = false;
      pause.gamePaused = false;
    }
  };

  var handleClick = function handleClick(e) {
    var horizontalpos = e.clientX - e.target.offsetLeft;
    var verticalpos = e.clientY - e.target.offsetTop;

    if (horizontalpos >= 740 && horizontalpos <= 790 && verticalpos >= 10 && verticalpos <= 60) {
      pause.clicked = true;
      handlePause();
    }
  };

  $(window).keypress(function (e) {
    if (e.keyCode === 112) {
      pause.clicked = true;
      console.log("pausebutton");
      handlePause();
    }
  });

  $(window).click(function (e) {
    handleClick(e);
  });
});

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var initialPlatforms = exports.initialPlatforms = [{ x: 200, y: 230, speed: 2, obstacles: null, powercubes: null, popped: null }, { x: 1050, y: 350, speed: 2, obstacles: null, powercubes: null, popped: null }, { x: 1800, y: 300, speed: 2, obstacles: null, powercubes: null, popped: null }, { x: 2650, y: 250, speed: 2, obstacles: null, powercubes: null, popped: null }];

// Level things

var platformGenerator = exports.platformGenerator = function platformGenerator(endoflast) {

  var platforms = [[{ x: endoflast + 50, y: 230, speed: 2, obstacles: null, powercubes: null, popped: null }, { x: endoflast + 900, y: 350, speed: 2, obstacles: null, powercubes: null, popped: null }, { x: endoflast + 900, y: 200, speed: 2, obstacles: null, powercubes: null, popped: null }, { x: endoflast + 1750, y: 260, speed: 2, obstacles: null, powercubes: null, popped: null }], [{ x: endoflast + 60, y: 230, speed: 2, obstacles: null, powercubes: null, popped: null }, { x: endoflast + 910, y: 350, speed: 2, obstacles: null, powercubes: null, popped: null }, { x: endoflast + 1680, y: 300, speed: 2, obstacles: null, powercubes: null, popped: null }, { x: endoflast + 2430, y: 250, speed: 2, obstacles: null, powercubes: null, popped: null }]];

  return platforms[Math.floor(Math.random() * platforms.length)];
};

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map
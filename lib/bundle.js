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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var player = exports.player = { x: 400, y: 200, jumping: false, direction: null };
var vehicleimg = exports.vehicleimg = new Image();
vehicleimg.src = "assets/images/vehicle.png";
var platform;

// const canvas = $("canvas")[0]
// const context = canvas.getContext("2d")


var init = exports.init = function init(context) {
  // const canvas = $("canvas")[0]
  // const context = canvas.getContext("2d")
  exports.player = player = { x: 400, y: 200, jumping: false, direction: null };
  context.drawImage(vehicleimg, player.x, player.y, 60, 30);
};

var move = exports.move = function move(plat, token) {
  platform = plat;
  var canvas = $("canvas")[0];
  var context = canvas.getContext("2d");

  if (token === "falling") {
    player.y += 5;
  }

  if (player.y === platform.y - 90 && player.jumping === true) {
    player.y += 5;
    player.jumping = false;
  } else if (player.y < platform.y - 20 && player.jumping === false) {
    player.y += 5;
  } else if (player.y === platform.y - 20 & player.jumping === true) {
    player.y -= 5;
  } else if (player.y < platform.y - 20 && player.jumping === true) {
    player.y -= 5;
  } else if (player.direction === "right") {
    player.x += 5;
  } else if (player.direction === "left") {
    player.x -= 5;
  }

  context.drawImage(vehicleimg, player.x, player.y, 60, 30);

  return player;
};

$(window).keypress(function (e) {

  if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && player.y === platform.y - 20) {
    e.preventDefault();
    player.jumping = true;
  } else if (e.keyCode === 100) {
    player.direction = "right";
  } else if (e.keyCode === 97) {
    player.direction = "left";
  }
});

$(window).keyup(function (e) {
  e.preventDefault();
  player.direction = null;
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _vehicle = __webpack_require__(0);

var Vehicle = _interopRequireWildcard(_vehicle);

var _platform = __webpack_require__(2);

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
  var interval_id;

  var player;
  var platform;

  var init = function init() {
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "black";
    context.strokeRect(0, 0, width, height);
    player = Vehicle.init(context);
    platform = Platform.init(context);
    interval_id = setInterval(move, 20);
  };

  var move = function move() {
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "black";
    context.strokeRect(0, 0, width, height);

    // Conditional logic before the move homie

    platform = Platform.move(context);
    player = Vehicle.move(platform);

    if (player.x < platform.x - 25 || player.x > platform.x + 775) {
      player = Vehicle.move(platform, "falling");
    }

    if (player.x < platform.x - 25 || player.y === 400) {
      clearInterval(interval_id);
      init();
    }
    debugger;
    if (player.x === platform.obstacles.x - 14 && player.y > platform.obstacles.y - 40) {
      console.log("you lose");
      clearInterval(interval_id);
      init();
    }
  };

  init();
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.move = exports.init = exports.platform = undefined;

var _obstacle = __webpack_require__(3);

var Obstacle = _interopRequireWildcard(_obstacle);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var platform = exports.platform = { x: 200, y: 230, speed: 2, obstacles: null

  // const canvas = $("canvas")[0]
  // const context = canvas.getContext("2d")


};var init = exports.init = function init(context) {
  // const canvas = $("canvas")[0]
  // const context = canvas.getContext("2d")
  exports.platform = platform = { x: 200, y: 220, speed: 2, obstacles: null };

  context.fillStyle = "darkgray";

  context.fillRect(platform.x, platform.y, 800, 50);
  context.strokeStyle = "red";
  context.linewidth = 5;
  context.strokeRect(platform.x, platform.y, 800, 50);
  platform.obstacles = Obstacle.init(context);
  return platform;
};

//
var move = exports.move = function move(context) {
  context.fillStyle = "darkgray";
  context.fillRect(platform.x, platform.y, 800, 50);
  context.strokeStyle = "red";
  context.linewidth = 5;
  context.strokeRect(platform.x, platform.y, 800, 50);

  platform.x -= platform.speed;
  platform.obstacles = Obstacle.move(context, platform.speed);
  return platform;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var obstacleimage = exports.obstacleimage = new Image();
obstacleimage.src = "assets/images/obstacle.png";

var obstacle = exports.obstacle = { x: 250, y: 200

  // const canvas = $("canvas")[0]
  // const context = canvas.getContext("2d")


};var init = exports.init = function init(context) {
  // const canvas = $("canvas")[0]
  // const context = canvas.getContext("2d")
  exports.obstacle = obstacle = { x: 550, y: 200 };

  context.drawImage(obstacleimage, obstacle.x, obstacle.y, 30, 40);

  return obstacle;
};

var move = exports.move = function move(context, speed) {
  context.drawImage(obstacleimage, obstacle.x, obstacle.y - 15, 30, 40);
  obstacle.x -= speed;
  return obstacle;
};

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map
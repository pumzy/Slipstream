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
var doublejumpstart;
var doublejumped = false;

var resetVehicle = exports.resetVehicle = function resetVehicle() {
  exports.player = player = { x: 400, y: 200, jumping: false, direction: null, token: null };
};

var init = exports.init = function init(context) {

  exports.player = player = { x: 400, y: 200, jumping: false, doublejumping: false, direction: null, token: null };
  context.drawImage(vehicleimg, player.x, player.y, 60, 30);

  return player;
};

var move = exports.move = function move(plat, token) {

  platform = plat;
  var canvas = $("canvas")[0];
  var context = canvas.getContext("2d");
  if (token === "falling") {
    player.falling = true;
    player.y += 5;
  } else if (player.y < doublejumpstart - 70 && player.doublejumping === true) {
    player.doublejumping = false;
    player.jumping = false;
    player.y += 5;
  } else if (player.y <= doublejumpstart && player.doublejumping === true) {
    player.y -= 5;
  } else if (player.y < doublejumpstart && player.doublejumping === false) {
    player.y += 5;
  } else if (player.y < platform.y - 90 && player.jumping === true) {
    player.y -= 5;
    player.jumping = false;
  } else if (player.y < platform.y - 20 && player.jumping === false) {
    player.y += 5;
  } else if (player.y === platform.y - 20 && player.jumping === false) {
    doublejumped = false;
    doublejumpstart = null;
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

  if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && player.y === platform.y - 20) {
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

  var pausebutton = new Image();
  pausebutton.src = "assets/images/pause_button.png";

  var interval_id;
  var player;
  var platforms;
  var previousplatform;
  var score;
  var pause = { clicked: false, gamePaused: false };

  var init = function init() {

    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "black";
    context.strokeRect(0, 0, width, height);
    player = Vehicle.init(context);
    platforms = Platform.init(context);
    interval_id = setInterval(move, 1000 / 60);
    score = 0;
  };

  var onPlatform = function onPlatform(array) {
    for (var i = 0; i < array.length; i++) {
      if (player.x + 60 > array[i].x && player.x < array[i].x + 775 && player.y < array[i].y) return true;
    }
    return false;
  };

  var move = function move() {

    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "black";
    context.strokeRect(0, 0, width, height);

    context.drawImage(pausebutton, 740, 10, 50, 50);

    // Conditional logic before the move homie

    var currentPlatform = void 0;

    if (onPlatform(platforms)) {
      for (var i = 0; i < platforms.length; i++) {
        if (player.x + 60 > platforms[i].x && player.x < platforms[i].x + 775) {
          currentPlatform = platforms[i];
        }
      }
    }

    if (currentPlatform) {
      previousplatform = currentPlatform;
    }

    if (onPlatform(platforms)) {
      platforms = Platform.move(context);
      player = Vehicle.move(currentPlatform);
    } else if (!onPlatform(platforms) && player.jumping === true) {
      player = Vehicle.move(previousplatform);
      platforms = Platform.move(context);
    } else if (!onPlatform(platforms)) {
      player = Vehicle.move(currentPlatform, "falling");
      platforms = Platform.move(context);
    }

    if (player.y === 400) {
      clearInterval(interval_id);
      init();
    }
    for (var i = 0; i < platforms.length; i++) {
      if (player.x > platforms[i].obstacles.x - 30 && player.x < platforms[i].obstacles.x - 10 && player.y > platforms[i].obstacles.y - 30 && onPlatform(platforms)) {
        console.log("you lose");
        clearInterval(interval_id);
        init();
        break;
      } else if (player.x === platforms[i].powercubes.x - 30 && player.y > platforms[i].powercubes.y - 30 && onPlatform(platforms)) {
        score += 5;
        platforms[i].popped = "popped";
      }
    }

    context.fillText('Score: ' + score, 5, 20);
    if (currentPlatform === platforms[platforms.length - 1]) {
      clearInterval(interval_id);
      platforms = Platform.generatePlatforms(context);
      interval_id = setInterval(move, 1000 / 60);
    }
  };

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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearPlatforms = exports.generatePlatforms = exports.move = exports.init = exports.platforms = undefined;

var _obstacle = __webpack_require__(3);

var Obstacle = _interopRequireWildcard(_obstacle);

var _powerup = __webpack_require__(4);

var PowerCube = _interopRequireWildcard(_powerup);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var platforms = exports.platforms = [{ x: 200, y: 230, speed: 2, obstacles: null, powercubes: null, popped: null }, { x: 1050, y: 350, speed: 2, obstacles: null, powercubes: null, popped: null }, { x: 1800, y: 300, speed: 2, obstacles: null, powercubes: null, popped: null }, { x: 2650, y: 250, speed: 2, obstacles: null, powercubes: null, popped: null }];

var init = exports.init = function init(context) {

  if (platforms.length === 4) {
    exports.platforms = platforms = [{ x: 200, y: 230, speed: 2, obstacles: null, powercubes: null, popped: null }, { x: 1050, y: 350, speed: 2, obstacles: null, powercubes: null, popped: null }, { x: 1800, y: 300, speed: 2, obstacles: null, powercubes: null, popped: null }, { x: 2650, y: 250, speed: 2, obstacles: null, powercubes: null, popped: null }];
  }

  Obstacle.clearObstacles();
  PowerCube.clearpowercubes();
  context.fillStyle = "darkgray";

  for (var i = 0; i < platforms.length; i++) {
    context.fillStyle = "darkgray";
    context.fillRect(platforms[i].x, platforms[i].y, 800, 50);
    context.strokeStyle = "red";
    context.linewidth = 5;
    context.strokeRect(platforms[i].x, platforms[i].y, 800, 50);
    platforms[i].obstacles = Obstacle.init(context, platforms[i]);
    platforms[i].powercuber = PowerCube.init(context, platforms[i]);
  }

  return platforms;
};

var move = exports.move = function move(context) {
  for (var i = 0; i < platforms.length; i++) {
    context.fillStyle = "darkgray";
    context.fillRect(platforms[i].x, platforms[i].y, 800, 50);
    context.strokeStyle = "red";
    context.linewidth = 5;
    context.strokeRect(platforms[i].x, platforms[i].y, 800, 50);
    platforms[i].x -= platforms[i].speed;
    platforms[i].obstacles = Obstacle.move(context, platforms[i], i, platforms[i].popped);
    platforms[i].powercubes = PowerCube.move(context, platforms[i], i, platforms[i].popped);
  }

  return platforms;
};

var generatePlatforms = exports.generatePlatforms = function generatePlatforms(context) {
  debugger;
  var endoflast = platforms[platforms.length - 1].x + 800;
  var newplatforms = [platforms[platforms.length - 2], platforms[platforms.length - 1]].concat([{ x: endoflast + 50, y: 230, speed: 2, obstacles: null, powercubes: null, popped: null }, { x: endoflast + 1050, y: 350, speed: 2, obstacles: null, powercubes: null, popped: null }, { x: endoflast + 1800, y: 300, speed: 2, obstacles: null, powercubes: null, popped: null }, { x: endoflast + 2650, y: 250, speed: 2, obstacles: null, powercubes: null, popped: null }]);
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var powercubeimage = exports.powercubeimage = new Image();
powercubeimage.src = "assets/images/powercube_green.png";

var powercubes = exports.powercubes = [];

// const canvas = $("canvas")[0]
// const context = canvas.getContext("2d")


var init = exports.init = function init(context, platform, id) {
  // const canvas = $("canvas")[0]
  // const context = canvas.getContext("2d")

  if (!powercubes[id]) {
    powercubes.push({ x: platform.x + 600, y: platform.y - 15 });
  }

  for (var i = 0; i < powercubes.length; i++) {
    context.drawImage(powercubeimage, powercubes[i].x, powercubes[i].y, 15, 15);
  }

  return powercubes[id];
};

var move = exports.move = function move(context, platform, id, popped) {
  for (var i = 0; i < powercubes.length; i++) {
    if (i === id && popped !== "popped") {
      powercubes[i].x = platform.x + 600;
      context.drawImage(powercubeimage, powercubes[i].x, powercubes[i].y, 15, 15);
    } else if (i === id && popped === "popped") {
      powercubes[i].x = 0;
    }
  }
  return powercubes[id];
};

var clearpowercubes = exports.clearpowercubes = function clearpowercubes() {
  exports.powercubes = powercubes = [];
};

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map
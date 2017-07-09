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
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var obstacleimage = exports.obstacleimage = new Image();
obstacleimage.src = "assets/images/obstacle.png";

var obstacles = exports.obstacles = [];
var idBreakpoint = exports.idBreakpoint = undefined;

var init = exports.init = function init(context, platform, id, token) {

  if (token === "regen") {

    if (id === 3) {
      exports.idBreakpoint = idBreakpoint = platform.id;
    }
    clearObstacles(idBreakpoint - 2);

    if (id >= 3) {
      for (var i = 0; i < calcObstacles(); i++) {
        var newobstacle = { x: platform.x + (platform.width - (i + 1) * 350), y: platform.y - 15, image: obstacleimage, platformID: platform.id };
        obstacles.push(newobstacle);
        context.drawImage(obstacleimage, newobstacle.x, newobstacle.y - 20, 30, 40);
      }

      console.log(obstacles);
      return obstacles.filter(function (obstacle) {
        return obstacle.platformID === platform.id;
      });
    }
  }

  for (var _i = 0; _i < calcObstacles(); _i++) {
    obstacles.push({ x: platform.x + (platform.width - (_i + 1) * 350), y: platform.y - 15, image: new Image(), platformID: platform.id });
  }

  for (var _i2 = 0; _i2 < obstacles.length; _i2++) {
    context.drawImage(obstacleimage, obstacles[_i2].x, obstacles[_i2].y - 20, 30, 40);
  }

  return obstacles.filter(function (obstacle) {
    return obstacle.platformID === platform.id;
  });
};

var move = exports.move = function move(context, platform, id) {
  for (var i = 0; i < obstacles.length; i++) {
    if (platform.id === obstacles[i].platformID) obstacles[i].x -= platform.speed;
    context.drawImage(obstacleimage, obstacles[i].x, obstacles[i].y - 20, 30, 40);
  }

  var filter = obstacles.filter(function (obstacle) {
    return obstacle.platformID === platform.id;
  });
  return filter;
};

var clearObstacles = exports.clearObstacles = function clearObstacles(num) {
  if (num) {
    exports.obstacles = obstacles = obstacles.filter(function (obstacle) {
      return obstacle.platformID >= num;
    });
  } else exports.obstacles = obstacles = [];
};

var restartFind = exports.restartFind = function restartFind(id) {
  return obstacles.filter(function (obstacle) {
    return obstacle.platformID === id;
  });
};

var calcObstacles = exports.calcObstacles = function calcObstacles() {
  return Math.floor(Math.random() * 2);
};

/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var powercubes = exports.powercubes = [];
var idBreakpoint = exports.idBreakpoint = undefined;

var init = exports.init = function init(context, platform, id, token) {

  if (token === "regen") {

    if (id === 3) {
      exports.idBreakpoint = idBreakpoint = platform.id;
    }
    clearpowercubes(idBreakpoint - 2);

    if (id >= 3) {
      for (var i = 0; i < calcCubes(); i++) {
        var cubepic = new Image();
        var randomno = Math.floor(Math.random() * 3 + 1);
        randomno === 1 ? cubepic.src = "assets/images/powercube_purple.png" : randomno === 2 ? cubepic.src = "assets/images/powercube_green.png" : cubepic.src = "assets/images/powercube_white.png";
        var newcube = { x: platform.x + (platform.width - (i + 1) * 200), y: platform.y - 15, image: cubepic, platformID: platform.id };
        powercubes.push(newcube);
        context.drawImage(cubepic, newcube.x, newcube.y, 15, 15);
      }

      return powercubes.filter(function (cube) {
        return cube.platformID === platform.id;
      });
    }
  }

  for (var _i = 0; _i < calcCubes(); _i++) {

    powercubes.push({ x: platform.x + (platform.width - (_i + 1) * 200), y: platform.y - 15, image: new Image(), platformID: platform.id });
  }

  for (var _i2 = 0; _i2 < powercubes.length; _i2++) {
    var _randomno = Math.floor(Math.random() * 3 + 1);
    _randomno === 1 ? powercubes[_i2].image.src = "assets/images/powercube_purple.png" : _randomno === 2 ? powercubes[_i2].image.src = "assets/images/powercube_green.png" : powercubes[_i2].image.src = "assets/images/powercube_white.png";
    context.drawImage(powercubes[_i2].image, powercubes[_i2].x, powercubes[_i2].y, 15, 15);
  }

  return powercubes.filter(function (cube) {
    return cube.platformID === platform.id;
  });
};

var move = exports.move = function move(context, platform, speed, popped) {
  for (var i = 0; i < powercubes.length; i++) {
    if (platform.id === powercubes[i].platformID && !popped.includes(powercubes[i].x)) {
      powercubes[i].x -= platform.speed;
      context.drawImage(powercubes[i].image, powercubes[i].x, powercubes[i].y, 15, 15);
    } else if (platform.id === powercubes[i].platformID && popped.includes(powercubes[i].x)) {
      powercubes[i].src = "";
      powercubes[i].y = -100;
    }
  }

  var filter = powercubes.filter(function (cube) {
    return cube.platformID === platform.id;
  });
  return filter;
};

var clearpowercubes = exports.clearpowercubes = function clearpowercubes(num) {
  if (num) {
    exports.powercubes = powercubes = powercubes.filter(function (powercube) {
      return powercube.platformID >= num;
    });
  } else exports.powercubes = powercubes = [];
};

var idMap = exports.idMap = function idMap(num) {
  return powercubes.filter(function (cube) {
    return cube.platformID <= num;
  });
  // let unique = [...new Set(idmap)];
  // debugger
  // return unique[unique.length-3];
};

var calcCubes = exports.calcCubes = function calcCubes() {
  return Math.floor(Math.random() * (3 - 0 + 1));
};

var restartFind = exports.restartFind = function restartFind(id) {
  return powercubes.filter(function (cube) {
    return cube.platformID === id;
  });
};

/***/ }),

/***/ 20:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var initialPlatforms = exports.initialPlatforms = function initialPlatforms() {
  return [{ x: 200, y: 230, speed: 2, obstacles: null, powercubes: null, popped: [], width: 800, id: 1 }, { x: 1050, y: 350, speed: 2, obstacles: null, powercubes: null, popped: [], width: 800, id: 2 }, { x: 1800, y: 300, speed: 2, obstacles: null, powercubes: null, popped: [], width: 800, id: 3 }, { x: 2650, y: 250, speed: 2, obstacles: null, powercubes: null, popped: [], width: 800, id: 4 }];
};

// Level things

var platformGenerator = exports.platformGenerator = function platformGenerator(endoflast, id, diff) {

  var platforms = [[{ x: endoflast + 50, y: 230, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id + 1 }, { x: endoflast + 900, y: 350, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id + 2 }, { x: endoflast + 900, y: 200, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id + 3 }, { x: endoflast + 1750, y: 260, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id + 4 }], [{ x: endoflast + 60, y: 230, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id + 1 }, { x: endoflast + 910, y: 350, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id + 2 }, { x: endoflast + 1680, y: 300, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id + 3 }, { x: endoflast + 2430, y: 250, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id + 4 }], [{ x: endoflast + 50, y: 230, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id + 1 }, { x: endoflast + 70, y: 0, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id + 2 }, { x: endoflast + 820, y: 200, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id + 3 }, { x: endoflast + 1650, y: 150, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id + 4 }]];

  return platforms[Math.floor(Math.random() * platforms.length)].slice(0);
};

var widthGenerator = exports.widthGenerator = function widthGenerator() {
  return Math.floor(Math.random() * (800 - 700 + 1)) + 700;
};

/***/ }),

/***/ 21:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _vehicle = __webpack_require__(8);

var Vehicle = _interopRequireWildcard(_vehicle);

var _platform = __webpack_require__(7);

var Platform = _interopRequireWildcard(_platform);

var _obstacle = __webpack_require__(0);

var Obstacle = _interopRequireWildcard(_obstacle);

var _powerup = __webpack_require__(1);

var PowerCube = _interopRequireWildcard(_powerup);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

document.addEventListener("DOMContentLoaded", function () {
  var canvas = $("canvas")[0];
  var context = canvas.getContext("2d");
  var width = 800;
  var height = 400;

  var interval_id;
  var player;
  var platforms;
  var previousplatform;
  var score = 0;
  var pause = { clicked: false, gamePaused: false };
  var token;
  var lives = 5;
  var started = false;
  var ended = false;
  var gamebackground = new Image();
  gamebackground.src = "assets/images/starbackground.jpg";

  var startScreen = function startScreen() {
    if (started === false) {
      context.clearRect(0, 0, width, height);
      context.drawImage(gamebackground, 0, 0, width, height);
      context.font = '30px Arcade-Classic';
      context.fillText('Press any key to start', 200, 200);
    }
  };

  var endScreen = function endScreen() {

    started = false;
    // PowerCube.clearpowercubes()
    // Platform.clearPlatforms()
    // Vehicle.resetVehicle()
    // Obstacle.clearObstacles()


    var pause = { clicked: false, gamePaused: false };
    token = null;
    lives = 5;
    started = false;
    context.fillText('You Lose, press any key to restart', 200, 200);
    context.fillText('Score: ' + Math.floor(score), 350, 100);
    score = 0;
    platforms = Platform.clearPlatforms();

    if (ended === false) {
      context.beginPath();
      context.globalCompositeOperation = "source-over";
      context.globalAlpha = 1;
      init();
    }
  };

  context.fillStyle = "white";
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "black";
  context.strokeRect(0, 0, width, height);

  var pausebutton = new Image();
  pausebutton.src = "assets/images/pause_button.png";

  var drawLives = function drawLives() {
    var currentpos = 30;

    for (var i = 0; i < lives; i++) {
      context.beginPath();
      context.arc(currentpos, 60, 15, 0, 2 * Math.PI, false);
      context.fillStyle = '#099cff';
      context.fill();
      context.lineWidth = 3;
      context.strokeStyle = '#099cff';
      context.stroke();
      context.lineWidth = 1;
      context.strokeStyle = 'white';
      context.stroke();
      currentpos += 35;
    }
    for (var i = 0; i < 5 - lives; i++) {
      context.beginPath();
      context.arc(currentpos, 60, 15, 0, 2 * Math.PI, false);
      context.lineWidth = 3;
      context.strokeStyle = '#099cff';
      context.stroke();
      context.lineWidth = 1;
      context.strokeStyle = 'white';
      context.stroke();
      currentpos += 35;
    }

    context.fillStyle = 'white';
  };

  var init = function init(token) {

    context.clearRect(0, 0, width, height);

    if (lives === 5) {
      context.drawImage(gamebackground, 0, 0, width, height);
      platforms = Platform.clearPlatforms();
      platforms = Platform.init(context, token);
      player = Vehicle.init(context);
      interval_id = setInterval(move, 1000 / 60);
      return;
    }

    if (lives > 0) {
      context.drawImage(gamebackground, 0, 0, width, height);
      player = Vehicle.init(context);
      platforms = Platform.init(context, token);
      interval_id = setInterval(move, 1000 / 60);
    } else {
      console.log("bug");
    }
  };

  var onPlatform = function onPlatform(array) {
    if (array) {
      for (var i = 0; i < array.length; i++) {
        if (player.x + 60 > array[i].x && player.x < array[i].x + 775 && player.y < array[i].y) return true;
      }
    }
    return false;
  };

  var move = function move() {
    context.clearRect(0, 0, width, height);
    context.drawImage(gamebackground, 0, 0, width, height);

    drawLives();
    context.drawImage(pausebutton, 740, 10, 50, 50);
    score += 0.01;

    var currentPlatform = void 0;

    if (onPlatform(platforms)) {
      var cp = void 0;
      for (var i = 0; i < platforms.length; i++) {
        if (player.x + 60 > platforms[i].x && player.x < platforms[i].x + (platforms[i].width - 25) && player.y <= platforms[i].y - 20) {
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
      if (lives > 0) {
        init("restart");
      } else {
        ended = true;
        endScreen();
      }
    }

    for (var i = 0; i < platforms.length; i++) {
      if (platforms[i].obstacles) {
        if (inObstacleArray(platforms[i]) !== false) {

          console.log("you lose");
          clearInterval(interval_id);
          player = Vehicle.resetVehicle();
          lives -= 1;

          if (lives > 0) {
            init("restart");
          } else {
            ended = true;
            endScreen();
          }
        } else if (inPCA(platforms[i]) !== false) {
          var currentCube = inPCA(platforms[i]);
          platforms[i].popped.push(currentCube.x);
          score += 10;
        }
      }
    }

    // context.font = "normal normal 20px comic sans";
    context.font = '30px Arcade-Classic';
    context.fillText('Score: ' + Math.floor(score), 16, 30);

    if (currentPlatform === platforms[platforms.length - 1]) {
      clearInterval(interval_id);
      platforms = Platform.generatePlatforms(context);
      interval_id = setInterval(move, 1000 / 60);
    }
  };

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

  var inPCA = function inPCA(platform) {
    var cubes = platform.powercubes;
    for (var j = 0; j < cubes.length; j++) {
      if (player.x < cubes[j].x - 27 && player.x > cubes[j].x - 33 && player.y >= cubes[j].y - 30 && onPlatform(platforms) && player.y <= cubes[j].y + 10) {
        return cubes[j];
      }
    }
    return false;
  };

  var inObstacleArray = function inObstacleArray(platform) {
    var obstacles = platform.obstacles;
    for (var j = 0; j < obstacles.length; j++) {
      if (player.x > obstacles[j].x - 30 && player.x < obstacles[j].x && player.y > obstacles[j].y - 30 && player.y < obstacles[j].y + 30) {
        return obstacles[j];
      }
    }
    return false;
  };

  startScreen();

  $(window).keypress(function (e) {

    if (started === false && ended === false) {
      started = true;
      init();
    } else if (started === false && ended === true) {
      ended = false;
    }
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

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearPlatforms = exports.generatePlatforms = exports.move = exports.init = exports.platforms = undefined;

var _obstacle = __webpack_require__(0);

var Obstacle = _interopRequireWildcard(_obstacle);

var _powerup = __webpack_require__(1);

var PowerCube = _interopRequireWildcard(_powerup);

var _platformArrays = __webpack_require__(20);

var PlatformArrays = _interopRequireWildcard(_platformArrays);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var platforms = exports.platforms = PlatformArrays.initialPlatforms();
var difficuly = 2;

var init = exports.init = function init(context, token) {
  var gennum = void 0;
  if (token === "regen") {
    gennum = 3;
  } else {
    gennum = 0;
  }
  // Obstacle.clearObstacles()
  // PowerCube.clearpowercubes()

  for (var i = gennum; i < platforms.length; i++) {
    context.strokeStyle = "#01a502";
    context.lineWidth = 5;
    context.strokeRect(platforms[i].x, platforms[i].y, platforms[i].width, 50);
    if (token === "restart") {
      platforms[i].obstacles = Obstacle.restartFind(i);
      platforms[i].powercubes = PowerCube.restartFind(i);
    } else if (token === "regen") {
      platforms[i].obstacles = Obstacle.init(context, platforms[i], i, "regen");
      platforms[i].powercubes = PowerCube.init(context, platforms[i], i, "regen");
    } else {
      platforms[i].obstacles = Obstacle.init(context, platforms[i], i);
      platforms[i].powercubes = PowerCube.init(context, platforms[i], i);
    }
  }
  return platforms;
};

var move = exports.move = function move(context) {
  for (var i = 0; i < platforms.length; i++) {
    context.strokeStyle = "#01a502";
    context.lineWidth = 3;
    context.strokeRect(platforms[i].x, platforms[i].y, platforms[i].width, 50);
    platforms[i].x -= platforms[i].speed;
    platforms[i].obstacles = Obstacle.move(context, platforms[i], i, platforms[i].popped);
    platforms[i].powercubes = PowerCube.move(context, platforms[i], i, platforms[i].popped);
  }
  window.platforms = platforms;
  return platforms;
};

var generatePlatforms = exports.generatePlatforms = function generatePlatforms(context) {
  var endoflast = platforms[platforms.length - 1].x + platforms[platforms.length - 1].width;
  var newplatforms = [platforms[platforms.length - 3], platforms[platforms.length - 2], platforms[platforms.length - 1]].concat(PlatformArrays.platformGenerator(endoflast, platforms[platforms.length - 1].id, Math.floor(difficuly)));

  exports.platforms = platforms = newplatforms;
  // PowerCube.clearpowercubes()
  // for (var i = 0; i < platforms.length; i++) {
  //   platforms[i].obstacles = Obstacle.init(context, platforms[i])
  //   platforms[i].powercubes = PowerCube.init(context, platforms[i], i, "regen")
  // }


  init(context, "regen");
  difficuly += 0.5;
};

var clearPlatforms = exports.clearPlatforms = function clearPlatforms() {
  exports.platforms = platforms = PlatformArrays.initialPlatforms();
  Obstacle.clearObstacles();
  PowerCube.clearpowercubes();
  difficuly = 2;
  return platforms;
};

/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var player = exports.player = { x: 400, y: 0, falljumped: false, jumping: true, direction: null, token: "start", doublejumping: false, falling: false };
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

  exports.player = player = { x: 400, y: 0, jumping: true, direction: null, falljumped: false, token: "start", doublejumping: false, falling: false };
  context.drawImage(vehicleimg, player.x, player.y, 60, 30);

  return player;
};

var move = exports.move = function move(plat, token) {

  debugger;

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
    player.falljumped = false;
  } else if (startpos && player.y < startpos) {
    player.y += 5;
  } else if (player.y <= doublejumpstart - 70 && player.doublejumping === true) {
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
    falljumpstart = null;
    player.jumping = false;
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
  } else if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && doublejumped === true) {
    return;
  } else if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && player.token === "falling" && player.jumping === false && player.falljumped === false) {
    e.preventDefault();
    player.jumping = true;
    falljumpstart = player.y;
    player.falljumped = true;
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

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map
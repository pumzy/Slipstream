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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export obstacleimage */
/* unused harmony export obstacles */
/* unused harmony export idBreakpoint */


var obstacleimage = new Image()
obstacleimage.src = "assets/images/obstacle.png"














var obstacles = [];
var idBreakpoint;



const init = (context, platform, id, token) => {


  if (token === "regen"){

    if (id === 3){
      idBreakpoint = platform.id;
    }
    clearObstacles(idBreakpoint - 2);


    if (id >= 3){
    for (let i = 0; i < calcObstacles(); i++) {
      let newobstacle = {x: (platform.x + (platform.width - (i+1)*350)), y: platform.y - 15, image: obstacleimage, platformID: platform.id}
      obstacles.push(newobstacle)
      context.drawImage(obstacleimage,newobstacle.x,(newobstacle.y - 20),30,40)
    }

    return obstacles.filter(obstacle => (
      obstacle.platformID === platform.id
    ))
  }}

  for (let i = 0; i < calcObstacles(); i++) {
    obstacles.push({x: (platform.x + (platform.width - (i+1)*350)), y: platform.y - 15, image: new Image(), platformID: platform.id})
  }

  for (let i = 0; i < obstacles.length; i++) {
    context.drawImage(obstacleimage,obstacles[i].x,(obstacles[i].y - 20),30,40)
  }

  return obstacles.filter(obstacle => (
    obstacle.platformID === platform.id
  ))

}
/* harmony export (immutable) */ __webpack_exports__["b"] = init;


const move = (context, platform, id) => {
  for (let i = 0; i < obstacles.length; i++) {
    if(platform.id === obstacles[i].platformID)
    obstacles[i].x  -= platform.speed
    context.drawImage(obstacleimage,obstacles[i].x,(obstacles[i].y - 20),30,40)
  }

    let filter = obstacles.filter(obstacle =>(
      obstacle.platformID === platform.id)
    )
    return filter
}
/* harmony export (immutable) */ __webpack_exports__["c"] = move;


const clearObstacles = (num) => {
  if (num){
    obstacles = obstacles.filter(obstacle => obstacle.platformID >= num)
  } else obstacles = [];
}
/* harmony export (immutable) */ __webpack_exports__["a"] = clearObstacles;


const restartFind = (id) => {
  return obstacles.filter(obstacle => (
    obstacle.platformID === id
  ))
}
/* harmony export (immutable) */ __webpack_exports__["d"] = restartFind;


const calcObstacles = () => (
  Math.floor(Math.random() * 2)
)
/* unused harmony export calcObstacles */



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export powercubes */
/* unused harmony export idBreakpoint */



var powercubes = [];
var idBreakpoint;

const init = (context, platform, id, token) => {

 if (token === "regen"){

   if (id === 3){
     idBreakpoint = platform.id;
   }
   clearpowercubes(idBreakpoint - 2);


   if (id >= 3){
   for (let i = 0; i < calcCubes(); i++) {
     let cubepic = new Image()
     let randomno = Math.floor(Math.random() * (3) + 1)
     randomno === 1 ? cubepic.src = "assets/images/powercube_purple.png" : randomno === 2 ? cubepic.src = "assets/images/powercube_green.png" : cubepic.src = "assets/images/powercube_white.png"
     let newcube = {x: (platform.x + (platform.width - (i+1)*200)), y: platform.y - 15, image: cubepic, platformID: platform.id}
     powercubes.push(newcube)
     context.drawImage(cubepic,newcube.x,newcube.y,15,15)
   }

   return powercubes.filter(cube => (
     cube.platformID === platform.id
   ))

 }}


  for (let i = 0; i < calcCubes(); i++) {

    powercubes.push({x: (platform.x + (platform.width - (i+1)*200)), y: platform.y - 15, image: new Image(), platformID: platform.id})
  }

  for (let i = 0; i < powercubes.length; i++) {
    let randomno = Math.floor(Math.random() * (3) + 1)
    randomno === 1 ? powercubes[i].image.src = "assets/images/powercube_purple.png" : randomno === 2 ? powercubes[i].image.src = "assets/images/powercube_green.png" : powercubes[i].image.src = "assets/images/powercube_white.png"
    context.drawImage(powercubes[i].image,powercubes[i].x,powercubes[i].y,15,15)
  }

  return powercubes.filter(cube => (
    cube.platformID === platform.id
  ))

}
/* harmony export (immutable) */ __webpack_exports__["b"] = init;



const move = (context, platform, speed, popped) => {
  for (let i = 0; i < powercubes.length; i++) {
    if(platform.id === powercubes[i].platformID && !popped.includes(powercubes[i].x)){
    powercubes[i].x -= platform.speed
    context.drawImage(powercubes[i].image,powercubes[i].x,powercubes[i].y,15,15)

  } else if (platform.id === powercubes[i].platformID && popped.includes(powercubes[i].x)){
      powercubes[i].src = ""
      powercubes[i].y = -100
  }}


  let filter = powercubes.filter(cube =>(
    cube.platformID === platform.id)
  )
  return filter

}
/* harmony export (immutable) */ __webpack_exports__["c"] = move;


const clearpowercubes = (num) => {
  if (num){
    powercubes = powercubes.filter(powercube => powercube.platformID >= num)
  } else powercubes = []
}
/* harmony export (immutable) */ __webpack_exports__["a"] = clearpowercubes;


const idMap = (num) => {
  return powercubes.filter(cube => cube.platformID <= num)

}
/* unused harmony export idMap */


const calcCubes = () => (
  Math.floor(Math.random() * (3 - 0 + 1))
)
/* unused harmony export calcCubes */


const restartFind = (id) => {
  return powercubes.filter(cube => (
    cube.platformID === id
  ))
}
/* harmony export (immutable) */ __webpack_exports__["d"] = restartFind;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vehicle_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__platform_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__obstacle_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__powerup_js__ = __webpack_require__(1);




// import * as Util from './util.js'





document.addEventListener("DOMContentLoaded", () => {
  const canvas = $("canvas")[0]
  const context = canvas.getContext("2d")
  const width = 800
  const height = 400
  // var highscores = [];
  var interval_id;
  var player;
  var platforms;
  var previousplatform;
  var score = 0;
  var pause = {clicked: false, gamePaused: false}
  var token;
  var lives = 5;
	var started = false;
	var ended = false;
  var gamebackground = new Image()
  gamebackground.src = "assets/images/starbackground.jpg"
  var startbackground = new Image()
  startbackground.src = "assets/images/buggati8bit.jpg"
  var scoresRef = firebase.database().ref("scores")


  scoresRef.orderByChild("score").limitToLast(5).on('value', (snapshot, highscores) => {
    $(".leaderboard-li").remove()
    highscores = []
      snapshot.forEach((childSnapshot) => {
          highscores.push((childSnapshot.val()));
      });
      highscores = highscores.reverse()
      for (var i = 0; i < highscores.length; i++) {
        $(".leaderboard-list").append(`<li class='leaderboard-li'>${highscores[i].username ? highscores[i].username : "Anonymous Rider" } : ${highscores[i].score} </li> `)
      }

  });








  const deleteCookie = (name) => {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }




  const readCookie = (name) => {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
      let c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }


	const startScreen = () => {
		if (started === false){
      context.clearRect(0,0, width, height)
      if (readCookie("slipstream_highscore") !== null){
        $(".highscore").append(`<span id="test"> ${readCookie("slipstream_highscore")}</span>`)
      } else {
        $(".highscore").append(`<span id="test"> none</span>`)
      }

      if (readCookie("slipstream_username") !== null){
        $(".username").append(`<span id="userspan"> ${readCookie("slipstream_username")}</span>`)
      } else {
        let username = window.prompt("Hello Friend! Please Enter a Username")
        if (username){
          document.cookie = `slipstream_username=${username}; expires=Fri, 3 Aug 2022 20:47:11 UTC; path=/`;
          $(".username").append(`<span id="userspan"> ${readCookie("slipstream_username")}</span>`)
        } else {
          $(".username").append(`<span id="userspan">Anonymous Rider</span>`)
        }
      }
		}












	}

	const endScreen = () => {
    let newscore = firebase.database().ref("scores").push()
    window.newscore = newscore
    let username = readCookie("slipstream_username")
    if (!username){
      username = "Anonymous Rider"
    }
    newscore.set({username: username, score: parseInt(score)})
		started = false
    let highScore =  readCookie("slipstream_highscore")
    if (highScore !== null && (Math.floor(score) > parseInt(highScore))){
      let scoretext = " " + `${Math.floor(score)}`
      $("#test").remove()
      deleteCookie("slipstream_highscore")
      document.cookie = `slipstream_highscore=${Math.floor(score)}; expires=Fri, 3 Aug 2022 20:47:11 UTC; path=/`;
      $(".highscore").append(`<span id="test"> ${Math.floor(score)}</span>`)
    } else if(!highScore){
      $("#test").remove()
      document.cookie = `slipstream_highscore=${Math.floor(score)}; expires=Fri, 3 Aug 2022 20:47:11 UTC; path=/`;
      $(".highscore").append(`<span id="test"> ${Math.floor(score)}</span>`)
    }





		var pause = {clicked: false, gamePaused: false}
		token = null;
		lives = 5;
		started = false
		context.fillText(`You Lose, press Enter to restart`, 200, 200)
		context.fillText(`Score: ${Math.floor(score)}`, 350, 100)
    score = 0;
    platforms = __WEBPACK_IMPORTED_MODULE_1__platform_js__["a" /* clearPlatforms */]()

		if (ended === false){
			context.beginPath();
			context.globalCompositeOperation = "source-over";
			context.globalAlpha = 1;
			init()
		}

	}




  context.fillStyle = "white"
  context.fillRect(0,0,width,height)
  context.strokeStyle = "black";
  context.strokeRect(0, 0, width, height);

  var pausebutton = new Image()
  pausebutton.src = "assets/images/pause_button.png"


	const drawLives = () => {
		let currentpos = 30

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
			currentpos += 35
		}
		for (var i = 0; i < (5 - lives); i++) {
			context.beginPath();
			context.arc(currentpos, 60, 15, 0, 2 * Math.PI, false);
			context.lineWidth = 3;
			context.strokeStyle = '#099cff';
			context.stroke();
			context.lineWidth = 1;
			context.strokeStyle = 'white';
			context.stroke();
			currentpos += 35
		}

		context.fillStyle = 'white';

	}



  const init = (token) => {

		context.clearRect(0,0, width, height)

		if (lives === 5){
			context.drawImage(gamebackground,0, 0, width , height);
			platforms = __WEBPACK_IMPORTED_MODULE_1__platform_js__["a" /* clearPlatforms */]()
			platforms = __WEBPACK_IMPORTED_MODULE_1__platform_js__["c" /* init */](context, token)
			player = __WEBPACK_IMPORTED_MODULE_0__vehicle_js__["a" /* init */](context)
			interval_id = setInterval(move, 1000/60);
			return
		}

    if (lives > 0){
      context.drawImage(gamebackground,0, 0, width , height);
			player = __WEBPACK_IMPORTED_MODULE_0__vehicle_js__["a" /* init */](context)
			platforms = __WEBPACK_IMPORTED_MODULE_1__platform_js__["c" /* init */](context, token)
      interval_id = setInterval(move, 1000/60);
    } else {
    }

  }

  const onPlatform = (array) => {
		if (array){
	    for (var i = 0; i < array.length; i++) {
	      if ((player.x + 60 > array[i].x) && (player.x < array[i].x + 775) && (player.y < array[i].y) ) return true;
	    }
	}
    return false;
  }

  const move = () => {

    context.clearRect(0,0, width, height)
    context.drawImage(gamebackground, 0 , 0, width, height);

		drawLives()
    context.drawImage(pausebutton,740,10,50,50)
    score += 0.01;


    let currentPlatform;

    if (onPlatform(platforms)) {
      let cp;
      for (var i = 0; i < platforms.length; i++) {
        if ((player.x + 60 > platforms[i].x) && (player.x < platforms[i].x + (platforms[i].width - 15)) && player.y <= platforms[i].y - 20){
           if (!cp || platforms[i].y < cp.y){
             cp = platforms[i];
           }
        }
      }
      if (cp){
        currentPlatform = cp;
      }
    }





    if (currentPlatform){
      previousplatform = currentPlatform;
    }


    if (currentPlatform && player.token === "start"){
      player = __WEBPACK_IMPORTED_MODULE_0__vehicle_js__["b" /* move */](currentPlatform)
      platforms = __WEBPACK_IMPORTED_MODULE_1__platform_js__["d" /* move */](context)
    }
    else if (currentPlatform) {
      platforms = __WEBPACK_IMPORTED_MODULE_1__platform_js__["d" /* move */](context)
      player = __WEBPACK_IMPORTED_MODULE_0__vehicle_js__["b" /* move */](currentPlatform)
    }
    else if (!currentPlatform && player.jumping === true){
      player = __WEBPACK_IMPORTED_MODULE_0__vehicle_js__["b" /* move */](previousplatform)
      platforms = __WEBPACK_IMPORTED_MODULE_1__platform_js__["d" /* move */](context)
    }
    else if (!currentPlatform){
      token = "falling"
      player = __WEBPACK_IMPORTED_MODULE_0__vehicle_js__["b" /* move */](previousplatform, "falling")
      platforms = __WEBPACK_IMPORTED_MODULE_1__platform_js__["d" /* move */](context)
    }

    // loseconditions

    if (player.y >= 400){
      clearInterval(interval_id)
      player = __WEBPACK_IMPORTED_MODULE_0__vehicle_js__["c" /* resetVehicle */]()
      lives -=1;
			if (lives > 0) {
				init("restart")
			} else {
				ended = true
				endScreen();
			}
    }



    for (var i = 0; i < platforms.length; i++) {
				if (platforms[i].obstacles) {
		      if (inObstacleArray(platforms[i]) !== false){

		        clearInterval(interval_id)
		        player = __WEBPACK_IMPORTED_MODULE_0__vehicle_js__["c" /* resetVehicle */]()
						lives -= 1

						if (lives > 0) {
							init("restart")
						} else
						{
							ended = true
							endScreen()
						}

	      } else if (inPCA(platforms[i]) !== false ){
				  let currentCube = inPCA(platforms[i])
					 platforms[i].popped.push(currentCube.x)
					 score += 10;
			 }


		 }
		}



		// context.font = "normal normal 20px comic sans";
		context.font         = '30px Arcade-Classic';
    context.fillText(`Score: ${Math.floor(score)}`, 16, 30)

    if (currentPlatform === platforms[platforms.length - 1]) {
      clearInterval(interval_id)
			platforms = __WEBPACK_IMPORTED_MODULE_1__platform_js__["b" /* generatePlatforms */](context)
      interval_id = setInterval(move, 1000/60);

    }
  }


  const handlePause = () => {
    if (pause.clicked === true && pause.gamePaused === false){
      clearInterval(interval_id)
      pause.gamePaused = true
      pause.clicked = false
    } else if (pause.clicked === true && pause.gamePaused === true){
      interval_id = setInterval(move, 1000/60)
      pause.clicked = false;
      pause.gamePaused = false;
    }
  }


  const handleClick = (e) => {
    let horizontalpos = e.clientX - e.target.offsetLeft
    let verticalpos = e.clientY - e.target.offsetTop

    if ((horizontalpos >= 740 && horizontalpos <= 790) && (verticalpos >= 10 && verticalpos <= 60)){
      pause.clicked = true
      handlePause();
    }
  }

  const inPCA = (platform) => {
    let cubes = platform.powercubes
    for (let j = 0; j < cubes.length; j++) {
       if ((player.x < cubes[j].x - 44 && player.x > cubes[j].x - 53 ) && player.y >= cubes[j].y - 30 && onPlatform(platforms) && player.y <= cubes[j].y + 10){
         return cubes[j];
       }
    }
    return false
  }

  const inObstacleArray = (platform) => {
    let obstacles = platform.obstacles
    for (let j = 0; j < obstacles.length; j++) {
       if ((player.x > obstacles[j].x - 50 && player.x < obstacles[j].x) && (player.y > obstacles[j].y - 30 && player.y < obstacles[j].y + 30)){
         return obstacles[j];
       }
    }
    return false
  }


	startScreen()


  $(window).keypress((e) => {

		if(started === false && ended === false && e.keyCode === 13){
			started = true
			init()
		} else if(started === false && ended === true){
			ended = false
		}
    if (e.keyCode === 112) {
     pause.clicked = true;
     handlePause()
   }
 })

 $(window).click(e => {
   handleClick(e);
 })
})

window.onload=function(){
  let canvas = $("canvas")[0]
  let context = canvas.getContext("2d")
  let width = 800
  let height = 400
  var startbackground = new Image()
  startbackground.src = "assets/images/buggati8bit.jpg"
  context.drawImage(startbackground, 0, 0, width, height);
  context.strokeStyle = "green"
  context.lineWidth = 3;
  context.strokeRect(155, 12, 500, 50)
  context.font  = '40px Arcade-Classic';
  context.fillText(`Press Enter to start`, 200, 50)
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export player */
/* unused harmony export vehicleimg */



var player = {x: 400, y: 0, falljumped: false, jumping: true, direction: null, token: "start", doublejumping: false, falling: false}
var vehicleimg = new Image()
vehicleimg.src = "assets/images/vehicle.png"
var platform;
var doublejumpstart;
var doublejumped = false;
var falljumpstart;
var startpos;
var gravity = 12;
var platjumpstart;


const resetVehicle = () => {
  player = { }
  return player
}
/* harmony export (immutable) */ __webpack_exports__["c"] = resetVehicle;


const init = (context) => {

  player = {x: 400, y: 0, jumping: true, direction: null, falljumped: false, token: "start", doublejumping: false, falling: false}
  context.drawImage(vehicleimg,player.x,player.y,60,30)
  return player
}
/* harmony export (immutable) */ __webpack_exports__["a"] = init;



const move = (plat, token) => {


  if (player.token === "start"){
    startpos = plat.y - 20;
    player.jumping = false
  }
  else if (token === "falling"){
    player.token = "falling"
  }
  else if(player.y > platjumpstart && player.y > plat.y - 20){}
  else{
    player.token = null;

  }

  if (doublejumpstart && player.y < platform.y-20 && doublejumpstart > platform.y - 20){
    doublejumpstart = platform.y - 20
  }





  platform = plat;
  const canvas = $("canvas")[0]
  const context = canvas.getContext("2d")


  if  (startpos && player.y === startpos){
  player.token = null;
  startpos = null;
  doublejumped = false
  doublejumpstart = null;
  player.token = null;
  falljumpstart = null;
  player.falljumped = false;

  }
   else if  (startpos && player.y < startpos){
    player.y += 5
  }
  else if (player.y <= (doublejumpstart - 78) && player.doublejumping === true) {
    player.doublejumping = false
    player.jumping = false
    gravity = 1;
    player.y += gravity
    gravity += 1
  }
  else if (player.y < (doublejumpstart) && player.doublejumping === true && (player.y < platform.y - 20)) {
    player.y -= gravity
    gravity -= 1;
  }
  else if ((player.y < (doublejumpstart)) && player.doublejumping === false && (player.y < platform.y - 20)) {
    player.y += gravity
    gravity += 1;
  }
    else if (player.y === (doublejumpstart) && player.doublejumping === true && (player.y < platform.y - 20)) {
      gravity = 12;
      player.y -= gravity
      gravity -= 1
    }


      else if (player.token === "falling" && player.jumping === false ){
        player.y += 5;
    } else if  (falljumpstart && player.jumping === true && player.y === falljumpstart){
        gravity = 12;
        player.y -= gravity
        gravity -= 1;
      }
      else if  (falljumpstart && player.jumping === true && player.y > falljumpstart - 78 ){
        player.y -= gravity
        gravity -= 1;
      }
      else if  (falljumpstart && player.jumping === true && player.y <= falljumpstart - 78 && (player.y < platform.y - 20)){
        falljumpstart = null;
        player.jumping = false;
        gravity = 1;
        player.y += gravity;
        gravity += 1;
  }
   else if (((player.y <= (platform.y - 98)) ||(player.y <= (platjumpstart - 98) )) && player.jumping === true) {
    player.jumping = false
    gravity = 1;
    player.y += gravity;
    gravity += 1;
    platjumpstart = null;
  }
  else if ((player.y + gravity) >= (platform.y - 20) && player.jumping === false && player.y !== platform.y - 20) {
    player.y = platform.y - 20;
  }
   else if (player.y < (platform.y - 20) && player.jumping === false) {
    player.y += gravity
    gravity += 1;
  }
  else if (player.y === (platform.y - 20) && player.jumping === false){
    doublejumped = false
    doublejumpstart = null;
    player.token = null;
    falljumpstart = null;
    gravity = 12;
    platjumpstart = player.y

  } else if (player.y <= (platform.y - 20) && player.jumping === true) {
    player.y -= gravity
    gravity -= 1;
  }

   else if (player.y > platform.y - 20 && player.jumping === false) {
    player.token = "falling"
  } else if (player.y > platform.y - 20 && player.jumping === true && player.y <= platjumpstart -78){
    gravity = 1;
    player.y -= gravity;
    gravity +=1;
    platjumpstart = null;
    player.jumping = false;
  } else if (player.y > platform.y - 20 && player.jumping === true && player.y <= platjumpstart){
    player.y -= gravity;
    gravity -= 1

  } else if (player.y > platform.y - 20 && player.jumping === true && player.y > platjumpstart) {
    player.jumping = false
  } else {
    debugger
  }
  context.drawImage(vehicleimg,player.x+10,player.y,60,30)

  return player

}
/* harmony export (immutable) */ __webpack_exports__["b"] = move;


$(window).keypress((e) => {


  if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && player.token === "start" ){
    e.preventDefault();
    player.jumping = false;
  } else if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && doublejumped === true){
    return
  }
  else if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && player.token === "falling" && player.jumping === false && player.falljumped === false){
    e.preventDefault();
    player.jumping = true;
    falljumpstart = player.y
    player.falljumped = true;
  } else if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && player.token === "falling" && player.jumping === true && doublejumped === false){
    e.preventDefault();
    player.doublejumping = true;
    doublejumped = true;
    doublejumpstart = player.y
  }
   else if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && (player.y === (platform.y - 20))) {
   e.preventDefault();
   player.jumping = true;
 } else if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && (doublejumped === false)) {
   e.preventDefault();
   player.doublejumping = true;
   doublejumped = true;
   doublejumpstart = player.y
 }
})

$(window).keyup((e) => {
  e.preventDefault()
  player.direction = null;
})


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export platforms */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__obstacle_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__powerup_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__platform_arrays_js__ = __webpack_require__(5);





var platforms = __WEBPACK_IMPORTED_MODULE_2__platform_arrays_js__["a" /* initialPlatforms */]()
var difficuly = 3;


const init = (context, token) => {
  let gennum
  if (token === "regen"){
    gennum = 3
  } else {
    gennum = 0
  }
  // Obstacle.clearObstacles()
  // PowerCube.clearpowercubes()

  for (let i = gennum; i < platforms.length; i++) {
    context.strokeStyle = "#01a502";
    context.lineWidth = 5
    context.strokeRect(platforms[i].x, platforms[i].y, platforms[i].width, 50);
    if (token === "restart"){
      platforms[i].obstacles = __WEBPACK_IMPORTED_MODULE_0__obstacle_js__["d" /* restartFind */](i)
      platforms[i].powercubes = __WEBPACK_IMPORTED_MODULE_1__powerup_js__["d" /* restartFind */](i)
  } else if (token === "regen"){
      platforms[i].obstacles = __WEBPACK_IMPORTED_MODULE_0__obstacle_js__["b" /* init */](context, platforms[i], i, "regen")
      platforms[i].powercubes = __WEBPACK_IMPORTED_MODULE_1__powerup_js__["b" /* init */](context, platforms[i], i, "regen")
    } else {
      platforms[i].obstacles = __WEBPACK_IMPORTED_MODULE_0__obstacle_js__["b" /* init */](context, platforms[i], i)
      platforms[i].powercubes = __WEBPACK_IMPORTED_MODULE_1__powerup_js__["b" /* init */](context, platforms[i], i)
    }
  }
  return platforms
}
/* harmony export (immutable) */ __webpack_exports__["c"] = init;




const move = (context) => {
  for (var i = 0; i < platforms.length; i++) {
    context.strokeStyle = "#01a502";
    context.lineWidth = 3
    context.strokeRect(platforms[i].x, platforms[i].y, platforms[i].width, 50);
    platforms[i].x -= platforms[i].speed
    platforms[i].obstacles = __WEBPACK_IMPORTED_MODULE_0__obstacle_js__["c" /* move */](context, platforms[i], i, platforms[i].popped)
    platforms[i].powercubes = __WEBPACK_IMPORTED_MODULE_1__powerup_js__["c" /* move */](context, platforms[i], i, platforms[i].popped)
  }
  window.platforms = platforms;
  return platforms
}
/* harmony export (immutable) */ __webpack_exports__["d"] = move;


const generatePlatforms = (context) => {
  let endoflast = platforms[platforms.length -1].x + platforms[platforms.length -1].width
  let newplatforms = [platforms[platforms.length-3],platforms[platforms.length - 2],platforms[platforms.length - 1]].concat(__WEBPACK_IMPORTED_MODULE_2__platform_arrays_js__["b" /* platformGenerator */](endoflast, platforms[platforms.length-1].id, Math.floor(difficuly)))

  platforms = newplatforms
  // PowerCube.clearpowercubes()
  // for (var i = 0; i < platforms.length; i++) {
  //   platforms[i].obstacles = Obstacle.init(context, platforms[i])
  //   platforms[i].powercubes = PowerCube.init(context, platforms[i], i, "regen")
  // }


  init(context, "regen")
  difficuly += 0.5

}
/* harmony export (immutable) */ __webpack_exports__["b"] = generatePlatforms;


const clearPlatforms = () => {
  platforms = __WEBPACK_IMPORTED_MODULE_2__platform_arrays_js__["a" /* initialPlatforms */]()
  __WEBPACK_IMPORTED_MODULE_0__obstacle_js__["a" /* clearObstacles */]()
  __WEBPACK_IMPORTED_MODULE_1__powerup_js__["a" /* clearpowercubes */]()
  difficuly = 3;
  return platforms;
}
/* harmony export (immutable) */ __webpack_exports__["a"] = clearPlatforms;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

const initialPlatforms = () => ([
  {x: 200, y: 230, speed: 3, obstacles: null, powercubes: null, popped: [], width: 800, id: 1},
  {x: 1050, y: 350, speed: 3, obstacles: null, powercubes: null, popped: [], width: 800, id: 2},
  {x: 1800, y: 300, speed: 3, obstacles: null, powercubes: null, popped: [], width: 800, id: 3},
  {x: 2650, y: 250, speed: 3, obstacles: null, powercubes: null, popped: [], width: 800, id: 4}
])
/* harmony export (immutable) */ __webpack_exports__["a"] = initialPlatforms;


// Level things

const platformGenerator = (endoflast, id, diff) => {

let platforms = [
  [
  {x: (endoflast + 50), y: 230, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+1},
  {x: (endoflast + 900), y: 350, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+2},
  {x: (endoflast + 900), y: 200, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+3},
  {x: (endoflast + 1750), y: 260, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+4}
  ],[
  {x: (endoflast + 60), y: 230, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+1},
  {x: (endoflast + 910), y: 350, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+2},
  {x: (endoflast + 1680), y: 300, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+3},
  {x: (endoflast + 2430), y: 250, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+4}
  ],[
  {x: (endoflast + 50), y: 230, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+1},
  {x: (endoflast + 70), y: 0, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+2},
  {x: (endoflast + 820), y: 200, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+3},
  {x: (endoflast + 1650), y: 150, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+4}
  ],[
  {x: (endoflast + 90), y: 360, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+1},
  {x: (endoflast + 30), y: 140, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+2},
  {x: (endoflast + 920), y: 280, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+3},
  {x: (endoflast + 1650), y: 220  , speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+4}
  ],[
  {x: (endoflast + 90), y: 360, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+1},
  {x: (endoflast + 30), y: 140, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+2},
  {x: (endoflast + 70), y: 250, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+3},
  {x: (endoflast + 900), y: 220, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+4}
  ]
]


return platforms[Math.floor(Math.random()*platforms.length)].slice(0);

}
/* harmony export (immutable) */ __webpack_exports__["b"] = platformGenerator;


const widthGenerator = () => (
  Math.floor(Math.random() * (800 - 700 + 1)) + 700
)
/* unused harmony export widthGenerator */



/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map
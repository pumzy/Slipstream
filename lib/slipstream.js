import * as Vehicle from './vehicle.js'
import * as Platform from './platform.js'
import * as Obstacle from './obstacle.js'
import * as PowerCube from './powerup.js'





document.addEventListener("DOMContentLoaded", () => {
  const canvas = $("canvas")[0]
  const context = canvas.getContext("2d")
  const width = 800
  const height = 400

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


	const startScreen = () => {
		if (started === false){
			context.clearRect(0,0, width, height)
	    context.fillText(`Press any key to start`, 200, 200)
		}

	}

	const endScreen = () => {

		started = false
		// PowerCube.clearpowercubes()
		// Platform.clearPlatforms()
		// Vehicle.resetVehicle()
		// Obstacle.clearObstacles()
		score = 0;

		var pause = {clicked: false, gamePaused: false}
		token = null;
		lives = 5;
		started = false
		context.fillText(`You Lose, press any key to restart`, 200, 200)

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

  var gamebackground = new Image()
  gamebackground.src = "assets/images/starbackground.jpg"

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
			platforms = Platform.clearPlatforms()
			platforms = Platform.init(context, token)
			player = Vehicle.init(context)
			interval_id = setInterval(move, 1000/60);
			return
		}

    if (lives > 0){
      context.drawImage(gamebackground,0, 0, width , height);
			player = Vehicle.init(context)
			platforms = Platform.init(context, token)
      interval_id = setInterval(move, 1000/60);
    } else {
			console.log("bug")
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



    let currentPlatform;

    if (onPlatform(platforms)) {
      let cp;
      for (var i = 0; i < platforms.length; i++) {
        if ((player.x + 60> platforms[i].x) && (player.x < platforms[i].x + (platforms[i].width - 25)) && player.y <= platforms[i].y - 20){
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
      player = Vehicle.move(currentPlatform)
      platforms = Platform.move(context)
    }
    else if (currentPlatform) {
      platforms = Platform.move(context)
      player = Vehicle.move(currentPlatform)
    }
    else if (!currentPlatform && player.jumping === true){
      player = Vehicle.move(previousplatform)
      platforms = Platform.move(context)
    }
    else if (!currentPlatform){
      token = "falling"
      player = Vehicle.move(previousplatform, "falling")
      platforms = Platform.move(context)
    }

    // loseconditions

    if (player.y === 400){
      clearInterval(interval_id)
      player = Vehicle.resetVehicle()
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
		      if ( onPlatform(platforms) && (player.x > platforms[i].obstacles.x - 30 && player.x < platforms[i].obstacles.x -10) && player.y > platforms[i].obstacles.y - 30 && player.y < platforms[i].obstacles.y + 30){

		        console.log("you lose")
		        clearInterval(interval_id)
		        player = Vehicle.resetVehicle()
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
					 score += 5;
			 }


		 }
		}



		// context.font = "normal normal 20px comic sans";
		context.font         = '30px Arcade-Classic';
    context.fillText(`Score: ${score}`, 16, 30)

    if (currentPlatform === platforms[platforms.length - 1]) {
      clearInterval(interval_id)
			platforms = Platform.generatePlatforms(context)
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
    for (var j = 0; j < cubes.length; j++) {
       if ((player.x < cubes[j].x - 27 && player.x > cubes[j].x - 33 ) && player.y >= cubes[j].y - 30 && onPlatform(platforms) && player.y <= cubes[j].y + 10){
         return cubes[j];
       }
    }
    return false
  }


	startScreen()


  $(window).keypress((e) => {

		if(started === false && ended === false){
			started = true
			init()
		} else if(started === false && ended === true){
			ended = false
		}
    if (e.keyCode === 112) {
     pause.clicked = true;
     console.log("pausebutton")
     handlePause()
   }
 })

 $(window).click(e => {
   handleClick(e);
 })
})

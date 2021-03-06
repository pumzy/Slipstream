import * as Vehicle from './vehicle.js'
import * as Platform from './platform.js'
import * as Obstacle from './obstacle.js'
import * as PowerCube from './powerup.js'
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
    platforms = Platform.clearPlatforms()

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

    if (player.y >= 400){
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
		      if (inObstacleArray(platforms[i]) !== false){

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
					 score += 10;
			 }


		 }
		}



		// context.font = "normal normal 20px comic sans";
		context.font         = '30px Arcade-Classic';
    context.fillText(`Score: ${Math.floor(score)}`, 16, 30)

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
    for (let j = 0; j < cubes.length; j++) {
       if ((player.x <= cubes[j].x - 44 && player.x >= cubes[j].x - 53 ) && player.y >= cubes[j].y - 30 && onPlatform(platforms) && player.y <= cubes[j].y + 10){
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

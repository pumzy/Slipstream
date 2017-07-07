import * as Vehicle from './vehicle.js'
import * as Platform from './platform.js'

document.addEventListener("DOMContentLoaded", () => {
  const canvas = $("canvas")[0]
  const context = canvas.getContext("2d")
  const width = 800
  const height = 400




  context.fillStyle = "white"
  context.fillRect(0,0,width,height)
  context.strokeStyle = "black";
  context.strokeRect(0, 0, width, height);

  var pausebutton = new Image()
  pausebutton.src = "assets/images/pause_button.png"

  var gamebackground = new Image()
  gamebackground.src = "assets/images/starbackground.jpg"



  var interval_id;
  var player;
  var platforms;
  var previousplatform;
  var score = 0;
  var pause = {clicked: false, gamePaused: false}
  var token;
  var lives = 5;




  const init = () => {

    

    if (lives > 0){
      context.drawImage(gamebackground,0, 0, width , height);
      player = Vehicle.init(context)
      platforms = Platform.init(context)
      interval_id = setInterval(move, 1000/60);
    } else {
      context.clearRect(0,0, width, height)
      context.fillText(`You Lose`, 200, 200)
    }

  }

  const onPlatform = (array) => {
    for (var i = 0; i < array.length; i++) {
      if ((player.x + 60 > array[i].x) && (player.x < array[i].x + 775) && (player.y < array[i].y) ) return true;
    }
    return false;
  }

  const move = () => {
    context.clearRect(0,0, width, height)
    context.drawImage(gamebackground, 0 , 0, width, height);


    context.drawImage(pausebutton,740,10,50,50)



    let currentPlatform;

    if (onPlatform(platforms)) {
      let cp;
      for (var i = 0; i < platforms.length; i++) {
        if ((player.x + 60> platforms[i].x) && (player.x < platforms[i].x + 775) && player.y <= platforms[i].y - 20){
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
      init()
    }
    for (var i = 0; i < platforms.length; i++) {
      if ( onPlatform(platforms) && (player.x > platforms[i].obstacles.x - 30 && player.x < platforms[i].obstacles.x -10) && player.y > platforms[i].obstacles.y - 30 && player.y < platforms[i].obstacles.y + 30){
        console.log("you lose")
        clearInterval(interval_id)
        player = Vehicle.resetVehicle()
        lives -=1;
        init()
        break;
      } else if ((player.x === platforms[i].powercubes.x - 30) && player.y > platforms[i].powercubes.y - 30 && onPlatform(platforms) && player.y < platforms[i].powercubes.y){
        score += 5;
        platforms[i].popped = "popped"
      }
    }

    context.fillText(`Score: ${score}`, 5, 20)
    if (currentPlatform === platforms[platforms.length - 1]) {
      platforms = Platform.generatePlatforms(context)
      clearInterval(interval_id)
      interval_id = setInterval(move, 1000/60);

    }
  }

  // End of move function

  init()

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

  $(window).keypress((e) => {
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

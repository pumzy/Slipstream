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
  var interval_id

  var player;
  var platforms;
  var previousplatform;
  var score;




  const init = () => {
    context.fillStyle = "black"
    context.fillRect(0,0,width,height)
    context.strokeStyle = "black";
    context.strokeRect(0, 0, width, height);
    player = Vehicle.init(context)
    platforms = Platform.init(context)
    interval_id = setInterval(move, 20)
    score = 0;
  }

  const onPlatform = (array) => {
    for (var i = 0; i < array.length; i++) {
      if ((player.x + 60 > array[i].x) && (player.x < array[i].x + 775) && (player.y < array[i].y) ) return true;
    }
    return false;
  }

  const move = () => {
    context.fillStyle = "black"
    context.fillRect(0,0,width,height)
    context.strokeStyle = "black";
    context.strokeRect(0, 0, width, height);

    // Conditional logic before the move homie

    let currentPlatform;

    if (onPlatform(platforms)) {
      for (var i = 0; i < platforms.length; i++) {
        if ((player.x + 60> platforms[i].x) && (player.x < platforms[i].x + 775)){
          currentPlatform = platforms[i]
        }
      }
    }



    if (currentPlatform){
      previousplatform = currentPlatform;
    }

    if (onPlatform(platforms)) {
      platforms = Platform.move(context)
      player = Vehicle.move(currentPlatform)
    } else if (!onPlatform(platforms) && player.jumping === true){
      player = Vehicle.move(previousplatform)
      platforms = Platform.move(context)
    } else if (!onPlatform(platforms)){
      player = Vehicle.move(currentPlatform, "falling")
      platforms = Platform.move(context)
    }

    if (player.y === 400){
      clearInterval(interval_id)
      init()
    }


    for (var i = 0; i < platforms.length; i++) {
      if ((player.x > platforms[i].obstacles.x - 30 && player.x < platforms[i].obstacles.x -10) && player.y > platforms[i].obstacles.y - 30 && onPlatform(platforms)){
        console.log("you lose")
        clearInterval(interval_id)
        init()
      } else if ((player.x === platforms[i].powercubes.x - 30) && player.y > platforms[i].powercubes.y - 30 && onPlatform(platforms)){
        score += 5;
        platforms[i].popped = "popped"
      }
    }


    context.fillText(`Score: ${score}`, 5, 20)
  }



  init()
})

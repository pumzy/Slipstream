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
  var platform;




  const init = () => {
    context.fillStyle = "black"
    context.fillRect(0,0,width,height)
    context.strokeStyle = "black";
    context.strokeRect(0, 0, width, height);
    player = Vehicle.init(context)
    platform = Platform.init(context)
    interval_id = setInterval(move, 20)
  }


  const move = () => {
    context.fillStyle = "black"
    context.fillRect(0,0,width,height)
    context.strokeStyle = "black";
    context.strokeRect(0, 0, width, height);

    // Conditional logic before the move homie

    platform = Platform.move(context)
    player = Vehicle.move(platform)






    if (player.x < platform.x - 25 || player.x > platform.x + 775){
      player = Vehicle.move(platform, "falling")
    }

    if (player.x < platform.x - 25 || player.y === 400){
      clearInterval(interval_id)
      init()
    }
    debugger
    if (player.x === platform.obstacles.x - 14 && player.y > platform.obstacles.y - 40){
      console.log("you lose")
      clearInterval(interval_id)
      init()
    }


  }

  init()
})

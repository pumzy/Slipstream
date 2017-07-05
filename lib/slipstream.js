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





  const init = () => {
    context.fillStyle = "black"
    context.fillRect(0,0,width,height)
    context.strokeStyle = "black";
    context.strokeRect(0, 0, width, height);
    Vehicle.init(context)
    Platform.init(context)
    interval_id = setInterval(move, 20)
  }


  const move = () => {
    context.fillStyle = "black"
    context.fillRect(0,0,width,height)
    context.strokeStyle = "black";
    context.strokeRect(0, 0, width, height);
    let platform = Platform.move(context)
    let player = Vehicle.move(context)

    if (player.x < platform.x -25 || player.x > platform.x + 775){
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

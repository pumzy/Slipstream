import * as Obstacle from './obstacle.js'

export var platform = {x: 200, y: 230, speed: 2, obstacles: null}

// const canvas = $("canvas")[0]
// const context = canvas.getContext("2d")



export const init = (context) => {
  // const canvas = $("canvas")[0]
  // const context = canvas.getContext("2d")
  platform = {x: 200, y: 220, speed: 2, obstacles: null}

  context.fillStyle = "darkgray"

  context.fillRect(platform.x,platform.y,800,50)
  context.strokeStyle =   "red";
  context.linewidth = 5 
  context.strokeRect(platform.x, platform.y, 800, 50);
  platform.obstacles = Obstacle.init(context)

  return platform
}


//
export const move = (context) => {
  context.fillStyle = "darkgray"
  context.fillRect(platform.x,platform.y,800,50)
  context.strokeStyle = "red";
  context.linewidth = 5
  context.strokeRect(platform.x, platform.y, 800, 50);

  platform.x -= platform.speed
  platform.obstacles = Obstacle.move(context, platform.speed)
  return platform
}

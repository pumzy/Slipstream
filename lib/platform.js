import * as Obstacle from './obstacle.js'

export var platforms = [{x: 200, y: 230, speed: 2, obstacles: null}, {x: 1050, y: 350, speed: 2, obstacles: null}]





export const init = (context) => {

  platforms = [{x: 200, y: 230, speed: 2, obstacles: null}, {x: 1050, y: 350, speed: 2, obstacles: null}]
  Obstacle.clearObstacles()
  context.fillStyle = "darkgray"

  for (var i = 0; i < platforms.length; i++) {
    context.fillStyle = "darkgray"
    context.fillRect(platforms[i].x,platforms[i].y,800,50)
    context.strokeStyle = "red";
    context.linewidth = 5
    context.strokeRect(platforms[i].x, platforms[i].y, 800, 50);
    platforms[i].obstacles = Obstacle.init(context, platforms[i])
  }

  return platforms
}



export const move = (context) => {
  for (var i = 0; i < platforms.length; i++) {
    context.fillStyle = "darkgray"
    context.fillRect(platforms[i].x,platforms[i].y,800,50)
    context.strokeStyle = "red";
    context.linewidth = 5
    context.strokeRect(platforms[i].x, platforms[i].y, 800, 50);
    platforms[i].x -= platforms[i].speed
    platforms[i].obstacles = Obstacle.move(context, platforms[i], i)
  }

  return platforms
}

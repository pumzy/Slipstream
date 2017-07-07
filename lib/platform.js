import * as Obstacle from './obstacle.js'
import * as PowerCube from './powerup.js'

















export var platforms = [{x: 200, y: 230, speed: 2, obstacles: null, powercubes: null, popped: null}, {x: 1050, y: 350, speed: 2, obstacles: null, powercubes: null, popped: null}, {x: 1050, y: 160, speed: 2, obstacles: null, powercubes: null, popped: null}, {x: 1800, y: 260, speed: 2, obstacles: null, powercubes: null, popped: null}]



export const init = (context) => {

  if (platforms.length === 4){
    platforms = [{x: 200, y: 230, speed: 2, obstacles: null, powercubes: null, popped: null}, {x: 1050, y: 350, speed: 2, obstacles: null, powercubes: null, popped: null}, {x: 1050, y: 160, speed: 2, obstacles: null, powercubes: null, popped: null}, {x: 1800, y: 260, speed: 2, obstacles: null, powercubes: null, popped: null}]
  }

  Obstacle.clearObstacles()
  PowerCube.clearpowercubes()
  context.fillStyle = "darkgray"

  for (var i = 0; i < platforms.length; i++) {
    context.strokeStyle = "#01a502";
    context.lineWidth = 5
    context.strokeRect(platforms[i].x, platforms[i].y, 800, 50);
    platforms[i].obstacles = Obstacle.init(context, platforms[i])
    platforms[i].powercuber = PowerCube.init(context, platforms[i])
  }

  return platforms
}



export const move = (context) => {
  for (var i = 0; i < platforms.length; i++) {
    // context.fillStyle = "darkgray"
    // context.fillRect(platforms[i].x,platforms[i].y,800,50)
    context.strokeStyle = "#01a502";
    context.lineWidth = 3
    context.strokeRect(platforms[i].x, platforms[i].y, 800, 50);
    platforms[i].x -= platforms[i].speed
    platforms[i].obstacles = Obstacle.move(context, platforms[i], i, platforms[i].popped)
    platforms[i].powercubes = PowerCube.move(context, platforms[i], i, platforms[i].popped)
  }

  return platforms
}

export const generatePlatforms = (context) => {
  let endoflast = platforms[platforms.length -1].x + 800
  let newplatforms = [platforms[platforms.length-3],platforms[platforms.length - 2],platforms[platforms.length - 1]].concat([{x: (endoflast + 50), y: 230, speed: 2, obstacles: null, powercubes: null, popped: null}, {x: (endoflast + 1050), y: 350, speed: 2, obstacles: null, powercubes: null, popped: null}, {x: (endoflast + 1050), y: 160, speed: 2, obstacles: null, powercubes: null, popped: null}, {x: (endoflast + 1800), y: 260, speed: 2, obstacles: null, powercubes: null, popped: null}])
  platforms = newplatforms
  for (var i = 0; i < platforms.length; i++) {
    platforms[i].obstacles = Obstacle.init(context, platforms[i])
    platforms[i].powercubes = PowerCube.init(context, platforms[i])
  }

  init(context)
  return platforms
}

export const clearPlatforms = () => {
  platforms = [];
}

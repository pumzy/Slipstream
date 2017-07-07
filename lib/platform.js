import * as Obstacle from './obstacle.js'
import * as PowerCube from './powerup.js'
import * as PlatformArrays from './platform-arrays.js'


export var platforms = PlatformArrays.initialPlatforms



export const init = (context, token) => {
  debugger
  if (platforms.length === 4){
    platforms =  PlatformArrays.initialPlatforms
  }

  Obstacle.clearObstacles()
  // PowerCube.clearpowercubes()
  context.fillStyle = "darkgray"

  for (var i = 0; i < platforms.length; i++) {
    context.strokeStyle = "#01a502";
    context.lineWidth = 5
    context.strokeRect(platforms[i].x, platforms[i].y, platforms[i].width, 50);
    if (token !== "restart"){
      platforms[i].obstacles = Obstacle.init(context, platforms[i])
    platforms[i].powercubes = PowerCube.init(context, platforms[i], i, token)
  } else {
    platforms[i].obstacles = Obstacle.init(context, platforms[i])
  }
  }
  return platforms
}



export const move = (context) => {
  for (var i = 0; i < platforms.length; i++) {
    context.strokeStyle = "#01a502";
    context.lineWidth = 3
    context.strokeRect(platforms[i].x, platforms[i].y, platforms[i].width, 50);
    platforms[i].x -= platforms[i].speed
    platforms[i].obstacles = Obstacle.move(context, platforms[i], i, platforms[i].popped)
    platforms[i].powercubes = PowerCube.move(context, platforms[i], i, platforms[i].popped)
  }

  return platforms
}

export const generatePlatforms = (context) => {
  let endoflast = platforms[platforms.length -1].x +  platforms[platforms.length -1].width
  let newplatforms = [platforms[platforms.length-3],platforms[platforms.length - 2],platforms[platforms.length - 1]].concat(PlatformArrays.platformGenerator(endoflast))

  platforms = newplatforms
  PowerCube.clearpowercubes()
  for (var i = 0; i < platforms.length; i++) {
    platforms[i].obstacles = Obstacle.init(context, platforms[i])
    platforms[i].powercubes = PowerCube.init(context, platforms[i], i, "regen")
  }


  init(context)
  return platforms
}

export const clearPlatforms = () => {
  platforms = [];
}

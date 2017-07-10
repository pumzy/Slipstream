import * as Obstacle from './obstacle.js'
import * as PowerCube from './powerup.js'
import * as PlatformArrays from './platform-arrays.js'


export var platforms = PlatformArrays.initialPlatforms()
var difficuly = 3;


export const init = (context, token) => {
  let gennum
  if (token === "regen"){
    gennum = 3
  } else {
    gennum = 0
  }
  // Obstacle.clearObstacles()
  // PowerCube.clearpowercubes()

  for (let i = gennum; i < platforms.length; i++) {
    context.strokeStyle = "#01a502";
    context.lineWidth = 5
    context.strokeRect(platforms[i].x, platforms[i].y, platforms[i].width, 50);
    if (token === "restart"){
      platforms[i].obstacles = Obstacle.restartFind(i)
      platforms[i].powercubes = PowerCube.restartFind(i)
  } else if (token === "regen"){
      platforms[i].obstacles = Obstacle.init(context, platforms[i], i, "regen")
      platforms[i].powercubes = PowerCube.init(context, platforms[i], i, "regen")
    } else {
      platforms[i].obstacles = Obstacle.init(context, platforms[i], i)
      platforms[i].powercubes = PowerCube.init(context, platforms[i], i)
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
  window.platforms = platforms;
  return platforms
}

export const generatePlatforms = (context) => {
  let endoflast = platforms[platforms.length -1].x + platforms[platforms.length -1].width
  let newplatforms = [platforms[platforms.length-3],platforms[platforms.length - 2],platforms[platforms.length - 1]].concat(PlatformArrays.platformGenerator(endoflast, platforms[platforms.length-1].id, Math.floor(difficuly)))

  platforms = newplatforms
  // PowerCube.clearpowercubes()
  // for (var i = 0; i < platforms.length; i++) {
  //   platforms[i].obstacles = Obstacle.init(context, platforms[i])
  //   platforms[i].powercubes = PowerCube.init(context, platforms[i], i, "regen")
  // }


  init(context, "regen")
  difficuly += 0.5

}

export const clearPlatforms = () => {
  platforms = PlatformArrays.initialPlatforms()
  Obstacle.clearObstacles()
  PowerCube.clearpowercubes()
  difficuly = 3;
  return platforms;
}

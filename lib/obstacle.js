export var obstacleimage = new Image()
obstacleimage.src = "assets/images/obstacle.png"


export var obstacles = [];

// const canvas = $("canvas")[0]
// const context = canvas.getContext("2d")



export const init = (context, platform, id) => {
  // const canvas = $("canvas")[0]
  // const context = canvas.getContext("2d")

  if (!obstacles[id]){
    obstacles.push({x: (platform.x + 400), y: platform.y - 35})
  }

  for (var i = 0; i < obstacles.length; i++) {
    context.drawImage(obstacleimage,obstacles[i].x,obstacles[i].y,30,40)
  }


  return obstacles[id]
}

export const move = (context, platform, id) => {
  for (var i = 0; i < obstacles.length; i++) {
    if(i === id) obstacles[i].x = platform.x + 400;
    context.drawImage(obstacleimage,obstacles[i].x,obstacles[i].y,30,40)
  }
  return obstacles[id]
}

export const clearObstacles = () => {
  obstacles = [];
}

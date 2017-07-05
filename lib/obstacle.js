export var obstacleimage = new Image()
obstacleimage.src = "assets/images/obstacle.png"


export var obstacle = {x: 250, y: 200}

// const canvas = $("canvas")[0]
// const context = canvas.getContext("2d")



export const init = (context) => {
  // const canvas = $("canvas")[0]
  // const context = canvas.getContext("2d")
  obstacle = {x: 550, y: 200}


  context.drawImage(obstacleimage,obstacle.x,obstacle.y,30,40)


  return obstacle
}

export const move = (context, speed) => {
  context.drawImage(obstacleimage,obstacle.x,obstacle.y- 15,30,40)
  obstacle.x -= speed
  return obstacle
}

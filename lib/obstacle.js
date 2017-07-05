export var obstacle = {x: 250, y: 200}

// const canvas = $("canvas")[0]
// const context = canvas.getContext("2d")



export const init = (context) => {
  // const canvas = $("canvas")[0]
  // const context = canvas.getContext("2d")
  obstacle = {x: 550, y: 200}
  context.fillStyle = "black"
  context.fillRect(obstacle.x,obstacle.y,30,50)
  context.strokeStyle = "black";
  context.strokeRect(obstacle.x, obstacle.y, 30, 50);

  return obstacle
}

export const move = (context, speed) => {
  context.fillStyle = "black"
  context.fillRect(obstacle.x,obstacle.y,30,50)
  context.strokeStyle = "black";
  context.strokeRect(obstacle.x, obstacle.y, 30, 50);
  obstacle.x -= speed
  return obstacle
}

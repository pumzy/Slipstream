

export var obstacleimage = new Image()
obstacleimage.src = "assets/images/obstacle.png"














export var obstacles = [];
export var idBreakpoint;



export const init = (context, platform, id, token) => {


  if (token === "regen"){

    if (id === 3){
      idBreakpoint = platform.id;
    }
    clearObstacles(idBreakpoint - 2);


    if (id >= 3){
    for (let i = 0; i < calcObstacles(); i++) {
      let newobstacle = {x: (platform.x + (platform.width - (i+1)*350)), y: platform.y - 15, image: obstacleimage, platformID: platform.id}
      obstacles.push(newobstacle)
      context.drawImage(obstacleimage,newobstacle.x,(newobstacle.y - 20),30,40)
    }

    console.log(obstacles)
    return obstacles.filter(obstacle => (
      obstacle.platformID === platform.id
    ))
  }}

  for (let i = 0; i < calcObstacles(); i++) {
    obstacles.push({x: (platform.x + (platform.width - (i+1)*350)), y: platform.y - 15, image: new Image(), platformID: platform.id})
  }

  for (let i = 0; i < obstacles.length; i++) {
    context.drawImage(obstacleimage,obstacles[i].x,(obstacles[i].y - 20),30,40)
  }

  return obstacles.filter(obstacle => (
    obstacle.platformID === platform.id
  ))

}

export const move = (context, platform, id) => {
  for (let i = 0; i < obstacles.length; i++) {
    if(platform.id === obstacles[i].platformID)
    obstacles[i].x  -= platform.speed
    context.drawImage(obstacleimage,obstacles[i].x,(obstacles[i].y - 20),30,40)
  }

    let filter = obstacles.filter(obstacle =>(
      obstacle.platformID === platform.id)
    )
    return filter
}

export const clearObstacles = (num) => {
  if (num){
    obstacles = obstacles.filter(obstacle => obstacle.platformID >= num)
  } else obstacles = [];
}

export const restartFind = (id) => {
  return obstacles.filter(obstacle => (
    obstacle.platformID === id
  ))
}

export const calcObstacles = () => (
  Math.floor(Math.random() * 2)
)

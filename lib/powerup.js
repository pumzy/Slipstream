// export var powercubeimage = new Image()



export var powercubes = [];

// const canvas = $("canvas")[0]
// const context = canvas.getContext("2d")



export const init = (context, platform, id) => {
  // const canvas = $("canvas")[0]
  // const context = canvas.getContext("2d")

  if (!powercubes[id]){
    powercubes.push({x: (platform.x + 600), y: platform.y - 15, image: new Image()})
  }

  for (var i = 0; i < powercubes.length; i++) {
    let randomno = Math.floor(Math.random() * (3) + 1)
    randomno === 1 ? powercubes[i].image.src = "assets/images/powercube_purple.png" : randomno === 2 ? powercubes[i].image.src = "assets/images/powercube_green.png" : powercubes[i].image.src = "assets/images/powercube_white.png" 
    context.drawImage(powercubes[i].image,powercubes[i].x,powercubes[i].y,15,15)
  }


  return powercubes[id]
}

export const move = (context, platform, id, popped) => {
  for (var i = 0; i < powercubes.length; i++) {
    if(i === id && popped !== "popped"){ powercubes[i].x = platform.x + 600;
    context.drawImage(powercubes[i].image,powercubes[i].x,powercubes[i].y,15,15)
  } else if (i === id && popped === "popped"){
     powercubes[i].x = 0;
  }}
  return powercubes[id]
}

export const clearpowercubes = () => {
  powercubes = [];
}

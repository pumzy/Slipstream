export var powercubeimage = new Image()
powercubeimage.src = "assets/images/powercube_green.png"


export var powercubes = [];

// const canvas = $("canvas")[0]
// const context = canvas.getContext("2d")



export const init = (context, platform, id) => {
  // const canvas = $("canvas")[0]
  // const context = canvas.getContext("2d")

  if (!powercubes[id]){
    powercubes.push({x: (platform.x + 600), y: platform.y - 15})
  }

  for (var i = 0; i < powercubes.length; i++) {
    context.drawImage(powercubeimage,powercubes[i].x,powercubes[i].y,15,15)
  }


  return powercubes[id]
}

export const move = (context, platform, id, popped) => {
  for (var i = 0; i < powercubes.length; i++) {
    if(i === id && popped !== "popped"){ powercubes[i].x = platform.x + 600;
    context.drawImage(powercubeimage,powercubes[i].x,powercubes[i].y,15,15)
  } else if (i === id && popped === "popped"){
     powercubes[i].x = 0;
  }}
  return powercubes[id]
}

export const clearpowercubes = () => {
  powercubes = [];
}

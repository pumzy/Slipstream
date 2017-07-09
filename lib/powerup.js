


export var powercubes = [];
export var idBreakpoint;

export const init = (context, platform, id, token) => {

 if (token === "regen"){

   if (id === 3){
     idBreakpoint = platform.id;
   }
   clearpowercubes(idBreakpoint - 2);


   if (id >= 3){
   for (let i = 0; i < calcCubes(); i++) {
     let cubepic = new Image()
     let randomno = Math.floor(Math.random() * (3) + 1)
     randomno === 1 ? cubepic.src = "assets/images/powercube_purple.png" : randomno === 2 ? cubepic.src = "assets/images/powercube_green.png" : cubepic.src = "assets/images/powercube_white.png"
     let newcube = {x: (platform.x + (platform.width - (i+1)*200)), y: platform.y - 15, image: cubepic, platformID: platform.id}
     powercubes.push(newcube)
     context.drawImage(cubepic,newcube.x,newcube.y,15,15)
   }

   return powercubes.filter(cube => (
     cube.platformID === platform.id
   ))

 }}


  for (let i = 0; i < calcCubes(); i++) {

    powercubes.push({x: (platform.x + (platform.width - (i+1)*200)), y: platform.y - 15, image: new Image(), platformID: platform.id})
  }

  for (let i = 0; i < powercubes.length; i++) {
    let randomno = Math.floor(Math.random() * (3) + 1)
    randomno === 1 ? powercubes[i].image.src = "assets/images/powercube_purple.png" : randomno === 2 ? powercubes[i].image.src = "assets/images/powercube_green.png" : powercubes[i].image.src = "assets/images/powercube_white.png"
    context.drawImage(powercubes[i].image,powercubes[i].x,powercubes[i].y,15,15)
  }

  return powercubes.filter(cube => (
    cube.platformID === platform.id
  ))

}


export const move = (context, platform, speed, popped) => {
  for (let i = 0; i < powercubes.length; i++) {
    if(platform.id === powercubes[i].platformID && !popped.includes(powercubes[i].x)){
    powercubes[i].x -= platform.speed
    context.drawImage(powercubes[i].image,powercubes[i].x,powercubes[i].y,15,15)

  } else if (platform.id === powercubes[i].platformID && popped.includes(powercubes[i].x)){
      powercubes[i].src = ""
      powercubes[i].y = -100
  }}


  let filter = powercubes.filter(cube =>(
    cube.platformID === platform.id)
  )
  return filter

}

export const clearpowercubes = (num) => {
  if (num){
    powercubes = powercubes.filter(powercube => powercube.platformID >= num)
  } else powercubes = []
}

export const idMap = (num) => {
  return powercubes.filter(cube => cube.platformID <= num)

}

export const calcCubes = () => (
  Math.floor(Math.random() * (3 - 0 + 1))
)

export const restartFind = (id) => {
  return powercubes.filter(cube => (
    cube.platformID === id
  ))
}

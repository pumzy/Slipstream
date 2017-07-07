


export var powercubes = [];


export const init = (context, platform, id, token) => {

 if (token === "regen"){
   if (id >= 3){
   for (let i = 0; i < calcCubes(); i++) {

     powercubes.push({x: (platform.x + (platform.width - i*200)), y: platform.y - 15, image: new Image(), platformID: id})
   }

   for (let i = 3; i < powercubes.length; i++) {
     let randomno = Math.floor(Math.random() * (3) + 1)
     randomno === 1 ? powercubes[i].image.src = "assets/images/powercube_purple.png" : randomno === 2 ? powercubes[i].image.src = "assets/images/powercube_green.png" : powercubes[i].image.src = "assets/images/powercube_white.png"
     context.drawImage(powercubes[i].image,powercubes[i].x,powercubes[i].y,15,15)
   }
   return powercubes.filter(cube => (
     cube.platformID === id
   ))

 }}


  for (let i = 0; i < calcCubes(); i++) {

    powercubes.push({x: (platform.x + (platform.width - i*200)), y: platform.y - 15, image: new Image(), platformID: id})
  }

  for (let i = 0; i < powercubes.length; i++) {
    let randomno = Math.floor(Math.random() * (3) + 1)
    randomno === 1 ? powercubes[i].image.src = "assets/images/powercube_purple.png" : randomno === 2 ? powercubes[i].image.src = "assets/images/powercube_green.png" : powercubes[i].image.src = "assets/images/powercube_white.png"
    context.drawImage(powercubes[i].image,powercubes[i].x,powercubes[i].y,15,15)
  }

  return powercubes.filter(cube => (
    cube.platformID === id
  ))

}


export const move = (context, platform, id, popped) => {
  for (let i = 0; i < powercubes.length; i++) {
    if(id === powercubes[i].platformID && !popped.includes(powercubes[i].x)){ powercubes[i].x = platform.x + (platform.width - i*200);
    context.drawImage(powercubes[i].image,powercubes[i].x,powercubes[i].y,15,15)

  } else if (id === powercubes[i].platformID && popped.includes(powercubes[i].x)){
      powercubes[i].src = ""
      powercubes[i].y = -100
  }}


  let filter = powercubes.filter(cube =>(
    cube.platformID === id)
  )
  return filter

}

export const clearpowercubes = () => {
  powercubes = [];
}

export const calcCubes = () => (
  Math.floor(Math.random() * (3 - 0 + 1))
)

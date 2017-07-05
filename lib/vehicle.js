


export var player = {x: 400, y: 200, jumping: false, direction: null}
export var vehicleimg = new Image()
vehicleimg.src = "assets/images/vehicle.png"

// const canvas = $("canvas")[0]
// const context = canvas.getContext("2d")



export const init = (context) => {
  // const canvas = $("canvas")[0]
  // const context = canvas.getContext("2d")
  player = {x: 400, y: 200, jumping: false, direction: null}
  context.drawImage(vehicleimg,player.x,player.y,60,30)


}


export const move = () => {
  const canvas = $("canvas")[0]
  const context = canvas.getContext("2d")
  if (player.y === 130 && player.jumping === true) {
    player.y += 5
    player.jumping = false
  }
  else if (player.y < 200 && player.jumping === false) {
    player.y += 5
  } else if (player.y === 200 & player.jumping === true){
    player.y -= 5
  } else if (player.y < 200 && player.jumping === true) {
    player.y -= 5
  } else if (player.direction === "right"){
    player.x += 5
  } else if (player.direction === "left"){
    player.x -= 5
  }

  context.drawImage(vehicleimg,player.x,player.y,60,30)

  return player

}

$(window).keypress((e) => {

  if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119)&& player.y === 200) {
   e.preventDefault();
   player.jumping = true;
 } else if (e.keyCode === 100){
   player.direction = "right"
 } else if (e.keyCode === 97){
   player.direction = "left"
 }
})

$(window).keyup((e) => {
  e.preventDefault()
  player.direction = null;
})

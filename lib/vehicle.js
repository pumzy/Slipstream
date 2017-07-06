


export var player = {x: 400, y: 200, jumping: false, direction: null, falling: false}
export var vehicleimg = new Image()
vehicleimg.src = "assets/images/vehicle.png"
var platform;
var doublejumpstart;



export const init = (context) => {

  player = {x: 400, y: 200, jumping: false, doublejumping: false, direction: null}
  context.drawImage(vehicleimg,player.x,player.y,60,30)

  return player
}


export const move = (plat, token) => {
  platform = plat;
  const canvas = $("canvas")[0]
  const context = canvas.getContext("2d")

  if (token === "falling"){
    player.falling = true
    player.y += 5
  } else if (player.y < (platform.y - 90) && player.jumping === true) {
    player.y -= 5
    player.jumping = false
  }
  else if (player.y < (platform.y - 20) && player.jumping === false) {
    player.y += 5
  } else if (player.y === (platform.y - 20) & player.jumping === true){
    player.y -= 5
  } else if (player.y < (platform.y - 20) && player.jumping === true) {
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

  if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && (player.y === (platform.y - 20))) {
   e.preventDefault();
   player.jumping = true;
 } else if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && (player.jumping === true)) {
   e.preventDefault();
   player.doublejumping = true;
   doublejumpstart = player.y
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

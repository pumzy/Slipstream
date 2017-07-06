


export var player = {x: 400, y: 200, jumping: false, direction: null}
export var vehicleimg = new Image()
vehicleimg.src = "assets/images/vehicle.png"
var platform;
var doublejumpstart;
var doublejumped = false;


export const resetVehicle = () => {
  player = {x: 400, y: 200, jumping: false, direction: null, token: null}
}

export const init = (context) => {

  player = {x: 400, y: 200, jumping: false, doublejumping: false, direction: null, token: null}
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
  } else if (player.y < (doublejumpstart - 70) && player.doublejumping === true) {
    player.doublejumping = false
    player.jumping = false
    player.y += 5
  } else if (player.y <= (doublejumpstart) && player.doublejumping === true) {
    player.y -= 5
  } else if ((player.y < (doublejumpstart)) && player.doublejumping === false) {
    player.y += 5
  }
   else if (player.y < (platform.y - 90) && player.jumping === true) {
    player.y -= 5
    player.jumping = false
  } else if (player.y < (platform.y - 20) && player.jumping === false) {
    player.y += 5
  } else if (player.y === (platform.y - 20) && player.jumping === false){
    doublejumped = false
    doublejumpstart = null;
  } else if (player.y <= (platform.y - 20) && player.jumping === true) {
    player.y -= 5
  }

   else if (player.y > platform.y - 20 && player.jumping === false) {
    player.token = "falling"
  } else if (player.y > platform.y - 20 && player.jumping === true) {
    player.y -= 5;
  }

  context.drawImage(vehicleimg,player.x,player.y,60,30)

  return player

}

$(window).keypress((e) => {

  if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && (player.y === (platform.y - 20))) {
   e.preventDefault();
   player.jumping = true;
 } else if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && (doublejumped === false)) {
   e.preventDefault();
   player.doublejumping = true;
   doublejumped = true;
   doublejumpstart = player.y
 }
})

$(window).keyup((e) => {
  e.preventDefault()
  player.direction = null;
})

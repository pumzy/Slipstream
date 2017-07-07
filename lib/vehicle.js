


export var player = {x: 400, y: 0, jumping: false, direction: null, token: null, doublejumping: false, falling: false}
export var vehicleimg = new Image()
vehicleimg.src = "assets/images/vehicle.png"
var platform;
var doublejumpstart;
var doublejumped = false;
var falljumpstart;


export const resetVehicle = () => {
  player = {x: 400, y: 0, jumping: false, direction: null, token: "falling", doublejumping: false, falling: false}
}

export const init = (context) => {

  player = {x: 400, y: 0, jumping: false, direction: null, token: "falling", doublejumping: false, falling: false}
  context.drawImage(vehicleimg,player.x,player.y,60,30)

  return player
}


export const move = (plat, token) => {
  if (token === "falling"){
    player.token = "falling"
  } else {
    player.token = null;
  }

  platform = plat;
  const canvas = $("canvas")[0]
  const context = canvas.getContext("2d")



  if  (player.y < (doublejumpstart - 70) && player.doublejumping === true) {
    player.doublejumping = false
    player.jumping = false
    player.y += 5
  } else if (player.y <= (doublejumpstart) && player.doublejumping === true) {
    player.y -= 5
  } else if ((player.y < (doublejumpstart)) && player.doublejumping === false) {
    player.y += 5
  }

  else if (player.token === "falling" && player.jumping === false){
    player.falling = true
    player.y += 5
  } else if  (falljumpstart && player.jumping === true && player.y > falljumpstart - 70 ){
    player.y -= 5
  } else if  (falljumpstart && player.jumping === true && player.y === falljumpstart - 70 ){
    player.jumping = false
    falljumpstart = null;
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

  if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && player.token === "falling" ){
    e.preventDefault();
    player.jumping = true;
    falljumpstart = player.y
  } else if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && (player.y === (platform.y - 20))) {
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

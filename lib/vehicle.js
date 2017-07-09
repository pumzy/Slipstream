


export var player = {x: 400, y: 0, falljumped: false, jumping: true, direction: null, token: "start", doublejumping: false, falling: false}
export var vehicleimg = new Image()
vehicleimg.src = "assets/images/vehicle.png"
var platform;
var doublejumpstart;
var doublejumped = false;
var falljumpstart;
var startpos;


export const resetVehicle = () => {
  player = { }
  return player
}

export const init = (context) => {

  player = {x: 400, y: 0, jumping: true, direction: null, falljumped: false, token: "start", doublejumping: false, falling: false}
  context.drawImage(vehicleimg,player.x,player.y,60,30)

  return player
}


export const move = (plat, token) => {


  if (player.token === "start"){
    startpos = plat.y - 20;
    player.jumping = false
  }
  else if (token === "falling"){
    player.token = "falling"
  }  else {
    player.token = null;
  }



  platform = plat;
  const canvas = $("canvas")[0]
  const context = canvas.getContext("2d")


  if  (startpos && player.y === startpos){
  player.token = null;
  startpos = null;
  doublejumped = false
  doublejumpstart = null;
  player.token = null;
  falljumpstart = null;
  player.falljumped = false;

  }
   else if  (startpos && player.y < startpos){
    player.y += 5
  }




  else if (player.y <= (doublejumpstart - 70) && player.doublejumping === true) {
    player.doublejumping = false
    player.jumping = false
    player.y += 5

  }
  else if (player.y <= (doublejumpstart) && player.doublejumping === true ) {
    player.y -= 5
  }
  else if ((player.y < (doublejumpstart)) && player.doublejumping === false) {
    player.y += 5
  }


  else if (player.token === "falling" && player.jumping === false ){
    player.y += 5
  }

  else if  (falljumpstart && player.jumping === true && player.y > falljumpstart - 70){
    player.y -= 5
  } else if  (falljumpstart && player.jumping === true && player.y === falljumpstart - 70){
    falljumpstart = null;
    player.jumping = false;
  }



   else if (player.y <= (platform.y - 90) && player.jumping === true) {
    player.y -= 5
    player.jumping = false
  } else if (player.y < (platform.y - 20) && player.jumping === false) {
    player.y += 5
  } else if (player.y === (platform.y - 20) && player.jumping === false){
    doublejumped = false
    doublejumpstart = null;
    player.token = null;
    falljumpstart = null;

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


  if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && player.token === "start" ){
    e.preventDefault();
    player.jumping = false;
  } else if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && doublejumped === true){
    return
  }
  else if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && player.token === "falling" && player.jumping === false && player.falljumped === false){
    e.preventDefault();
    player.jumping = true;
    falljumpstart = player.y
    player.falljumped = true;
  } else if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && player.token === "falling" && player.jumping === true && doublejumped === false){
    e.preventDefault();
    player.doublejumping = true;
    doublejumped = true;
    doublejumpstart = player.y
  }
   else if ((e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 119) && (player.y === (platform.y - 20))) {
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

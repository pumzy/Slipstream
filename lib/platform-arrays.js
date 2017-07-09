
export const initialPlatforms = () => ([
  {x: 200, y: 230, speed: 2, obstacles: null, powercubes: null, popped: [], width: 800, id: 1},
  {x: 1050, y: 350, speed: 2, obstacles: null, powercubes: null, popped: [], width: 800, id: 2},
  {x: 1800, y: 300, speed: 2, obstacles: null, powercubes: null, popped: [], width: 800, id: 3},
  {x: 2650, y: 250, speed: 2, obstacles: null, powercubes: null, popped: [], width: 800, id: 4}
])

// Level things

export const platformGenerator = (endoflast, id, diff) => {

let platforms = [
  [
  {x: (endoflast + 50), y: 230, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+1},
  {x: (endoflast + 900), y: 350, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+2},
  {x: (endoflast + 900), y: 200, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+3},
  {x: (endoflast + 1750), y: 260, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+4}
  ],[
  {x: (endoflast + 60), y: 230, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+1},
  {x: (endoflast + 910), y: 350, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+2},
  {x: (endoflast + 1680), y: 300, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+3},
  {x: (endoflast + 2430), y: 250, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+4}
  ],[
  {x: (endoflast + 50), y: 230, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+1},
  {x: (endoflast + 70), y: 0, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+2},
  {x: (endoflast + 820), y: 200, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+3},
  {x: (endoflast + 1650), y: 150, speed: diff, obstacles: null, powercubes: null, popped: [], width: widthGenerator(), id: id+4}
]
]


return platforms[Math.floor(Math.random()*platforms.length)].slice(0);

}

export const widthGenerator = () => (
  Math.floor(Math.random() * (800 - 700 + 1)) + 700
)

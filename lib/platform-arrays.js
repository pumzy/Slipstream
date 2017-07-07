
export const initialPlatforms =  [
  {x: 200, y: 230, speed: 2, obstacles: null, powercubes: null, popped: [], width: 800},
  {x: 1050, y: 350, speed: 2, obstacles: null, powercubes: null, popped: [], width: 800},
  {x: 1800, y: 300, speed: 2, obstacles: null, powercubes: null, popped: [], width: 800},
  {x: 2650, y: 250, speed: 2, obstacles: null, powercubes: null, popped: [], width: 800}
]

// Level things

export const platformGenerator = (endoflast) => {

let platforms = [
  [
  {x: (endoflast + 50), y: 230, speed: 2, obstacles: null, powercubes: null, popped: [], width: widthGenerator()},
  {x: (endoflast + 900), y: 350, speed: 2, obstacles: null, powercubes: null, popped: [], width: widthGenerator()},
  {x: (endoflast + 900), y: 200, speed: 2, obstacles: null, powercubes: null, popped: [], width: widthGenerator()},
  {x: (endoflast + 1750), y: 260, speed: 2, obstacles: null, powercubes: null, popped: [], width: widthGenerator()}
  ],[
  {x: (endoflast + 60), y: 230, speed: 2, obstacles: null, powercubes: null, popped: [], width: widthGenerator()},
  {x: (endoflast + 910), y: 350, speed: 2, obstacles: null, powercubes: null, popped: [], width: widthGenerator()},
  {x: (endoflast + 1680), y: 300, speed: 2, obstacles: null, powercubes: null, popped: [], width: widthGenerator()},
  {x: (endoflast + 2430), y: 250, speed: 2, obstacles: null, powercubes: null, popped: [], width: widthGenerator()}
  ]
]


return platforms[Math.floor(Math.random()*platforms.length)];

}

export const widthGenerator = () => (
  Math.floor(Math.random() * (800 - 700 + 1)) + 700
)

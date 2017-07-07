
export const initialPlatforms =  [
  {x: 200, y: 230, speed: 2, obstacles: null, powercubes: null, popped: null},
  {x: 1050, y: 350, speed: 2, obstacles: null, powercubes: null, popped: null},
  {x: 1800, y: 300, speed: 2, obstacles: null, powercubes: null, popped: null},
  {x: 2650, y: 250, speed: 2, obstacles: null, powercubes: null, popped: null}
]

// Level things

export const platformGenerator = (endoflast) => {

let platforms = [
  [
  {x: (endoflast + 50), y: 230, speed: 2, obstacles: null, powercubes: null, popped: null},
  {x: (endoflast + 900), y: 350, speed: 2, obstacles: null, powercubes: null, popped: null},
  {x: (endoflast + 900), y: 200, speed: 2, obstacles: null, powercubes: null, popped: null},
  {x: (endoflast + 1750), y: 260, speed: 2, obstacles: null, powercubes: null, popped: null}
  ],[
  {x: (endoflast + 60), y: 230, speed: 2, obstacles: null, powercubes: null, popped: null},
  {x: (endoflast + 910), y: 350, speed: 2, obstacles: null, powercubes: null, popped: null},
  {x: (endoflast + 1680), y: 300, speed: 2, obstacles: null, powercubes: null, popped: null},
  {x: (endoflast + 2430), y: 250, speed: 2, obstacles: null, powercubes: null, popped: null}
  ]
]


return platforms[Math.floor(Math.random()*platforms.length)];

}

# Slipstream

Slipstream is an arcade style infinite platformer game inspired by Vector Runner Remix. Sllipstream was built using HTML5 canvas combined with JavaScript, and features a Google Firebase backend which is used for storing scores and creating a leaderboard.

## Features and Implementation

### Dynamic Jumping

The crafting of Slipstream's jumping logic was perhaps one of the most complex parts of this project, mainly due to the fact that the vehicle's x position remains stationary throughout the game. Therefore, in order to allow for a realistic jumping animation, I used a parabolic gravity system. Whilst this was somewhat straightforward to implement, the real challenge here lay in allowing for doublejumping, and for players to be able to jump when they are falling. In order to allow for this feature, Slipstream will dynamically reset the gravity of the player on doublejump, and then will run the parabolic equation again to account for the increased jump height/

### Infinite Generation and Scaling Difficulty

Given that Slipstream is an infinite platformer, it would be inefficient to manually draw out all the platforms, levels, and obstacles. In order to account for this I made a random generation algorithm that incorporates platform, power cube, and obstacle generation, based on the current position of the player. This algorithm is also responsible for increasing the difficulty of the game each time these platforms and randomly generated.

### Collision detection

Slipstream utilises separate pixel level collision detection algorithms for platforms, obstacles, and powercubes.

### Leaderboards and Cookies

Slipstream makes use of a Google Firebase backend in order to store scores and then generate a leaderboard based on the highest scores in the database. Further, Slipstream uses cookies for local highscore storage, as well as to keep a user logged in locally.

# Brackey's Game
## I made this project to learn a little about THREEJS and web games.

This game I made was inspired by the game which Brackey makes on his Unity beginners tutorial: https://www.youtube.com/watch?v=IlKaB1etrik \
However the only thing that was taken from that series is the game idea, since that is teaching unity, but I am making this game on the web using THREEJS.

Here is the URL: https://aryaacubegame.azurewebsites.net

## Game Contents:
Just guide the cube (player) through the obstacles and to the finish line.

### Controls:
- Arrow Keys to move
- Esc / Escape to pause

![Preview 1](https://github.com/AryaaSk/BrackeysGame/blob/master/Previews/Preview1.png?raw=true)

There is also a Level Editor where you can edit and make your own levels, you can access this by clicking the Level Editor button in the top left. It is a little buggy as if you don't add any obstacles or if you remove all levels then the game won't work, but otherwise should be fine:

![Preview 2](https://github.com/AryaaSk/BrackeysGame/blob/master/Previews/Preview2.png?raw=true)

## How it works:
The Level Editor just saves all the changes you make to a global gameLevels object, which is also saved to local storage so you don't lose your levels when you refresh the page.

The actual game just uses basic THREEJS objects, however the Obstacles are all rendered as one mesh, and using the Box3 collision detection wouldn't work since it generates an Axis-Aligned-Bounding-Box, which basically means that the game would think that the player collided with an obstacle when he/she actually didn't. 

So to fix this I had to implement a RayTracer which fires a ray from the 2 front corners of the player, and then detects if those rays have hit anything *(since the only thing on the map is the obstacles this didn't matter)*. This is why sometimes the collision detection is a little faulty, and the player will go into the obstacle a little bit before the collision is detected.

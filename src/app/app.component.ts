import { Component } from '@angular/core';
import { LevelGridsService } from './level-grids.service';
import * as THREE from 'three';
import { mergeBufferGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Brackeys Game';
  
  constructor (private levels: LevelGridsService) {}

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  renderer = new THREE.WebGLRenderer();

  cameraZOffset = 50;
  cameraYOffset = 15;
  cameraXRotation = 0.02;

  persistanceText = "";
  popupText = "";
  currentLevel = 0;

  showPopup(text: string, duration: number)
  {
    document.getElementById("popupText")!.style.transition = String(duration) + "ms";
    document.getElementById("popupText")!.style.opacity = "100%";
    this.popupText = text;
    setTimeout(() => { document.getElementById("popupText")!.style.opacity = "0%"; }, duration);
  }

  ngAfterViewInit()
  {   this.initializeGame(); }

  player:THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial> = new THREE.Mesh();
  sceneLight = new THREE.PointLight();
  plane: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial> = new THREE.Mesh();
  finish: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial> = new THREE.Mesh();
  initializeGame()
  {
    this.showPopup("", 1); //for some reason the first time it displays the transition doesn't work
    this.startMovementListener();

    this.camera.rotation.x = this.cameraXRotation; //not setting up position, since it follow the player

    this.renderer = new THREE.WebGLRenderer({ //renderer setup
      canvas: document.getElementById("renderingWindow")!
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene.background = new THREE.Color( 0x87ceeb );
    
    //adding the plane and finish line here since the plane is dynamic based on the length of the level in the level-grids.service.ts
    const planeGeo = new THREE.BoxGeometry(80, 10, 10);
    const planeMat = new THREE.MeshStandardMaterial( {color: 0xFFFFFF, wireframe: false } );
    this.plane = new THREE.Mesh(planeGeo, planeMat);
    this.scene.add(this.plane);

    const finishGeo = new THREE.BoxGeometry(this.plane.geometry.parameters.width, this.plane.geometry.parameters.height, 20);
    const finishMat = new THREE.MeshStandardMaterial( {color: 0x0000FF, wireframe: false} );
    this.finish = new THREE.Mesh(finishGeo, finishMat);
    this.scene.add(this.finish);

    const playerGeo = new THREE.BoxGeometry(10, 10, 10);
    const playerMat = new THREE.MeshStandardMaterial({color: 0xFF0000, wireframe: false});
    this.player = new THREE.Mesh(playerGeo, playerMat);
    this.scene.add(this.player);
    this.player.position.y = this.plane.geometry.parameters.height; //to make the player sit on top of the cube
    
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
    this.scene.add(ambientLight);
    this.sceneLight = new THREE.PointLight(0xFFFFFF, 0.9);
    this.scene.add(this.sceneLight);

    this.createScene();
  }
  render()
  { this.renderer.render(this.scene, this.camera); };

  createScene()
  {
    const originalPlaneDepth = 10; //the original depth of the plane is 10, just since 10 is a nice number that usually divides nicely
    const planeScale = (this.levels.gameLevels[this.currentLevel].obstacles.length * 10 / originalPlaneDepth);
    this.plane.geometry.parameters.depth = originalPlaneDepth * planeScale
    this.plane.scale.z = planeScale;

    //positioning the finish line right after the track
    this.finish.position.z = JSON.parse(JSON.stringify(this.plane.position.z - (this.plane.geometry.parameters.depth / 2) - (this.finish.geometry.parameters.depth / 2)));

    this.persistanceText = `Current Level: ${this.levels.gameLevels[this.currentLevel].levelName}`;
    this.player.position.z = this.plane.position.z + (this.plane.geometry.parameters.depth / 2) - (this.player.geometry.parameters.depth / 2); //to position the player at the start of the plane

    this.addObstacles();
    this.startGameLoop();
  };

  obstacles:THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial> = new THREE.Mesh();
  addObstacles()
  {
    this.scene.remove(this.obstacles);

    //define an array which has a "#" or " " allocated for every 10*10*10 space on the plane, the plane is 80*200, so there should be 160 cubes in total
    //I am going to merge all the cubes into 1 mesh, since we don't need to know specifically which cube the player has hit, only that the player has hit an obstacle 
    const obstacleGrid = this.levels.gameLevels[this.currentLevel].obstacles;

    const obstacleGeo = new THREE.BoxGeometry(10, 10, 10);
    const obstacleMat = new THREE.MeshStandardMaterial( {color: 0x242424, wireframe: false } );
    
    let cubes: THREE.BufferGeometry[] = [];

    let row = 0;
    while (row != obstacleGrid.length)
    {
      let column = 0;
      while (column != obstacleGrid[row].length)
      {
        if (obstacleGrid[row][column] == '#')
        {
          const obstacleCube = obstacleGeo.clone(); //define basic object geometry

          //give the cubes the correct position
          const obstacleX = (column * 10) - (this.plane.position.x) - (this.plane.geometry.parameters.width / 2) + (obstacleGeo.parameters.width / 2);
          const obstacleY = this.plane.geometry.parameters.height; //to make it sit on top of the plane like the player
          const obstacleZ = (row * -10) - (this.plane.position.x) + (this.plane.geometry.parameters.depth / 2) - (obstacleGeo.parameters.width / 2);
          obstacleCube.translate(obstacleX, obstacleY, obstacleZ);

          //add the cube to the cubes list
          cubes.push(obstacleCube);
        }
        column += 1;
      }
      row += 1;
    }

    //merge all the obstacle cubes into 1 geometry
    let mergedCubes = mergeBufferGeometries(cubes);
    mergedCubes = mergeVertices(mergedCubes);

    this.obstacles = new THREE.Mesh(mergedCubes, obstacleMat);
    this.scene.add(this.obstacles);
  }

  gameLoop: any = undefined;
  startGameLoop()
  {
    const levelSpeed = this.levels.gameLevels[this.currentLevel].speed; //player is constantly moving forward at speed of level
    this.gameLoop = setInterval(() => {
      this.player.position.z -= levelSpeed; //move player forward

      //I also need to check if any key is being pressed, I can't use the keydown listeners since they have a slight delay after being pressed
      if (this.currentKey == "ArrowLeft")
      { 
        if (!((this.player.position.x - (this.player.geometry.parameters.width / 2)) < (this.plane.position.x - (this.plane.geometry.parameters.width / 2) + 1)))
        { this.player.position.x -= levelSpeed; }
      }
      else if (this.currentKey == "ArrowRight")
      {
        if (!((this.player.position.x + (this.player.geometry.parameters.width / 2)) > (this.plane.position.x + (this.plane.geometry.parameters.width / 2) - 1)))
        { this.player.position.x += levelSpeed; }
      }
    
      //check if there is a collision with the obstacles
      if (this.collision(this.player, this.obstacles, true) == true)
      { this.restartLevel(); }

      //check if it is collision with the finish line, if so then stop the game
      if (this.collision(this.player, this.finish) == true)
      { this.nextLevel(); }

      this.syncCamera();
      this.render();
    }, 16); //16ms since that is about 60fps
  }
  stopLoop()
  { clearInterval(this.gameLoop); }
  restartLevel()
  { 
    this.stopLoop(); 
    this.showPopup("You crashed into an obstacle", 500);
    setTimeout(() => {this.createScene();}, 500); //give the user a break before restarting the level
  }; 
  nextLevel()
  { 
    this.stopLoop();
    if (this.currentLevel == this.levels.gameLevels.length - 1)
    { this.showPopup("Here's a certificate", 5000); this.persistanceText = "You have completed the game !" }
    else
    { setTimeout(() => { this.currentLevel += 1; this.createScene(); }, 50); }
  }

  syncCamera()
  {
    //just attachs camera to the player
    this.camera.position.x = this.player.position.x;
    this.camera.position.y = this.player.position.y + this.cameraYOffset;
    this.camera.position.z = this.player.position.z + this.cameraZOffset;
    this.sceneLight.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z - 40);
  }

  collision(obj1: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>, obj2: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>, raycasting?: boolean)
  {
    if (raycasting == undefined)
    {
      //just checks if the 2 objects are colliding using Box3s
      const firstBB = new THREE.Box3().setFromObject(obj1); //player 
      const secondBB = new THREE.Box3().setFromObject(obj2); //other object
      return firstBB.intersectsBox(secondBB);
    }
    else
    {
      //we need to create 4 directions, top-left, top-right, bottom-left, bottom-right
      const directions = [new THREE.Vector3(-1, 0, -1), new THREE.Vector3(1, 0, -1), new THREE.Vector3(-1, 0, 1), new THREE.Vector3(1, 0, 1)];

      let i = 0;
      while (i != directions.length)
      {
        const rayDirection = directions[i];
        //and we also need to get the distance from the obj1s body to the outside (easy since all bodies are squares so we can juse pythagorus)
        const rayLength = Math.sqrt((obj1.geometry.parameters.width / 2)**2 + (obj1.geometry.parameters.depth / 2)**2) - 0.0001;
        
        const raycaster = new THREE.Raycaster(obj1.position, rayDirection, 0, rayLength);
        
        const intersects = raycaster.intersectObject(obj2);
        if (intersects.length > 0)
        { return true; }
        i += 1;
      }

      return false; //if nothing has happened then we return false
    }
  }

  currentKey = "";
  startMovementListener() //move player using the mouse
  {
    /* //This code moves the player based on the mouse, however it is quite glitchy
    const sensetiivity = 0.05;
    let playerPosition = ($event.clientX - (window.innerWidth / 2) + this.plane.position.x) * sensetiivity;
    
    const playerLeftSide = this.player.position.x - (this.player.geometry.parameters.width / 2); //the left side of the player object
    const planeLeftSide = this.plane.position.x - (this.plane.geometry.parameters.width / 2);
    const playerRightSide = this.player.position.x + (this.player.geometry.parameters.width / 2); //the right side of the player object
    const planeRightSide = this.plane.position.x + (this.plane.geometry.parameters.width / 2);

    if (playerLeftSide < planeLeftSide)
    { playerPosition = planeLeftSide + (this.player.geometry.parameters.width / 2); }
    else if (playerRightSide > planeRightSide)
    { playerPosition = planeRightSide - (this.player.geometry.parameters.width / 2); }

    this.player.position.x = playerPosition;
    */

    document.onkeydown = ($event) => {
      if ($event.key == "ArrowLeft" || $event.key == "ArrowRight")
      { this.currentKey = $event.key; }
    }
    document.onkeyup = () => {
      this.currentKey = ""; //reset the current key
    }
  }


}


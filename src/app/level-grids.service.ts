import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LevelGridsService {

  constructor() { }

  obstacles: string[][] = [
    [
      // 12345678
        "        ", //START
        "        ",
        "        ",
        "        ",
        "        ",
        "        ",
        "        ",
        "        ",
        "        ",
        " ##     ", //LEVEL 0
        "        ",
        "        ",
        "        ",
        "   #    ",
        "        ",
        "        ",
        "        ",
        "   #### ",
        "        ",
        "#      #" //FINISH
      // 12345678
    ]
    ,
    [
      // 12345678
        "#       ", //START
        "        ",
        "        ",
        "        ",
        "        ",
        "        ",
        "        ",
        "        ",
        "        ",
        "        ", //LEVEL 1
        "        ",
        "        ",
        "        ",
        "        ",
        "        ",
        "        ",
        "        ",
        "        ",
        "        ",
        "# # # # ",
        "        ",
        "        ",
        "        ",
        "        ",
        "        ",
        "     #  " //FINISH
      // 12345678
    ]
    ,
    [
      // 12345678
        "#       ", //START
        "        ",
        "        ",
        "        ",
        "        ",
        "        ",
        "  #  ## ",
        "      ##",
        "        ",
        "      # ", //LEVEL 2
        "        ",
        "        ",
        "###   # ",
        "        ",
        "        ",
        "        ",
        "        ",
        "        ",
        "        ",
        "#    ## " //FINISH
      // 12345678
    ]
    ,
    [
      // 12345678
        "        ", //START
        "        ",
        "        ",
        "        ",
        "        ",
        "        ",
        "        ",
        "        ",
        "   ###  ",
        " ###    ",
        "###     ",
        "        ",
        "        ",
        "        ", //LEVEL 3
        "        ",
        "        ",
        "        ",
        "        ",
        "        ",
        "  ####  ",
        "        ",
        "        ",
        "        ",
        "        ",
        "        ",
        "        " //FINISH
      // 12345678
    ]
  ];

  gameLevels: {levelName: string, speed: number, obstacles: string[]}[] = [ //the speed is how much the player should move per frame (60 fps), 1 is recommended
    {levelName: "Level 0", speed: 1, obstacles: this.obstacles[0]},
    {levelName: "Level 1", speed: 1, obstacles: this.obstacles[1]},
    {levelName: "Level 2", speed: 1, obstacles: this.obstacles[2]},
    {levelName: "Level 3", speed: 3, obstacles: this.obstacles[3]}
  ];
}

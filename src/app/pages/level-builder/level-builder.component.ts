import { Component, OnInit } from '@angular/core';
import { LevelGridsService } from 'src/app/level-grids.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-level-builder',
  templateUrl: './level-builder.component.html',
  styleUrls: ['./level-builder.component.css']
})
export class LevelBuilderComponent implements OnInit {

  constructor(public router: Router, public levelService: LevelGridsService) { }

  ngOnInit(): void {
    this.levelService.loadLevelsFromStorage();
  }

  addLevel()
  {
    const sampleObstacles: string[][] = [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], //START
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', '#', '#', ' ', ' ', ' '],
      [' ', ' ', ' ', '#', '#', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '] //FINISH
    ]

    const sampleLevel = {levelName: "New Level", speed: 1, obstacles: sampleObstacles};
    this.levelService.gameLevels.push(sampleLevel);
    this.saveData();
  }
  deleteLevel(level: number)
  {
    if (this.levelService.currentLevelIndex != 0)
    { this.levelService.currentLevelIndex -= 1; }
    this.levelService.gameLevels.splice(level, 1);
    this.saveData();
  }
  goToLevel(level: number)
  {
    this.levelService.currentLevelIndex = level;
    this.router.navigate(['']);
  }


  addRow(level: number)
  {
    this.levelService.gameLevels[level].obstacles.push([' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']);
    this.saveData();
  }
  deleteRow(level: number, row: number)
  { 
    this.levelService.gameLevels[level].obstacles.splice(row, 1);
    this.saveData();
  }

  switchObstacle(level: number, row: number, column: number)
  {
    if (this.levelService.gameLevels[level].obstacles[row][column] == "#")
    { this.levelService.gameLevels[level].obstacles[row][column] = " " }
    else
    { this.levelService.gameLevels[level].obstacles[row][column] = "#" }

    this.saveData();
  }

  saveData()
  {
    //save the data to local storage
    const gameLevelJSON = JSON.stringify(this.levelService.gameLevels);
    localStorage.setItem("levels", gameLevelJSON);
  }

}

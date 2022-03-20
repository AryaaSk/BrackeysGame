import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameComponent } from './pages/game/game.component';
import { LevelBuilderComponent } from './pages/level-builder/level-builder.component';

const routes: Routes = [
  {path: "", component: GameComponent, pathMatch: "full"},
  {path: "levelBuilder", component: LevelBuilderComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

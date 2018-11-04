import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayersComponent } from './players/players.component';

const routes: Routes = [
  { path: 'players', component: PlayersComponent },
  { path: '', redirectTo: '/players', pathMatch: 'full' },
  { path: '**', redirectTo: '/players' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

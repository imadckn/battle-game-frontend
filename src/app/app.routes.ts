import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BattleComponent } from './pages/battle/battle.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'battle/:firstPlayer/:secondPlayer', component: BattleComponent },
];

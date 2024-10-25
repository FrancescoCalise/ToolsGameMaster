import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component'; // Assicurati di importare HomeComponent
import { authGuard } from './guard/auth.guard';
import { NotFoundComponent } from './component/notFoud/not-found.component';

import { UserProfileComponent } from './component/user/profile/user-profile.component';
import { UserSettingsComponent } from './component/user/settings/user-settings.component';
import { DungeonAndDragons5eComponent } from './component/games/dungeonAndDragns5e/dungeonanddragons5e.component';
import { UltimaRottaComponent } from './component/games/ultimaRotta/ultimaRotta.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', redirectTo: '/games', pathMatch: 'full' },
  { path: 'games', component: DashboardComponent, canActivate: [authGuard] },

  { path: 'profile', component: UserProfileComponent, canActivate: [authGuard] },
  { path: 'settings', component: UserSettingsComponent, canActivate: [authGuard] },

  { path:'games/dungeon-and-dragons-5e', component: DungeonAndDragons5eComponent, canActivate: [authGuard] },
  { path:'games/ultima-rotta', component: UltimaRottaComponent, canActivate: [authGuard] },
  // Aggiungi qui altre rotte protette

  // Questa rotta deve essere sempre alla fine
  { path: '**', component: NotFoundComponent },
];

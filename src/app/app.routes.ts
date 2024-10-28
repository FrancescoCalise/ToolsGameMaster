import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component'; // Assicurati di importare HomeComponent
import { authGuard } from './guard/auth.guard';
import { NotFoundComponent } from './component/notFoud/not-found.component';

import { UserProfileComponent } from './component/user/profile/user-profile.component';
import { UserSettingsComponent } from './component/user/settings/user-settings.component';
import { DungeonAndDragons5eComponent } from './component/games/dungeonAndDragns5e/dungeonanddragons5e.component';
import { UltimaRottaComponent } from './component/games/ultimaRotta/ultimaRotta.component';
import { PageNavbarGuard } from './guard/page-navbar-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', redirectTo: '/games', pathMatch: 'full' },
  {
    path: 'games', component: DashboardComponent, canActivate: [authGuard], canDeactivate: [PageNavbarGuard], data: {
      imgLogoGame: '',
      rootTitle: 'DASHBOARD.TITLE',
      cssTitleRoot: 'game-dashboard-navbar-title'
    }
  },

  { path: 'profile', component: UserProfileComponent, canActivate: [authGuard] },
  { path: 'settings', component: UserSettingsComponent, canActivate: [authGuard] },

  {
    path: 'games/dungeon-and-dragons-5e', component: DungeonAndDragons5eComponent, canActivate: [authGuard, PageNavbarGuard], canDeactivate: [PageNavbarGuard], data: {
      imgLogoGame: 'URL_TO_IMAGE',
      rootTitle: 'DUNGEON_AND_DRAGONS_5E.TITLE',
      cssTitleRoot: 'dnd5e-navbar-title'
    }
  },
  {
    path: 'games/ultima-rotta', component: UltimaRottaComponent, canActivate: [authGuard, PageNavbarGuard], canDeactivate: [PageNavbarGuard], data: {
      imgRoot: 'https://static.wixstatic.com/media/5738c7_b85f94f134a14da2918869dfe0bd7f6c~mv2.png/v1/fill/w_502,h_278,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/logo%20lur_edited.png',
      rootTitle: 'ULTIMA_ROTTA.TITLE',
      cssTitleRoot: 'ultima-rotta-navbar-title'
    }
  },
  // Aggiungi qui altre rotte protette

  // Questa rotta deve essere sempre alla fine
  { path: '**', component: NotFoundComponent },
];

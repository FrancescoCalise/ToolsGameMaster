import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component'; // Assicurati di importare HomeComponent
import { authGuard } from './guard/auth.guard';
import { NotFoundComponent } from './component/notFoud/not-found.component';

import { UserProfileComponent } from './component/user/profile/user-profile.component';
import { UserSettingsComponent } from './component/user/settings/user-settings.component';
import { GameLayoutComponent } from './component/game-layout/game-layout.component';
import { MultiDynamicTablesComponent } from './component/multi-dynamic-tables/multi-dynamic-tables.component';
import { DungeonAndDragons5eComponent } from './component/game-layout/games/dungeonAndDragns5e/dungeonanddragons5e.component';
import { UltimaRottaComponent } from './component/game-layout/games/ultimaRotta/ultimaRotta.component';
import { ultimaRottaCriticDamage, ultimaRottaWeapon } from './component/game-layout/games/ultimaRotta/ultima-rotta-table';
import { SessionManagerComponenet } from './component/session-manager/session-manger.component';
import { GenerateCharacterLurComponent } from './component/game-layout/games/ultimaRotta/features/generate-character-lur/generate-character-lur.component';

export const routes: Routes = [
  {
    path:'games/ultima-rotta', redirectTo: '/games/ultima-rotta/SESSION_MANAGER', pathMatch: 'full'
  },
  {
    path: 'games',
    component: GameLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dungeon-and-dragons-5e',
        component: DungeonAndDragons5eComponent,
        data: {
          gameName: 'Dungeon-and-dragons-5e'
        },
        children: [
          // Eventuali sottorotte di Dungeon and Dragons 5e
        ]
      },
      {
        path: 'ultima-rotta',
        component: UltimaRottaComponent,
        data: {
          imgRoot: 'https://static.wixstatic.com/media/5738c7_b85f94f134a14da2918869dfe0bd7f6c~mv2.png/v1/fill/w_502,h_278,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/logo%20lur_edited.png',
          rootTitle: 'ULTIMA_ROTTA.TITLE',
          cssTitleRoot: 'ultima-rotta-navbar-title',
          gameName: 'Ultima-rotta'
        },
        children: [
          {
            path: 'SESSION_MANAGER',
            component: SessionManagerComponenet
          },
          {
            path: 'SHOW_WEAPONS',
            component: MultiDynamicTablesComponent,
            data: {
              data: ultimaRottaWeapon
            }
          },
          {
            path: 'SHOW_CRITIC_DAMAGE',
            component: MultiDynamicTablesComponent,
            data: {
              data: ultimaRottaCriticDamage
            }
          },
          {
            path: 'CREATE_CHARACTER_ULTIMA_ROTTA',
            component: GenerateCharacterLurComponent,
          }
          
        ]
      }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: UserProfileComponent, canActivate: [authGuard] },
  { path: 'settings', component: UserSettingsComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard],
  },
 
  
  { path: '**', component: NotFoundComponent },
];

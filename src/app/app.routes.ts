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
import { SessionManagerComponenet } from './component/game-layout/feature-sitemap/session-manager/session-manger.component';
import { GenerateCharacterLurComponent } from './component/game-layout/games/ultimaRotta/features/generate-character-lur/generate-character-lur.component';
import { GenerateCharacterDND5EComponent } from './component/game-layout/games/dungeonAndDragns5e/features/generate-character-dnd/generate-character-dnd5e.component';
import { PNGGenerator5eComponent } from './component/game-layout/games/dungeonAndDragns5e/features/png-generator/png-generator-5e.component';

export const routes: Routes = [
  {
    path:'games/ultima-rotta', redirectTo: '/games/ultima-rotta/SESSION_MANAGER', pathMatch: 'full'
  },
  {
    path:'games/dungeon-and-dragons-5e', redirectTo: '/games/dungeon-and-dragons-5e/SESSION_MANAGER', pathMatch: 'full'
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
          {
            path: 'SESSION_MANAGER',
            component: SessionManagerComponenet
          },
          {
            path: 'CREATE_CHARACTER',
            component: GenerateCharacterDND5EComponent,
          },
          {
            path: 'PNG_GENERATOR',
            component: PNGGenerator5eComponent,
          }
        ]
      },
      {
        path: 'ultima-rotta',
        component: UltimaRottaComponent,
        data: {
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
              multiTable: ultimaRottaWeapon,
              excludedColumnsToTranslate:["ULTIMA_ROTTA.COST", "ULTIMA_ROTTA.DURATION", "ULTIMA_ROTTA.DAMAGE","ULTIMA_ROTTA.SHOTS"]
            }
          },
          {
            path: 'SHOW_CRITIC_DAMAGE',
            component: MultiDynamicTablesComponent,
            data: {
              multiTable: ultimaRottaCriticDamage,
              excludedColumnsToTranslate:["ULTIMA_ROTTA.TABLE.CRITIC.RESULT"]
            }
          },
          {
            path: 'CREATE_CHARACTER',
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

// game-components.service.ts
import { Injectable, Type } from '@angular/core';
import { DungeonAndDragons5eComponent } from '../component/games/dungeonAndDragns5e/dungeonanddragons5e.component';
import { UltimaRottaComponent } from '../component/games/ultimaRotta/ultimaRotta.component';


@Injectable({
  providedIn: 'root',
})
export class GameComponentsService {
  private componentMap: { [key: string]: Type<any> } = {
    'Dungeon-and-dragons-5e': DungeonAndDragons5eComponent,
    'Ultima-rotta': UltimaRottaComponent,
  };

  getComponentByRoute(routeName: string): Type<any> | null {
    return this.componentMap[routeName] || null;
  }
}

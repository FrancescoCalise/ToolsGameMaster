// app.providers.ts
import { InjectionToken, Provider } from '@angular/core';
import { FirestoreService } from './services/firestore.service';
import { UserInformationSaved } from './interface/Document/UserInformationSaved';
import { ErrorLog } from './interface/Document/ErrorLog';
import { SessionManager } from './interface/Document/SessionManager';
import { CharacterSheetLURTemplate } from './component/game-layout/games/ultimaRotta/features/generate-character-lur/charachter-sheet-lur';
import { CharacterSheetDND5ETemplate } from './component/game-layout/games/dungeonAndDragns5e/features/generate-character-dnd/charachter-sheet-dnd5e';
import { PNG_5E } from './component/game-layout/games/dungeonAndDragns5e/interface/png_5e-interface';

export const USER_FIRESTORE_SERVICE = new InjectionToken<FirestoreService<UserInformationSaved>>('UserFirestoreService');
export const APPLICATION_LOGS_FIRESTORE_SERVICE = new InjectionToken<FirestoreService<ErrorLog>>('ApplicationLogsSerivce');
export const SESSION_MANAGER_SERVICE = new InjectionToken<FirestoreService<SessionManager>>('SessionManagerService');
export const CHARECTER_SHEET_LUR = new InjectionToken<FirestoreService<CharacterSheetLURTemplate>>('charecterSheetLur');

export const PNG_SHEET_DND_5 = new InjectionToken<FirestoreService<CharacterSheetDND5ETemplate>>('pngSheetDnd5e');
export const PG_SHEET_DND_5 = new InjectionToken<FirestoreService<PNG_5E>>('pgSheetDnd5e');

export class FireBaseProviders {
  static getProviders(): Provider[] {
    return [
      { provide: USER_FIRESTORE_SERVICE, useClass: FirestoreService },
      { provide: APPLICATION_LOGS_FIRESTORE_SERVICE, useClass: FirestoreService },
      { provide: SESSION_MANAGER_SERVICE, useClass: FirestoreService },
      { provide: CHARECTER_SHEET_LUR, useClass: FirestoreService },
      { provide: PNG_SHEET_DND_5, useClass: FirestoreService },
      { provide: PG_SHEET_DND_5, useClass: FirestoreService },
      //add more firebase providere here
    ];
  }
}

// app.providers.ts
import { InjectionToken, Provider } from '@angular/core';
import { FirestoreService } from './services/firestore.service';
import { UserInformationSaved } from './interface/Document/UserInformationSaved';
import { ErrorLog } from './interface/Document/ErrorLog';
import { SessionManager } from './interface/Document/SessionManager';

export const USER_FIRESTORE_SERVICE = new InjectionToken<FirestoreService<UserInformationSaved>>('UserFirestoreService');
export const APPLICATION_LOGS_FIRESTORE_SERVICE = new InjectionToken<FirestoreService<ErrorLog>>('ApplicationLogsSerivce');
export const SESSION_MANAGER_SERVICE = new InjectionToken<FirestoreService<SessionManager>>('SessionManagerService');

export class FireBaseProviders {
  static getProviders(): Provider[] {
    return [
      { provide: USER_FIRESTORE_SERVICE, useClass: FirestoreService },
      { provide: APPLICATION_LOGS_FIRESTORE_SERVICE, useClass: FirestoreService },
      { provide: SESSION_MANAGER_SERVICE, useClass: FirestoreService }

      //add more firebase providere here
    ];
  }
}

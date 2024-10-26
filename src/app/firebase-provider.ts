// app.providers.ts
import { InjectionToken, Provider } from '@angular/core';
import { FirestoreService } from './services/firestore.service';
import { UserInformationSaved } from './interface/Document/UserInformationSaved';
import { ErrorLog } from './interface/Document/ErrorLog';

export const USER_FIRESTORE_SERVICE = new InjectionToken<FirestoreService<UserInformationSaved>>('UserFirestoreService');
export const APPLICATION_LOGS_FIRESTORE_SERVICE = new InjectionToken<FirestoreService<ErrorLog>>('ApplicationLogsSerivce');

export class FireBaseProviders {
  static getProviders(): Provider[] {
    return [
      { provide: USER_FIRESTORE_SERVICE, useClass: FirestoreService },
      { provide: APPLICATION_LOGS_FIRESTORE_SERVICE, useClass: FirestoreService }
      //add more firebase providere here
    ];
  }
}

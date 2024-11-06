// global-error-handler.service.ts
import { ErrorHandler, Inject, Injectable, Injector } from '@angular/core';
import { v4 as uuidv4 } from 'uuid'; // Per generare ID unici (installalo con `npm install uuid`)
import { MatDialog } from '@angular/material/dialog'; // Per aprire la modale
import { AuthService, PersonalUser } from './auth.service'; // Servizio di autenticazione per ottenere l'utente loggato
import { Timestamp } from 'firebase/firestore';
import { ErrorLog } from '../interface/Document/ErrorLog';
import { FirestoreService } from './firestore.service';
import { environment } from '../environments/environment';
import { ErrorModalComponent } from '../component/error/error-modal.componenet';
import { TranslationMessageService } from './translation-message-service';
import { APPLICATION_LOGS_FIRESTORE_SERVICE } from '../firebase-provider';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  
  user: PersonalUser | null = null;
  
  constructor(
    @Inject(APPLICATION_LOGS_FIRESTORE_SERVICE) private firestoreLogService: FirestoreService<ErrorLog>,
    private dialog: MatDialog,
    private translationMessageService: TranslationMessageService
  ) {
    this.firestoreLogService.setCollectionName('application-logs');
  }

  async handleError(error: any): Promise<void> {
    const errorCode = uuidv4();
    const UnknownError = await this.translationMessageService.translate("ERROR.UNKNOWN");
    const message = error.message || UnknownError;
    const timestamp = Timestamp.now();    

    const logData: ErrorLog = {
      errorCode,
      message,
      timestamp,
      environment: environment.production ? 'prod' : 'test',
      version: environment.version
    } ;

    await this.firestoreLogService.addItem(logData);

    this.dialog.open(ErrorModalComponent, {
      data: logData,
      width: '50%',
      height: '50%',
    });

    throw error;
  }
}

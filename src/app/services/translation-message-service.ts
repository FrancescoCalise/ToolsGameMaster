// translation.service.ts
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslationMessageService {
  constructor(private translateService: TranslateService) 
  {
    
  }

  /**
   * Metodo per ottenere la traduzione di una chiave.
   * @param key Chiave della traduzione nel file JSON.
   * @param params Parametri opzionali per sostituire valori dinamici nella traduzione.
   * @returns Promise<string> La stringa tradotta.
   */
  async translate(key: string, params?: Object): Promise<string> {
    return firstValueFrom(this.translateService.get(key, params));
  }
}

// translation.service.ts
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { CacheStorageService } from './cache-storage.service';

@Injectable({
  providedIn: 'root',
})
export class TranslationMessageService {
  private cache: { [key: string]: string } = {}; // Cache interna per la sessione

  constructor(private translateService: TranslateService, private cacheStorageService: CacheStorageService) 
  {
    const savedCache = cacheStorageService.getItem(this.cacheStorageService.translationCache);
    if (savedCache) {
      this.cache = JSON.parse(savedCache);
    }
  }

  /**
   * Metodo per ottenere la traduzione di una chiave.
   * @param key Chiave della traduzione nel file JSON.
   * @param params Parametri opzionali per sostituire valori dinamici nella traduzione.
   * @returns Promise<string> La stringa tradotta.
   */
  async translate(key: string, params?: Object): Promise<string> {
    if (this.cache[key]) {
      return this.cache[key];
    }
    const translatedText = await firstValueFrom(this.translateService.get(key, params));
    this.cache[key] = translatedText;

    this.cacheStorageService.setItem(this.cacheStorageService.translationCache, JSON.stringify(this.cache));

    return translatedText;
  }

  getLang(): string {
    return this.translateService.currentLang;
  }
}

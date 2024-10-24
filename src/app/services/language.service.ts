import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly storageKey = 'appLanguage'; // Chiave per localStorage
  private defaultLanguage = 'IT'; // Lingua di default (Italiano)

  constructor(private translate: TranslateService) {
    // Se non c'è una lingua nella cache, impostiamo quella di default
    const storedLanguage = this.getStoredLanguage();
    if (!storedLanguage) {
      this.setLanguage(this.defaultLanguage);
      this.translate.setDefaultLang(this.defaultLanguage);
    }
  }

  // Ottieni la lingua attualmente impostata dall'utente o quella di default
  getLanguage(): string {
    return this.getStoredLanguage() || this.defaultLanguage;
  }

  // Cambia la lingua e la salva nella cache
  setLanguage(languageCode: string): void {
    localStorage.setItem(this.storageKey, languageCode); // Salva la lingua in localStorage
    this.translate.use(languageCode);
  }

  // Recupera la lingua salvata nella cache
  private getStoredLanguage(): string | null {
    return localStorage.getItem(this.storageKey);
  }
}
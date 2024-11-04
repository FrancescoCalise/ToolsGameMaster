import { Injectable, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Observable, firstValueFrom } from 'rxjs';
import { CacheStorageService } from './cache-storage.service';

@Injectable({
  providedIn: 'root',
})
export class TranslationMessageService implements OnInit {
  
  private defaultLanguage = 'IT';
  private languageChangeSubject = new Subject<string>();
  private cache: { [key: string]: string } = {}; // Cache delle traduzioni

  constructor(
    private translateService: TranslateService,
    private cacheStorageService: CacheStorageService
  ) {
    this.use(this.getLanguage());
  }

  ngOnInit(): void {
    const savedCache = this.cacheStorageService.getItem(this.cacheStorageService.translationCache);
    if (savedCache) {
      this.cache = JSON.parse(savedCache);
    }

    const storedLanguage = this.getStoredLanguage();
    if (storedLanguage) {
      this.setLanguage(storedLanguage);
      this.translateService.setDefaultLang(storedLanguage);
    } else {
      this.setLanguage(this.defaultLanguage);
      this.translateService.setDefaultLang(this.defaultLanguage);
    }
  }
  
  setDefaultLang(languageCode: string): void {
    this.translateService.setDefaultLang(languageCode);
  }
  
  use(languageCode: string): void {
    this.translateService.use(languageCode);
  }
  // Ottenere la lingua corrente
  getLanguage(): string {
    return this.getStoredLanguage() || this.defaultLanguage;
  }

  // Imposta una nuova lingua e notifica i sottoscrittori
  setLanguage(languageCode: string): void {
    this.cache = {};
    this.cacheStorageService.removeItem(this.cacheStorageService.translationCache);
    this.cacheStorageService.setItem(this.cacheStorageService.appLanguageKey, languageCode);
    this.translateService.use(languageCode);
    this.defaultLanguage = languageCode;
    this.languageChangeSubject.next(languageCode);
  }

  // Metodo per ottenere la traduzione di una chiave
  async translate(key: string, params?: Object): Promise<string> {
    if (this.cache[key] && !params) {
      return this.cache[key];
    }

    const translatedText = await firstValueFrom(this.translateService.get(key, params));
    this.cache[key] = translatedText;

    if (translatedText === key) {
      console.warn(`Translation not found for key: ${key}`);
    }

    this.cacheStorageService.setItem(this.cacheStorageService.translationCache, JSON.stringify(this.cache));
    return translatedText;
  }

  // Metodo per ottenere cambiamenti di lingua come Observable
  onLanguageChange(): Observable<string> {
    return this.languageChangeSubject.asObservable();
  }

  private getStoredLanguage(): string | undefined {
    let language = this.cacheStorageService.getItem(this.cacheStorageService.appLanguageKey);
    return language;
  }
}

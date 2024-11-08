import { Inject, Injectable, Injector, OnInit } from '@angular/core';
import { CacheStorageService } from './cache-storage.service';
import { FirestoreService } from './firestore.service';

import { QueryFieldFilterConstraint, where } from 'firebase/firestore';
import { BaseDocument } from '../interface/Document/BaseModel';
import { TranslateService } from '@ngx-translate/core';
import { Subject, firstValueFrom, Observable } from 'rxjs';
import { TRANSLATION_FIRESTORE_SERVICE, } from '../firebase-provider';

export interface IDMLManager extends BaseDocument {
  codes: string[];
  lang: string;
}

@Injectable({
  providedIn: 'root',
})
export class TranslationCacheService {

  private cache: { [key: string]: string } = {}; // Cache delle traduzioni

  constructor(
    private cacheStorageService: CacheStorageService,
    private firestoreService: TranslationFirestoreService
  ) {
  }

  // Metodo per salvare le chiavi di traduzione in Firestore
  async saveTranslationKey(key: string, lang: string): Promise<void> {
    await this.firestoreService.saveTranslationKey(key, lang);
    this.cacheStorageService.setItem(this.cacheStorageService.translationCache, JSON.stringify(this.cache));
  }

  // Metodo per recuperare la cache delle traduzioni salvata localmente
  loadCachedTranslations(): { [key: string]: string } | null {
    const savedCache = this.cacheStorageService.getItem(this.cacheStorageService.translationCache);
    return savedCache ? JSON.parse(savedCache) : null;
  }

  // Metodo per aggiornare la cache locale
  updateCache(key: string, translation: string): void {
    this.cache[key] = translation;
    this.cacheStorageService.setItem(this.cacheStorageService.translationCache, JSON.stringify(this.cache));
  }

  clearCache(): void {
    this.cache = {};
    this.cacheStorageService.removeItem(this.cacheStorageService.translationCache);
  }

  cacheLang(languageCode: string) {
    this.cacheStorageService.setItem(this.cacheStorageService.appLanguageKey, languageCode);
  }
  public getStoredLanguage(): string | undefined {
    return this.cacheStorageService.getItem(this.cacheStorageService.appLanguageKey);
  }
}


@Injectable({
  providedIn: 'root',
})
export class TranslationMessageService implements OnInit {
  private defaultLanguage = navigator.language.toUpperCase();
  private languageChangeSubject = new Subject<string>();

  constructor(
    private translateService: TranslateService,
    private translationCacheService: TranslationCacheService
  ) {
    this.use(this.getLanguage());
  }

  ngOnInit(): void {
    const cachedTranslations = this.translationCacheService.loadCachedTranslations();
    if (cachedTranslations) {
      this.translationCacheService.updateCache('', JSON.stringify(cachedTranslations));
    }

    const storedLanguage = this.translationCacheService.getStoredLanguage();
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

  getLanguage(): string {
    let storageLang = this.translationCacheService.getStoredLanguage();
    if(!storageLang){
      this.translationCacheService.cacheLang(this.defaultLanguage);
    }

    return storageLang || this.defaultLanguage;
  }

  setLanguage(languageCode: string): void {
    this.translationCacheService.clearCache();
    this.translationCacheService.cacheLang(languageCode);
    this.translateService.use(languageCode);
    this.defaultLanguage = languageCode;
    this.languageChangeSubject.next(languageCode);
  }

  // Metodo per ottenere la traduzione di una chiave
  async translate(key: string, params?: Object): Promise<string> {
    // Usa la cache se la traduzione è già presente
    const cachedTranslation = this.translationCacheService.loadCachedTranslations();
    if (cachedTranslation && cachedTranslation[key] && !params) {
      return cachedTranslation[key];
    }

    const translatedText = await firstValueFrom(this.translateService.get(key, params));
    this.translationCacheService.updateCache(key, translatedText);

    if (translatedText === key) {
      debugger
      console.error(`Translation not found for key: ${key}`);
    }

    await this.translationCacheService.saveTranslationKey(key, this.getLanguage());
    return translatedText;
  }

  // Metodo per ottenere cambiamenti di lingua come Observable
  onLanguageChange(): Observable<string> {
    return this.languageChangeSubject.asObservable();
  }
}


@Injectable({
  providedIn: 'root',
})
export class TranslationFirestoreService  {
  constructor(
    @Inject(TRANSLATION_FIRESTORE_SERVICE) private firestoreTranslationService: FirestoreService<IDMLManager>,
  ) {
    this.firestoreTranslationService.setCollectionName('idml-manager');
  }

  async saveTranslationKey(key: string, lang: string): Promise<void> {
    let whereConditions: QueryFieldFilterConstraint[] = [where('lang', '==', lang)];
    let logIDML = await this.firestoreTranslationService.getItemsWhere(whereConditions);

    if (logIDML.length === 0) {
      let idml: IDMLManager = { codes: [key], lang };
      await this.firestoreTranslationService.addItem(idml);
    } else {
      let log = logIDML[0];
      if (!log.codes.includes(key)) {
        log.codes.push(key);
        await this.firestoreTranslationService.updateItem(log);
      }
    }
  }
}
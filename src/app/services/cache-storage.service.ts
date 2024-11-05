import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheStorageService {
  public readonly userInfoKey = 'UserInfo';
  public readonly defaultSession = 'DefaultSession';
  public readonly translationCache = 'translationCache';
  public readonly appLanguageKey = 'appLanguage';
  public readonly turnOrderKey = 'turnOrder';
  public readonly sunOfDeathKey = 'sunOfDeath';

  constructor() { }

  public setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public getItem(key: string): any {
    let item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    } else { return null; }
  }

  public removeItem(key: string) {
    localStorage.removeItem(key);
  }

  public clear() {
    localStorage.clear();
  }

}
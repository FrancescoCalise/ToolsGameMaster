// navbar.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslationMessageService } from './translation-message-service';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  constructor(private translationMessageService: TranslationMessageService) {

  }

  // Definisco soggetti reattivi per imgLogoGame e gameTitle
  private imgRouteSource = new BehaviorSubject<string>('');
  private nameRootSource = new BehaviorSubject<string>('');
  private cssRootSource = new BehaviorSubject<string>('');

  // Observable per sottoscrivere i cambiamenti nella navbar
  imgRouteSource$ = this.imgRouteSource.asObservable();
  nameRootSource$ = this.nameRootSource.asObservable();
  cssRootSource$ = this.cssRootSource.asObservable();

  // Metodi per aggiornare i valori
  setImgLogoGame(value: string): void {
    this.imgRouteSource.next(value);
  }

  setCssTitleRoot(value: string): void {
    this.cssRootSource.next(value);
  }

  async setGameTitle(value: string): Promise<void> {

    let titlte = await this.translationMessageService.translate(value);
    this.nameRootSource.next(titlte);
  }

  resetNavbar(): void {
    this.imgRouteSource.next('');
    this.nameRootSource.next('');
    this.cssRootSource.next('');
  }
}

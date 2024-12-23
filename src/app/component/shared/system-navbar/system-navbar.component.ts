import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';
import { SwUpdate } from '@angular/service-worker';
import { CacheStorageService } from '../../../services/cache-storage.service';
import { TranslationMessageService } from '../../../services/translation-message-service';

@Component({
  selector: 'app-system-navbar',
  templateUrl: './system-navbar.component.html',
  styleUrls: ['./system-navbar.component.css'],
  standalone: true,
  imports: [
    SharedModule
  ],
})

export class SystemNavBarComponent implements OnInit, AfterViewChecked, OnDestroy {
  selectedLanguage: string;
  selectedFlag: string; // Flag per la lingua selezionata
  languages = [
    //{ code: 'EN', label: 'English', flag: 'fi fi-gb' },
    { code: 'IT', label: 'Italiano', flag: 'fi fi-it' }
  ];
  isAuthenticating: boolean = false;

  environment: string = '';
  version: string = '';
  private breakpointSubscription: Subscription = new Subscription;
  private langSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private swUpdate: SwUpdate,
    private cacheStorageService: CacheStorageService,
    private translationMessageService: TranslationMessageService
  ) {
  
    this.selectedLanguage = this.translationMessageService.getLanguage();
    const selectedLang = this.languages.find(lang => lang.code === this.selectedLanguage);
    this.selectedFlag = selectedLang ? selectedLang.flag : 'fi fi-it';
    this.environment = environment.production ? 'prod' : 'test';
    this.version = environment.version;
  }

  ngOnDestroy(): void {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }

  async forceRefresh() {
    if (this.swUpdate.isEnabled) {
      await this.swUpdate.activateUpdate();
      window.location.reload();
    } else {
      window.location.reload();
    }
  }

  ngAfterViewChecked(): void {
    const authStatus = this.authService.isAuthLoginCompleted();
    if (this.isAuthenticating !== authStatus) {
      this.isAuthenticating = authStatus;
      this.cdr.detectChanges(); // Forza il rilevamento delle modifiche
    }
  }

  ngOnInit(): void {
    this.updateFlag(this.selectedLanguage);
  }

  // Funzione chiamata quando si cambia la lingua
  changeLanguage(languageCode: string): void {
    this.selectedLanguage = languageCode;
    this.translationMessageService.setLanguage(languageCode); // Salva la lingua nel servizio
    this.updateFlag(languageCode); // Aggiorna la bandiera quando cambia la lingua

    const offcanvasElement = document.querySelector('#offcanvasNavbar');
    if (offcanvasElement) {
      const btnClose = offcanvasElement.querySelector('.btn-close');
      if (btnClose) {
        (btnClose as HTMLElement).click();
      }
    }

    
  }

  // Aggiorna la bandiera in base alla lingua selezionata
  private updateFlag(languageCode: string): void {
    const selectedLang = this.languages.find(lang => lang.code === languageCode);
    this.selectedFlag = selectedLang ? selectedLang.flag : 'fi fi-it'; // Imposta la bandiera predefinita
  }

  public logout(): void {
    this.authService.logout();
  }
  goToHome(): void {
    this.router.navigate(['/']); // Naviga verso la route della homepage
  }

  public cleanCache() {
    this.cacheStorageService.clear();
  }
}

import { AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SharedModule } from '../shared.module';
import { LanguageService } from '../../services/language.service';
import { AuthService } from '../../services/auth.service';
import { SpinnerService } from '../../services/spinner.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-system-navbar',
  templateUrl: './system-navbar.component.html',
  styleUrls: ['./system-navbar.component.css'],
  standalone: true,
  imports: [
    SharedModule
  ]
})

export class SystemNavBarComponent implements OnInit, AfterViewChecked {

  selectedLanguage: string;
  selectedFlag: string; // Flag per la lingua selezionata
  languages = [
    { code: 'EN', label: 'English', flag: 'fi fi-gb' },
    { code: 'IT', label: 'Italiano', flag: 'fi fi-it' }
  ];
  isAuthenticating: boolean = false;

  environment: string = '';
  version: string = '';

  constructor(
    private languageService: LanguageService,
    private authService: AuthService,
    private spinner: SpinnerService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.selectedLanguage = this.languageService.getLanguage();
    const selectedLang = this.languages.find(lang => lang.code === this.selectedLanguage);
    this.selectedFlag = selectedLang ? selectedLang.flag : 'fi fi-it';
    this.environment = environment.production ? 'prod' : 'test';
    this.version = environment.version;
  }

  ngAfterViewChecked(): void {
    const authStatus = this.authService.isAuthLoginCompleted();
    if (this.isAuthenticating !== authStatus) {
      this.isAuthenticating = authStatus;
      this.cdr.detectChanges(); // Forza il rilevamento delle modifiche
    }
  }

  ngOnInit(): void {
    // Ottieni la lingua salvata nella cache o quella di default
    this.selectedLanguage = this.languageService.getLanguage();
    this.updateFlag(this.selectedLanguage); // Aggiorna la flag corrispondente
  }

  // Funzione chiamata quando si cambia la lingua
  changeLanguage(languageCode: string): void {
    this.selectedLanguage = languageCode;
    this.languageService.setLanguage(languageCode); // Salva la lingua nel servizio
    this.updateFlag(languageCode); // Aggiorna la bandiera quando cambia la lingua
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
}

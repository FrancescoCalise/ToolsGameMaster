import { Component } from '@angular/core';
import { SharedModule } from '../shared.module';
import { LanguageService } from '../../services/language.service';


@Component({
  selector: 'app-system-navbar',
  templateUrl: './system-navbar.component.html',
  styleUrls: ['./system-navbar.component.css'],
  standalone: true,
  imports: [
    SharedModule
  ]
})

export class SystemNavBarComponent {

  selectedLanguage: string;
  selectedFlag: string; // Flag per la lingua selezionata
  languages = [
    { code: 'EN', label: 'English', flag: 'fi fi-gb' },
    { code: 'IT', label: 'Italiano', flag: 'fi fi-it' }
  ];

  constructor(private languageService: LanguageService) {
    this.selectedLanguage = this.languageService.getLanguage();
    const selectedLang = this.languages.find(lang => lang.code === this.selectedLanguage);
    this.selectedFlag = selectedLang ? selectedLang.flag : 'fi fi-it';
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
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SystemNavBarComponent } from '../app/shared/system-navbar/system-navbar.component';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../app/services/language.service';
import { LoadingComponent } from './shared/loading/loading.component';
import { SpinnerService } from './services/spinner.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SystemNavBarComponent, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'ToolsGameMaster';

  constructor(
    private translate: TranslateService, 
    private languageService: LanguageService,
    private spinnerService: SpinnerService
  ) {
    
    spinnerService.showSpinner();

    let selectedLanguage = this.languageService.getLanguage();
     // Imposta la lingua predefinita
     this.translate.setDefaultLang(selectedLanguage);

     // Imposta la lingua corrente
     this.translate.use(selectedLanguage);
  }
}

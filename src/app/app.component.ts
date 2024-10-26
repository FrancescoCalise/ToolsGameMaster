import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SystemNavBarComponent } from '../app/shared/system-navbar/system-navbar.component';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../app/services/language.service';
import { LoadingComponent } from './shared/loading/loading.component';
import { SpinnerService } from './services/spinner.service';
import { SystemFooterComponent } from './shared/system-footer/system-footer.component';

import { environment } from '../app/environments/environment';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    SystemNavBarComponent,
    LoadingComponent,
    SystemFooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    private spinnerService: SpinnerService,
    private swUpdate: SwUpdate
  ) {
    console.log('Environment: ', environment);
    spinnerService.showSpinner();
    let selectedLanguage = this.languageService.getLanguage();
    this.translate.setDefaultLang(selectedLanguage);
    this.translate.use(selectedLanguage);

  }
  
  async ngOnInit(): Promise<void> {
    await this.checkSwUpdate();
  }

  async checkSwUpdate(): Promise<void> {
    if (this.swUpdate.isEnabled) {
      // Controlla subito se c’è un aggiornamento
      const hasUpdate = await this.swUpdate.checkForUpdate();

      // Se trova un aggiornamento, attiva la nuova versione e ricarica
      if (hasUpdate) {
        const confirmed = confirm("Una nuova versione dell'app è disponibile. Vuoi aggiornare?");
        if (confirmed) {
          await this.swUpdate.activateUpdate();
          window.location.reload();
        }
      }

      /* // Controlla per aggiornamenti periodici (opzionale, ogni 6 ore)
      
      setInterval(async () => {
        const hasUpdate = await this.swUpdate.checkForUpdate();
        if (hasUpdate) {
          const confirmed = confirm("Una nuova versione dell'app è disponibile. Vuoi aggiornare?");
          if (confirmed) {
            await this.swUpdate.activateUpdate();
            window.location.reload();
          }
        }
      }, 6 * 60 * 60 * 1000); // ogni 6 ore 
      
      */
    }
  }  
}

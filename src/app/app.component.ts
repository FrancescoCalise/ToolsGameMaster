import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SystemNavBarComponent } from '../app/shared/system-navbar/system-navbar.component';
import { LanguageService } from '../app/services/language.service';
import { LoadingComponent } from './shared/loading/loading.component';
import { SpinnerService } from './services/spinner.service';
import { SystemFooterComponent } from './shared/system-footer/system-footer.component';

import { environment } from '../app/environments/environment';
import { SwUpdate } from '@angular/service-worker';
import { ToastService } from './services/toast.service';
import { TranslationMessageService } from './services/translation-message-service';
import { TranslateService } from '@ngx-translate/core';

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
    private translationMessagew: TranslationMessageService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private spinnerService: SpinnerService,
    private swUpdate: SwUpdate,
    private toastService: ToastService
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
      this.spinnerService.showSpinner();

      if (!hasUpdate) {
        const tiltle = await this.translationMessagew.translate('UPDATE.TITLE');
        const message = await this.translationMessagew.translate('UPDATE.DESCRIPTION');
        this.toastService.showInfo(message, tiltle, 3000);
        setTimeout(async () => {
          await this.swUpdate.activateUpdate();
          window.location.reload();
        }, 3000);

      }
    }
  }
}  

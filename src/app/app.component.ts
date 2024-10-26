import { CommonModule } from '@angular/common';
import { Component, isDevMode, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SystemNavBarComponent } from '../app/shared/system-navbar/system-navbar.component';
import { LanguageService } from '../app/services/language.service';
import { LoadingComponent } from './shared/loading/loading.component';
import { SpinnerService } from './services/spinner.service';
import { SystemFooterComponent } from './shared/system-footer/system-footer.component';

import { environment } from '../app/environments/environment';
import { ToastService } from './services/toast.service';
import { TranslationMessageService } from './services/translation-message-service';
import { TranslateService } from '@ngx-translate/core';

import { SwUpdate, VersionEvent, VersionDetectedEvent, VersionReadyEvent } from '@angular/service-worker';

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
    private translationMessage: TranslationMessageService,
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
    await this.checkVersionUpdates();
  }

  async checkVersionUpdates(): Promise<void> {
    
    if (!isDevMode() && this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe(async (event: VersionEvent) => {
        this.spinnerService.showSpinner();
        
        console.log('SERVICE UPDATE: ', event);

        if (event.type === 'VERSION_READY') {
          const readyTitle = await this.translationMessage.translate('UPDATE.TITLE');
          const readyMessage = await this.translationMessage.translate('UPDATE.DESCRIPTION');

          this.toastService.showInfo(readyMessage, readyTitle, 3000);

          setTimeout(async () => {
            await this.swUpdate.activateUpdate();
            window.location.reload();
          }, 3000);
        }
      });
    }
  }
}  

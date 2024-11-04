import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component,  isDevMode, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SystemNavBarComponent } from '../app/shared/system-navbar/system-navbar.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { SpinnerService } from './services/spinner.service';
import { SystemFooterComponent } from './shared/system-footer/system-footer.component';

import { environment } from '../app/environments/environment';
import { ToastService } from './services/toast.service';
import { TranslationMessageService } from './services/translation-message-service';
import { TranslateService } from '@ngx-translate/core';

import { SwUpdate, VersionEvent, VersionDetectedEvent, VersionReadyEvent } from '@angular/service-worker';
import { CacheStorageService } from './services/cache-storage.service';

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

  private swVersion: string = '';
  showFooter: boolean = true;

 
  constructor(
    private translationMessage: TranslationMessageService,
    private spinnerService: SpinnerService,
    private swUpdate: SwUpdate,
    private toastService: ToastService,
    private cacheService: CacheStorageService,
    private cdr: ChangeDetectorRef
  ) {
    console.log('Environment: ', environment);
    spinnerService.show("AppComponent.constructor");
    let selectedLanguage = this.translationMessage.getLanguage();
    this.translationMessage.setDefaultLang(selectedLanguage);
    this.translationMessage.use(selectedLanguage);
    spinnerService.hide("AppComponent.constructor");
  }

  async ngOnInit(): Promise<void> {
    if(this.swUpdate.isEnabled && this.swVersion === ''){
      this.cacheService.getItem('sw-version');
    }
    await this.checkVersionUpdates();
  }

  async checkVersionUpdates(): Promise<void> {
    if (!isDevMode() && this.swUpdate.isEnabled) {

      this.swUpdate.versionUpdates.subscribe(async (event: VersionEvent) => {
        
        if(this.swVersion === '' && event.type === 'VERSION_DETECTED') {
          let eventDetected = event as VersionDetectedEvent;
          this.cacheService.setItem('sw-version', eventDetected.version.hash);
          this.swVersion = eventDetected.version.hash;
        }
        
        if (event.type === 'VERSION_READY' && this.swVersion !== event.currentVersion.hash) {
          this.spinnerService.show("AppComponent.checkVersionUpdates");

          this.swVersion = event.currentVersion.hash;
          this.cacheService.setItem('sw-version', event.currentVersion.hash);

          const readyTitle = await this.translationMessage.translate('UPDATE.TITLE');
          const readyMessage = await this.translationMessage.translate('UPDATE.DESCRIPTION', { 
            version: this.swVersion
          });

          this.toastService.showInfo(readyMessage, readyTitle, 3000);

          setTimeout(async () => {
            await this.swUpdate.activateUpdate();
            this.spinnerService.hide("AppComponent.checkVersionUpdates");

            window.location.reload();
          }, 3000);
        }
      });
    }
  }

  onShowFooterChange(show: boolean) {
    this.showFooter = show;
    this.cdr.detectChanges();
  }
}  

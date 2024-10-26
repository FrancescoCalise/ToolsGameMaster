import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FeatureConfig } from '../../../interface/FeatureConfig';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TurnOrderComponent } from './features/TurnOrderComponent';
import { TranslationMessageService } from '../../../services/translation-message-service';
import { DeathSunComponent } from './features/DeathSunComponent';
import { ToastService } from '../../../services/toast.service';
import { CacheStorageService } from '../../../services/cache-storage.service';

@Component({
  selector: 'app-game-ultima-rotta',
  templateUrl: './ultimaRotta.component.html',
  styleUrl: './ultimaRotta.component.css',
  standalone: true,
  imports: [
    SharedModule
  ],

})

export class UltimaRottaComponent implements OnInit {

  features: FeatureConfig[] = [
    { id: 'TURN_ORDER', description: '', component: TurnOrderComponent, icon: 'turn_slight_right' }
  ];

  timerDisplay: string = '30:00';
  solarDeathTestValue = 0;
  isDarkIconVisible = true;
  private timeRemaining: number = 1800; // 30 minuti in secondi
  private timerInterval: any;
  private isTimerRunning = false;

  constructor(
    private dialog: MatDialog,
    private translationMessageService: TranslationMessageService,
    private toastService: ToastService,
    private cacheStorageService : CacheStorageService
  ) { }

  async ngOnInit(): Promise<void> {
    this.initFromCache();
    this.features = await Promise.all(this.features.map(async feature => {
      feature.description = await this.translationMessageService.translate(`ULTIMA_ROTTA.FEATURE_${feature.id}`);
      feature.tooltip = await this.translationMessageService.translate(`ULTIMA_ROTTA.FEATURE_TOOLTIP_${feature.id}`);
      return feature;
    }));
  }

  initFromCache() {
    
  }

  openFeature(component: any, config: MatDialogConfig = {}) {
    const dialogConfig = {
      width: '90vw',
      height: '90vh',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'full-screen-dialog',
      ...config
    };
    this.dialog.open(component, dialogConfig);
  }

  // Funzione per avviare il timer
  startTimer() {
    if (this.isTimerRunning) {
      // Se il timer è in esecuzione, fermalo
      clearInterval(this.timerInterval);
      this.isTimerRunning = false;
      this.toastService.showInfo("Timer fermato");
    } else {
      // Se il timer non è in esecuzione, avvialo
      this.isTimerRunning = true;
      this.toastService.showInfo("Timer avviato");

      this.timerInterval = setInterval(() => {
        if (this.timeRemaining > 0) {
          this.timeRemaining--;
          this.updateTimerDisplay();
        } else {
          clearInterval(this.timerInterval);
          this.isTimerRunning = false;
          this.openDialog();
        }
      }, 1000);
    }
  }

  // Formatta il tempo in formato mm:ss
  private updateTimerDisplay() {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    this.timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Apre una dialog quando il timer raggiunge 0
  openDialog() {
    this.dialog.open(DeathSunComponent, {
      width: '300px',
      data: { message: "E' passata mezz'ora, il sole sta cambiando" }
    });
  }
}
